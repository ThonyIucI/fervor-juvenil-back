// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginImport from 'eslint-plugin-import'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: ['dist', 'eslint.config.mjs'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      import: eslintPluginImport,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        Express: 'writable',
      },
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^@nestjs', '^typeorm', '^@?\\w'],
            ['^(@|components)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      '@typescript-eslint/no-explicit-any': 'off',
      'no-extra-semi': 'warn',
      '@typescript-eslint/no-var-requires': 0,
      'no-undef': 'error',

      'comma-spacing': ['error', { before: false, after: true }],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-spacing': 'error',
      'no-empty': [2, { allowEmptyCatch: true }],
      'no-with': 2,
      'no-mixed-spaces-and-tabs': 2,
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'padded-blocks': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      'no-multi-str': 2,
      'dot-location': [2, 'property'],
      'operator-linebreak': [2, 'after'],
      'quote-props': [2, 'as-needed', { keywords: true }],
      'space-unary-ops': [2, { words: false, nonwords: false }],
      'no-restricted-syntax': [
        'warn',
        {
          selector:
            "CallExpression[callee.object.name='console'][callee.property.name=/^(log|warn|error|info|trace)$/]",
          message: 'Unexpected console call',
        },
      ],
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': [
        2,
        { anonymous: 'ignore', named: 'never' },
      ],
      'no-spaced-func': 2,
      'space-in-parens': [2, 'never'],
      semi: [2, 'never'],
      'comma-dangle': [2, 'never'],
      'no-trailing-spaces': 2,
      yoda: [2, 'never'],
      'comma-style': [2, 'last'],
      curly: [2, 'multi', 'consistent'],
      'eol-last': 2,
      'wrap-iife': 2,
      'space-infix-ops': 2,
      'keyword-spacing': [
        2,
        {
          overrides: {
            if: { after: false },
            while: { before: true },
            catch: { before: true },
          },
        },
      ],
      'spaced-comment': [2, 'always'],
      'space-before-blocks': [2, 'always'],
      'key-spacing': [2, { align: 'colon' }],
      'array-bracket-spacing': [2, 'always'],
      indent: [2, 2, { SwitchCase: 1 }],
      quotes: [2, 'single', { avoidEscape: true }],
      'max-len': [
        'error',
        {
          code: 150,
          ignoreUrls: true,
          ignoreStrings: true,
          ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\(',
        },
      ],
    },
  }
)
