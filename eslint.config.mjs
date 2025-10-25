// eslint.config.mjs
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginImport from 'eslint-plugin-import'
import globals from 'globals'

export default tseslint.config(
  {
    ignores: [
      'dist',
      'dist.backup',
      'node_modules',
      'coverage',
      'eslint.config.mjs',
      '*.js',
      '*.d.ts',
      '*.js.map'
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'import': eslintPluginImport
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.node,
        ...globals.jest,
        Express: 'writable'
      }
    },
    rules: {
      // Import sorting
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // NestJS y TypeORM primero
            ['^@nestjs', '^typeorm'],
            // Paquetes externos
            ['^@?\\w'],
            // Imports de src/ (alias)
            ['^src/'],
            // Imports relativos del parent
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Imports relativos del mismo directorio
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Side effect imports
            ['^\\u0000']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // TypeScript específico
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase']
          // Permitimos interfaces con prefijo I (ej: IUserRepository)
        }
      ],

      // Código limpio
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-undef': 'error',
      'no-extra-semi': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'no-with': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-trailing-spaces': 'error',

      // Espaciado y formato
      'comma-spacing': ['error', { before: false, after: true }],
      'arrow-body-style': ['error', 'as-needed'],
      'arrow-spacing': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'padded-blocks': ['error', 'never'],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] }
      ],
      'object-curly-spacing': ['error', 'always'],
      'space-before-function-paren': [
        'error',
        { anonymous: 'ignore', named: 'never', asyncArrow: 'always' }
      ],
      'space-in-parens': ['error', 'never'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'never'],
      'yoda': ['error', 'never'],
      'comma-style': ['error', 'last'],
      'curly': ['error', 'multi-line', 'consistent'],
      'eol-last': 'error',
      'wrap-iife': 'error',
      'space-infix-ops': 'error',
      'keyword-spacing': [
        'error',
        {
          overrides: {
            'if': { after: false },
            'while': { before: true },
            'catch': { before: true }
          }
        }
      ],
      'spaced-comment': ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
      'key-spacing': ['error', { align: 'colon' }],
      'array-bracket-spacing': ['error', 'always'],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'max-len': [
        'error',
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignorePattern: '^\\s*var\\s.+=\\s*require\\s*\\('
        }
      ],

      // Mejores prácticas
      'prefer-const': 'error',
      'no-var': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true
        }
      ]
    }
  }
)
