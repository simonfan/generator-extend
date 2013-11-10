'use strict';

var YoExtensions = require('../../lib/yo-extensions.js'),
		path = require('path');

/*
	======== A Handy Little Nodeunit Reference ========
	https://github.com/caolan/nodeunit

	Test methods:
		test.expect(numAssertions)
		test.done()
	Test assertions:
		test.ok(value, [message])
		test.equal(actual, expected, [message])
		test.notEqual(actual, expected, [message])
		test.deepEqual(actual, expected, [message])
		test.notDeepEqual(actual, expected, [message])
		test.strictEqual(actual, expected, [message])
		test.notStrictEqual(actual, expected, [message])
		test.throws(block, [error], [message])
		test.doesNotThrow(block, [error], [message])
		test.ifError(value)
*/

exports['test'] = {
	setUp: function(done) {
		process.yoextensionsJSON = new YoExtensions(path.join(__dirname, 'yoextensions.test.json'));

		// setup here
		done();
	},
	tearDown: function(done) {
		done();
	},
	'basic instantiation': function(test) {
		var yoextensionsJSON = process.yoextensionsJSON;

		test.expect(2);
		// tests here
		test.ok(yoextensionsJSON);
		test.equal(yoextensionsJSON.file.get('packageJSONTemplate'), 'app/templates/_package.json');

		test.done();
	},

	'read dependencies': function(test) {
		test.expect(1);

		test.deepEqual(process.yoextensionsJSON.dependencies(), {
			'https://github.com/yeoman/generator-backbone.git': '>=0.0.0',
			'generator-generator': '0.1.0',
			'generator-bower-amd': '*'
		});

		test.done();
	},


	'get extensions': function(test) {
		test.expect(1);
		var extensions = process.yoextensionsJSON.extensions();

		test.deepEqual(Object.keys(extensions), [
			'backbone:model',
			'backbone:view',
			'backbone:collection',
			'backbone:router',
			'generator:subgenerator',
			'bower-amd:app'
		]);

		test.done();
	},

	'set extensions': function(test) {
		test.expect(1);

		// set extensions.
		// remember: extensions(deps) extends the current extensions,
		// and does not overwrite them
		process.yoextensionsJSON.extensions({ 'fake-dependency': '*' });



		test.deepEqual(process.yoextensionsJSON.file.get('extensions'), {
			"https://github.com/yeoman/generator-backbone.git": {
				"generator": "backbone",
				"version": ">=0.0.0",
				"subgenerators": ["model","view","collection","router"]
			},

			"generator:subgenerator": "0.1.0",
			"bower-amd": "*",
			"fake-dependency": "*"
		});
		test.done();
	},
};
