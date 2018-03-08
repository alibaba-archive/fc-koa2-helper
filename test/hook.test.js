var expect = require('expect.js')
var handler = require('./hook-example')

describe('test hook', function() {
  this.timeout(10000)

  it('successFn', function(done) {
    var evt = {
      path: '/test',
      httpMethod: 'GET',
      headers: {},
      queryParameters: {},
      pathParameters: {},
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler.successFn(evt, {}, function(err, data) {
      //console.log(data)
      expect(data.statusCode).to.be(200)
      var info = data.body
      expect(info.code).to.be('ok')
      expect(info.message).to.be('success')
      done();
    })
  })

  it('errorFn', function(done) {

    var evt = {
      path: '/test',
      httpMethod: 'GET',
      headers: {},
      queryParameters: {},
      pathParameters: {},
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler.errorFn(evt, {}, function(err, data) {
      expect(data.statusCode).to.be(500)
      var info = data.body
      expect(info.code).to.be('Internal')
      expect(info.message).to.be('Invalid parameter')
      done();
    })
  })


})
