var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = require('./app.config');
var BabiliPlugin = require("babili-webpack-plugin");
var CompressionPlugin = require('compression-webpack-plugin');


const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;


const common = {
    entry: PATHS.app,
    output: {
        path: PATHS.build,
        filename: 'bundle.[hash].js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    sassResources: [
      './app/scss/_variables.scss',
      './app/scss/_mixins.scss',
    ],
    module: {
        preLoaders: [
        ],
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: PATHS.app
            }, {
                test: /\.css$/,
                loaders: ['style', 'css'],
                include: PATHS.app
            },{
                test: /\.scss$/,
                loader: TARGET === 'build' ?
                  ExtractTextPlugin.extract('style-loader', 'css-loader?minimize!sass-loader!sass-resources') :
                  'style!css!sass!sass-resources',
                include: PATHS.app
            },{
                test: /\.(png|jpg|svg|woff2)$/,
                loader: "file-loader"
            },{
              test: /manifest.json$/,
              loader: 'file-loader?name=manifest.json!web-app-manifest-loader'
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: config.PAGE_TITLE,
            template: "app/assets/index.html",
            appMountId: 'app',
            hash: false,
            mobile: true,
            themeColor: config.THEME_COLOR,
            sentry: TARGET === 'build' ? config.SENTRY_KEY : false,
            sw:  TARGET === 'build' ? true : false,
        }),
        new webpack.DefinePlugin({
         "process.env": {
           NODE_ENV: TARGET === 'build' ? JSON.stringify("production") : JSON.stringify("development")
         }
       }),
    ]
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true,
            stats: 'errors-only',
            host: config.SERVER_HOST,
            port: config.SERVER_PORT
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoErrorsPlugin(),
        ]
    });
}

if (TARGET === 'build') {
    module.exports = merge(common, {
        plugins: [
          new BabiliPlugin(),
          new webpack.optimize.DedupePlugin(),
          new CleanWebpackPlugin(['build']),
          new ExtractTextPlugin("styles.[hash].css"),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.optimize.AggressiveMergingPlugin(),
        ]
    });
}
