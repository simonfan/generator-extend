'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

var ProxyGenerator = module.exports = function ProxyGenerator(args, options, config) {
	// By calling `NamedBase` here, we get the argument to the subgenerator call
	// as `this.name`.
	yeoman.generators.NamedBase.apply(this, arguments);

    this.log.create('Creating a proxy generator for '+ this.name);
};

util.inherits(ProxyGenerator, yeoman.generators.NamedBase);

ProxyGenerator.prototype.files = function files() {

    // name = generator[:subgenerator]
    var name = this.name,
    	generator = name.split(':')[0],
        subgenerator = name.split(':')[1] || 'app';

    this.mkdir(subgenerator);
    this.template('_index.js', subgenerator + '/index.js', {
        generator: generator,
        subgenerator: subgenerator,
    });
};
