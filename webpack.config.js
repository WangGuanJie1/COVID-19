const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    // mode:'production',
    entry: {
        "index/index": './public/javascripts/index/index.js',
        "index/screen": './public/javascripts/index/screen.js',
        "index/analysis": './public/javascripts/index/analysis.js'
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './public/dist')
    },
    // devtool: 'inline-source-map',
    devServer: {
        host: 'localhost',
        port: '80',
        contentBase: './public/dist',
        hot: true,
        open: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ]
}