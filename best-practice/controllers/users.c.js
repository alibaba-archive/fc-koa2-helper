
module.exports = {
  list,
  get,
  update,
  del
}

async function list(ctx){
  var status = ctx.query.status;
  var marker = ctx.query.marker;
  var limit = ctx.query.limit;

  console.log(`list users, querys: ${JSON.stringify(ctx.query)}`)

  ctx.body = {
    items: [{
      userId: 'user-001',
      userName: 'xiaoming',
      status: 'normal',
      description: 'demo'
    },{
      userId: 'user-002',
      userName: 'xiaohua',
      status: 'normal',
      description: 'demo'
    }],
    nextMarker: ''
  };
}

async function get(ctx){
  var userId = ctx.params.userId;

  console.log('get userInfo: userId='+userId)

  if(userId!='user-001'){
    ctx.status = 404;
    ctx.body = {
      code: 'NotFound', message:'user not found'
    }
    return;
  }

  ctx.body = {
    userId: 'user-001',
    userName: 'xiaoming',
    status: 'normal',
    description: 'demo'
  };
}

async function update(ctx){
  var userId = ctx.params.userId;

  if(userId!='user-001' && userId!='user-002'){
    ctx.status = 404;
    ctx.body = {
      code: 'NotFound', message:'user not found'
    }
    return;
  }

  var status = ctx.body.status;
  var name = ctx.body.name;
  var description = ctx.body.description;

  console.log(`received data: ${JSON.stringify(ctx.body)}`)

  ctx.body = {
    code: 'OK', message: 'success'
  }
}

async function del(ctx){
  var userId = ctx.params.userId;

  console.log('delete user: '+userId)

  ctx.status=204;
  ctx.end();
}
