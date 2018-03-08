
const app = require('../');

app.get('/users', async (ctx)=>{
  ctx.body = [{
    userId: 'u-123', userName: 'aleelock'
  }]
});

app.get('/users/:userId', async(ctx)=>{
  ctx.body = {
    userId: ctx.params.userId,
    userName: 'aleelock'
  }
})
app.get('/users/:userId/books/:bookId', async(ctx)=>{
  ctx.body = {
    userId: ctx.params.userId,
    userName: 'aleelock',
    bookId: ctx.params.bookId,
    bookName: 'lala'
  }
})
app.delete('/users/:userId', async(ctx)=>{
  ctx.status=204
  ctx.body = ''
})

app.put('/users/:userId', async(ctx)=>{
  var userName = ctx.body.userName
  ctx.body = {code:'ok', message: 'update '+userName+' success'}
})

app.post('/users', async(ctx)=>{
  var userName = ctx.body.userName
  throw new Error('Invalid userName')
})

exports.handler = app.handler;
