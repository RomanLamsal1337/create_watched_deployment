import * as core from "@actions/core"
import * as github from "@actions/github"
import {octokitClient} from "./octokitClient"
import {setDeploymentState} from "./deployment"
import {getDeploymentId} from "./deploymentId"
import {components} from "@octokit/openapi-types"

const isFailingStep = ({ conclusion }: { conclusion: string | null }) => conclusion === "failure" || conclusion === "cancelled"

const hasOnlyNonCompletedPosts = (steps?: (components["schemas"]["job"]["steps"])) => steps
    ?.filter(step => step.status !== "completed")
    .every(step => step.name.startsWith("Post"))

const pollJobUntilFinished = (): Promise<components["schemas"]["job"]> => new Promise((resolve, reject) => {
    let tries = 20

    const intervalId = setInterval(async () => {
        if (!tries) {
            clearInterval(intervalId)
            reject("Timeout after 20 tries.")
        }

        const workflow = await octokitClient.rest.actions.listJobsForWorkflowRun({
            ...github.context.repo,
            run_id: github.context.runId,
        })

        const job = workflow.data.jobs.find(job => job.name === github.context.job)
        core.debug("Step numbers: " + job?.steps?.map(step => step.number))

        if (job && hasOnlyNonCompletedPosts(job.steps)) {
            clearInterval(intervalId)
            resolve(job)
        }

        --tries
    }, 1000)
})

async function post() {
    const job = await pollJobUntilFinished()
    const failed = job.steps?.some(isFailingStep)

    await setDeploymentState(getDeploymentId(), failed ? "failure" : "success")
}

post()
    .then(() => core.info("Deployment status updated."))
    .catch(e => core.setFailed(e))
