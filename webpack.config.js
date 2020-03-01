const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    devtool: 'source-map',
    entry: [
        "./src/index.ts"
    ],
    output: {
        path: path.resolve(__dirname, "wwwroot"),
        filename: "[name].[chunkhash].js",
        publicPath: "/"
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(["wwwroot/*"]),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            inject: false,
            minify: {
                except: ["onSignIn", "googleUser","renderInput"]
            }
            
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[chunkhash].css"
        })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                uglifyOptions: {
                    mangle: {
                        keep_fnames: true
                    },
                    compress: {
                        keep_fnames: true
                    }
                }
             })
        ]
    }
};