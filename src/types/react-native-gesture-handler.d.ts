declare module 'react-native-gesture-handler' {
  import * as React from 'react';
  import {ViewProps, Animated, StyleProp, ViewStyle} from 'react-native';

  export interface SwipeableProps extends ViewProps {
    children?: React.ReactNode;
    renderLeftActions?: () => React.ReactNode;
    renderRightActions?: () => React.ReactNode;
    onSwipeableOpen?: (direction: 'left' | 'right') => void;
    containerStyle?: StyleProp<ViewStyle>;
    overshootFriction?: number;
  }

  export class Swipeable extends React.Component<SwipeableProps> {}
}
