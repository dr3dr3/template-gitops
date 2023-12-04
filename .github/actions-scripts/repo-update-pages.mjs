#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepoPages() {

    const { status:githubPages } = await octokit.rest.repos.getPages({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
    });
    console.log( 'getPages status: ' + githubPages );

    if (githubPages === 404) {
        const { status:githubPagesCreate } = await octokit.rest.repos.createPagesSite({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            build_type: "workflow",
            source: {
                "branch": "main",
                "path": "/",
            },
        });
        console.log( 'createPagesSite status: ' + githubPagesCreate );
    };

    if (githubPages === 200) {
        const { status:githubPagesCreate } = await octokit.rest.repos.updateInformationAboutPagesSite({
            owner: process.env.REPO_OWNER,
            repo: process.env.REPO_NAME,
            build_type: "workflow",
            source: {
                "branch": "main",
                "path": "/",
            },
        });
        console.log( 'updateInformationAboutPagesSite status: ' + githubPagesCreate );
    };

    return true;
}

async function main() {
    const result = await updateRepoPages();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update-pages.mjs
*/