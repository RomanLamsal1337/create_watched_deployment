import * as core from "@actions/core"
import * as github from "@actions/github"

const token = core.getInput("token")

if (!token)
    core.setFailed("No Github Token provided.")

export const octokitClient = github.getOctokit(token)
