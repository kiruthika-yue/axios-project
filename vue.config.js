module.exports = {
  publicPath: process.env.BASE_URL,
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config.plugin("html").tap(args => {
      args[0].title = "Richctrl WebEXP Login";
      return args;
    });
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api": {
        target: "http://iam.richctrl.com",
        changeOrigin: true,
      },
      "/idp": {
        target: "http://iam.richctrl.com",
        changeOrigin: true,
      },
      "/application": {
        target: "http://iam.richctrl.com",
        changeOrigin: true,
      }
    }
  }
};
