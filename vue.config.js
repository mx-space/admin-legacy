/*
 * @Author: Innei
 * @Date: 2020-05-27 19:10:07
 * @LastEditTime: 2020-05-30 12:45:15
 * @LastEditors: Innei
 * @FilePath: /mx-admin/vue.config.js
 * @Code with Love
 */

/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use strict'
// const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require('webpack')
// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following methods:
// port = 9528 npm run dev OR npm run dev --port = 9528
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  publicPath:
    process.env.NODE_ENV === 'production'
      ? !process.env.VUE_APP_PUBLIC_URL
        ? 'https://cdn.jsdelivr.net/gh/Innei/admin-cdn@master'
        : ''
      : '/',

  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  pwa: {
    name: 'mx-space-admin',
    themeColor: '#1681e1',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  },
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true,
    },
  },

  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
    )
  },
  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach((type) =>
      addStyleResource(config.module.rule('scss').oneOf(type)),
    )
  },
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: process.env.NODE_ENV === 'production' ? true : false,
    },
  },
}

function addStyleResource(rule) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
        require('path').resolve(__dirname, 'src/assets/scss/_var.scss'),
      ],
    })
}
