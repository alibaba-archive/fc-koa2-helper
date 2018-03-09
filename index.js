const pathToRegexp = require('path-to-regexp');

const ORIGIN_EVENT = Symbol.for('#origin_event');
const EVENT = Symbol.for('#event');
const EVENT_PARSED = Symbol.for('#event_parsed');
const BODY_PARSED = Symbol.for('#body_parsed');
const BODY = Symbol.for('#body');

class Ctx {
  constructor(event, context, callback) {
    this[ORIGIN_EVENT] = event;
    this[EVENT_PARSED] = null;
    this[BODY_PARSED] = false;
    this[BODY] = null;
    this.context = context;
    // this.ctx = context;


    //response
    this._headers = {};
    this._body = undefined;
    this.typeSetted = false;
    this.statusCode = 200;
    this.callback = callback;
  }

  get[EVENT]() {
    if (!this[EVENT_PARSED]) {
      this[EVENT_PARSED] = JSON.parse(this[ORIGIN_EVENT]);
      this[ORIGIN_EVENT] = null;
    }
    return this[EVENT_PARSED];
  }

  get path() {
    return this[EVENT].path;
  }

  get method() {
    return this[EVENT].httpMethod;
  }

  get headers() {
    return this[EVENT].headers;
  }

  get query() {
    return this[EVENT].queryParameters;
  }

  get params() {
    return this[EVENT].pathParameters;
  }

  get body() {
    if (!this[BODY_PARSED]) {
      if (this[EVENT].isBase64Encoded) {
        this[BODY] = new Buffer(this[EVENT].body, 'base64').toString();
      } else {
        this[BODY] = this[EVENT].body;
      }

      if(this[BODY] && typeof(this[BODY]) == 'string'){
        try{
          this[BODY] = JSON.parse(this[BODY])
        }catch(e){

        }
      }
      this[BODY_PARSED] = true;
    }

    return this[BODY];
  }
  toString(){
    var obj = JSON.parse(JSON.stringify(this));
    obj.method = this.method
    obj.path = this.path
    obj.query = this.query
    obj.headers = this.headers
    obj.params = this.params
    obj.body = this.body
    return JSON.stringify(obj);
  }



  ////////////////
  set type(val) {
    this.setHeader('content-type', val);
    this.typeSetted = true;
  }

  set status(code) {
    this.statusCode = code;
  }
  set(key, value) {
    if (typeof(key) == 'object') {
      for (var k in key) {
        this.setHeader(k, key[k])
      }
    } else {
      this.setHeader(key,value)
    }
  }

  setHeader(key, value) {
    this._headers[key.toLowerCase()] = value;
  }

  send(data) {
    if (typeof data === 'string') {
      if (!this.typeSetted) {
        this.type = 'text/plain';
      }
    } else if (typeof data === 'object') {
      if (!this.typeSetted) {
        this.type = 'application/json; chartset=utf-8';
      }
    }
    this._body = data;
    this.end();
  }

  end() {
    var response = {
      isBase64Encoded: false,
      statusCode: this.statusCode,
      headers: this._headers,
      body: this._body
    };
    if(response.body && response.body instanceof Buffer){
      response.body = response.body.toString('base64');
      response.isBase64Encoded = true;
    }
    //console.log('koa2 response:', JSON.stringify(response));
    this.callback(null, response);

  }

  set body(s) {
    this.send(s)
  }
  redirect(s) {
    this.status = 302;
    this.setHeader('Location', s)
    this.end();
  }
}



exports.hook = function(handler) {
  return async function(event, context, callback) {

    const ctx = new Ctx(event, context, callback);
    try {
      await handler(ctx)
    } catch (e) {
      try{
        console.log(`handler Error: ${JSON.stringify(e.stack||e)}`)
      }catch(e2){
        console.log(`handler Error: ${JSON.stringify(e.message)}`)
      }

      ctx.status = e.status || 500;
      ctx.body = {
        code: e.code || 'Internal',
        message: e.message
      }
    }
  }
}

/////////////////////


var routes = [];
var METHODS = ['all', 'get', 'post', 'put', 'head', 'delete', 'options'];
METHODS.forEach(function(n) {
  exports[n] = function(pattern, fn) {
    var keys = [];
    var re = pathToRegexp(pattern, keys);
    routes.push({
      method: n.toUpperCase(),
      re: re,
      keys: keys,
      fn: fn
    });
  }
});


exports['handler'] = async function(event, context, callback) {

  const ctx = new Ctx(event, context, callback);

  var has = false;
  for (var rt of routes) {
    if (rt.method == 'ALL' || rt.method == ctx.method) {

      var result = rt.re.exec(ctx.path);

      if (result) {
        try {
          await rt.fn(ctx);
        } catch (e) {
          try{
            console.log(`handler Error: ${JSON.stringify(e.stack||e)}`)
          }catch(e2){
            console.log(`handler Error: ${JSON.stringify(e.message)}`)
          }


          ctx.status = e.status || 500;
          ctx.body = {
            code: e.code || 'Internal',
            message: e.message
          }
          return;
        }
        has = true;
      }
    }
  }
  if (!has) {
    ctx.status = 405;
    ctx.body = {
      code: 'NotAllow',
      message: 'Unsupported Request'
    }
  }

};
