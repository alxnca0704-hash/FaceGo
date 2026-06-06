import { scale, moderateScale } from './responsive';

/**
 * Calculates cosine similarity between two feature vectors.
 * Higher value (up to 1) means more similarity.
 */
export function calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
  if (vectorA.length !== vectorB.length) return 0;
  
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    normA += vectorA[i] * vectorA[i];
    normB += vectorB[i] * vectorB[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Extracts a simplified feature vector from face landmark data.
 * This is a basic geometric approach using ratios to achieve scale-invariance.
 */
export const extractFeatureVector = (face: any) => {
  const landmarks = face?.landmarks;
  const bounds = face?.bounds;
  if (!landmarks || !bounds) return null;

  // Normalize based on different potential landmark naming conventions
  const leftEye   = landmarks.LEFT_EYE    || landmarks.leftEye;
  const rightEye  = landmarks.RIGHT_EYE   || landmarks.rightEye;
  const noseBase  = landmarks.NOSE_BASE   || landmarks.noseBase;
  const mouthLeft = landmarks.MOUTH_LEFT  || landmarks.mouthLeft;
  const mouthRight = landmarks.MOUTH_RIGHT || landmarks.mouthRight;

  if (!leftEye || !rightEye || !noseBase || !mouthLeft || !mouthRight) return null;

  // Face scale factor for normalization
  const faceScale = Math.sqrt(bounds.width * bounds.height);
  
  // Calculate Euclidean distances
  const d_eyes = Math.sqrt(Math.pow(rightEye.x - leftEye.x, 2) + Math.pow(rightEye.y - leftEye.y, 2));
  const d_nose_leftEye = Math.sqrt(Math.pow(noseBase.x - leftEye.x, 2) + Math.pow(noseBase.y - leftEye.y, 2));
  const d_nose_rightEye = Math.sqrt(Math.pow(noseBase.x - rightEye.x, 2) + Math.pow(noseBase.y - rightEye.y, 2));
  const d_mouth = Math.sqrt(Math.pow(mouthRight.x - mouthLeft.x, 2) + Math.pow(mouthRight.y - mouthLeft.y, 2));

  // Return normalized feature vector (ratios)
  return [
    d_eyes / faceScale,
    d_nose_leftEye / faceScale,
    d_nose_rightEye / faceScale,
    d_mouth / faceScale
  ];
};
