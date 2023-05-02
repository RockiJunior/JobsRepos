// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'react/no-unescaped-entities': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
/*     'prettier/prettier': ['error', { endOfLine: 'auto' }],
 */    'prettier/prettier': 0,
    'no-unused-vars': 0
  },
  globals: {
    process: true
  }
};
