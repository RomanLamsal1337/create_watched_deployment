import * as core from "@actions/core"

export type Inputs = {
    environment: string
    environmentUrl?: string
    ref?: string
    requiredContexts?: string[]
}

export const getInputs = (): Inputs => {
    const requiredContextsInput: string = core.getInput("required_contexts")
    return ({
        environment: core.getInput("environment"),
        environmentUrl: core.getInput("environment_url") || undefined,
        ref: core.getInput("ref") || undefined,
        requiredContexts: requiredContextsInput ? JSON.parse(requiredContextsInput) : undefined
    })
}
