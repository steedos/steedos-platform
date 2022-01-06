const { Octokit } = require("@octokit/core");

const auth = process.env.GITHUB_TOKEN;
const tagName = `v${process.env.CURRENT_VERSION}`;
const owner = 'steedos';
const repo = 'steedos-project-template';
const target_commitish = null;

const octokit = new Octokit({ auth: auth });

octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner: owner,
    repo: repo,
    tag_name: tagName,
    // target_commitish: target_commitish //Default: the repository's default branch (usually master).
}).then(() => {
    console.info(`success: [${target_commitish}]create ${owner}/${repo} release ${tagName}`)
}).catch((error) => {
    console.error(`fail: [${target_commitish}]create ${owner}/${repo} release ${tagName}`, error)
})