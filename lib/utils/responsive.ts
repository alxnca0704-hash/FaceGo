import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 375;

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const SCREEN_DIMENSIONS = {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
};
