module.exports = {
  css: {
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: '@import "~@/styles/variables.scss";'
      }
    }
  },

  devServer: {
    // 此代理只针对本地开发服务(npm run serve，本地使用的是webpack-dev-serve启动的开发服务，本项目中接口有跨域限制)
    // 打包后运行dist使用的serve，与此处没有关系，不会走此处的代理，serve不支持代理配置，在访问localhost:5000时需要单独处理（使用node工具，创建test-serve目录实现）
    proxy: {
      '/boss': {
        target: 'http://eduboss.lagou.com',
        // ws: true, // websocket不需要配置
        changeOrigin: true // 把请求头中的host配置为target,当请求boss，请求头里的host就是http://eduboss.lagou.com，主要作用是如果后端配置了反向代理，需要通过changeOrigin识别客户端请求
      },
      '/front': {
        target: 'http://edufront.lagou.com',
        changeOrigin: true
      }
    }
  }
}
