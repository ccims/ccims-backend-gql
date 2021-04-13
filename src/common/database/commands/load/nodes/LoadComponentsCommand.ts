import { QueryResult, QueryResultRow } from "pg";
import { Component, ComponentTableSpecification } from "../../../../nodes/Component";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNamedSyncNodesCommand } from "./LoadNamedSyncNode";
import { createRelationFilterByPrimary, createRelationFilterBySecundary, createRelationFilterOnMany, createStringListFilter } from "./RelationFilter";

/**
 * command to load a list of components
 */
export class LoadComponentsCommand extends LoadNamedSyncNodesCommand<Component> {

    /**
     * Select only nodes when their repositoryURL matches this _POSIX_ RegEx
     */
    public repositoryURL: string | undefined;

    /**
     * load the components which are registered on any of the projects
     */
    public onProjects: string[] | undefined;

    /**
     * filters the components which consume any of the specified componentInterfaces
     */
    public consumesInterface: string[] | undefined;

    /**
     * select only components that have one of the given ims types
     */
    public imsTypes: number[] | undefined;

    /**
     * filters for Components where at least one of the issues is located
     */
    public hasIssueOnLocation: string[] | undefined;

    /**
     * filters for components with at least one of the issues
     */
    public hasIssue: string[] | undefined;

    /**
     * Select only Components that have at least one of these labels
     */
    public labels: string[] | undefined;

    /**
     * Selects only Components that have at least one of these artifacts
     */
    public artifacts: string[] | undefined;

    /**
     * creates a new LoadComponentsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(ComponentTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a component
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed component
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Component {
        return new Component(databaseManager, resultRow.id, resultRow.name, resultRow.description, resultRow.last_updated_at, resultRow.repository_url, 
            resultRow.created_by, resultRow.created_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("component", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onProjects !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("project", "component", this.onProjects, i));
            conditions.i++;
        }
        if (this.consumesInterface !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("component", "consumed_component_interface", this.consumesInterface, conditions.i));
            conditions.i++;
        }
        if (this.hasIssueOnLocation !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("issueLocation", "issue", this.hasIssueOnLocation, conditions.i));
            conditions.i++;
        }
        if (this.hasIssue !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("component", "issue", this.hasIssue, conditions.i));
            conditions.i++;
        }
        if (this.imsTypes !== undefined) {
            if (this.imsTypes.length === 1) {
                conditions.conditions.push({
                    text: `main.imssystem_id=(SELECT id FROM ims_system WHERE ims_type=$${conditions.i})`,
                    values: [this.imsTypes[0]],
                    priority: 6
                });
            } else {
                conditions.conditions.push({
                    text: `main.imssystem_id=(SELECT id FROM ims_system WHERE ims_type=ANY($${conditions.i}))`,
                    values: [this.imsTypes],
                    priority: 6
                });
            }
            conditions.i++;
        }

        if (this.labels !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("component", "label", this.labels, conditions.i));
            conditions.i++;
        }

        if (this.artifacts !== undefined) {
            conditions.conditions.push(createRelationFilterOnMany("artifact", "component_id", this.artifacts, conditions.i));
            conditions.i++;
        }

        if (this.repositoryURL !== undefined) {
            conditions.conditions.push({
                text: `main.repositoryURL ~* $${conditions.i}`,
                values: [this.repositoryURL],
                priority: 7
            });
            conditions.i++;
        }

        return conditions;
    }

}