koars-browserify
================
[![Build Status](https://img.shields.io/travis/koars/browserify.svg?style=flat)](https://travis-ci.org/koars/browserify)

This module provides koa middleware to compile and serve a browserify bundle.

The following will serve the compiled contents of `js/index.js` on every route.

	var app = koa();
	var browserify = require('koars-browserify');
	app.use(browserify('js/index.js'));

Reloading
---------
If the `NODE_ENV` environment variable is not set to `production`, the files are dynamically reloaded upon any changes.