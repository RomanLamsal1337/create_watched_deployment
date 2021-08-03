import * as core from "@actions/core"
import * as github from "@actions/github"

if (!process.env.GITHUB_TOKEN)
    core.setFailed("No Github Token in environment.")

export const octokitClient = github.getOctokit(process.env.GITHUB_TOKEN!)
