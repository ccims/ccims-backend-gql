import { getSdk, Sdk } from "./generated";
import { GraphQLClient } from "graphql-request";


function getSdkWrapper(sdk: Sdk) {
    return {
        ...sdk
    }    
}

export type GitHubApi = ReturnType<typeof getSdkWrapper>;

/**
 * Gets the GitHub api
 * @param token 
 * @returns 
 */
export function getGitHubApi(token: string): GitHubApi {
    const client = new GraphQLClient("https://api.github.com/graphql", {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.bane-preview+json"
        }
    });
    return getSdkWrapper(getSdk(client));
}