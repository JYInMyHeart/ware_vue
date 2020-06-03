module.exports = {
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8089,
    open: true,
    https: false,
    proxy: {
      '/Team_weacsoft_AutomaticCourse_war_exploded': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/Team_weacsoft_AutomaticCourse_war_exploded': ''
        }
      }
    },
    hotOnly: false
  }
}
