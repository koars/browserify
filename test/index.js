var koa = require('koa');
var path = require('path');
var request = require('supertest');
var rewire = require('rewire');
var browserify = rewire('../index.js');
var watchifyMock = require('./mocks/watch');
var browserifyMock = require('./mocks/browserify');

var app, revert;
before(function() {
	revert = browserify.__set__({
		watchify: watchifyMock.mock,
		browserify: browserifyMock.mock
	});
});

after(function() {
	revert();
});

beforeEach(function() {
	app = koa();
	app.use(browserify('js/index.js'));
});

describe('In production mode the middleware', function() {
	before(function() {
		process.env.NODE_ENV_TEST = 'production';
	});

	after(function() {
		delete process.env.NODE_ENV_TEST;
	});

	it('serves the JavaScript correctly', function(done) {
		request(app.listen())
			.get('/')
			.expect(200)
			.expect(/js\/index.js/)
			.expect('Content-Type', /text\/javascript/)
			.end(done);
	});

	it('does not reload', function(done) {
		watchifyMock.trigger();

		request(app.listen())
			.get('/')
			.expect(200)
			.expect(/js\/index.js0/)
			.expect('Content-Type', /text\/javascript/)
			.end(done);
	});
});

describe('In development mode the middleware', function() {
	it('serves the JavaScript correctly', function(done) {
		request(app.listen())
			.get('/')
			.expect(200)
			.expect(/js\/index.js/)
			.expect('Content-Type', /text\/javascript/)
			.end(done);
	});

	it('reloads', function(done) {
		watchifyMock.trigger();

		request(app.listen())
			.get('/')
			.expect(200)
			.expect(/js\/index.js1/)
			.expect('Content-Type', /text\/javascript/)
			.end(done);
	})
});