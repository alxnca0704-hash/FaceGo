import * as SQLite from 'expo-sqlite';
import { useEffect, useRef, useState } from 'react';

const db = SQLite.openDatabaseSync('attendance.db');

export interface MatchResult {
  employeeId: string;
  fullName: string;
  department: string;
  confidenceScore: number;
  autoStatus: 'Present' | 'Late' | 'Time-Out' | 'Time-In';
  timestamp: string;
}

export function useVerificationEngine() {
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);
  const [activeFaceFrame, setActiveFaceFrame] = useState<any | null>(null);
  const [isProcessingLock, setIsProcessingLock] = useState(false);
  const [matchedUser, setMatchedUser] = useState<MatchResult | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState('ALIGN FACE TO VERIFY');
  
  // Stability buffer
  const matchBuffer = useRef<Map<string, number>>(new Map());
  const bufferSize = useRef(0);

  useEffect(() => {
    const records = db.getAllSync<any>(`
      SELECT u.id, u.employee_id, u.full_name, u.department, l.profile_data 
      FROM users u
      INNER JOIN enrollment_ledgers l ON u.ledger_id = l.id
      WHERE u.is_active = 1
    `);
    setEnrolledUsers(records || []);
  }, []);

  const extractFeatureVector = (face: any) => {
    const landmarks = face?.landmarks;
    if (!landmarks) return null;

    const leftEye    = landmarks.LEFT_EYE    || landmarks.leftEye;
    const rightEye   = landmarks.RIGHT_EYE   || landmarks.rightEye;
    const noseBase   = landmarks.NOSE_BASE   || landmarks.noseBase;
    const mouthLeft  = landmarks.MOUTH_LEFT  || landmarks.mouthLeft;
    const mouthRight = landmarks.MOUTH_RIGHT || landmarks.mouthRight;

    if (!leftEye || !rightEye || !noseBase || !mouthLeft || !mouthRight) return null;

    const iod = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
    if (iod < 5) return null;

    return [
      Math.sqrt(Math.pow(noseBase.x - leftEye.x, 2) + Math.pow(noseBase.y - leftEye.y, 2)) / iod,
      Math.sqrt(Math.pow(noseBase.x - rightEye.x, 2) + Math.pow(noseBase.y - rightEye.y, 2)) / iod,
      Math.sqrt(Math.pow(mouthRight.x - mouthLeft.x, 2) + Math.pow(mouthRight.y - mouthLeft.y, 2)) / iod,
      Math.sqrt(Math.pow(noseBase.x - mouthLeft.x, 2) + Math.pow(noseBase.y - mouthLeft.y, 2)) / iod,
      Math.sqrt(Math.pow(noseBase.x - mouthRight.x, 2) + Math.pow(noseBase.y - mouthRight.y, 2)) / iod
    ];
  };

  const handleFacesDetected = (faces: any[]) => {
    if (isProcessingLock || matchedUser !== null) return;
    
    if (faces.length === 0) {
      setActiveFaceFrame(null);
      setVerificationFeedback('ALIGN FACE TO VERIFY');
      matchBuffer.current.clear();
      bufferSize.current = 0;
      return;
    }

    const liveFace = faces[0];
    setActiveFaceFrame(liveFace);

    if (enrolledUsers.length === 0) {
      setVerificationFeedback('NO ENROLLED USERS FOUND');
      return;
    }
    
    const liveVector = extractFeatureVector(liveFace);
    if (!liveVector) {
      setVerificationFeedback('HOLD STILL... ANALYZING');
      return;
    }

    const liveYaw = liveFace.yawAngle ?? 0;
    const livePitch = liveFace.pitchAngle ?? 0;

    // Reliability focused thresholds
    const MAX_DEVIATION_LIMIT_SQUARED = Math.pow(0.18, 2); // Very forgiving
    const CONFIDENCE_THRESHOLD = 70;
    
    let bestMatch = null;
    let maxConfidence = 0;

    for (const user of enrolledUsers) {
      const ledger = JSON.parse(user.profile_data);
      for (const stage of ledger) {
        const stageYaw = stage.yaw ?? 0;
        const stagePitch = stage.pitch ?? 0;
        
        // Very wide pose tolerance for reliability
        const yawDiff = Math.abs(liveYaw - stageYaw);
        const pitchDiff = Math.abs(livePitch - stagePitch);
        if (yawDiff > 45 || pitchDiff > 45) continue;

        const storedVector = JSON.parse(stage.metrics);
        if (!Array.isArray(storedVector) || storedVector.length !== liveVector.length) continue;

        const sqDev = liveVector.reduce((acc, v, i) => acc + Math.pow(v - storedVector[i], 2), 0);
        const confidence = Math.max(0, Math.min(100, Math.round((1 - (sqDev / MAX_DEVIATION_LIMIT_SQUARED)) * 100)));
        
        if (confidence > maxConfidence) {
          maxConfidence = confidence;
          bestMatch = user;
        }
      }
    }

    if (bestMatch && maxConfidence >= CONFIDENCE_THRESHOLD) {
      const currentCount = (matchBuffer.current.get(bestMatch.employee_id) || 0) + 1;
      matchBuffer.current.set(bestMatch.employee_id, currentCount);
      bufferSize.current += 1;

      setVerificationFeedback(`🔍 ANALYZING BIOMETRIC SIGNATURE (${maxConfidence}%)`);

      // Require 3 consistent frames for reliability
      if (currentCount >= 3) {
        setIsProcessingLock(true);
        
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const nowTime = now.toTimeString().split(' ')[0];

        db.runSync(
          'INSERT INTO attendance_logs (user_id, date, time_in, status) VALUES (?, ?, ?, ?)',
          [bestMatch.id, today, nowTime, 'Present']
        );

        setMatchedUser({
          employeeId: bestMatch.employee_id,
          fullName: bestMatch.full_name,
          department: bestMatch.department,
          confidenceScore: maxConfidence,
          autoStatus: 'Present',
          timestamp: nowTime
        });
        setVerificationFeedback(`✓ LOGGED: ${bestMatch.full_name}`);
      }
    } else {
      setVerificationFeedback(maxConfidence > 0 
        ? `🔍 ANALYZING BIOMETRIC SIGNATURE (${maxConfidence}%)`
        : 'ALIGN FACE WITHIN THE FRAME'
      );
    }
  };

  const resetVerification = () => {
    setMatchedUser(null);
    setActiveFaceFrame(null);
    setIsProcessingLock(false);
    setVerificationFeedback('ALIGN FACE TO VERIFY');
  };

  return { activeFaceFrame, isProcessingLock, matchedUser, verificationFeedback, handleFacesDetected, resetVerification };
}
