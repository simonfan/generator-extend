/**
Defines a object that reads data from yoextensions.json
*/
var jsonf = require('json-file'),
	_ = require('lodash');

var YoExtensions = module.exports = function(path) {

	console.log(__dirname);
	console.log(path);
	this.file = jsonf.read(path);
};

YoExtensions.prototype.parseExtension = function(name) {
	var res = {},
		description = this.file.get('extensions')[name];
		/**
		description {Object|String}
			{Object}: {
				generator: generatorName,
				[subgenerators]: {String|Array|undefined} defaults to "app",
				[version]: {String|undefined} defaults to "*"
			}
			{String}: "semver"
		*/


	if (_.isObject(description)) {
		// name = "npmPackageSource:subgenerator"
		// description =  {
		//      "generator": "generatorName",
		//      "subgenerators": ["subgeneratorName","anotherSubGeneratorName"],
		//      "verion": "semverVersion"
		// }

		if (!description.generator) {
			throw new Error('No generator specified for ' + name + ' package!');
		}

		res.dependency = name;
		res.version = description.version;

		res.generator = description.generator;
		// subgenerators default to app.
		res.subgenerators = description.subgenerators || 'app';


	} else {
		// name = "generatorName:subgeneratorName"
		// description = "semverVersion"

		res.generator = name.split(':')[0];
		// subgenerators default to app
		res.subgenerators = name.split(':')[1] || 'app';
		res.dependency = 'generator-' + res.generator;
		res.version = description;
	}

	// normalize subgenerators property to array
	res.subgenerators = _.isArray(res.subgenerators) ? res.subgenerators : [res.subgenerators];
	res.version = res.version || '*';

	return res;
	/**
	res {Object}: {
		dependency: ,
		version: ,
		generator: ,
		subgenerators: ,
	}
	*/
};
/**
Normalizes data on extensions defined at yoextensions.json.

@method parseExtension
@param name {String}
*/


YoExtensions.prototype.parseExtensions = function() {
	// parse all extensios data
	var _this = this,
		extensions = this.file.get('extensions');

	return _.reduce(Object.keys(extensions), function(res, extName) {
		res[ extName ] = _this.parseExtension(extName);
		return res;
	}, {});
};



YoExtensions.prototype.dependencies = function() {
	// loop through the extensions and return dependencies.
	var extensionsData = this.parseExtensions();

	return _.reduce(extensionsData, function(res, extData, extName) {
		res[ extData.dependency ] = extData.version;
		return res;
	}, {});
};
/**
Reads | Sets dependencies on the yoextensions file.

@method dependencies
*/

YoExtensions.prototype.extensions = function(extensions) {

	if (arguments.length === 0) {
		// getter

		var extensionsData = this.parseExtensions();

		return _.reduce(extensionsData, function(res, extData, extName) {

			_.each(extData.subgenerators, function(subgenerator) {
				res[ extData.generator +':'+ subgenerator] = extData.version;
			});

			return res;

		}, {});

	} else {
		// setter
		this.extend('extensions', extensions);

		return this;
	}
};
/**
Parses out the extension names in the format #generator:#subgenerator

@method extensions
*/






YoExtensions.prototype.extend = function(prop, data) {
	if (_.isObject(prop)) {
		_.each(prop, function(value, key) {
			this.file.set(key, value);
		}.bind(this));
	} else {
		var d = _.extend(this.file.get(prop), data);
		this.file.set(prop, d);
	}

	return this;
};
/**
Extends a property and sets it.

@method extend
@param prop {String|Object}
	If prop is a String, extend a property and set it.
	If prop is an Object, set all values of the object on this object, as a default extend
@param data {Object}
*/



// facade to some methods of file
YoExtensions.prototype.set = function() {
	var args = Array.prototype.slice.call(arguments, 0);

	return this.file.set.apply(this.file, args);
};

YoExtensions.prototype.get = function() {
	var args = Array.prototype.slice.call(arguments, 0);

	return this.file.get.apply(this.file, args);
};

YoExtensions.prototype.writeSync = function() {
	var args = Array.prototype.slice.call(arguments, 0);
	this.file.writeSync.apply(this.file, args);
	return this;
};
