'use strict'

module.exports = {
  extends: [
    '@beyonk/eslint-config',
    'svelte3'
  ],
  'overrides': [
    {
      'files': ['*.svelte','*.html'],
      'rules': {
        'import/first': 'off',
        'import/no-duplicates': 'off',
        'import/no-mutable-exports': 'off',
        'import/no-unresolved': 'off'
      }
    }
  ]
}
