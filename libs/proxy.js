const httpProxy = require('http-proxy-middleware');
const _ = require('lodash')


module.exports = (opts) => {
  const options = {
    target: `${opts.scheme}://${opts.host}:${opts.port}${opts.targetPath || '/'}`,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      [opts.path] : '/' 
    },
    onProxyReq: (proxyReq, req, res, options) => {
      if (opts.auth && _.isFunction(opts.auth)) {
        opts.auth(proxyReq, res)
      }
    },
  }
  return httpProxy(options)
}