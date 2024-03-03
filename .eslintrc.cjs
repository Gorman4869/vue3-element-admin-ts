module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "parser":"vue-eslint-parser",
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-essential",
        "./.eslintrc-auto-import.json"//自动导入的函数方法
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "vue"
    ],
    "rules": {
        // https://eslint.vuejs.org/rules/#priority-a-essential-error-prevention
        "vue/multi-word-component-names": "off",
        "vue/no-v-model-argument": "off",
        "vue/script-setup-uses-vars": "error",
        "vue/no-reserved-component-names": "off",
        "vue/custom-event-name-casing": "off",
        "vue/attributes-order": "off",
        "vue/one-component-per-file": "off",
        "vue/html-closing-bracket-newline": "off",
        "vue/max-attributes-per-line": "off",
        "vue/multiline-html-element-content-newline": "off",
        "vue/singleline-html-element-content-newline": "off",
        "vue/attribute-hyphenation": "off",
        "vue/require-default-prop": "off",
        "vue/require-explicit-emits": "off",
        "vue/html-self-closing": [
          "error",
          {
            html: {
              void: "always",
              normal: "never",
              component: "always",
            },
            svg: "always",
            math: "always",
          },
        ],
    
        "@typescript-eslint/no-empty-function": "off", // 关闭空方法检查
        "@typescript-eslint/no-explicit-any": "off", // 关闭any类型的警告
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/ban-ts-ignore": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-unused-vars": "off",
      }
}