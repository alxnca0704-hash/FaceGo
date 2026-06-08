import React from 'react';
import { View } from 'react-native';
import { s } from 'react-native-size-matters';

export const FaceLandmarkMesh = ({ 
  face, 
  isLocked, 
  windowWidth = 0, 
  windowHeight = 0,
  facing = 'front' 
}: { 
  face: any; 
  isLocked: boolean;
  windowWidth?: number;
  windowHeight?: number;
  facing?: 'front' | 'back';
}) => {
  const isVisible = face && face.bounds && !isLocked && windowWidth > 0 && windowHeight > 0;
  
  if (!isVisible) return null;

  const isFront = facing === 'front';

  const points = [
    face.landmarks?.LEFT_EYE || face.landmarks?.leftEye,
    face.landmarks?.RIGHT_EYE || face.landmarks?.rightEye,
    face.landmarks?.NOSE_BASE || face.landmarks?.noseBase,
    face.landmarks?.MOUTH_LEFT || face.landmarks?.mouthLeft,
    face.landmarks?.MOUTH_RIGHT || face.landmarks?.mouthRight
  ];

  return (
    <View 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: windowWidth,
        height: windowHeight,
        zIndex: 50,
      }} 
      pointerEvents="none"
    >
      {/* 
        Stationary central frame is handled in the screen components. 
        This mesh handles the precise landmark dots tracking.
      */}
      {points.map((pos, i) => {
        if (!pos) return null;
        
        // Accurate mirroring logic:
        // When front-facing, the camera feed is mirrored. The detector coordinates 
        // need to be flipped relative to the view width.
        const pX = isFront ? (windowWidth - pos.x) : pos.x;
        const pY = pos.y;
        
        return (
          <View 
            key={i} 
            style={{ 
              position: 'absolute', 
              top: pY - s(2), 
              left: pX - s(2), 
              width: s(4), 
              height: s(4), 
              borderRadius: s(2), 
              backgroundColor: '#ffea00',
              borderWidth: 0.5,
              borderColor: 'white',
              opacity: 0.9
            }} 
          />
        );
      })}
    </View>
  );
};
