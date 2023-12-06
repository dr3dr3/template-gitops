#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput, setFailed } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");
console.assert(process.env.LABEL_NAME, "LABEL_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function getLabel() {

    try {
        const { status:getLabel } = await octokit.rest.issues.getLabel({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            name: process.env.LABEL_NAME,
        });
        console.log( 'getLabel status: ' + getLabel );
    } catch (err) {
        setFailed(err.message);
        console.error("Error!!! " + err);
    };

    return true;
}

async function main() {
    const result = await getLabel();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-branch-protection.mjs
*/
