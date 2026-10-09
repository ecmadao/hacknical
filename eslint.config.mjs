import js from '@eslint/js'
import babelParser from '@babel/eslint-parser'
import reactPlugin from 'eslint-plugin-react'
import importPlugin from 'eslint-plugin-import'
import globals from 'globals'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/public/**',
      '**/coverage/**',
      '**/.git/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react']
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        require: 'readonly',
        $: 'readonly',
        jQuery: 'readonly',
        window: 'readonly',
        QRCode: 'readonly',
        particlesJS: 'readonly',
        System: 'readonly'
      }
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    },
    rules: {
      'no-console': 1,
      'no-unused-vars': 0,
      'no-undef': 1,
      'semi': 0,
      'comma-dangle': 0,
      'no-param-reassign': 0,
      'consistent-return': 0,
      'no-useless-escape': 0,
      'no-return-await': 0,
      'no-await-in-loop': 0,
      'no-empty': 0,
      'no-case-declarations': 0,
      'no-useless-assignment': 0,
      'no-constant-condition': 0,
      'no-cond-assign': 0,
      'import/no-dynamic-require': 0,
      'import/no-unresolved': 0,
      'react/jsx-uses-react': 1,
      'react/jsx-uses-vars': 1
    }
  }
]
