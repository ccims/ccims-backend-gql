import { CCIMSNode } from "../CCIMSNode";
import { Saveable } from "../Saveable";
import { DatabaseManager } from "../../database/DatabaseManager";
import { NodesPropertySpecification } from "./NodesPropertySpecification";
import { LoadNodeListCommand } from "../../database/commands/load/nodes/LoadNodeListCommand";

export class NodesProperty<T extends CCIMSNode, V extends CCIMSNode> implements Saveable {
    private _databaseManager: DatabaseManager;
    private _specification: NodesPropertySpecification<T, V>;
    private _node: V;
    private _loadLevel: LoadLevel = LoadLevel.None;
    private _ids: string[] = [];
    private _elements: Map<string, T> = new Map<string, T>();
    private _addedIds: string[] = [];
    private _removedIds: string[] = [];


    /**
     * create a new NodesProperty with the provided specification
     * @param databaseManager the databaseManager used to execute DatabaseCommands
     * @param specification the specification for the command
     * @param node the node proviced to all generators as last parameter
     */
    public constructor(databaseManager: DatabaseManager, specification: NodesPropertySpecification<T, V>, node: V) {
        this._databaseManager = databaseManager;
        this._specification = specification;
        this._node = node;
    }

    
    /**
     * get the ids of all elements
     */
    public async getIds(): Promise<string[]> {
        await this.ensureLoadLevel(LoadLevel.Ids);
        return this._ids;
    }

    /**
     * get all elements
     */
    public async getElements(): Promise<T[]> {
        await this.ensureLoadLevel(LoadLevel.Complete);
        return Array.from(this._elements, ([key, value]) => value);
    }

    /**
     * gets a single element
     * @param id the id of the element to get
     * @returns the element if existing, otherwise undefined
     */
    public async getElement(id: string): Promise<T | undefined> {
        throw new Error();
    }

    /**
     * adds an element to this property
     * does 
     * @param element the element to add
     */
    public async add(element: T) : Promise<void> {
        
    }

    /**
     * removes an element from this property if possible
     * @param element 
     */
    public async remove(element: T) : Promise<void> {

    }

    /**
     * saves all changes on this property if necessary
     */
    public save(): void{
        
    }

    /**
     * ensures that the load level is high enough
     * @param level the level to reach
     */
    private async ensureLoadLevel(level: LoadLevel): Promise<void> {
        if (this._loadLevel < level) {
            if (level == LoadLevel.Ids && this._specification.loadDynamic) {
                if (!this._specification.loadIds) {
                    throw new Error("necessary generator not present");
                }
                const getIdsCommand = this._specification.loadIds(this._node);
                this._databaseManager.addCommand(getIdsCommand);
                await this._databaseManager.executePendingCommands();
                this.setIds(getIdsCommand.getResult(this._databaseManager));
            } else if (level > LoadLevel.None) {
                if (this._loadLevel >= LoadLevel.Ids) {
                    const notLoadedIds = this._ids.filter(id => !this._elements.has(id));
                    const loadOtherCommand = this._specification.loadFromIds(notLoadedIds, this._node);
                    this._databaseManager.addCommand(loadOtherCommand);
                    await this._databaseManager.executePendingCommands();
                    loadOtherCommand.getResult(this._databaseManager).forEach(element => {
                        this._elements.set(element.id, element);
                    });
                    notLoadedIds.forEach(id => {
                        this._ids = this._ids.filter(this._elements.has);
                    });
                    this._loadLevel = LoadLevel.Complete;
                } else {
                    const loadAllCommand = this._specification.loadElements(this._node);
                    this._databaseManager.addCommand(loadAllCommand);
                    await this._databaseManager.executePendingCommands();
                    this.setElements(loadAllCommand.getResult(this._databaseManager));
                }
            }
        }
    }

    /**
     * set the id list
     * this should only be used when loaded from the database
     * this MUST NOT be used to change the elements list!
     * this has only any effect, if it is not loaded yet
     * @param ids the list of ids
     */
    setIds(ids: string[]): void {
        this._ids = ids;
        if (this._loadLevel > LoadLevel.None) {
            this._removedIds = this._removedIds.filter(id => this._ids.includes(id));
        }
        if (this._loadLevel > LoadLevel.Ids) {
            const allKnownIds = [...ids, ...this._addedIds];
            const newElements: Map<string, T> = new Map<string, T>();
            this._elements.forEach(element => {
                if (allKnownIds.includes(element.id)) {
                    newElements.set(element.id, element);
                }
            });
            this._elements = newElements;
        } else {
            this._loadLevel = LoadLevel.Ids;
        }
    }

    /**
     * set the nodes list
     * this is treated as the most current version, 
     * @param elements the list of elements
     */
    setElements(elements: T[]): void {
        this._ids = elements.map(element => element.id);
        const newElements = this._addedIds.map(this._elements.get);
        this._elements = elements.reduce((map, element, index, elements) => map.set(element.id, element), new Map<string, T>());
        newElements.forEach(element => {
            if (element) {
                this._elements.set(element.id, element);
            }
        });
        this._removedIds = this._removedIds.filter(id => this._ids.includes(id));
        this._loadLevel = LoadLevel.Complete;
    }

}

enum LoadLevel {
    /**
     * nothing is loaded
     */
    None = 0,
    /**
     * the id list is present
     */
    Ids = 1,
    /**
     * the id list and some elements are present
     */
    Partial = 2,
    /**
     * the id list and all elements are present
     */
    Complete = 3
}