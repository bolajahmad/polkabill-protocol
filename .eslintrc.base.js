module.exports = {
  "root": true,
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "tsconfigRootDir": __dirname,
    "sourceType": "module",
    "project": [
      './tsconfig.json',           // root TSConfig
      './packages/*/tsconfig.json',
      './apps/*/tsconfig.json'
    ],
  },
  "plugins": ["@typescript-eslint", "react"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended"
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "env": {
    "browser": true,
    "node": true,
    "es2021": true
  },
  "ignorePatterns": ["node_modules", "dist"]
}