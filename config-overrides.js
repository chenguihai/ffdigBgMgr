const {override, fixBabelImports, addLessLoader} = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style: 'css',
        style: true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: {
            '@primary-color': '#27b7d7',
            '@font-size-base': '12px',
            '@font-family': '"Microsoft Yahei", "Hiragino Sans GB", "Heiti SC", "WenQuanYi Micro Hei"',
            '@input-placeholder-color': '#bfbfbf',
        },
    }),
);