/**
 * This is a proxy-subgenerator.
 *
 * It's primary purpose is to invoke
 * '<%= generator %>:<%= subgenerator %>'.
 *
 * For this subgenerator to work appropriately, you must either
 * [1] have '<%= generator %>' installed globally
 * 					OR
 * [2] have '<%= generator %>' installed as a local devDependency of the GENERATED PROJECT.
 */
'use strict';
var util = require('util'),
	yeoman = require('yeoman-generator'),

	path = require('path'),
	fs = require('fs');

var Extension<%= _.classify(generator) + _.classify(subgenerator) %> = module.exports = function(args, options, config) {

	yeoman.generators.Base.apply(this, arguments);

	// save arguments.
	this.invocationArguments = Array.prototype.slice.call(arguments, 0);
};

util.inherits(Extension<%= _.classify(generator) + _.classify(subgenerator) %>, yeoman.generators.Base);


Extension<%= _.classify(generator) + _.classify(subgenerator) %>.prototype.proxy = function proxy() {
	var cb = this.async();

	this.invoke(
		'<%= generator %>:<%= subgenerator %>',
		{ args: this.invocationArguments },
		cb
	);
};
/**
@method proxy
Invokes '<%= generator %>:<%= subgenerator %>'.
*/

<% if (subgenerator === 'app') { %>
Extension<%= _.classify(generator) + _.classify(subgenerator) %>.prototype.addExtensionDependencies = function addExtensionDependencies() {
	// read extension-dependencies.json
	var extDepsPath = path.join(this.sourceRoot(), 'extension-dependencies.json'),
		extDeps = JSON.parse(this.readFileAsString(extDepsPath));



	// read package.json of generated-project
	var packageJsonPath = path.join(this.destinationRoot(), 'package.json'),
		packageJson = JSON.parse(this.readFileAsString(packageJsonPath));

	packageJson.devDependencies = this._.extend({}, packageJson.devDependencies, extDeps);

	// overwrite generated-project's package.json
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, '\t'));
}
/**
@method addExtensionDependencies
Reads the dependencies saved at the GENERATOR's app/extension-dependencies.json
and adds them to the package.json 'devDependencies' of the GENERATED project.

This is essential because it guarantees that once the project has been generated,
all of the GENERATOR 'proxy-subgenerators' are fully functional without any further requirements.
*/
<% } %>
