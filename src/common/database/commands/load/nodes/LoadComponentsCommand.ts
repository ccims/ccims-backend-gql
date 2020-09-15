import { QueryResultRow, QueryResult } from "pg";
import { Component, ComponentTableSpecification } from "../../../../nodes/Component";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNodeListCommand } from "./LoadNodeListCommand";

export class LoadComponentsCommand extends LoadNodeListCommand<Component> {

    /**
     * load the components which are registered on any of the projects
     */
    public onProjects?: string[];

    public constructor() {
        super(ComponentTableSpecification.rows);
    }

    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Component {
        return new Component(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["owner_user_id"], resultRow["imsSystem_id"]);
    }

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
     */
    protected generateConditions(i: number): [ConditionSpecification[], number] {
        const [conditions, i2] = super.generateConditions(i);
        i = i2;

        if (this.onProjects) {
            if (this.onProjects.length == 1) {
                conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${i})`,
                    values: [this.onProjects[0]]
                })
            } else {
                conditions.push({
                    priority: 2,
                    text: `main.id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${i}))`,
                    values: [this.onProjects]
                });
            }
            i++;
        }
        return [conditions, i];
    }

}