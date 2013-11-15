Yo Extend
=========

Maintainer: [Simon Fan](https://github.com/simonfan)

## Documentation conventions

For simplicity's sake it is important to have a set of 
conventions in this man page. 

__generator__ refers to the generator-package at which the 
`yo extend` method was invoked.

__parent-generator__ refers to a generator-package from 
which __generator__ inherits subgenerators.

__generated-project__ refers to the project that should be 
scaffolded by __generator__.


## Usage

Install `generator-extend`:

	npm install -g generator-extend

Make a new directory, and `cd` into it:

	mkdir my-new-generator && cd $_

Start your generator:

	yo generator

Run any of the following:

	yo extend
	yo extend %someGenerator
	yo extend %someGenerator:%someSubGenerator
	yo extend %someGenerator:%someSubGenerator,%someOtherSubGenerator,%andYetAnother

## Prompts

#### `generator`

The __parent-generator__.

#### `subgenerators`

The subgenerators that the __generator__ should inherit from the __parent-generator__.

#### `package`

The npm package name for the __parent-generator__.
The key in package.json `dependencies` and `devDependencies` hashes.

#### `version_or_source`

The version or the source of the __parent-generator__
The value in package.json `dependencies` and `devDependencies` hashes.



## Under the hood

#### Proxy Generators

The concept of _proxy generators_ is at the core of generator inheritance.
_Proxy generators_ simulate the file structure that Yo recognizes as that 
of subgenerators.

First lets have a look at how Yo recognizes generators and their subgenerators:

	generator-<%= generatorName %>/		// root
		app/								// app-subgenerator (main) (generator:app | generator)
			index.js						// runs app-generation logic
			...
		<%= subgeneratorName %>/			// subgenerator-subgenerator (generator:subgenerator)
			index.js						// runs subgenerator-generation logic
			...

Any dir with `index.js` in the generator's package root is considered a subgenerator.


Extension and inheritance allow for code reuse by centralizing logic in specific modules.
This behaviour is extremely desirable in the Yo Generators environment, 
as projects have multiple features in common, especially in the subgenerator area.

	generator-express/
		app/
			index.js			// scaffolds what express(1).
			templates/

	generator-express-base/
		app/
			index.js			// express-base:app proxy -> invokes 'express:app'
		route/					// express-base:route
			index.js
			templates/


	generator-express-rest/
		app/
			index.js			// proxy -> invokes 'express:app'
		endpoint/
			index.js			// express-rest:endpoint proxy -> express-base:route 
								// + endpoint specific tasks
			templates/
				_endpoint.js

	generator-express-markdown-server/
		app/
			index.js			// proxy -> invokes 'express:app'
		markdown-server/
			index.js			// invokes express-base:route
								// + markdown-server specific tasks

#### Dependency transfers

For _proxy generators_ to be functional, they have to be accessible within the
__generated-project__.
