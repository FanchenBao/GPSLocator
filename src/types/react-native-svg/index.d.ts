/**
 * @format
 */

// See this article:
// https://dev.to/vinipachecov/how-to-use-svg-files-in-react-native-with-typescript-1bn7?signin=true
declare module '*.svg' {
  import {SvgProps} from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
