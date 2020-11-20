import { QueryResult, QueryResultRow } from "pg";
import { Component, ComponentTableSpecification } from "../../../../nodes/Component";
import { ImsType } from "../../../../nodes/ImsSystem";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNamedOwnedNodesCommand } from "./LoadNamedOwnedNodesCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load a list of components
 */
export class LoadComponentsCommand extends LoadNamedOwnedNodesCommand<Component> {

    /**
     * load the components which are registered on any of the projects
     */
    public onProjects?: string[];

    /**
     * filters the components which consume any of the specified componentInterfaces
     */
    public consumesInterface?: string[];

    /**
     * select only components that have one of the given ims types
     */
    public imsTypes?: ImsType[];

    /**
     * filters for Components where at least one of the issues is located
     */
    public hasIssueOnLocation?: string[];

    /**
     * filters for components with at least one of the issues
     */
    public hasIssue?: string[];

    /**
     * Select only Components that have at least one of these labels
     */
    public labels?: string[];

    /**
     * creates a new LoadComponentsCommand
     */
    public constructor() {
        super(ComponentTableSpecification.rows);
    }

    /**
     * parses a component
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed component
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Component {
        return new Component(databaseManager, resultRow.id, resultRow.name, resultRow.description, resultRow.owner_user_id, resultRow.ims_system_id);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM component main `,
            values: []
        }
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

        return conditions;
    }

}