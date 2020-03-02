const AwsSamPlugin = require('aws-sam-webpack-plugin');

const awsSamPlugin = new AwsSamPlugin();

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  entry: () => awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: '[name]/app.js',
    libraryTarget: 'commonjs2',
    path: __dirname + '/.aws-sam/build/',
  },

  // Create source maps
  devtool: 'source-map',

  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.ts', '.js'],
  },

  // Target node
  target: 'node',

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
  externals: process.env.NODE_ENV === 'development' ? [] : ['aws-sdk'],

  // Set the webpack mode
  mode: process.env.NODE_ENV || 'production',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },

  // Add the AWS SAM Webpack plugin
  plugins: [awsSamPlugin],
};
