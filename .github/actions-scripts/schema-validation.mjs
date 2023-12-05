#!/usr/bin/env node

import { readFileSync } from 'fs';
import Ajv from 'ajv';
import * as yaml from 'js-yaml';
import { setOutput, setFailed } from "@actions/core";

const ajv = new Ajv()

main();

async function schemaValidate(inputYamlFile,schemaJsonFile) {

    const repositoriesSchema = { 
        type: "object",
        properties: {
            repositories: {
                type: "object",
                properties: {
                    solutions: {
                        type: "array",
                        maxItems: 3,
                        items: [{
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                repo: { type: "string" },
                                repoDescription: { type: "string" },
                                repoTemplate: { type: "string" },
                                route: { type: "string" },
                                githubPages: { type: "boolean" },
                                status: { type: "string" }
                            }
                        }],
                    },
                    pipeline: {
                        type: "array",
                        minItems: 2,
                        maxItems: 2,
                        items: [{
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                repo: { type: "string" },
                                repoDescription: { type: "string" },
                                repoTemplate: { type: "string" },
                                route: { type: "string" },
                                githubPages: { type: "boolean" },
                                status: { type: "string" }
                            }
                        }],
                    },
                    deployment: {
                        type: "array",
                        minItems: 2,
                        maxItems: 6,
                        items: [{
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                repo: { type: "string" },
                                repoDescription: { type: "string" },
                                repoTemplate: { type: "string" },
                                route: { type: "string" },
                                githubPages: { type: "boolean" },
                                status: { type: "string" }
                            }
                        }]
                    }
                }
            }
        }
    };
    
    try {
        const readUtf8 = (file) => readFileSync(file, 'utf8');
        const inputJson = yaml.load(readUtf8(inputYamlFile));
        const isValid = ajv.validate(repositoriesSchema, inputJson);
        console.log([isValid, ajv.errors]);
        return isValid;
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
        return false;
    };    
};

async function main() {
    const result = schemaValidate('./repo/repositories.yml');
    setOutput("result", result);
};

/*
Test locally:
node .github/actions-scripts/schema-validation.mjs
*/