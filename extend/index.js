/*
ExtendableGenerator should scaffold a generator skeleton,
just like generator-generator.

To do so we use the following method:

[1] create an "extend" subgenerator by running "yo generator:subgenerator extend"
[2] run "yo extendable:extend generator-generator:app" FROM WITHIN generator-extendable
	project to extend the core generator
	from generator-generator itself.
*/
'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),

	fs = require('fs'),
	path = require('path');

var ExtensionGenerator = module.exports = function ExtensionGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

	console.log('You called the extend subgenerator with the argument ' + args + '.');
};


util.inherits(ExtensionGenerator, yeoman.generators.Base);






ExtensionGenerator.prototype._createInheritanceJSON = function() {
	this.template('_extensions.json','extensions.json');
};
/**
Helper method that creates the extensions.json
*/

ExtensionGenerator.prototype._updateInheritanceJSON = function() {
	console.log('Update extensions.json');


	var extensions = JSON.parse(this.readFileAsString('extensions.json'));
};
/**
Helper method that updates the extensions.json
called by .extensionsJSON
*/

// util.inherits(ExtensionGenerator, yeoman.generators.NamedBase);

ExtensionGenerator.prototype.extensionsJSON = function() {

	var cb = this.async(),

		// read
		extensionsJSONpath = path.join(this.destinationRoot(), 'extensions.json');

	fs.readFile(extensionsJSONpath, function(err, data) {

		if (err) {
			this._createInheritanceJSON();
		} else {
			this._updateInheritanceJSON();
		}


		cb();

	}.bind(this));

};
/**
Attempts to read the extensions.json from current directory.
If no extensions.json is available, creates a new one.
*/


/**
From here on, work is redone multiple times.

Methods should base their work on data at extensions.json.
*/

ExtensionGenerator.prototype.readInheritanceJSON = function() {
	this.extensions = JSON.parse( this.readFileAsString('extensions.json') );
}


ExtensionGenerator.prototype.installGenerators = function() {


	var cb = this.async(),
		generators = Object.keys(this.extensions.inherits);

	console.log('Installing generators: ' + generators);

};
/**
Installs the parent generator
*/


ExtensionGenerator.prototype._symlink = function() {

};
/**
Helper method that creates a symlink
*/


ExtensionGenerator.prototype.extensions = function() {

	var _ = this._;

	_.each(this.extensions.inherits, function(subgenerators, generator) {
		console.log('Generator: ' + generator);
		console.log('Sub: ' + subgenerators);
	});

};
/**
Parses the extensions required by the user and calls _symlink accordingly.
*/
