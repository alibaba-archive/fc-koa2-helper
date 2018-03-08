
const app = require('fc-koa2-helper');
const Users = require('./controllers/users.c.js');


app.all('/(.*)', async (ctx)=>{
  console.log(`${ctx.method} ${ctx.path} ${ctx}`)
  //common codes goes here

});


app.get('/users', Users.list);
app.get('/users/:userId', Users.get);
app.put('/users/:userId', Users.update);
app.delete('/users/:userId', Users.del);

exports.handler = app.handler
