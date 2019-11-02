var path = require('path');

module.exports = {
    entry: [
        './src/index.jsx',
    ],
    resolve: {
        modules: [
            'src',
            'node_modules',
        ],
        extensions: ['*', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react',
                            [
                                "@babel/preset-env",
                                {
                                    "modules": "commonjs",
                                    "targets": {
                                        "node": "current"
                                    }
                                }
                            ]
                        ],
                    },
                },
            },
        ],
    },
    externals: {
        "react": 'React',
        "react-dom": 'ReactDom',
        "redux": 'Redux',
        "react-redux": 'ReactRedux',
        "prop-types": 'PropTypes',
        "@steedos/react": 'SteedosReact',
        "@salesforce/design-system-react": 'ReactDesignSystem',
    },
    output: {
        path: path.join(__dirname, '..', '/src'),
        publicPath: '/',
        filename: 'webapp.client.js',
    },
};