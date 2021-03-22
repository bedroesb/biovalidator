# JSON Schema Validator service
[![Build Status](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator.svg?branch=master)](https://travis-ci.org/EMBL-EBI-SUBS/json-schema-validator) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/7fbabc981e294249a9a0967965418058)](https://www.codacy.com/app/fpenim/json-schema-validator?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=EMBL-EBI-SUBS/json-schema-validator&amp;utm_campaign=Badge_Grade)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

This repository contains a deployable and/or executable [JSON Schema](http://json-schema.org/) validator service. This validator can runs as a standalone node server or just a command line application that receives validation requests and gives back it's results.

The validation is done using the [AJV](https://github.com/epoberezkin/ajv) library version ^7.0.0 that supports the JSON Schema draft-06/07/2019-09.

## Contents
- [Getting Started](README.md#getting-started)

- [Prerequisites](README.md#prerequisites)

- [Installing](README.md#installing)

- [Running the Tests](README.md#running-the-tests)

- [Executing](README.md#executing)

- [Executing the validator by a command line](README.md#executing-with-the-provided-cli-script)

- [Development](README.md#development)

- [Validation API](README.md#validation-api)

- [Usage](README.md#usage)

- [API Errors](README.md#api-errors)

- [Custom keywords](README.md#custom-keywords)

- [License](README.md#license)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
To be able to run this project you'll need to have [Node.js](https://nodejs.org/en/about/) and [npm](https://www.npmjs.com/) installed in your machine.
npm is distributed with Node.js which means that when you download Node.js, you automatically get npm installed on your computer.

### Installing

#### Node.js / npm
- Get Node.js: https://nodejs.org/en/ (v8.11.1 LTS)

- If you use [Homebrew](https://brew.sh/) you can install node by doing:
```
brew install node
```

After installation check that everything is correctly installed and which versions you are running:
```
node -v
npm -v
```

#### Project
Clone project and install dependencies:
```
git clone https://github.com/elixir-europe/bio-validator.git
cd bio-validator
npm install
```

### Running the Tests
```
npm test
```

### Executing
```
node src/server
```
The node server will run on port **3020** and will expose one endpoint: **/validate**.

#### Startup arguments

- logPath

If provided with a log path argument, the application will write the logs to a file on the specified directory with a 24h rotation. To provide the log path add a `logPath` property after the startup statement:
```
node src/server --logPath=/log/directory/path
```

- pidPath

If provided with a pid file path argument, the application will write the pid into the specified file. If no pid file argument is provided, the application will still create a pid file on the default path: `./server.pid`.
To provide the pid file path add a `pidPath` property after the startup statement:
```
node src/server --pidPath=/pid/file/path/server.pid
```
Note: This is the **file path** and not just the directory it will be written to.

### Executing with the provided CLI script

There is a `validator-cli.js` script is provided in the repository's root folder for the user if they would like to execute the validation from the command line without setting up a running server.

Just simply type `node ./validator-cli.js --help` to get the usage of this script:

```js
node ./validator-cli.js --help

Bio-validator CLI (Command Line Interface)
usage: node ./validator-cli.js [--schema=path/to/schema] [--json=path/to/json]

Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -s, --schema   path to the schema file                              [required]
  -j, --json     path to the json file to validate                    [required]

Examples:
  node ./validator-cli.js                   Validates 'valid.json' with
  --json=valid.json                         'test_schema.json'.
  --schema=test_schema.json


```



### Development
For development purposes using [nodemon](https://nodemon.io/) is useful. It reloads the application everytime something has changed on save time.
```
nodemon src/server
```

## Validation API
This validator exposes one single endpoint that will accept POST requests. When running on you local machine it will look like: **http://localhost:3020/validate**.

### Usage
The endpoint will expect the body to have the following structure:
```js
{
  "schema": {},
  "object": {}
}
```
Where the schema should be a valid json schema to validate the object against.
You also have to add this value to the header of the request:

```
Content-Type: application/json
```

**Example:**
Sending a POST request with the following body:
```js
{
  "schema": {
    "$schema": "http://json-schema.org/draft-07/schema#",
    
    "type": "object",
    "properties": {
      "alias": {
        "description": "A sample unique identifier in a submission.",
        "type": "string"
      },
      "taxonId": {
        "description": "The taxonomy id for the sample species.",
        "type": "integer"
      },
      "taxon": {
        "description": "The taxonomy name for the sample species.",
        "type": "string"
      },
      "releaseDate": {
        "description": "Date from which this sample is released publicly.",
        "type": "string",
        "format": "date"
      }
    },  
    "required": ["alias", "taxonId" ]
  },
  "object": {
    "alias": "MA456",
    "taxonId": 9606
  }
}
```
will produce a response like:

HTTP status code `200`
```json
[]
```
An example of a validation response with errors:

HTTP status code `200`
```json
[
  {
    "errors": [
        "should have required property 'value'"
    ],
    "dataPath": ".attributes['age'][0].value"
  },
  {
    "errors": [
        "should NOT be shorter than 1 characters",
        "should match format \"uri\""
    ],
    "dataPath": ".attributes['breed'][0].terms[0].url"
  }
]
```
Where *errors* is an array of error messages for a given input identified by its path on *dataPath*. There may be one or more error objects within the response array. An empty array represents a valid validation result.

### API Errors
Sending malformed JSON or a body with either the schema or the submittable missing will result in an API error (the request will not reach the validation). API errors have the following structure:

HTTP status code `400`
```json
{
  "error": "Malformed JSON please check your request body."
}
```
## Custom keywords
The AJV library supports the implementation of custom json schema keywords to address validation scenarios that go beyond what json schema can handle.

Currently, in this repository four custom keywords are implemented: `graph_restriction`, `isChildTermOf`, `isValidTerm` and `isValidTaxonomy`.

If the user would like to add a new custom keywords then they have to add it to the validator when it is being instantiated:

```js
// get all the custom extensions
const { newCustomKeyword, isChildTermOf, isValidTerm, isValidTaxonomy } = require("./keywords");

const validator = new BioValidator([
    new CustomKeyword(param1, param2),
    new isChildTermOf(null, "https://www.ebi.ac.uk/ols/api/search?q="),
    new isValidTerm(null, "https://www.ebi.ac.uk/ols/api/search?q="),
    new isValidTaxonomy(null)
]);

// only use the new custom keyword
let validator = new BioValidator([CustomKeyword])
```

### graph_restriction


This custom keyword *evaluates if an ontology term is child of another*. This keyword is applied to a string (CURIE) and **passes validation if the term is a child of the term defined in the schema**.
The keyword requires one or more **parent terms** *(classes)* and **ontology ids** *(ontologies)*, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to know if a given term is child of another.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.


#### Usage
Schema:
```js
{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://schema.dev.data.humancellatlas.org/module/ontology/5.3.0/organ_ontology",
    "$async": true,
    "properties": {
        "ontology": {
            "description": "A term from the ontology [UBERON](https://www.ebi.ac.uk/ols/ontologies/uberon) for an organ or a cellular bodily fluid such as blood or lymph.",
            "type": "string",
            "graph_restriction":  {
                "ontologies" : ["obo:hcao", "obo:uberon"],
                "classes": ["UBERON:0000062","UBERON:0000179"],
                "relations": ["rdfs:subClassOf"],
                "direct": false,
                "include_self": false
            }
        }
    }
}
```
JSON object:
```js
{
    "ontology": "UBERON:0000955"
}
```


### isChildTermOf
This custom keyword also *evaluates if an ontology term is child of another* and is a simplified version of the graph_restriction keyword. This keyword is applied to a string (url) and **passes validation if the term is a child of the term defined in the schema**.
The keyword requires the **parent term** and the **ontology id**, both of which should exist in [OLS - Ontology Lookup Service](https://www.ebi.ac.uk/ols).

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to know if a given term is child of another.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

#### Usage
Schema:
```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,
  "properties": {
    "term": {
      "type": "string",
      "format": "uri",
      "isChildTermOf": {
        "parentTerm": "http://purl.obolibrary.org/obo/PATO_0000047",
        "ontologyId": "pato"
      }
    }
  }
}
```
JSON object:
```js
{
  "term": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```

### isValidTerm
This custom keyword *evaluates if a given ontology term url exists in OLS* ([Ontology Lookup Service](https://www.ebi.ac.uk/ols)). It is applied to a string (url) and **passes validation if the term exists in OLS**. It can be aplied to any string defined in the schema.

This keyword works by doing an asynchronous call to the [OLS API](https://www.ebi.ac.uk/ols/api/) that will respond with the required information to determine if the term exists in OLS or not.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

#### Usage
Schema:
```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$async": true,

  "properties": {
    "url": {
      "type": "string",
      "format": "uri",
      "isValidTerm": true
    }
  }
}
```
JSON object:
```js
{
  "url": "http://purl.obolibrary.org/obo/PATO_0000383"
}
```

### isValidTaxonomy

This custom keyword evaluates if a given *taxonomy* exists in ENA's Taxonomy Browser. It is applied to a string (url) and **passes validation if the taxonomy exists in ENA**. It can be aplied to any string defined in the schema.

This keyword works by doing an asynchronous call to the [ENA API](https://www.ebi.ac.uk/ena/taxonomy/rest/any-name/<REPLACE_ME_WITH_AXONOMY_TERM>) that will respond with the required information to determine if the term exists or not.
Being an async validation step, whenever used in a schema, the schema must have the flag: `"$async": true` in its object root.

#### Usage
Schema:
```js
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Is valid taxonomy expression.",
  "$async": true,
  
  "properties": {
    "value": { 
      "type": "string", 
      "minLength": 1, 
      "isValidTaxonomy": true
    }
  }
}
```
JSON object:
```js
{
  "metagenomic source" : [ {
    "value" : "wastewater metagenome"
  } ]
}
```


## License
 For more details about licensing see the [LICENSE](LICENSE.md).
