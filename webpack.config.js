const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/js/script.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: isProd ? './' : '/',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/html/index.html',
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/assets/img/favicon.ico', to: 'assets/img/favicon.ico', noErrorOnMissing: true },
          { from: 'src/assets/pdf', to: 'assets/pdf', noErrorOnMissing: true },
        ],
      }),
    ],
    devServer: {
      static: path.join(__dirname, 'dist'),
      open: true,
      historyApiFallback: true,
    },
    mode: argv.mode || 'development',
  };
};
