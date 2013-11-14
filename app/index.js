'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),

	path = require('path'),
	fs = require('fs'),

	Q = require('q'),
	jsonf = require('json-file');


var ExtensionGenerator = module.exports = function(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);


	var input = args[0] || '';

	// args[0] = $generator[:$subgenerator[|$subgenerator]]
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
		message: 'NPM package [npm install ...]',
		default: function(answers) {
			return 'generator-' + answers.generator
		}
	});
	/**
	The package to be installed by npm.
	*/

	prompts.push({
		name: 'version',
		message: 'Package version [semver]',
		default: '*'
	});

	prompts.push({
		name: 'setPackageJsonTemplate',
		message: 'Would you like me to add the package to the devDependencies of the package.json template file of your generator?',
		type: 'confirm',
	});

	prompts.push({
		name: 'packageJsonTemplatePath',
		message: 'Deal! What is the path to your package.json template file?',
		default: 'app/templates/_package.json',
		when: function(answers) {
			return answers.setPackageJsonTemplate;
		},
		validate: function(file) {
			var done = this.async(),
				p = path.join(dest, file);

			fs.readFile(p, function(err, content) {

				var r = err ? 'I found an error reading the file at ' +
						p +'. Are you sure the path is right?' : true;

				done(r);
			});
		}
	});


	this.prompt(prompts, function(answers) {

		this._.extend(this, answers);

		cb();
	}.bind(this))
};

ExtensionGenerator.prototype.updatePackageJsonTemplate = function updatePackageJsonTemplate() {
	if (this.setPackageJsonTemplate) {

		this.log.info('Rewriting ' + this.packageJsonTemplatePath + ' in order to add ' + this.package + ' as a devDependency.');

		var p = path.join(this.destinationRoot(), this.packageJsonTemplatePath),
			file = jsonf.read(p),

			devDeps = this._.extend({}, file.get('devDependencies'));

		// the package for this extension
		devDeps[ this.package ] = this.version;

		file.set('devDependencies', devDeps)
			.writeSync(null, '\t');
	}
};
/**
Checks if user requested us to update the package.json template file.
If so, add the package to the devDependencies of the package.json template file,
so that the final generated project has the original generator as a development dependency.
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
		this.log.create('GREAT!');

		cb();
	}.bind(this))
};
/**
Invokes 'extend:proxy' subgenerator in order to create the directory structure that
will emulate the extended subgenerators.

Does stuff asynchronously so that user can confirm or deny file overwrites.
*/
