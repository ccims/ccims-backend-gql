import { QueryResult, QueryResultRow } from "pg";
import { Project, ProjectTableSpecification } from "../../../../nodes/Project";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNamedOwnedNodesCommand } from "./LoadNamedOwnedNodesCommand";
import { createRelationFilterByPrimary, createRelationFilterBySecundary } from "./RelationFilter";

/**
 * command to load a list of projects
 */
export class LoadProjectsCommand extends LoadNamedOwnedNodesCommand<Project> {

    /**
     * select the projects with have one of the specified components
     */
    public components?: string[];

    /**
     * select the projects with have one of the specified users as participants
     */
    public users?: string[];

    /**
     * select only projects which have one of the given issues on a component assigned to them
     */
    public issuesOnComponent?: string[];

    /**
     * Select only projects where at least one of the given labels is available (on a acomponent assigned to this project)
     */
    public labels?: string[];

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
        return new Project(databaseManager, resultRow.id, resultRow.name, resultRow.description, resultRow.owner_user_id);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("project", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     */
    protected generateConditions(i: number): { conditions: ConditionSpecification[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.components !== undefined) {
            conditions.conditions.push(createRelationFilterBySecundary("project", "component", this.components, conditions.i));
            conditions.i++;
        }
        if (this.users !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("user", "project", this.users, conditions.i));
            conditions.i++;
        }

        if (this.issuesOnComponent !== undefined) {
            if (this.issuesOnComponent.length === 1) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY(SELECT component_id FROM relation_component_issue WHERE issue_id=$${conditions}))`,
                    values: [this.issuesOnComponent[0]],
                    priority: 5
                });
            } else {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY(SELECT component_id FROM relation_component_issue WHERE issue_id=ANY($${conditions})))`,
                    values: [this.issuesOnComponent],
                    priority: 5
                });
            }
            conditions.i++;
        }

        if (this.labels !== undefined) {
            if (this.labels.length === 1) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY(SELECT component_id FROM relation_component_label WHERE label_id=$${conditions}))`,
                    values: [this.labels[0]],
                    priority: 7
                });
            } else {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT project_id FROM relation_project_component WHERE component_id=ANY(SELECT component_id FROM relation_component_label WHERE label_id=ANY($${conditions})))`,
                    values: [this.labels],
                    priority: 7
                });
            }
            conditions.i++;
        }

        return conditions;
    }

}