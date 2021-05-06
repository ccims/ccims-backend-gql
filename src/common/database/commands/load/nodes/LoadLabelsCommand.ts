import { QueryResult, QueryResultRow } from "pg";
import { Color } from "../../../../Color";
import { Label, LabelTableSpecification } from "../../../../nodes/Label";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNamedSyncNodesCommand } from "./LoadNamedSyncNode";
import { createRelationFilterByPrimary } from "./RelationFilter";

/**
 * command to load a list of components
 */
export class LoadLabelsCommand extends LoadNamedSyncNodesCommand<Label> {

    /**
     * Select only components which have one of the specified colors
     */
    public colors: Color[] | undefined;

    /**
     * Select only labels that are on components assigned to at least one of these projects
     */
    public onProjects: string[] | undefined;

    /**
     * Select only labels that are on one of these components
     */
    public onComponents: string[] | undefined;

    /**
     * Select only labels that are assigned to one of these issues
     */
    public assignedToIssues: string[] | undefined;

    /**
     * creates a new LoadLabelsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(LabelTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a Label
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed Label
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Label {
        return new Label(databaseManager, resultRow.id, resultRow.name, resultRow.description, resultRow.last_updated_at, resultRow.color, 
            resultRow.created_by_id, resultRow.created_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("label", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.colors !== undefined) {
            if (this.colors.length === 1) {
                conditions.conditions.push({
                    text: `main.color=$${conditions.i}`,
                    values: [this.colors[0]],
                });
            } else {
                conditions.conditions.push({
                    text: `main.color=ANY($${conditions.i})`,
                    values: [this.colors],
                });
            }
            conditions.i++;
        }

        if (this.onProjects !== undefined) {
            if (this.onProjects.length === 1) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT label_id FROM relation_component_label WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${conditions.i}))`,
                    values: [this.onProjects[0]],
                });
            } else {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT label_id FROM relation_component_label WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${conditions.i})))`,
                    values: [this.onProjects],
                });
            }
            conditions.i++;
        }

        if (this.onComponents !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "label", this.onComponents, conditions.i));
            conditions.i++;
        }

        if (this.assignedToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "label", this.assignedToIssues, conditions.i));
            conditions.i++;
        }

        return conditions;
    }

}