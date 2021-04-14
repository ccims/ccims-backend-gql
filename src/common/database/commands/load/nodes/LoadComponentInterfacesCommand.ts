import { QueryResultRow, QueryResult } from "pg";
import { ComponentInterface, ComponentInterfaceTableSpecification } from "../../../../nodes/ComponentInterface";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadNamedSyncNodesCommand } from "./LoadNamedSyncNode";
import { createRelationFilterByPrimary, createStringListFilter } from "./RelationFilter";

/**
 * command to load componentInterfaces
 */
export class LoadComponentInterfacesCommand extends LoadNamedSyncNodesCommand<ComponentInterface> {

    /**
     * filter for ComponentInterfaces which are on any of the components
     */
    public onComponents: string[] | undefined;

    /**
     * filter for ComponentInterfaces which are consumed by any of the components
     */
    public consumedByComponent: string[] | undefined;

    /**
     * filters for IssueLocations where at least one of the issues is located
     */
    public hasIssueOnLocation: string[] | undefined;

    
    /**
     * Select only component interfaces which are on any component on one of these projects
     */
    public onProjects: string[] | undefined;

    /**
     * creates a new LoadComponentInterfacesCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(ComponentInterfaceTableSpecification.rows, loadDeleted);
    }

    /**
     * parses a componentInterface
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed componentInterface
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): ComponentInterface {
        return new ComponentInterface(databaseManager, resultRow.id, resultRow.name, resultRow.description, resultRow.last_updated_at, resultRow.host_component_id, 
            resultRow.created_by, resultRow.created_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the queryStart
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("component_interface", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the array of conditions and a index for the next value
     */
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onComponents !== undefined) {
            conditions.conditions.push(createStringListFilter("host_component_id", this.onComponents, conditions.i));
            conditions.i++;
        }
        if (this.consumedByComponent !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "consumed_component_interface", this.consumedByComponent, conditions.i));
            conditions.i++;
        }
        if (this.hasIssueOnLocation !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("component", "issue", this.hasIssueOnLocation, conditions.i));
            conditions.i++;
        }
        if (this.onProjects !== undefined) {
            if (this.onProjects.length === 1) {
                conditions.conditions.push({
                    text: `main.host_component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${conditions.i})`,
                    values: [this.onProjects[0]]
                });
            } else {
                conditions.conditions.push({
                    text: `main.host_component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${conditions.i}))`,
                    values: [this.onProjects[0]]
                });
            }
            conditions.i++;
        }

        return conditions;
    }

}