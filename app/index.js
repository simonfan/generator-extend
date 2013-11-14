'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),

	path = require('path'),
	fs = require('fs'),

	Q = require('q'),
	jsonf = require('json-file');


var ExtensionGenerator = module.exports = function(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);


	// args[0] = input = [$generator[:$subgenerator[|$subgenerator]]]
	var input = args[0] || '';

	this.generator = input.split(':')[0];

	var sub = input.split(':')[1] || 'app';
	this.subgenerators = sub.split(',');
};

util.inherits(ExtensionGenerator, yeoman.generators.Base);


ExtensionGenerator.prototype.askFor = function askFor() {
	var cb = this.async();


	var prompts = [],
		src = this.sourceRoot(),
		dest = this.destinationRoot();


	prompts.push({
		name: 'generator',
		message: 'Generator name [without "generator-" prefix]',
		default: this.generator,

		when: function(answers) {
			return !this.name;
		}.bind(this),

		validate: function(input) {
			return input == '' ? 'Generator name is required.' : true;
		}
	});
	/**
	The generator namespace.
	Same as one would call in command 'yo $generator'.
	*/

	prompts.push({
		name: 'subgenerators',
		message: 'Which subgenerators would you like to extend?',
		default: this.subgenerators.join(' '),
		validate: function(input) {
			return input == '' ? 'At least one subgenerator is required.' : true;
		},
		filter: function(input) {
			return input.split(/ +/);
		},
	});
	/**
	Subgenerators to inherit, separated by spaces.
	*/

	prompts.push({
		name: 'package',
		message: 'Souce npm package',
		default: function(answers) {
			return 'generator-' + answers.generator
		}
	});
	/**
	The package to be installed by npm.
	*/

	prompts.push({
		name: 'version_or_source',
		message: 'Package version or Package source',
		default: '*'
	});
	/**
	Semver version or source for the package.
	*/

	this.prompt(prompts, function(answers) {

		this._.extend(this, answers);

		cb();
	}.bind(this))
};


ExtensionGenerator.prototype.writeExtensionDependenciesJson = function writeExtensionDependenciesJson() {

	var cb = this.async(),
		// check if app/extension-dependencies.json already exists
		p = path.join(this.destinationRoot(), 'app/extension-dependencies.json');

	fs.readFile(p, function(err, contents) {

		if (err) {
			// create the file
			this.write(p, JSON.stringify({}));
		}

		cb();

	}.bind(this));
};
/**
Check if app/extensions-dependencies.json file exists. If it doesn't, create one.
*/

ExtensionGenerator.prototype.updateExtensionsDependenciesJson = function updateExtensionsDependenciesJson() {

	this.log.info('Updating extension dependencies (app/extension-dependencies.json)');

	var p = path.join(this.destinationRoot(), 'app/extension-dependencies.json'),
		file = jsonf.read(p);

	file.set(this.package, this.version_or_source)
		.writeSync(null, '\t');
};
/**
Update the app/extensions-dependencies.json file.
*/

ExtensionGenerator.prototype.proxyGenerators = function proxyGenerators() {
	this.log.info('Proxying generators...');

	var cb = this.async(),
		queue = this.subgenerators.reduce(function(last, sub) {

			var proxy = this.generator + ':' + sub;

			return last.then(function() {

				console.log(proxy)

				var defer = Q.defer(),
					i = this.invoke('extend:proxy', { args: [ proxy ] }, defer.resolve);
				return defer.promise;
			}.bind(this));

		}.bind(this), Q.resolve(true));


	queue.then(function() {
		this.log.ok('I am done!');

		cb();
	}.bind(this))
};
/**
Invokes 'extend:proxy' subgenerator in order to create the directory structure that
will emulate the extended subgenerators.

Does stuff asynchronously so that the user can confirm or deny file overwrites.
*/
