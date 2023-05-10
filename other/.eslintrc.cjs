
/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  extends       : ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser        : '@typescript-eslint/parser',
  parserOptions : {
    ecmaVersion : 2022,
    sourceType  : 'module'
  },
  plugins : ['@typescript-eslint'],
  env     : {
    node    : true,
    es2022  : true,
    browser : true
  }
}