import { QueryResultRow, QueryResult } from "pg";
import { Project, ProjectTableSpecification } from "../../../../nodes/Project";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

/**
 * command to load a list of projects
 */
export class LoadProjectsCommand extends LoadNodeListCommand<Project> {

    /**
     * select the projects with have one of the specified components
     */
    public onComponents?: string[];

    /**
     * creates a new LoadProjectsCommand
     */
    public constructor() {
        super(ProjectTableSpecification.rows);
    }

    /**
     * parses a project
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed project
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Project {
        return new Project(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["owner_user_id"]);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM project`,
            values: []
        }
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): {conditions: ConditionSpecification[], i: number} {
        const conditions = super.generateConditions(i);

        if (this.onComponents) {
            if (this.onComponents.length == 1) {
                conditions.conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=$${conditions.i})`,
                    values: [this.onComponents[0]]
                })
            } else {
                conditions.conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY($${conditions.i}))`,
                    values: [this.onComponents]
                });
            }
            conditions.i++;
        }
        return conditions;
    }

}