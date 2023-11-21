#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.VAR_NAME, "VAR_NAME not present");
console.assert(process.env.VAR_VAL, "VAR_VAL not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function createRepoVariable() {
    const { status:varCreated } = await octokit.rest.actions.createRepoVariable({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        name: process.env.VAR_NAME,
        value: process.env.VAR_VAL,
    });
    console.log( 'createRepoVarible status: ' + varCreated );
    return true;
};

async function updateRepoVariable() {
    const { status:varCreated } = await octokit.rest.actions.updateRepoVariable({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        name: process.env.VAR_NAME,
        value: process.env.VAR_VAL,
    });
    console.log( 'createRepoVarible status: ' + varCreated );
    return true;
};

async function checkRepoVariable() {
    const { data:varList } = await octokit.rest.actions.listRepoVariables({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
    });
    const varListFiltered = varList.variables.filter( varName => varName.name === process.env.VAR_NAME );
    const varExists = (varListFiltered.length == 1 ) ? true : false    
    return varExists;
};

async function main() {
    const check = await checkRepoVariable()
    const result = check ? await updateRepoVariable() : await createRepoVariable();
    setOutput("result", result);
};
