var webpackConfig = require('./webpack.config.js');
webpackConfig.output.publicPath = '';
module.exports = webpackConfig;