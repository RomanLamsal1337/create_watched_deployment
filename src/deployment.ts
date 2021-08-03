import {getInputs} from "./getInputs"
import {octokitClient} from "./octokitClient"
import {DeploymentId, saveDeploymentId} from "./deploymentId"
import {context} from "@actions/github"

export const createDeployment = async (): Promise<DeploymentId> => {
    const inputs = getInputs()
    const deployment = await octokitClient.rest.repos.createDeployment({
        ...context.repo,
        environment: inputs.environment,
        ref: inputs.ref || context.ref,
        auto_merge: false,
        required_contexts: inputs.requiredContexts,
    })

    if (deployment.status !== 201) {
        throw new Error("Could not create deployment: " + deployment.data.message)
    }

    saveDeploymentId(deployment.data.id)
    return deployment.data.id
}

export const setDeploymentState = async (deploymentId: DeploymentId, state: "failure" | "success" | "in_progress") => {
    const inputs = getInputs()

    const mediaTypePreviews: { [key in typeof state]: string[] } = {
        success: ["ant-man"],
        failure: ["ant-man"],
        in_progress: ["flash", "ant-man"]
    }

    await octokitClient.rest.repos.createDeploymentStatus({
        ...context.repo,
        state,
        deployment_id: deploymentId,
        environment_url: inputs.environmentUrl,
        log_url: `https://github.com/${ context.repo.repo }/actions/runs/${ context.runId }`,
        mediaType: {
            previews: mediaTypePreviews[state]
        },
        // @ts-ignore poor typing on github's side allows only '"production" | "staging" | "qa" | undefined' here. Booh.
        environment: inputs.environment,
    })
}
