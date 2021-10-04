module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
  },
  overrides: [
    {
      "files": ["*.js"],
      "excludedFiles": "node_modules/",
      "rules": {
        "quotes": ["error", "single"],
        "no-plusplus": 0,
        "no-console": 0,
      }
    }
  ]
};
