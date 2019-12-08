module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint"
  ],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "prettier",
    "jest",
  ],
  globals: {
    "process": true,
    "__dirname": true
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "no-irregular-whitespace": ["error", { "skipRegExps": true }],
    "prettier/prettier": ["error", {
      singleQuote: true,
      semi: false
    }]
  },
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  }
}