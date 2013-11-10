/**
 * This is a proxy-subgenerator.
 *
 * It's primary purpose is to invoke
 * <%= generator %>'s subgenerator <%= subgenerator %>.
 *
 * The generator-<%= generator %> was added to the *packageJSONTemplate*
 * file specified in your yoextensions.json.
 *
 * If you wish to alter the version of the generator please do so in
 * the yoextensions.json and then run yo extendable-generator:extend
 * in the directory of your generator.
 */
'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),

    chalk = require('chalk');

var Extension<%= _.classify(generator) + _.classify(subgenerator) %> = module.exports = function(args, options, config) {

	yeoman.generators.Base.apply(this, arguments);

	this.invoke('<%= generator %>:<%= subgenerator %>', {
		args: Array.prototype.slice.call(arguments, 0),
	});

	<% if (subgenerator === 'app') { %>

    //////////////////////////////////////////////////
	// You have overridden the app generator,       //
    // thus the devDependencies in the package.json //
    // might not be correct. You should install all //
    // the generator dependencies manually.         //
    //////////////////////////////////////////////////

	<% } %>

};

util.inherits(Extension<%= _.classify(generator) + _.classify(subgenerator) %>, yeoman.generators.Base);
