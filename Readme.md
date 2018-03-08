# fc-koa2-helper

函数计算 & API 网关辅助库。

提供类似koa2风格的web开发体验。

依赖 nodejs8 及以上。

## 安装

```
npm i --save fc-koa2-helper
```

## 函数计算原始形式

```js
exports.handler = function(event, context, callback) {
  // 处理 event
  callback(null, {
    isBase64Encoded: false,
    statusCode: statusCode,
    headers: headers,
    body: body
  });
}
```

## Usage 1

将一个 Web 形式的处理单元转化为原始形式。

```js
const hook = require('fc-koa2-helper').hook

exports.handler = hook((ctx)=>{
  ctx.status = 200
  ctx.body = {
    code: 'ok',
    message: 'success'
  }
})
```

更详细例子: [test/hook-example.js](test/hook-example.js)

## Usage 2

在一个函数中，通过请求方法和路径拆分功能。

```js

const app = require('fc-koa2-helper');

app.all('/(.*)', async (ctx)=>{
  console.log(`${ctx.method} ${ctx.path} ${ctx}`)
  //common codes goes here
});

app.get('/users', async (ctx)=>{
  ctx.status = 200
  ctx.body = {
    code: 'ok',
    message: 'success',
    users: []
  }
});

app.put('/users/:userId', async (ctx)=>{
  //...
});

//app 支持方法有：['get','post','put','head','delete','options']

exports.handler = app.handler;
```

更详细例子: [test/app-example.js](test/app-example.js)

## cxt 对象

ctx 对象同时具有request和response的功能。

ctx 具有 path、method、headers、query、params、body只读属性。

可以通过 cxt.status = 200 的方式设置 statusCode。

可以通过 cxt.set('key', 'value') 的方式设置任意 header。

可以通过 cxt.body="" 的方式设置 body。如果没有设置 content-type，会根据 body 类型自动设置 content-type。

string，会自动填充类型为 text/plain
object，会自动填充类型为 application/json

可以通过 ctx.redirect(url) 重定向。

## License

MIT
