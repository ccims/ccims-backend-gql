import { QueryResultRow, QueryResult } from "pg";
import { Project, ProjectTableSpecification } from "../../../../nodes/Project";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export class LoadProjectsCommand extends LoadNodeListCommand<Project> {

    /**
     * select the projects with have one of the specified components
     */
    public onComponents?: string[];

    public constructor() {
        super(ProjectTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Project {
        return new Project(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["owner_user_id"]);
    }

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
    protected generateConditions(i: number): [ConditionSpecification[], number] {
        const [conditions, i2] = super.generateConditions(i);
        i = i2;

        if (this.onComponents) {
            if (this.onComponents.length == 1) {
                conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=$${i})`,
                    values: [this.onComponents[0]]
                })
            } else {
                conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY($${i}))`,
                    values: [this.onComponents]
                });
            }
            i++;
        }
        return [conditions, i];
    }

}