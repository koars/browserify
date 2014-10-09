var browserify = require('browserify');
var watchify = require('watchify');
var koars = require('koars-utils')({module: 'assets', asset:'js'});

module.exports = function(src, dest, excludes) {
	//Setup our cache, timestamp and watchify instance
	var cache, time = new Date();
	var w = watchify(browserify(src, watchify.args));

	//Exclude all specified modules
	if(excludes) excludes.forEach(w.exclude.bind(w));

	//Run the initial bundle and listen for updates
	cache = bundle();
	if(koars.dev()) w.on('update', function() {
		cache = bundle();
	});

	//Exclude handlebars, if needed, so we use the handlebars instance which has our helpers attached
	//Then bundle the files, update the timestamp and log our success/failure
	function bundle() {
		return new Promise(function(resolve, reject) {
			w.bundle(function(err, bundle) {
				if(!err) {
					time = new Date();
					koars.log.debug('Rebuilt js bundle');
					resolve(bundle);
				} else {
					koars.log.warn(err, 'Failed to build js bundle');
					reject(err);
				}
			});
		});
	}

	//Return a middleware generator function to serve our cached bundle upon request
	return function *(next) {
		this.body = yield cache;
		this.lastModified = time;
		this.type = 'text/javascript';
	};
};