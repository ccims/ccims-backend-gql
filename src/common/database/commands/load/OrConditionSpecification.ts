import { QueryPart } from "./QueryPart";

/**
 * Creats a single conditions out of multiple conditions, joined by OR
 */
export class OrConditionSpecification implements QueryPart {
    text: string;
    values: any[];

    public constructor(...specifications: QueryPart[]) {
        this.text = `(${specifications.map(spec => `(${spec.text})`).join(" OR ")})`;
        this.values = specifications.map(spec => spec.values).flat();
    }
}