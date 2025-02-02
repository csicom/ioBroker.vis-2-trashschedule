import config from '@iobroker/eslint-config';

export default [
    ...config,
    // {
    //     files: ['**/*.js'],
    //     rules: {
    //         '@typescript-eslint/no-require-imports': 'off',
    //     },
    // },
    {
    ignores: [
        '.dev-server/',
        '.vscode/',
        '*.test.js', 
        'test/**/*.js', 
        '*.config.mjs', 
        'build', 
        'admin/build', 
        'admin/words.js',
        'admin/admin.d.ts',
        '**/adapter-config.d.ts',
        'widgets',
        'src-widgets'     
    ] 
    },

    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ['*.js', '*.mjs'],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
];
