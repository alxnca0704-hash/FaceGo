import { useEffect, useRef, useState } from 'react';

export const CAPTURE_STAGES = [
  { id: 'front', instruction: 'Look Straight Ahead' },
  { id: 'left', instruction: 'Turn Head Slightly Left' },
  { id: 'right', instruction: 'Turn Head Slightly Right' },
  { id: 'up', instruction: 'Tilt Head Slightly Up' },
  { id: 'down', instruction: 'Tilt Head Slightly Down' }
];

export function useBiometricEngine(
  facing: 'front' | 'back',
  onComplete: (profiles: any[]) => void
) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [capturedProfiles, setCapturedProfiles] = useState<any[]>([]);
  const [activeFaceFrame, setActiveFaceFrame] = useState<any | null>(null);
  const [isProcessingLock, setIsProcessingLock] = useState(false);
  const stabilityFrames = useRef(0);

  const currentStageInfo = CAPTURE_STAGES[currentStageIndex] || { id: 'done', instruction: 'Complete' };

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
    if (isProcessingLock) return; 
    if (faces.length > 0) setActiveFaceFrame(faces[0]);
    else {
      setActiveFaceFrame(null);
      stabilityFrames.current = 0; 
    }
  };

  const validateAngleGate = (): { isValid: boolean; feedback: string } => {
    if (!activeFaceFrame) return { isValid: false, feedback: "ALIGN FACE IN OVAL" };
    
    const yaw = activeFaceFrame.yawAngle ?? 0;
    const pitch = activeFaceFrame.pitchAngle ?? 0;
    const isFront = facing === 'front';

    switch (currentStageInfo.id) {
      case 'front':
        return Math.abs(yaw) <= 12 && Math.abs(pitch) <= 12
          ? { isValid: true, feedback: "✓ PERFECT! HOLD STILL..." }
          : { isValid: false, feedback: "LOOK DIRECTLY AT THE SCREEN CENTER" };
      case 'left':
        const isLeftLocked = isFront ? yaw > 18 : yaw < -18;
        return isLeftLocked
          ? { isValid: true, feedback: "✓ LEFT ANGLE LOCKED! HOLD STILL..." }
          : { isValid: false, feedback: "TURN HEAD SLIGHTLY LEFT" };
      case 'right':
        const isRightLocked = isFront ? yaw < -18 : yaw > 18;
        return isRightLocked
          ? { isValid: true, feedback: "✓ RIGHT ANGLE LOCKED! HOLD STILL..." }
          : { isValid: false, feedback: "TURN HEAD SLIGHTLY RIGHT" };
      case 'up':
        return pitch > 12
          ? { isValid: true, feedback: "✓ UPWARD TILT LOCKED! HOLD STILL..." }
          : { isValid: false, feedback: "TILT HEAD SLIGHTLY UP" };
      case 'down':
        return pitch < -12
          ? { isValid: true, feedback: "✓ DOWNWARD TILT LOCKED! HOLD STILL..." }
          : { isValid: false, feedback: "TILT HEAD SLIGHTLY DOWN" };
      default:
        return { isValid: false, feedback: "ERROR" };
    }
  };

  const executeBiometricScan = (isValidGate: boolean) => {
    if (!activeFaceFrame || !isValidGate || isProcessingLock) return;
    const featureVector = extractFeatureVector(activeFaceFrame);
    if (!featureVector) return;

    const updatedProfiles = [...capturedProfiles, { 
      angle: currentStageInfo.id, 
      metrics: JSON.stringify(featureVector) 
    }];
    setCapturedProfiles(updatedProfiles);

    if (currentStageIndex < CAPTURE_STAGES.length - 1) { 
      setCurrentStageIndex(currentStageIndex + 1);
      stabilityFrames.current = 0; 
    } else {
      setIsProcessingLock(true);
      onComplete(updatedProfiles);
    }
  };

  useEffect(() => {
    if (!activeFaceFrame || isProcessingLock) return;
    
    const { isValid } = validateAngleGate();
    if (isValid) {
      stabilityFrames.current += 1;
      if (stabilityFrames.current >= 5) {
        executeBiometricScan(true);
        stabilityFrames.current = 0;
      }
    } else {
      stabilityFrames.current = 0;
    }
  }, [activeFaceFrame, currentStageIndex]);

  const resetEnrollment = () => {
    setIsProcessingLock(false);
    setCurrentStageIndex(0);
    setCapturedProfiles([]);
    setActiveFaceFrame(null);
    stabilityFrames.current = 0;
  };

  return {
    currentStageIndex,
    currentStageInfo, 
    capturedProfiles,
    activeFaceFrame,
    isProcessingLock, 
    handleFacesDetected,
    executeBiometricScan,
    validateAngleGate,
    resetEnrollment
  };
}
