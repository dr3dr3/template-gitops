#!/usr/bin/env node

import { getOctokit } from "@actions/github";
import { setOutput } from "@actions/core";

console.assert(process.env.GHA_TOKEN, "GHA_TOKEN not present");
console.assert(process.env.REPO_OWNER, "REPO_OWNER not present");
console.assert(process.env.REPO_NAME, "REPO_NAME not present");

const octokit = getOctokit(process.env.GHA_TOKEN);

main();

async function checkUsersRepos() {
    const { data:repoList } = await octokit.rest.repos.listForUser({
        username: process.env.REPO_OWNER,
        type: 'owner'
        });
    const repoListFiltered = repoList.filter( repoName => repoName.name === process.env.REPO_NAME );
    const repoExists = (repoListFiltered.length == 1 ) ? true : false
    console.log( repoListFiltered );
    return repoExists;
}

async function main() {
    const result = await checkUsersRepos();
    setOutput("result", result);
};