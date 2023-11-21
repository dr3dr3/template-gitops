#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.REPO_TEMPLATE, "REPO_TEMPLATE not present");
console.assert(process.env.REPO_DESC, "REPO_DESC not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function createRepoUsingTemplate() {
    const { status:repoCreated } = await octokit.rest.repos.createUsingTemplate({
        template_owner: 'dr3dr3',
        template_repo: process.env.REPO_TEMPLATE,
        owner: process.env.REPO_OWNER,
        name: process.env.REPO_NAME,
        description: process.env.REPO_DESC
        });
    console.log( repoCreated );
    return repoCreated;
}

async function main() {
    const result = await createRepoUsingTemplate();
    setOutput("result", result);
};