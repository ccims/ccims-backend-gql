import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";

export const NamedNodeTableSpecification: NodeTableSpecification<NamedNode>
    = new NodeTableSpecification<NamedNode>("node", CCIMSNodeTableSpecification, 
        RowSpecification.fromProperty("name", "name"),
        RowSpecification.fromProperty("description", "description"));

export class NamedNode<T extends NamedNode = any> extends CCIMSNode<T> {
    private _name: string;

    private _description: string;

    protected constructor (type: NodeType, databaseManager: DatabaseManager, tableSpecification: NodeTableSpecification<T>, id: string, name: string, description: string) {
        super(type, databaseManager, tableSpecification, id);
        this._name = name;
        this._description = description;
    }

    public get name(): string {
        return this._name;
    }

    /**
     * sets the name, which must shorter than 257 chars
     */
    public set name(value: string) {
        if (value.length > 256) {
            throw new Error("the specified name is too long");
        }
        this.markChanged();
        this._name = value;
    }

    public get description(): string {
        return this._description;
    }

    /**
     * sets the name, which must shorter than 65537 chars
     */
    public set description(value: string) {
        if (value.length > 65536) {
            throw new Error("the specified description is too long");
        }
        this.markChanged();
        this._description = value;
    }
}