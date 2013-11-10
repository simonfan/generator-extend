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
	path = require('path'),

    jsonf = require('json-file'),

    YoExtensions = require('../lib/yo-extensions');



////////////////////////////////////
// constructor & argument parsing //

var ExtensionGenerator = module.exports = function(args, options, config) {
	yeoman.generators.Base.apply(this, arguments);


    if (args[0]) {
        // additions to the yoextensions.json file.
        this.extension = args[0];
        this.extensionVersion = args[1];

        this.log.info('You called the extend subgenerator with the argument ' + args + '.');
    } else {
        // no additions to the yoextensions.json file.
        // just reat whatever is therer
        this.log.info('You called the extend subgenerator without any arguments.')
    }
};

util.inherits(ExtensionGenerator, yeoman.generators.Base);

// constructor & argument parsing //
////////////////////////////////////

//////////////////////
// internal methods //
ExtensionGenerator.prototype._proxy = function(name) {

    this.log.create('Creating a proxy generator for '+ name);

    // name = generator[:subgenerator]
    var generator = name.split(':')[0],
        subgenerator = name.split(':')[1] || 'app';

    if (!generator) {
        throw new Error('ExtensionGenerator.prototype._proxy method must receive a generator argument.');
    }

    this.mkdir(subgenerator);
    this.template('_proxy-index.js', subgenerator + '/index.js', {
        generator: generator,
        subgenerator: subgenerator,
    });

    if (subgenerator === 'app') {

        var message =
            '\n You are now using <%= generator %> app subgenerator as your own' +
            '\n generator\'s app subgenerator.' +
            '\n The generators that your generator extends might ' +
            '\n not have been included in the devDependencies of the package.json ' +
            '\n as the default extendable-generator\'s app generator was not run. \n' +
            '\n To overcome possible issues, make sure you have the following ' +
            '\n packages either installed globally or locally in the generated project\s node_modules.';

        console.log(chalk.yellow(message));

    }
};
/**
Method creates a proxy subgenerator.
*/

// internal methods //
//////////////////////




//////////////////////
// generation steps //

ExtensionGenerator.prototype.readJSONdata = function() {
    this.log.info('Reading package.json ...');

    var src = this.sourceRoot(),
        dest = this.destinationRoot();

    // packageJSON
    this.packageJSON = jsonf.read(path.join(dest, 'package.json'));


    this.log.info('Reading yoextensions.json ...');

	// yoExtensionsJSON
	this.yoExtensionsJSON = new YoExtensions(path.join(dest, 'yoextensions.json'));


    this.log.info('Reading ' + this.yoExtensionsJSON.get('packageJSONTemplate') + ' ...');
	// packageJSONTemplate
	this.packageJSONTemplate = jsonf.read(path.join(dest, this.yoExtensionsJSON.get('packageJSONTemplate')) );
}
/**
1
Reads data from .json files that will be required further
in the generation process.
*/




ExtensionGenerator.prototype.updateYoExtensionsJSON = function() {
	// only change if there is an extension.
	if (this.extensionName) {
        // rewrite the file
        this.log.info('Updating yoextensions.json: adding '+ this.extensionName + ' ' + this.extensionVersion);

		this.yoExtensionsJSON
            .set('extensions.'+ this.extensionName, this.extensionVersion)
            .writeSync(null, '\t');
	}
};
/**
2
Update yoextensions.json according to arguments passed by user.
Here is where the user input is actually processed.

yoextensions.json example:
{
    "packageJSONTemplate": "app/templates/_package.json",
    "extensions": {
        "https://github.com/yeoman/generator-backbone.git": {
            "generator": "backbone",
            "version": "",
            "subgenerators": ["model","view","collection","router"]
        },

        "generator:subgenrator": "*",
        "bower-amd": "*"
    }
}

*/



ExtensionGenerator.prototype.updatePackageJSONTemplate = function() {
    this.log.info('Updating ' + this.yoExtensionsJSON.get('packageJSONTemplate') + ' ...');

    var deps = this._.extend(
        this.packageJSONTemplate.get('devDependencies'),
        this.yoExtensionsJSON.dependencies()
    );

	// extend devDependencies and rewrite file.
	this.packageJSONTemplate
        .set('devDependencies', deps)
        .writeSync(null, '\t');
};
/**
4
Update package.json template file according to required extensions.
*/

ExtensionGenerator.prototype.updatePackageJSON = function() {
    this.log.info('Updating package.json ...');

    var deps = this._.extend(
        this.packageJSON.get('devDependencies'),
        this.yoExtensionsJSON.dependencies()
    );

    this.packageJSON.set('dependencies', deps)
        .writeSync(null, '\t');
};
/**
5
Update package.json of the current generator
*/



ExtensionGenerator.prototype.proxyGenerators = function() {
	this.log.info('Proxying generators...');

	this._.each(Object.keys(this.yoExtensionsJSON.extensions()), this._proxy.bind(this));
};
/**
4
Creates proxy generators.
*/

// generation steps //
//////////////////////
