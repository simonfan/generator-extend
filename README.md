# Yo Extend

Maintainer: [Simon Fan](https://github.com/simonfan)

## Documentation conventions

For simplicity's sake it is important to have a set of 
conventions in this man page. 

_GENERATOR_ refers to the generator-package at which the 
`yo extend` method was invoked.

_PARENT-GENERATOR_ refers to a generator-package from 
which _GENERATOR_ inherits subgenerators.

_GENERATED-PROJECT_ refers to the project that should be 
scaffolded by _GENERATOR_.


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

The _PARENT-GENERATOR_.

#### `subgenerators`

The subgenerators that the _GENERATOR_ should inherit from the _PARENT-GENERATOR_.

#### `package`
#### `version_or_source`

The npm package name for the _PARENT-GENERATOR_.
dependencies: {
    _PARENT-GENERATOR_: _version_or_package_source_
}


## Under the hood

### Proxy Generators

Generator inheritance is 

### Dependency transfers

