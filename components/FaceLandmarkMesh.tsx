import React from 'react';
import { View } from 'react-native';
import { s } from 'react-native-size-matters';

export const FaceLandmarkMesh = ({ face, isLocked }: { face: any; isLocked: boolean }) => {
  const isVisible = face && face.bounds && !isLocked;
  
  if (!isVisible) return null;

  const width = face.bounds.width;
  const height = face.bounds.height;
  const x = face.bounds.x;
  const y = face.bounds.y;

  const points = [
    face.landmarks?.LEFT_EYE, face.landmarks?.RIGHT_EYE,
    face.landmarks?.NOSE_BASE, face.landmarks?.MOUTH_LEFT, face.landmarks?.MOUTH_RIGHT
  ];

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
      <View style={{ 
        position: 'absolute', 
        top: y, 
        left: x, 
        width, 
        height, 
        borderWidth: 2, 
        borderColor: '#00b0ff', 
        borderRadius: s(8), 
        borderStyle: 'dashed' 
      }} />
      {points.map((pos, i) => {
        if (!pos) return null;
        return (
          <View 
            key={i} 
            style={{ 
              position: 'absolute', 
              top: pos.y - s(4), 
              left: pos.x - s(4), 
              width: s(8), 
              height: s(8), 
              borderRadius: s(4), 
              backgroundColor: '#ffea00' 
            }} 
          />
        );
      })}
    </View>
  );
};
