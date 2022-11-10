import * as React from 'react';
import {View} from 'react-native';
import Svg, {Path} from 'react-native-svg';

type PropsT = {
  height?: string;
  width?: string;
  scale?: number;
};

export const TimerIcon = (props: PropsT) => {
  const {width = '100%', height = '100%', scale = 1.0} = props;
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // borderColor: 'blue',
        // borderWidth: 2,
      }}>
      <Svg
        // style={{borderColor: 'blue', borderWidth: 2}}
        width={width}
        height={height}>
        <Path
          // @ts-expect-error: error stemps from react-native-svg
          style={{
            stroke: 'none',
            strokeWidth: 1,
            strokeDasharray: 'none',
            strokeLinecap: 'butt',
            strokeDashoffset: 0,
            strokeLinejoin: 'miter',
            strokeMiterlimit: 4,
            fill: '#000',
            fillRule: 'nonzero',
            opacity: 1,
          }}
          transform={`scale(${scale})`}
          d="M0 24C0 10.75 10.75 0 24 0h336c13.3 0 24 10.75 24 24s-10.7 24-24 24h-8v18.98c0 40.32-16.9 78.12-44.5 107.52L225.9 256l81.6 81.5C335.1 366 352 404.7 352 445v19h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.25 0-24-10.7-24-24s10.75-24 24-24h8v-19c0-40.3 16.01-79 44.52-107.5L158.1 256l-81.58-81.5C48.01 145.1 32 107.3 32 66.98V48h-8C10.75 48 0 37.25 0 24zm99.78 360H284.2c-3.2-4.4-6.8-8.6-10.7-12.5L192 289.9l-81.5 81.6c-3.9 3.9-8.4 8.1-10.72 12.5zM284.2 128c11.9-17.6 19.8-38.97 19.8-61.02V48H80v18.98c0 22.05 7 43.42 19.78 61.02H284.2z"
        />
      </Svg>
    </View>
  );
};
