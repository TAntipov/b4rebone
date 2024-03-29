const Webpack = require('webpack');
const Path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SvgStore = require('webpack-svg-icon-system/lib/SvgStorePlugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// PostCSS plugins
const Autoprefixer = require('autoprefixer');
const CSSMQpacker = require('css-mqpacker');
const CSSNano = require('cssnano');

const DIR_SRC = 'src';
const DIR_BUILD = 'build';
const DIR_ASSETS = 'assets';
const DIR_CACHE = 'cache';
const MODE_DEVELOPMENT = 'development';
const MODE_PRODUCTION = 'production';

const getThreadLoader = (name) => ({
  loader: 'thread-loader',
  options: {
    workerParallelJobs: 50,
    poolRespawn: false,
    name,
  },
});

const getCacheLoader = (path) => ({
  loader: 'cache-loader',
  options: {
    cacheDirectory: Path.resolve(__dirname, DIR_CACHE, path),
  },
});

module.exports = (env, argv) => {
  const ExtractCSS = new ExtractTextPlugin({
    filename: '../css/styles.css',
    publicPath: '/css',
  });

  const ExtractPUG = new ExtractTextPlugin({
    filename: '../[name].html',
  });

  const fileLoaderOptions = {
    outputPath: '../assets/',
    publicPath: '/assets/',
    regExp: /assets\/([\s\S]+)/,
    esModule: false,
    name: '[1]',
  };

  const webpackConfig = {
    entry: {
      index: Path.resolve(__dirname, DIR_SRC, 'js', 'index.js'),
      second: Path.resolve(__dirname, DIR_SRC, 'js', 'second.js'),
      third: Path.resolve(__dirname, DIR_SRC, 'js', 'third.js'),
    },

    output: {
      filename: '[name].js',
      path: Path.resolve(__dirname, DIR_BUILD, 'js'),
      publicPath: '',
      library: 'Page',
    },

    resolveLoader: {
      modules: [
        'node_modules',
        // custom loaders
        Path.resolve(__dirname, 'loaders'),
      ],
    },

    resolve: {
      modules: ['./js', './js/modules', 'node_modules', './data'],
      alias: {
        assets: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS),
        img: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'img'),
        svg: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'svg'),
        fonts: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'fonts'),
        styles: Path.resolve(__dirname, DIR_SRC, 'styles'),
        templates: Path.resolve(__dirname, DIR_SRC, 'templates'),
      },
    },
    mode: argv.mode,
    watch: argv.mode === MODE_DEVELOPMENT,
    watchOptions: {
      aggregateTimeout: 200,
      poll: 1000,
    },
    devtool: argv.mode === MODE_PRODUCTION ? false : 'source-map',
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            name: 'common',
            enforce: true,
          },
        },
      },
    },

    module: {
      rules: [
        // Expose jQuery
        {
          test: require.resolve('jquery'),
          use: [{
            loader: 'expose-loader',
            options: 'jQuery',
          }, {
            loader: 'expose-loader',
            options: '$',
          }],
        },

        // Babel
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            getCacheLoader('js'),
            getThreadLoader('js'),
            {
              loader: 'babel-loader',
              options: {
                presets: [['@babel/preset-env', {
                  modules: false, // disable babel bundling for speedup
                  loose: true,
                  useBuiltIns: 'usage',
                  debug: true,
                  target: 'es2015',
                  // target in .browserslistrc
                }]],
              },
            }],
        },

        // Images
        {
          test: /\.(png|gif|jpg|ico)([?]?.*)$/,
          use: [
            {
              loader: 'file-loader',
              options: fileLoaderOptions,
            },
          ],
        },

        // Fonts
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: fileLoaderOptions,
            },
          ],
        },

        // SVG Icons to sprite
        {
          test: /\.svg$/,
          include: [
            Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'svg', 'icons'),
          ],
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: false,
                esModule: false,
                publicPath: 'assets/svg/',
                name: 'sprite.svg#icon-[name]',
              },
            },
            {
              loader: 'webpack-svg-icon-system',
              options: {
                name: '../assets/svg/sprite.svg',
                prefix: 'icon',
                svgoOptions: {
                  plugins: [
                    { removeTitle: true },
                    { convertColors: { shorthex: false } },
                    { convertPathData: false },
                  ],
                },
              },
            },
          ],
        },

        // SVG
        {
          test: /\.svg$/,
          exclude: [
            Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'svg', 'icons'),
            // Path.resolve(__dirname, DIR_SRC, 'img', 'sprite.svg')
          ],
          use: [
            {
              loader: 'file-loader',
              options: fileLoaderOptions,
            },
            {
              loader: 'svgo-loader',
              options: {
                plugins: [
                  { removeTitle: true },
                  { convertColors: { shorthex: false } },
                  { convertPathData: false },
                ],
              },
            },
          ],
        },

        // PUG
        {
          test: /\.pug$/,
          use: ExtractPUG.extract({
            use: [
              getCacheLoader('html'),
              getThreadLoader('html'),
              {
                loader: 'html-loader',
                options: {
                  attributes: {
                    list: [
                      {
                        tag: 'img',
                        attribute: 'src',
                        type: 'src',
                      },
                      {
                        tag: 'use',
                        attribute: 'xlink:href',
                        type: 'src',
                      },
                      {
                        tag: 'source',
                        attribute: 'srcset',
                        type: 'srcset',
                      },
                    ],
                  },
                },

              },
              {
                loader: 'pug-html-loader',
                options: {
                  data: {
                    title: 'b4rebone',
                    // products: require(Path.resolve(__dirname, DIR_SRC, 'data', 'products.json'))
                  },
                  pretty: argv.mode === MODE_DEVELOPMENT,
                },
              },
            ],
          }),
        },

        // SASS
        {
          test: /\.(sass|scss|css)$/,
          use:
            ExtractCSS.extract({
              fallback: 'style-loader',
              use: [
                getCacheLoader('css'),
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: argv.mode === MODE_DEVELOPMENT,
                  },
                },
                {
                  loader: 'postcss-loader',
                  options: {
                    ident: 'postcss',
                    // sourceMap: argv.mode === MODE_DEVELOPMENT,
                    plugins: (() => {
                      const plugins = [
                        Autoprefixer,
                        CSSMQpacker,
                      ];
                      if (argv.mode === MODE_PRODUCTION) {
                        plugins.push(CSSNano);
                      }
                      return plugins;
                    })(),
                  },
                },
                // getThreadLoader('sass'),  Postcss error
                {
                  loader: 'sass-loader',
                  options: {
                    sourceMap: argv.mode === MODE_DEVELOPMENT,
                  },
                }],
            }),
        },
      ],
    },
    plugins: [

      // Copy files
      new CopyWebpackPlugin({
        patterns: [
          {
            from: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'favicon'),
            to: Path.resolve(__dirname, DIR_BUILD, DIR_ASSETS, 'favicon'),
          }, {
            from: Path.resolve(__dirname, DIR_SRC, DIR_ASSETS, 'robots.txt'),
            to: Path.resolve(__dirname, DIR_BUILD, 'robots.txt'),
          }],
        options: {
          concurrency: 100,
        },
      }),

      // Provide jQuery
      new Webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        jQuery: 'jquery',
        'window.jquery': 'jquery',
        'window.jQuery': 'jquery',
      }),
      new SvgStore(),
      ExtractCSS,
      ExtractPUG,
      new BrowserSyncPlugin({
        host: 'localhost',
        port: 8888, // remove port option to avoid socket.io.js 404 (Not Found)
        open: false,
        server: { baseDir: Path.resolve(DIR_BUILD) },
      }),

    ],
  };

  if (argv.mode === MODE_PRODUCTION) {
    webpackConfig.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          cache: true,
          parallel: true,
          mangle: true,
        },
        sourceMap: false,
      }),
    ];
  }

  webpackConfig.plugins.push(
    // Clean build dir
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        Path.resolve(__dirname, DIR_BUILD, '*'),
        `!${Path.resolve(__dirname, DIR_BUILD, '.gitkeep')}`, // keep file
      ],
      verbose: true,
      dry: false,
    }),
  );

  return webpackConfig;
};
