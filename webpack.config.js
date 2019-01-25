let Path = require('path');
let Webpack = require('webpack');
let CleanWebpackPlugin = require('clean-webpack-plugin');
let BrowserSyncPlugin = require('browser-sync-webpack-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let Autoprefixer = require('autoprefixer');
let SvgStore = require('webpack-svg-icon-system/lib/SvgStorePlugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const DIR_SRC = 'src';
const DIR_BUILD = 'build';

let ExtractCSS = new ExtractTextPlugin({
  filename: '../css/styles.css',
  publicPath: '/css'
  //disable: process.env.NODE_ENV === "development"
});

let ExtractHTML = new ExtractTextPlugin({
  filename: '../[name].html',
  //disable: process.env.NODE_ENV === "development"
});

let ExtractPUG = new ExtractTextPlugin({
  filename: '../[name].html'
});

let fileLoaderOptions = {
  outputPath: '../assets/',
  publicPath: 'assets/',
  regExp: /src\/assets\/([\s\S]+)/,
  name: '[1]'
}

module.exports = {
  entry: {
    index: Path.resolve(__dirname, DIR_SRC, 'js', 'index.js'),
    second: Path.resolve(__dirname, DIR_SRC, 'js', 'second.js'),
  },
  output: {
    filename: '[name].js',
    path: Path.resolve(__dirname, DIR_BUILD, 'js'),
    publicPath: '',
    library: 'Page'
  },

  resolveLoader: {
    modules: [
      'node_modules',
      Path.resolve(__dirname, 'loaders')
    ]
  },

  resolve: {
    modules: ['./js', './js/modules', 'node_modules', './data'],
    alias: {
      assets: Path.resolve(__dirname, DIR_SRC, 'assets'),
      img: Path.resolve(__dirname, DIR_SRC, 'assets', 'img'),
      styles: Path.resolve(__dirname, DIR_SRC, 'styles'),
      templates: Path.resolve(__dirname, DIR_SRC, 'templates'),
    }
  },
  devtool: 'source-map',

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          name: "common",
          enforce: true
        }
      }
    }
  },

  module: {
    rules: [
      //Expose jQuery
      {
        test: require.resolve('jquery'),
        use: [{
          loader: 'expose-loader',
          options: 'jQuery'
        }, {
          loader: 'expose-loader',
          options: '$'
        }]
      },
      //Babel
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["es2015"]
            }
          }]
      },
      //Images
      {
        test: /\.(png|gif|jpg|ico)([\?]?.*)$/,
        use: [
          {
            loader: 'file-loader',
            options: fileLoaderOptions
          }
        ]
      },

      //Fonts
      {
        test: /\.(woff|woff2|ttf|eot)([\?]?.*)$/,
        use: [
          {
            loader: 'file-loader',
            options: fileLoaderOptions
          }
        ]
      },

      // //Fonts
      // {
      //   test: /\.(woff|woff2|ttf|eot)([\?]?.*)$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         publicPath: 'assets/fonts/',
      //         regExp: /\/fonts\/(.*)/,
      //         name: '../assets/fonts/[1]'
      //       }
      //     }
      //   ]
      // },

      //{test: /\.(woff|svg|ttf|eot)([\?]?.*)$/, loader: 'file-loader?name=../assets/fonts/[1]&regExp=fonts/(.*)'},

      //SVG Icons to sprite
      {
        test: /\.svg$/,
        include: [
          Path.resolve(__dirname, DIR_SRC, 'assets', 'svg', 'icons')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              emitFile: false,
              publicPath: 'assets/svg/',
              name: 'sprite.svg#icon-[name]'
            }
          },
          {
            loader: 'webpack-svg-icon-system',
            options: {
              name: '../assets/svg/sprite.svg',
              prefix: 'icon',
              svgoOptions: {
                plugins: [
                  {removeTitle: true},
                  {convertColors: {shorthex: false}},
                  {convertPathData: false}
                ]
              }
            }
          }
        ]
      },

      //SVG
      {
        test: /\.svg$/,
        exclude: [
          Path.resolve(__dirname, DIR_SRC, 'assets', 'svg', 'icons')
          //Path.resolve(__dirname, DIR_SRC, 'img', 'sprite.svg')
        ],
        use: [
          {
            loader: 'file-loader',
            options: fileLoaderOptions
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                {removeTitle: true},
                {convertColors: {shorthex: false}},
                {convertPathData: false}
              ]
            }
          }
        ]
      },

      //PUG
      {
        test: /\.pug$/,
        use: ExtractPUG.extract({
          use: [
            {
              loader: 'html-loader',
              options: {
                interpolate: true,
                ignoreCustomFragments: [/\{\{.*?}}/],
                attrs: ['link:href', 'img:src', 'use:xlink:href', 'source:srcset']
              }

            },
            {
              loader: 'pug-html-loader',
              options: {
                data: {
                  title: 'b4rebone',
                  //products: require(Path.resolve(__dirname, DIR_SRC, 'data', 'products.json'))
                },
                pretty: NODE_ENV === 'development' ? true : false

              }
            }
          ]
        })
      },

      // SASS
      {
        test: /\.(sass|scss|css)$/,
        use: ExtractCSS.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    Autoprefixer('last 2 versions', 'ie 10')
                  ]
                }
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }]
        })
      },
      //HTML
      {
        test: /\.html$/,
        use: ExtractHTML.extract({
          use: [{loader: "html-loader"}]
        })
      },
    ]
  },
  plugins: [

    //Clean build dir
    new CleanWebpackPlugin([DIR_BUILD], {
      root: Path.resolve(__dirname),
      verbose: true,
      dry: false,
      exclude: ['.gitkeep']
    }),

    new Webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      'window.jQuery': 'jquery'
    }),

    new SvgStore(),
    ExtractCSS,
    ExtractHTML,
    ExtractPUG,
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8888, // remove port option to avoid socket.io.js 404 (Not Found)
      server: {baseDir: Path.resolve(DIR_BUILD)}
    })

  ],
  watch: NODE_ENV === 'development' ? true : false,
  watchOptions: {aggregateTimeout: 100},
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false

};

if (NODE_ENV !== 'development') {
  module.exports.plugins.push(
    new Webpack.optimize.UglifyJsPlugin({
      warnings: false,
      unsafe: true,
      drop_console: true
    })
  );
}