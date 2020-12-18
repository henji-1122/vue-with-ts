module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential', // https://eslint.vuejs.org/
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 'semi': ['error', 'always'] 配置分号分割代码
    '@typescript-eslint/member-delimiter-style': ['error', { // 配置TS代码取消分号分割成员
      multiline: {
        delimiter: 'none',
        requireLast: true
      }
    }
    ]
  }
}
