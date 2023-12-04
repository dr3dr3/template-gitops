#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function updateRepo() {

    const { status:privateVulnerabilityReporting } = await octokit.rest.repos.enablePrivateVulnerabilityReporting({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
    });
    console.log( 'privateVulnerabilityReporting status: ' + privateVulnerabilityReporting );

    const { status:repoUpdates } = await octokit.rest.repos.update({
        owner: process.env.REPO_OWNER,
        repo: process.env.REPO_NAME,
        security_and_analysis: { 
            "security_and_analysis": {
                "advanced_security": { "status": "enabled" } ,
                "secret_scanning": { "status": "enabled" } ,
                "secret_scanning_push_protection": { "status": "enabled" } 
            }},
        has_issues: true,
        has_project: true,
        has_wiki: false,
        allow_squash_merge: true,
        allow_merge_commit: true,
        allow_rebase_merge: false,
        delete_branch_on_merge: true,
        squash_merge_commit_title: "PR_TITLE",
        squash_merge_commit_message: "PR_BODY",
    });
    console.log( 'repoUpdates status: ' + repoUpdates );

    return true;
}

async function main() {
    const result = await updateRepo();
    setOutput("result", result);
};

/*
Test locally:
GHA_TOKEN=<token> REPO_OWNER=dr3dr3 REPO_NAME=temp-slidev node .github/actions-scripts/repo-update.mjs
*/