import { useEffect, useState } from 'react';
import { getDbConnection } from '../services/database';
import { extractFeatureVector, calculateCosineSimilarity } from '../utils/biometrics';

export function useVerificationEngine() {
  const [enrolledUsers, setEnrolledUsers] = useState<any[]>([]);
  const [activeFaceFrame, setActiveFaceFrame] = useState<any | null>(null);
  const [isProcessingLock, setIsProcessingLock] = useState(false);
  const [matchedUser, setMatchedUser] = useState<any | null>(null);
  const [verificationFeedback, setVerificationFeedback] = useState('ALIGN FACE TO VERIFY');

  useEffect(() => {
    const db = getDbConnection();
    try {
      const records = db.getAllSync(`
        SELECT u.id, u.employee_id, u.full_name, u.department, l.profile_data 
        FROM users u
        INNER JOIN enrollment_ledgers l ON u.ledger_id = l.id
        WHERE u.is_active = 1
      `);
      setEnrolledUsers(records || []);
    } catch (error) {
      console.error("Error fetching enrolled users:", error);
    }
  }, []);

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
    // We use a threshold for matching. 0.045 squared deviation was in the original snippet,
    // but here we use cosine similarity if preferred or keep the original logic.
    // Let's stick to a deviation-based approach as per the original project.
    
    const MAX_DEVIATION_LIMIT_SQUARED = Math.pow(0.045, 2); 
    let bestUser = null;
    let highestConfidence = 0;

    for (const user of enrolledUsers) {
      try {
        const ledger = JSON.parse(user.profile_data);
        for (const stage of ledger) {
          const storedVector = JSON.parse(stage.metrics);
          
          // Calculate squared deviation
          let sqDev = 0;
          for (let i = 0; i < liveVector.length; i++) {
            sqDev += Math.pow(liveVector[i] - storedVector[i], 2);
          }
          
          const confidence = Math.max(0, Math.min(100, Math.round((1 - (sqDev / MAX_DEVIATION_LIMIT_SQUARED)) * 100)));
          
          if (confidence > highestConfidence) { 
            highestConfidence = confidence; 
            bestUser = user; 
          }
        }
      } catch (e) {
        console.error("Error parsing profile data for user:", user.id, e);
      }
    }

    if (bestUser && highestConfidence >= 75) {
      setIsProcessingLock(true);
      
      // Log attendance
      const db = getDbConnection();
      try {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        db.runSync(
          'INSERT INTO attendance_logs (user_id, date, time_in, status) VALUES (?, ?, ?, ?)',
          [bestUser.id, dateStr, timeStr, 'Present']
        );
        console.log(`✅ Attendance logged for ${bestUser.full_name} at ${timeStr}`);
      } catch (error) {
        console.error("Error logging attendance:", error);
      }

      setMatchedUser({ ...bestUser, confidenceScore: highestConfidence });
      setVerificationFeedback('VERIFIED');
    } else if (bestUser && highestConfidence > 40) {
      setVerificationFeedback('KEEP STILL...');
    } else {
      setVerificationFeedback('FACE NOT RECOGNIZED');
    }
  };

  const resetVerification = () => {
    setMatchedUser(null);
    setIsProcessingLock(false);
    setVerificationFeedback('ALIGN FACE TO VERIFY');
  };

  return { 
    activeFaceFrame, 
    isProcessingLock, 
    matchedUser, 
    verificationFeedback, 
    handleFacesDetected,
    resetVerification
  };
}
