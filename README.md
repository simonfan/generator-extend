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

    generator-generator/
        app/
            index.js
            templates/
            ...
        subgenerator/
            index.js
            templates/
            ...

#### Dependency transfers

