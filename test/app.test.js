var expect = require('expect.js')
var handler = require('./app-example').handler

describe('test app handler', function() {
  this.timeout(60000)

  it('GET /users', function(done) {
    var evt = {
      path: '/users',
      httpMethod: 'GET',
      headers: {},
      queryParameters: {
        a: 'b'
      },
      pathParameters: {},
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      //console.log(data)
      expect(data.statusCode).to.be(200)
      var arr = data.body
      expect(arr[0].userId).to.be('u-123')
      expect(arr[0].userName).to.be('aleelock')
      done();
    })
  })

  it('GET /users/:userId/books/:bookId', function(done) {

    var evt = {
      path: '/users/u-123/books/b-345',
      httpMethod: 'GET',
      headers: {},
      queryParameters: {},
      pathParameters: {
        userId: 'u-123',
        bookId: 'b-345'
      },
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      //console.log('-------',data)
      expect(data.statusCode).to.be(200)
      var info = data.body
      expect(info.userId).to.be('u-123')
      expect(info.userName).to.be('aleelock')
      expect(info.bookId).to.be('b-345')
      expect(info.bookName).to.be('lala')
      done();
    })
  })

  it('GET /users/:userId', function(done) {

    var evt = {
      path: '/users/u-123',
      httpMethod: 'GET',
      headers: {},
      queryParameters: {},
      pathParameters: {
        userId: 'u-123'
      },
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      //console.log('-------',data)
      expect(data.statusCode).to.be(200)
      var info = data.body
      expect(info.userId).to.be('u-123')
      expect(info.userName).to.be('aleelock')
      done();
    })
  })

  it('DELETE /users/:userId', function(done) {

    var evt = {
      path: '/users/u-123',
      httpMethod: 'DELETE',
      headers: {},
      queryParameters: {},
      pathParameters: {
        userId: 'u-123'
      },
      body: '',
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      expect(data.statusCode).to.be(204)
      expect(data.body).to.be('')
      done();
    })
  })

  it('PUT /users/:userId', function(done) {

    var evt = {
      path: '/users/u-123',
      httpMethod: 'PUT',
      headers: {'Content-Type':'application/json'},
      queryParameters: {},
      pathParameters: {
        userId: 'u-123'
      },
      body: JSON.stringify({userName:'aleelock'}),
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      expect(data.statusCode).to.be(200)
      var info =  data.body
      expect(info.code).to.be('ok')
      expect(info.message).to.be('update aleelock success')
      done();
    })
  })

  it('POST /users', function(done) {

    var evt = {
      path: '/users',
      httpMethod: 'POST',
      headers: {},
      queryParameters: {},
      pathParameters: {},
      body: JSON.stringify({userName:'aleelock'}),
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {
      expect(data.statusCode).to.be(500)
      var info = data.body
      expect(info.code).to.be('Internal')
      expect(info.message).to.be('Invalid userName')

      done();
    })
  })

  it('POST /undefine', function(done) {

    var evt = {
      path: '/undefine',
      httpMethod: 'POST',
      headers: {},
      queryParameters: {},
      pathParameters: {},
      body: JSON.stringify({userName:'aleelock'}),
      isBase64Encoded: false
    };
    evt = JSON.stringify(evt);

    handler(evt, {}, function(err, data) {

      expect(data.statusCode).to.be(405)
      var info = data.body
      expect(info.code).to.be('NotAllow')
      expect(info.message).to.be('Unsupported Request')

      done();
    })
  })


})
