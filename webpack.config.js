const Path = require('path');
const Webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Autoprefixer = require('autoprefixer');
const SvgStore = require('webpack-svg-icon-system/lib/SvgStorePlugin');

const DIR_SRC = 'src';
const DIR_BUILD = 'build';
const DIR_ASSETS = 'assets';

module.exports = (env, argv) => {

  let ExtractCSS = new ExtractTextPlugin({
    filename: '../css/styles.css',
    publicPath: '/css',
  });

  let ExtractHTML = new ExtractTextPlugin({
    filename: '../[name].html',
  });

  let ExtractPUG = new ExtractTextPlugin({
    filename: '../[name].html'
  });

  let fileLoaderOptions = {
    outputPath: '../assets/',
    publicPath: '/assets/',
    regExp: /src\/assets\/([\s\S]+)/,
    name: '[1]'
  }

  let webpackConfig = {
    entry: {
      index: Path.resolve(__dirname, DIR_SRC, 'js', 'index.js'),
      second: Path.resolve(__dirname, DIR_SRC, 'js', 'second.js'),
      third: Path.resolve(__dirname, DIR_SRC, 'js', 'third.js'),
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
        //custom loaders
        Path.resolve(__dirname, 'loaders')
      ]
    },

    resolve: {
      modules: ['./js', './js/modules', 'node_modules', './data'],
      alias: {
        assets: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS),
        img: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'img'),
        fonts: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'fonts'),
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
          test: /\.(woff(2)?|ttf|eot|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: fileLoaderOptions
            }
          ]
        },

        //SVG Icons to sprite
        {
          test: /\.svg$/,
          include: [
            Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'svg', 'icons')
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
            Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'svg', 'icons')
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
                  pretty: argv.mode === 'development' ? true : false

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
                  sourceMap: argv.mode === 'development' ? true : false,
                  minimize: argv.mode === 'development' ? false : true
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
                  sourceMap: argv.mode === 'development' ? true : false
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

      new CopyWebpackPlugin([
          {
            from: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'favicon'),
            to: Path.resolve(__dirname, DIR_BUILD, DIR_ASSETS, 'favicon'),
            toType: 'dir'
          }], {
          //'debug': true
        }
      ),

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
    watch: argv.mode === 'development' ? true : false,
    watchOptions: {aggregateTimeout: 100},
    devtool: argv.mode === 'development' ? 'inline-source-map' : false
  };


  if (argv.mode !== 'development') {
    webpackConfig.optimization.minimizer = [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: true
      })
    ]
  }


  // warnings: false,
  //   unsafe: true,
  //   drop_console: true

  return webpackConfig;

}
