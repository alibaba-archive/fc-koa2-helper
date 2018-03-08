const hook = require('../').hook

exports.successFn = hook((ctx)=>{
  ctx.status = 200
  ctx.body = {
    code: 'ok',
    message: 'success'
  }
})

exports.errorFn = hook((ctx)=>{
  throw new Error('Invalid parameter')
})
