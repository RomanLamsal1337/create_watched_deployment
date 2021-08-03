import {getState, saveState } from "@actions/core"

export type DeploymentId = number

export const DEPLOYMENT_ID_KEY = "deploymentId"

export const saveDeploymentId = (deploymentId: DeploymentId) => saveState(DEPLOYMENT_ID_KEY, deploymentId.toString())

/** Only filled in post action. */
export const getDeploymentId = (): DeploymentId => Number.parseInt(getState(DEPLOYMENT_ID_KEY))
