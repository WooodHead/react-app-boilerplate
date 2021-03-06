/* eslint-disable global-require, import/no-extraneous-dependencies */
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import NodeExternals from 'webpack-node-externals';

import baseConfig, {
  SRC_PATH,
  SERVER_DIST_PATH,
} from './webpack.config.base.babel';

const config = {
  ...baseConfig,

  entry: {
    'modules/ui/components/Root': path.join(
      SRC_PATH,
      'modules/ui/components/Root',
    ),
  },

  output: {
    path: SERVER_DIST_PATH,
    filename: '[name].js',
    libraryTarget: 'commonjs2',
  },

  externals: [NodeExternals()],

  target: 'node',

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
      options: {
        context: __dirname,
        postcss: () => [require('autoprefixer')],
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin({
      filename: '_[name].css',
      allChunks: true,
    }),
    new webpack.DllReferencePlugin({
      manifest: require('../build/client/dll/lib-manifest.json'),
    }),
  ],

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.(js|jsx)$/,
        loaders: ['babel-loader'],
        include: SRC_PATH,
        exclude: /node_modules/,
      },
    ],
  },

  cache: true,
};

export default config;
