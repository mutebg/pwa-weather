var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var config = require('./app.config');


const TARGET = process.env.npm_lifecycle_event;
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build')
};

process.env.BABEL_ENV = TARGET;


const common = {
    // Entry accepts a path or an object of entries.
    // The build chapter contains an example of the latter.
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
            // Set up jsx. This accepts js too thanks to RegExp
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: PATHS.app
            }, {
                // Test expects a RegExp! Note the slashes!
                test: /\.css$/,
                loaders: ['style', 'css'],
                // Include accepts either a path or an array of paths.
                include: PATHS.app
            },{
                test: /\.scss$/,
                loader: TARGET === 'build' ?
                  ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer-loader!sass-loader!sass-resources') :
                  'style!css!autoprefixer-loader!sass!sass-resources',
                // Include accepts either a path or an array of paths.
                include: PATHS.app
            },{
                test: /\.(png|jpg|svg|woff2)$/,
                //loader: "url-loader?limit=100000"
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

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env so this is easy to customize.
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
          // new UglifyJsPlugin({
          //     minimize: true
          // }),
          new webpack.optimize.DedupePlugin(),
          new CleanWebpackPlugin(['build']),
          new ExtractTextPlugin("styles.[hash].css"),
          new webpack.optimize.OccurenceOrderPlugin(),
        ]
    });
}
