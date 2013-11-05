ExtendableGenerator should scaffold a generator skeleton, just like generator-generator.

To do so we use the following method:

[1] create an "extend" subgenerator by running "yo generator:subgenerator extend" [2] run "yo extendable:extend generator-generator:app" to extend the core generator from generator-generator itself.
