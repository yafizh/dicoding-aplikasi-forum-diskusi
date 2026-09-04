import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const google = require('eslint-config-google');

const coreRules = new Set(Object.keys(js.configs.all.rules));
const stylisticRules = new Set(Object.keys(stylistic.rules));

const renamedRules = {
  'func-call-spacing': '@stylistic/function-call-spacing',
  'no-new-object': 'no-object-constructor',
  'no-new-symbol': 'no-new-native-nonconstructor',
};
const removedRules = new Set(['valid-jsdoc', 'require-jsdoc']);

function buildGoogleStyleRules() {
  const rules = {};
  for (const [name, value] of Object.entries(google.rules)) {
    if (removedRules.has(name)) continue;
    if (renamedRules[name]) {
      rules[renamedRules[name]] = value;
    } else if (coreRules.has(name)) {
      rules[name] = value;
    } else if (stylisticRules.has(name)) {
      rules[`@stylistic/${name}`] = value;
    }
  }

  rules['@stylistic/quotes'] = [
    'error',
    'single',
    {allowTemplateLiterals: 'always'},
  ];

  return rules;
}

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {'@stylistic': stylistic},
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {ecmaFeatures: {jsx: true}},
    },
    rules: {
      ...buildGoogleStyleRules(),
      '@stylistic/max-len': ['error', {
        code: 80,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    },
  },
]);
