import { useEffect, useRef, useState } from 'react';
import { extractFeatureVector } from '../utils/biometrics';

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

  const handleFacesDetected = (faces: any[]) => {
    if (isProcessingLock) return; 
    if (faces.length > 0) {
      setActiveFaceFrame(faces[0]);
    } else {
      setActiveFaceFrame(null);
      stabilityFrames.current = 0; 
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

  // Simple stability and orientation check (placeholder for more complex yaw/pitch/roll logic)
  useEffect(() => {
    if (!activeFaceFrame || isProcessingLock) return;
    
    // In a real implementation, we would check face.yawAngle, face.pitchAngle here
    // For now, we'll simulate a slight delay for "stability"
    const timer = setTimeout(() => {
        stabilityFrames.current += 1;
        if (stabilityFrames.current >= 3) {
            executeBiometricScan(true);
        }
    }, 500);

    return () => clearTimeout(timer);
  }, [activeFaceFrame, currentStageIndex]);

  return {
    currentStageIndex,
    currentStageInfo, 
    capturedProfiles,
    activeFaceFrame,
    isProcessingLock, 
    handleFacesDetected,
    executeBiometricScan
  };
}
