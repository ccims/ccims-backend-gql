import { IMSSystemData, IMSSystem } from "../../../common/nodes/IMSSystem";
import { SyncAdapter } from "../SyncAdapter";
import { SyncManager } from "../../SyncManager";
import { CCIMSUser } from "../../../common/nodes/CCIMSUser";
import { IMSUser, ImsUserData } from "../../../common/nodes/IMSUser";
import { Component } from "../../../common/nodes/Component";
import { IMSComponent, IMSComponentData } from "../../../common/nodes/IMSComponent";
import { getGitHubApi, GitHubApi } from "./github";
import { GithubLoader } from "@graphql-tools/github-loader";
import { Repository } from "./generated";
import { Color } from "../../../common/Color";
import GraphQLLabel from "../../../api/resolvers/types/nodes/GraphQLLabel";
import { Label } from "../../../common/nodes/Label";
import { Issue } from "../../../common/nodes/Issue";

class GitHubSyncAdapter implements SyncAdapter {
    tag = "GITHUB";
    description =  "GitHub (or GitHub enterprise server) is the IMS for the component";

    public async canSync(imsComponent: IMSComponent): Promise<boolean> {
        const ims = await imsComponent.ims();
        if (ims != undefined) {
            const api = this.getApi(ims);
            return true;
        } else {
            return false;
        }
    }

    public async sync(syncManager: SyncManager): Promise<void> {
        try {
            const component = (await syncManager.component()).node;
            const imsComponent = await syncManager.imsComponent();
            const repositoryId = (imsComponent.imsData as GitHubIMSComponentData).id!;
            const ims = await imsComponent.ims();
            if (ims != undefined) {
                const api = this.getApi(ims);
                const repository = (await api.repositoryState({id: repositoryId})).node as Repository;
                const gitHubIssues = repository.issues?.nodes!;
                const gitHubLabels = repository.labels?.nodes!;

                const allLabels: Map<string, Label> = new Map();

                for (const gitHubLabel of gitHubLabels) {
                    const ccimsLabelId = await syncManager.getLookupTableValue(gitHubLabel!.id);
                    const gitHubUpatedAt = Date.parse(gitHubLabel?.updatedAt);
                    if (gitHubLabel != undefined) {
                        if (ccimsLabelId != undefined) {
                            console.log("update label");
                            const ccimsLabel = await component.labelsProperty.getElement(ccimsLabelId);
                            if (ccimsLabel != undefined) {
                                allLabels.set(gitHubLabel.id, ccimsLabel)
                                if (ccimsLabel.lastUpdatedAt.getTime() < gitHubUpatedAt) {
                                    console.log("update really");
                                    ccimsLabel.setDescription(gitHubLabel.description ?? "", new Date(gitHubUpatedAt));
                                    ccimsLabel.setName(gitHubLabel.name, new Date(gitHubUpatedAt));
                                    ccimsLabel.setColor(new Color("#" + gitHubLabel.color), new Date(gitHubUpatedAt))
                                } else {
                                    if (ccimsLabel.name != gitHubLabel.name 
                                        || ccimsLabel.description != gitHubLabel.description 
                                        || ccimsLabel.color.toString() != new Color("#" + gitHubLabel.color).toString()) {
                                        console.log("update locally");
                                        await api.updateLabel({
                                            id: gitHubLabel.id, 
                                            name: ccimsLabel.name, 
                                            description: ccimsLabel.description, 
                                            color: ccimsLabel.color.toString().substr(1)}
                                        );
                                    }
                                }
                            }
                        } else {
                            console.log("create new");
                            const label = await Label.create(syncManager.databaseManager, 
                                gitHubLabel.name, 
                                new Color("#" + gitHubLabel.color), 
                                undefined, 
                                new Date(gitHubUpatedAt), gitHubLabel.description ?? "", 
                                [component]);
                            label.metadata = {
                                id: gitHubLabel.id
                            }
                            syncManager.setLookupTableValue(gitHubLabel.id, label.id);
                            allLabels.set(gitHubLabel.id, label)
                        }
                    } else {
                        console.log("this is not allowed")
                    }
                }
                for (const label of await component.labelsProperty.getElements()) {
                    if (!label.isMetadataPresent) {
                        console.log("sync to github")
                        const gitHubId = (await api.createLabel({
                            repositoryId: repositoryId,
                            name: label.name,
                            description: label.description,
                            color: label.color.toString().substr(1)
                        })).createLabel?.label?.id!;
                        label.metadata = {
                            id: gitHubId
                        }
                        syncManager.setLookupTableValue(gitHubId, label.id);
                        allLabels.set(gitHubId, label)
                    }
                }

                for (const gitHubIssue of gitHubIssues) {
                    const ccimsIssueId = await syncManager.getLookupTableValue(gitHubIssue!.id);
                    const gitHubUpatedAt = Date.parse(gitHubIssue?.updatedAt);
                    if (gitHubIssue != undefined) {
                        if (ccimsIssueId != undefined) {
                            const ccimsIssue = await component.issuesProperty.getElement(ccimsIssueId);
                            if (ccimsIssue != undefined) {
                                if (ccimsIssue.lastUpdatedAt.getTime() < gitHubUpatedAt) {
    
                                }
                            }
                        } else {
                            console.log("!!!!!!!!!!!! create issue !!!!!!!!!!!!!!!")
                            const issue = await Issue.create(syncManager.databaseManager,
                                undefined, 
                                new Date(gitHubUpatedAt),
                                gitHubIssue.title,
                                gitHubIssue.body
                            );
                            await issue.addToComponent(component, new Date(gitHubUpatedAt), undefined);
                            await issue.addToLocation(component, new Date(gitHubUpatedAt), undefined);
                            for (const labelId of (gitHubIssue.labels?.nodes ?? []).map(label => label?.id!)) {
                                console.log("!!label id: " + labelId)
                                console.log(allLabels.get(labelId));
                                await issue.addLabel(allLabels.get(labelId)!, new Date(gitHubUpatedAt), undefined);
                            }
                            issue.metadata = {
                                id: gitHubIssue.id
                            };
                            syncManager.setLookupTableValue(gitHubIssue.id, issue.id);
                        }
                    }
                }

                console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
                for (const issue of await component.issuesProperty.getElements()) {
                    console.log("near the range of metadata")
                    console.log(issue.metadata)
                    if (!issue.isMetadataPresent) {
                        console.log("!!!!!!!!!!!! sync to github !!!!!!!!!!!!!!!")
                        const gitHubId = (await api.createIssue({
                            repositoryId: repositoryId,
                            title: issue.title,
                            body: issue.body,
                            labelIds: (await issue.labelsProperty.getElements()).map(label => (label.metadata as any)?.id).filter(id => id != undefined)
                        })).createIssue?.issue?.id!;
                        issue.metadata = {
                            id: gitHubId
                        };
                        syncManager.setLookupTableValue(gitHubId, issue.id);
                    } else {
                        console.log("Already on github")
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async createIMSSystemData(data: IMSSystemData): Promise<IMSSystemData> {
        if (!("token" in data)) {
            throw Error("token not provided");
        }
        return data;
    }

    public async linkUserToIMS(user: CCIMSUser, ims: IMSSystem, data: ImsUserData): Promise<IMSUser> {
        throw new Error("Method not implemented.");
    }

    public async linkComponentToIMS(component: Component, ims: IMSSystem, data: IMSComponentData): Promise<IMSComponent> {
        const api = this.getApi(ims);
        const gitHubData = data as GitHubIMSComponentData;
        const id = (await api.repositoryId({owner: gitHubData.owner, name: gitHubData.name})).repository?.id
        if (id == undefined) {
            throw Error("Could not get id");
        }
        gitHubData.id = id;
        return IMSComponent.create(component.databaseManager, component, ims, gitHubData);
    }

    private getApi(ims: IMSSystem): GitHubApi {
        const token = (ims.imsData as GitHubIMSSystemData).token;
        return getGitHubApi(token);
    }
}

interface GitHubIMSSystemData {
    token: string
}

interface GitHubIMSComponentData {
    owner: string,
    name: string,
    id?: string
}

/**
 * GitHub SyncAdapter
 */
export const GitHubAdapter: SyncAdapter = new GitHubSyncAdapter()