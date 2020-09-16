import { QueryResultRow, QueryResult } from "pg";
import { Project, ProjectTableSpecification } from "../../../../nodes/Project";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary } from "./RelationFilter";

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
            conditions.conditions.push(createRelationFilterBySecundary("project", "component", this.onComponents, conditions.i));
            conditions.i++;
        }
        return conditions;
    }

}