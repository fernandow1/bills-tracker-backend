import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict, // o .recommended si preferís más permisivo
  {
    ignores: ['dist', 'node_modules', 'migrations'],
  },
  {
    rules: {
      // personalizá tus reglas acá
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/naming-convention': [
        'warn',

        // ✅ Clases, Enums y Tipos → PascalCase
        {
          selector: ['class', 'typeAlias', 'enum'],
          format: ['PascalCase'],
        },

        // ✅ Interfaces → PascalCase (sin forzar prefijo I)
        {
          selector: 'interface',
          format: ['PascalCase'],
        },

        // ✅ Variables y funciones → camelCase
        {
          selector: ['variable', 'function', 'parameter', 'property'],
          format: ['camelCase'],
          leadingUnderscore: 'allow', // permite usar _privateVar
        },

        // ✅ Constantes globales → UPPER_CASE
        {
          selector: 'variable',
          modifiers: ['const', 'global'],
          format: ['UPPER_CASE'],
        },

        // ✅ Propiedades de objetos externos (como APIs, DB) → sin restricción
        {
          selector: 'property',
          modifiers: ['requiresQuotes'],
          format: null,
        },
      ],
    },
  },
  prettier, // desactiva reglas que chocan con Prettier
);
