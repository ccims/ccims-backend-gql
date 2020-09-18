import { QueryResult, QueryResultRow } from "pg";
import { Color } from "../../../../Color";
import { Label, LabelTableSpecification } from "../../../../nodes/Label";
import { DatabaseManager } from "../../../DatabaseManager";
import { ConditionSpecification } from "../ConditionSpecification";
import { QueryPart } from "../QueryPart";
import { LoadNamedSyncNodesCommand } from "./LoadNamedSyncNode";

/**
 * command to load a list of components
 */
export class LoadLabelCommand extends LoadNamedSyncNodesCommand<Label> {

    /**
     * Select only components which have one of the specified colors
     */
    public colors?: Color[];

    /**
     * creates a new LoadComponentsCommand
     */
    public constructor() {
        super(LabelTableSpecification.rows);
    }

    /**
     * parses a component
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed component
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Label {
        return new Label(databaseManager, resultRow["id"], resultRow["name"], resultRow["description"], resultRow["color"], resultRow["created_by"], resultRow["created_at"], resultRow["deleted"], resultRow["metadata"]);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(): QueryPart {
        return {
            text: `SELECT ${this.rows} FROM issue_label main `,
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

        if (this.colors) {
            if (this.colors.length === 1) {
                conditions.conditions.push({
                    text: `main.color=$${conditions.i}`,
                    values: [this.colors],
                    priority: 6
                });
            } else {
                conditions.conditions.push({
                    text: `main.color=ANY($${conditions.i})`,
                    values: [this.colors],
                    priority: 6
                });
            }
            conditions.i++;
        }

        return conditions;
    }

}