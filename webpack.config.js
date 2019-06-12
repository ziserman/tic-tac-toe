'use strict';

const path                  = require('path');
const postcssNested         = require('postcss-nested');
const postcssImport         = require('postcss-import');
const webpack               = require('webpack');
const autoprefixer          = require('autoprefixer');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const HtmlWebpackPlugin     = require('html-webpack-plugin');

const isProd     = process.env.NODE_ENV === 'production';
const isWatch    = process.env.WATCH === 'true';

const postCSSOpts = {
    sourceMap: !isProd,
    ident: 'postcss',
    plugins: [
        postcssImport(),
        autoprefixer({
            browsers: ['last 3 versions', 'Firefox ESR', 'ie >= 11']
        }),
        postcssNested(),
    ]
};

const getCSSLoaderRules = (params) => {
    const cssLoader = {
        loader: 'css-loader',
        options: {
            modules: params.cssModulesEnabled,
            sourceMap: !isProd
        }
    };

    if (params.cssModulesEnabled) {
        cssLoader.options.localIdentName = '[folder]-[local]__[hash:5]';
    }

    return [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        cssLoader,
        {
            loader: 'postcss-loader',
            options: postCSSOpts
        }
    ];
};


module.exports = (function() {
    let options = {
        watch: isWatch,
        devtool: isProd
            ? false
            : 'inline-source-map',
        stats: {
            children: false
        },
        mode: isProd ? 'none' : 'development',
        entry: {
            app: ['./src/index']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
            filename: `[name].js`,
            globalObject: 'this'
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css'],
            modules: ['node_modules'],
            alias: {
                'react': path.join(__dirname, 'node_modules', 'react'),
                'react-dom': path.join(__dirname, 'node_modules', 'react-dom')
            }
        },
        optimization: {
            minimize: isProd
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[id].css'
            }),
            new HtmlWebpackPlugin({
                title: 'Tic Tac Toe',
                template: './src/page-template.html',
                fileName: 'index.html',
                chunks: {
                    module: {
                        entry: ['[name].js'],
                        css: ['[name].css']
                    }
                }
            }),
        ],
        module: {
            rules: [{
                test: /\.tsx?$/,
                use: [{
                    loader: 'awesome-typescript-loader',
                    options: {
                        useCache: true,
                        cacheDirectory: '.awcache'
                    }
                }],
                exclude: /(node_modules)/
            }, {
                test: /\.css$/,
                use: getCSSLoaderRules({ cssModulesEnabled: true }),
                exclude: /(node_modules)/
            }, {
                test: /\.css$/,
                use: getCSSLoaderRules({ cssModulesEnabled: false }),
                include: /(node_modules)/
            }]
        }
    };

    if (isWatch) {
        const DEV_SERVER_PORT = 3000;
        const DEV_SERVER_HOST = 'localhost';

        options.entry.app.unshift(
            `webpack-dev-server/client?http://${DEV_SERVER_HOST}:${DEV_SERVER_PORT}`,
            'webpack/hot/only-dev-server'
        );
        options.plugins.push(new webpack.HotModuleReplacementPlugin());
        options.devServer = {
            contentBase: './',
            port: DEV_SERVER_PORT,
            host: DEV_SERVER_HOST,
            hot: true,
            open: true,
            openPage: 'dist/index.html',
            stats: { children: false }
        };
    }

    if (isProd) {
        options.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true
            }),
        );
    } else {
        options.plugins.push(
            new webpack.NamedModulesPlugin(),
        );
    }

    return options;
}());
