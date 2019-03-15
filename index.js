const express = require('express')
const log4js = require('log4js')
const history = require('connect-history-api-fallback')
const httpproxy = require('./libs/proxy')
const http = require('http')
const https = require('https')
class Proxy {
  constructor({
    bind = { host: '0.0.0.0', port: 3000 }, web = { dir: `${__dirname}/public`},proxy
  }) {
    this.bind = bind
    this.web = web
    this.proxy = proxy
    this.app = express()
  }

  start() {
    log4js.configure({
      appenders: { console: { type: 'console' } },
      categories: { default: { appenders: [ 'console' ], level: 'info' } }
    })
    const logger = log4js.getLogger()
    this.app.use(log4js.connectLogger(logger));
    if(Array.isArray(this.proxy)){
      for(let p of this.proxy) {
        this.app.use(p.path, httpproxy({
          host: p.host,
          port: p.port,
          path: p.path,
          auth: p.auth,
          scheme: p.scheme || 'http',
          targetPath: p.targetPath
        }))
        this._heartBeat(p)
        
      }
    } else {
      this.app.use(this.proxy.path, httpproxy({
        host: this.proxy.host,
        port: this.proxy.port,
        path: this.proxy.path,
        auth: this.proxy.auth,
        scheme: this.proxy.scheme || 'http',
        targetPath: this.proxy.targetPath
      }))
      this._heartBeat(p)
    }
    this.app.use(function (req, res, next) {
      res.set('Cache-Control', 'no-cache')
      next()
    })
    this.app.use(history())
    this.app.use(express.static(this.web.dir))
    this.app.listen(this.bind.port,this.bind.host)
  }

  _heartBeat(p) {
    if (p.heartBeat > 0) {
      setInterval(() => {
        const url = `${p.scheme || 'http'}://${p.host}:${p.port}${p.targetPath || '/'}`
        const req = (p.scheme === 'https' ? https : http).request(url, {}, (res) => {
          if(res.statusCode !== 400) {
            console.error(`Proxy "${url}" HeartBeat Error！StatusCode: ${res.statusCode}`)
          }
        })
        req.end()
      }, p.heartBeat)
    }
  }
}
module.exports = Proxy