const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'spin.js',
        library: 'spin'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            'camelcase': require.resolve('lodash/camelCase'),
            'decamelize': require.resolve('lodash/snakeCase'),
            'openai': false,
            'langsmith': false,
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    optimization: {
        // minimize: false,
    },
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1,
        }),
        new webpack.ProvidePlugin({
            ReadableStream: 'stream-browserify',
        }),
    ]
};
