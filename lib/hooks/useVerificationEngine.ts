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
    const bounds = face?.bounds;
    if (!landmarks || !bounds) return null;

    const leftEye   = landmarks.LEFT_EYE    || landmarks.leftEye;
    const rightEye  = landmarks.RIGHT_EYE   || landmarks.rightEye;
    const noseBase  = landmarks.NOSE_BASE   || landmarks.noseBase;
    const mouthLeft = landmarks.MOUTH_LEFT  || landmarks.mouthLeft;
    const mouthRight = landmarks.MOUTH_RIGHT || landmarks.mouthRight;

    if (!leftEye || !rightEye || !noseBase || !mouthLeft || !mouthRight) return null;

    const faceScale = Math.sqrt(bounds.width * bounds.height);
    const d_eyes = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
    const d_nose_leftEye = Math.sqrt(Math.pow(noseBase.x - leftEye.x, 2) + Math.pow(noseBase.y - leftEye.y, 2));
    const d_nose_rightEye = Math.sqrt(Math.pow(noseBase.x - rightEye.x, 2) + Math.pow(noseBase.y - rightEye.y, 2));
    const d_mouth = Math.sqrt(Math.pow(mouthRight.x - mouthLeft.x, 2) + Math.pow(mouthRight.y - mouthLeft.y, 2));

    return [
      d_eyes / faceScale,
      d_nose_leftEye / faceScale,
      d_nose_rightEye / faceScale,
      d_mouth / faceScale
    ];
  };

  const handleFacesDetected = (faces: any[]) => {
    if (isProcessingLock || enrolledUsers.length === 0 || matchedUser !== null) return;
    if (faces.length === 0) {
      setActiveFaceFrame(null);
      setVerificationFeedback('ALIGN FACE TO VERIFY');
      return;
    }

    const liveFace = faces[0];
    setActiveFaceFrame(liveFace);
    
    // 1. Extract vector
    const liveVector = extractFeatureVector(liveFace);
    if (!liveVector) return;

    // 2. Compare against DB
    const MAX_DEVIATION_LIMIT_SQUARED = Math.pow(0.045, 2); 
    let bestUser = null, highMsg = 0;

    for (const user of enrolledUsers) {
      const ledger = JSON.parse(user.profile_data);
      for (const stage of ledger) {
        const storedVector = JSON.parse(stage.metrics);
        const sqDev = liveVector.reduce((acc, v, i) => acc + Math.pow(v - storedVector[i], 2), 0);
        const confidence = Math.max(0, Math.min(100, Math.round((1 - (sqDev / MAX_DEVIATION_LIMIT_SQUARED)) * 100)));
        if (confidence > highMsg) { highMsg = confidence; bestUser = user; }
      }
    }

    if (bestUser && highMsg >= 75) {
      setIsProcessingLock(true);
      
      const today = new Date().toISOString().split('T')[0];
      const now = new Date();
      const nowTime = now.toTimeString().split(' ')[0];

      // Simple attendance logic
      db.runSync(
        'INSERT INTO attendance_logs (user_id, date, time_in, status) VALUES (?, ?, ?, ?)',
        [bestUser.id, today, nowTime, 'Present']
      );

      setMatchedUser({
        employeeId: bestUser.employee_id,
        fullName: bestUser.full_name,
        department: bestUser.department,
        confidenceScore: highMsg,
        autoStatus: 'Present',
        timestamp: nowTime
      });
      setVerificationFeedback(`✓ LOGGED: ${bestUser.full_name}`);
    } else {
      setVerificationFeedback(`🔍 ANALYZING BIOMETRIC SIGNATURE (${highMsg}%)`);
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
