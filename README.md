# Extendable Generator - Manual

Maintainer: [Simon Fan](https://github.com/simonfan)

Based on [generator-generator](https://github.com/yeoman/generator-generator)


## Usage

Install `generator-extendable-generator`:

    npm install -g generator-extendable-generator

Make a new directory, and `cd` into it:

    mkdir my-new-generator && cd $_

Run:

    yo extendable-generator
    

## yoextensions.json

This file describes metadata on your generator's extensions and file locations.

#### `packageJsonTemplate`
Path to the package.json template file (the one that will be processed by lodash and copied to the generated project's root).
As of 0.1.0, the package.json template file has to be a valid JSON string.

Extendable-generator sets the package.json template's devDependencies property, so that all the extended generators are installed inside the scaffolded project's node_modules folder (local installation).

#### `extensions`
Object that describes all extensions required by the generator.

> **`Keys`** 

> Follow the `$generatorName[:$subgeneratorName]` format.

> If both `$generatorName` and `$subgeneratorName` (e.g., generator:app, backbone:model) are specified in the key string: the generator being extended will have a subgenerator named '$subgeneratorName' which does whatever the original subgenerator did.

> If only `$generatorName` is specified (e.g., backbone, angular): the subgenerators will be identified from the key's value (see below). 

> **`Values`**

> `Object`: describes the extension(s). Takes the following keys:
> `generator`: The name of the generator from which functionality will be inherited.
> `subgenerators`: 
>     {String} Single subgenerator names to be inherited.
>     {Array} Multiple subgenerator names to be inherited.
> `aliases`: object that maps generator and subgenerator names to their aliased names.
>
    {
        "generator": "generatorName",
        "subgenerators": ["subgeneratorName","anotherSubGeneratorName"],
        "version": "semverVersion",
        "aliases": {
            "generatorName": "generatorAliasName",
            "subgeneratorName": "subgenenratorAliasName",
            "anotherSubgeneratorName": "anotherSubgeneratorAliasName"
        }
    }
    
> `String`: semver, just as package.json dependencies property.



## Extending generators: via yoextensions.json

Edit the yoextensions.json at the root of your new generator and run

    yo extendable-generator:extend



## Extending generators: via CLI

At the root of your new generator, run

    yo extendable-generator:extend %generatorName:%subgeneratorName

## Example workflow



## Gotchas

#### Extending `app` subgenerator

Whenever the `app` subgenerator, the default `app` subgenerator's index.js file is overwritten by a proxy-generator that invokes the other generator.



## Under the hood

#### Proxy Generator


#### lib/yo-extensions.js
