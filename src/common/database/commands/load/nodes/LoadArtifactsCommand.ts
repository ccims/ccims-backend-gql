import { QueryResult, QueryResultRow } from "pg";
import { Artifact, ArtifactTableSpecification } from "../../../../nodes/Artifact";
import { DatabaseManager } from "../../../DatabaseManager";
import { QueryPart } from "../QueryPart";
import { LoadSyncNodeListCommand } from "./LoadSyncNodeListCommand";
import { createRelationFilterByPrimary, createStringListFilter } from "./RelationFilter";

/**
 * command to load a list of Artifacts
 */
export class LoadArtifactsCommand extends LoadSyncNodeListCommand<Artifact> {

    /**
     * Selects only Artifacts when their uri machts this _POSIX_ RegEx
     */
    public uri: string | undefined;

    /**
     * Select only Artifacts that are on one of these Components
     */
    public onComponents: string[] | undefined;

    /**
     * Select only labels that are on components assigned to at least one of these projects
     */
    public onProjects: string[] | undefined;

    /**
     * Select only Artifacts that are assigned to one of these Issues
     */
    public assignedToIssues: string[] | undefined;

    /**
     * creates a new LoadArtifactsCommand
     */
    public constructor(loadDeleted: boolean = false) {
        super(ArtifactTableSpecification.rows, loadDeleted);
    }

    /**
     * parses an Artifact
     * @param resultRow  the row to parse
     * @param result  the complete QueryResult for additional properties like fields
     * @returns the parsed Artifact
     */
    protected getNodeResult(databaseManager: DatabaseManager, resultRow: QueryResultRow, result: QueryResult<any>): Artifact {
        return new Artifact(databaseManager, resultRow.id, resultRow.component_id, resultRow.uri, resultRow.line_range_start, resultRow.line_range_end, resultRow.last_updated_at,
            resultRow.created_by_id, resultRow.created_at, resultRow.deleted, resultRow.last_modified_at, resultRow.metadata);
    }

    /**
     * generates the start of the query
     */
    protected generateQueryStart(databaseManager: DatabaseManager): QueryPart {
        return this.generateQueryStartFromTableName("artifact", databaseManager);
    }

    /**
     * adds the id condition
     * can be overwritten to add other conditions, calling the super function is recommended
     * @param i the first index of query parameter to use
     * @returns the conditions
     */
    protected generateConditions(i: number): { conditions: QueryPart[], i: number } {
        const conditions = super.generateConditions(i);

        if (this.onComponents !== undefined) {
            conditions.conditions.push(createStringListFilter("component_id", this.onComponents, conditions.i));
            conditions.i++;
        }

        if (this.assignedToIssues !== undefined) {
            conditions.conditions.push(createRelationFilterByPrimary("issue", "artifact", this.assignedToIssues, conditions.i));
            conditions.i++;
        }

        if (this.onProjects !== undefined) {
            if (this.onProjects.length === 1) {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT id FROM artifact WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=$${conditions.i}))`,
                    values: [this.onProjects[0]],
                });
            } else {
                conditions.conditions.push({
                    text: `main.id=ANY(SELECT id FROM artifact WHERE component_id=ANY(SELECT component_id FROM relation_project_component WHERE project_id=ANY($${conditions.i})))`,
                    values: [this.onProjects],
                });
            }
            conditions.i++;
        }

        if (this.uri !== undefined) {
            conditions.conditions.push({
                text: `main.uri ~* $${conditions.i}`,
                values: [this.uri],
            });
            conditions.i++;
        }

        return conditions;
    }
}