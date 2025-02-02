const { deleteFoldersRecursive, buildReact, npmInstall, copyFiles } = require('@iobroker/build-tools');

// http://127.0.0.1:18082/vis-2-beta/widgets/vis-2-widgets-material/static/js/node_modules_iobroker_vis-2-widgets-react-dev_index_jsx-_adb40.af309310.chunk.js

function copyAllFiles() {
    copyFiles(
        [
            'src-widgets/build/**/*',
            '!src-widgets/build/static/js/*node_modules*.*',
            '!src-widgets/build/static/js/node_modules_*',
        ],
        'widgets/vis-2-trashschedule/',
    );
    copyFiles(
        [
            `src-widgets/build/static/js/*runtime_js-src_sketch_css*.*`,
            `src-widgets/build/static/js/*node_modules_babel_runtime_helpers_createForOfItera*.*`,
        ],
        'widgets/vis-2-trashschedule/static/js',
    );
}

if (process.argv.includes('--copy-files')) {
    copyAllFiles();
} else if (process.argv.includes('--build')) {
    buildReact(`${__dirname}/src-widgets`, { rootDir: __dirname, craco: true }).catch(() =>
        console.error('Error by build'),
    );
} else {
    deleteFoldersRecursive('src-widgets/build');
    deleteFoldersRecursive('widgets');
    npmInstall('src-widgets')
        .then(() => buildReact(`${__dirname}/src-widgets`, { rootDir: __dirname, craco: true }))
        .then(() => copyAllFiles());
}
