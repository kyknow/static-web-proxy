## static web proxy
静态网站代理转发容器

### 安装

```shell
npm i static-web-proxy --save
```

### 使用

```javascript
const Proxy = require('static-web-proxy')
const proxy = new Proxy({
  proxy: [
    {                                   //代理
      host: 'localhost',                //代理HOST
      scheme: 'http',                   //协议(可选，默认http)
      port: 80,                         //代理端口
      targetPath:'/',                   //代理根路径
      path: '/apin',                    //原目录(会代理到代理服务的'/'目录)
      auth: (req, res) => {}            //签名方法(可选)
      heartBeat: 5000                   //心跳检测 默认不开启
    }
  ],
  web: {
    dir: path.join(__dirname, '/dist')  //静态网站目录
  },
  bind:{                                //启动绑定
    host: '0.0.0.0'                     
    port: 8080
  }
})
proxy.start()
```