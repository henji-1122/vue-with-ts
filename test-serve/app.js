// 使用基于nodejs的web服务框架express

const express = require('express')
const app = express()
const path = require('path')
const { createProxyMiddleware } = require('http-proxy-middleware')

// app.get('/', (req,res) => {
//   res.send('hello')
// })

// 将dist项目托管到express的web服务中
// 托管了dist目录，当访问 / 的时候，默认会返回托管项目中的 index.html 文件
app.use(express.static(path.join(__dirname, '../dist')))

// 配置代理
app.use('/boss', createProxyMiddleware({
  target: 'http://eduboss.lagou.com',
  changeOrigin: true
}))

app.use('/front', createProxyMiddleware({
  target: 'http://edufront.lagou.com',
  changeOrigin: true
}))

app.listen(3000, () => {
  console.log('running ....')
})
