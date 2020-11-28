import { ConditionSpecification } from "./ConditionSpecification";

/**
 * Creats a single conditions out of multiple conditions, joined by OR
 */
export class OrConditionSpecification implements ConditionSpecification {
    priority: number;
    text: string;
    values: any[];

    public constructor(priority: number, ...specifications: ConditionSpecification[]) {
        this.priority = priority;
        this.text = `(${specifications.map(spec => `(${spec.text})`).join(" OR ")})`;
        this.values = specifications.map(spec => spec.values).flat();
    }
}