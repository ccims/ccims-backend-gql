import { QueryResultRow, QueryResult } from "pg";
import { Component, ComponentTableSpecification } from "../../../../nodes/Component";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load a list of components
 */
export class LoadComponentsCommand extends LoadNodeListCommand<Component> {

    /**
     * load the components which are registered on any of the projects
     */
    public onProjects?: string[];

    /**
     * filters the components which consume any of the specified componentInterfaces
     */
    public consumesInterface?: string[];

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
        return new Component(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["owner_user_id"], resultRow["imsSystem_id"]);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM component`,
            values: []
        }
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): {conditions: ConditionSpecification[], i: number} {
        const conditions= super.generateConditions(i);

        if (this.onProjects) {
            conditions.conditions.push(createRelationFilterByPrimary("project", "component", this.onProjects, i));
            conditions.i++;
        }
        if (this.consumesInterface) {
            conditions.conditions.push(createRelationFilterBySecundary("component", "consumedComponentInterface", this.consumesInterface, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}