import * as core from "@actions/core"
import {createDeployment, setDeploymentState} from "./deployment"

async function main() {
    const deploymentId = await createDeployment()
    await setDeploymentState(deploymentId, "in_progress")

    return deploymentId
}

main()
    .then(deploymentId => core.info(`Created deployment with id '${deploymentId}'.`))
    .catch(e => core.setFailed(e))
