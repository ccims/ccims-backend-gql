import { DatabaseManager } from "../database/DatabaseManager";
import { CCIMSNode, CCIMSNodeTableSpecification } from "./CCIMSNode";
import { NodeTableSpecification, RowSpecification } from "./NodeTableSpecification";
import { NodeType } from "./NodeType";

/**
 * specification of a table which can contain NamedNodes
 */
export const NamedNodeTableSpecification: NodeTableSpecification<NamedNode>
    = new NodeTableSpecification<NamedNode>("node", CCIMSNodeTableSpecification, 
        RowSpecification.fromProperty("name", "name"),
        RowSpecification.fromProperty("description", "description"));

/**
 * a namedNode is a CCIMSNode with a name and a description
 * @param T the type of this NamedNode
 */
export class NamedNode<T extends NamedNode = any> extends CCIMSNode<T> {
    /**
     * the name, a string shorter than 257 chars
     */
    private _name: string;

    /**
     * the description, a string shorter than 65537 chars
     */
    private _description: string;

    /**
     * abstract constructor for subclasses
     * @param type the type
     * @param databaseManager the databaseManager 
     * @param tableSpecification teh table specification
     * @param id the id of the NamedNode
     * @param name the name of the NamedNode
     * @param description the description of the NamedNode
     */
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