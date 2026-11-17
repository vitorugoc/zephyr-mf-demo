export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'shell',
        'catalog',
        'scaffolder',
        'ui',
        'e2e',
        'tools',
        'ci',
        'repo',
        'docs',
        'deps',
        'release',
      ],
    ],
  },
};
