module.exports = {
  env: {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" }],
    "no-param-reassign": "off",
    "react/jsx-indent-props": "off",
    "camelcase": "off",
    "react/style-prop-object": "off",
    "import/no-unresolved": "off",
    "no-restricted-globals": "off",
    "import/no-extraneous-dependencies": "off",
    "no-tabs": "off",
    "indent": "off",
    "no-mixed-spaces-and-tabs": "off",
    "comma-dangle": "off",
    "react/jsx-indent": "off",
    "react/display-name": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": "off",
    "no-alert": "off",
    "nonblock-statement-body-position": "off",
    "curly": "off",
    "implicit-arrow-linebreak": "off",
    "operator-linebreak": "off",
    "react/jsx-wrap-multilines": "off",
    "object-curly-newline": "off"
  },
};
