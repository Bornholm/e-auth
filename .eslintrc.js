/* eslint-env node */
module.exports = {
  'root': true,
  'env': {
    'node': true,
    'es6': true,
  },
  'extends': [
    'eslint:recommended'
  ],
  'rules': {
    'array-bracket-spacing': [ 'error', 'always' ],
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': [ 'error', 'always-multiline' ],
    'comma-spacing': 'error',
    'curly':[ 'error', 'multi-line', 'consistent' ],
    'eol-last': 'error',
    'indent': [ 'error', 2 ],
    'keyword-spacing': 'error',
    'linebreak-style': 'error',
    'no-spaced-func': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'quotes': [ 'error', 'single', { 'avoidEscape': true } ],
    'semi': 'error',
    'semi-spacing': 'error',
  },
  'parserOptions': {
    'sourceType': 'script',
  },
};
