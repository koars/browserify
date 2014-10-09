var path = require('path');
var sinon = require('sinon');
var cb;

module.exports = {
	mock: function(src) {
		var call = 0;
		return {
			bundle: function(cb) {
				cb(null, src+call++);
			},
			exclude: sinon.spy(),
			on: function(type, fn) {
				cb = fn;
			}
		};
	},
	trigger: function() {
		if(cb) cb();
	}
};