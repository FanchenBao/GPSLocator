module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: [
    'node_modules/**/*',
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'jest.setup.js',
  ],
  rules: {
    // allow inline styles to facilitate dynamic stying based on some boolean checks
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {'ts-ignore': 'allow-with-description'},
    ],
  },
};
