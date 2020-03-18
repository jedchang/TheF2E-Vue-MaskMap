module.exports = {
  root: true,
  env: {
    node: true
  },
  // extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  // extends: ['plugin:vue/recommended', '@vue/prettier'],
  // 引用順序有影響
  extends: ['prettier', 'prettier/vue', 'plugin:vue/recommended'],
  plugins: ['prettier'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 以下設定屬性換行
    'vue/order-in-components': 'error',
    'vue/require-prop-types': 'error',
    'vue/require-default-prop': 'error',
    // vue 的屬性必須每行一個
    'vue/max-attributes-per-line': [
      'error',
      {
        // 一行顯示 1 個屬性
        singleline: 1,
        multiline: {
          // 可以代替 allowFitstLine (允許第一行)
          max: 1,
          // 如果為 true，則允許屬性與該標記名稱位於同一行
          allowFirstLine: false
        }
      }
    ]
  }
}
