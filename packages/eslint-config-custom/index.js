module.exports = {
  extends: ['prettier'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        createDefaultProgram: true,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
      ],
      rules: {
        'prettier/prettier': 'error',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
          },
        ],
      },
      plugins: ['prettier'],
    },
  ],
}
