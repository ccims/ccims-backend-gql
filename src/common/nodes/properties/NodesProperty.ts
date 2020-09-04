import { CCIMSNode } from "../CCIMSNode";
import { Saveable } from "../Saveable";
import { DatabaseManager } from "../../database/DatabaseManager";
import { NodesPropertySpecification } from "./NodesPropertySpecification";
import { LoadNodeListCommand } from "../../database/commands/load/nodes/LoadNodeListCommand";
import { Property } from "./Property";
import { DatabaseCommand } from "../../database/DatabaseCommand";

export class NodesProperty<T extends CCIMSNode, V extends CCIMSNode> implements Saveable, Property<T> {
    private _databaseManager: DatabaseManager;
    private _specification: NodesPropertySpecification<T, V>;
    private _node: V;
    private _loadLevel: LoadLevel = LoadLevel.None;
    private _ids: Set<string> = new Set<string>();
    private _elements: Map<string, T> = new Map<string, T>();
    private _addedIds: Set<string> = new Set<string>();
    private _removedIds: Set<string> = new Set<string>();


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
        return Array.from(this._ids);
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
        await this.ensureLoadLevel(LoadLevel.Partial);
        if (this._elements.has(id)) {
            return this._elements.get(id);
        } else if (this._ids.has(id) && this._specification.loadFromId) {
            const loadCommand = this._specification.loadFromId(id, this._node);
            this._databaseManager.addCommand(loadCommand);
            await this._databaseManager.executePendingCommands();
            const resultElement = loadCommand.getResult(this._databaseManager);
            if (resultElement) {
                if (!this._elements.has(id)) {
                    this._elements.set(id, resultElement);
                    await this.notifyAdded(resultElement, true);
                }
            }
            return resultElement;
        } else {
            return undefined;
        }
    }

    /**
     * adds an element to this property
     * does 
     * @param element the element to add
     */
    public async add(element: T) : Promise<void> {
        await this.ensureAddDeleteLoadLevel();
        if (!this._ids.has(element.id)) {
            this._ids.add(element.id);
            this._addedIds.add(element.id);
            if (this._loadLevel > LoadLevel.Ids) {
                this._elements.set(element.id, element);
            }
            await this.notifyAdded(element, false);
            this._node.markChanged();
        }
    }

    /**
     * removes an element from this property if possible
     * @param element 
     */
    public async remove(element: T) : Promise<void> {
        await this.ensureAddDeleteLoadLevel();
        if (this._ids.has(element.id)) {
            this._ids.delete(element.id);
            this._elements.delete(element.id);
            await this.notifyRemoved(element, false);
            this._removedIds.add(element.id);
            this._node.markChanged();
        }
    }

    /**
     * saves all changes on this property if necessary
     */
    public save(): void{
        if (this._specification.save) {
            const addRel = this._specification.addRel as (((id: string, node: V) => DatabaseCommand<void>));
            const removeRel = this._specification.removeRel as (((id: string, node: V) => DatabaseCommand<void>));
            this._addedIds.forEach(id => {
                this._databaseManager.addCommand(addRel(id, this._node));
            });
            this._removedIds.forEach(id => {
                this._databaseManager.addCommand(removeRel(id, this._node));
            });
        }
        
    }

    private async ensureAddDeleteLoadLevel(): Promise<void> {
        if (this._specification.loadDynamic) {
            await this.ensureLoadLevel(LoadLevel.Ids);
            if (this._loadLevel == LoadLevel.Ids) {
                this._loadLevel = LoadLevel.Partial;
            }
        } else {
            await this.ensureLoadLevel(LoadLevel.Ids);
        }
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
                    const notLoadedIds = Array.from(this._ids).filter(id => !this._elements.has(id));
                    const loadOtherCommand = this._specification.loadFromIds(notLoadedIds, this._node);
                    this._databaseManager.addCommand(loadOtherCommand);
                    await this._databaseManager.executePendingCommands();
                    loadOtherCommand.getResult(this._databaseManager).forEach(element => {
                        this._elements.set(element.id, element);
                        //a notify is not necessary because this was already done when the ids were loaded
                    });
                    notLoadedIds.forEach(id => {
                        if (!this._elements.has(id)) {
                            this._ids.delete(id);
                            // a notify is not possible
                        }
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
    async setIds(ids: string[]): Promise<void> {
        //these devensive checks 
        this._ids.forEach(async id => {
            if (!ids.includes(id)) {
                this._removedIds.delete(id);
                const element = this._elements.has(id) ? this._elements.get(id) : (this._databaseManager.getNode(id) as T);
                if (element) {
                    await this.notifyRemoved(element, true);
                }
            }
        });
        ids.forEach(async id => {
            if (this._ids.has(id)) {
                const element = this._elements.has(id) ? this._elements.get(id) : (this._databaseManager.getNode(id) as T);
                if (element) {
                    await this.notifyAdded(element, true);
                }
            }
        });

        this._ids = new Set<string>(ids);
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
        this.setIds(elements.map(element => element.id));
        const newElements = Array.from(this._addedIds).map(this._elements.get);
        this._elements = elements.reduce((map, element, index, elements) => map.set(element.id, element), new Map<string, T>());
        newElements.forEach(element => {
            if (element) {
                this._elements.set(element.id, element);
            }
        });
        this._loadLevel = LoadLevel.Complete;
    }

    /**
     * notifies the element that this node was added
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    private async notifyAdded(element: T, byDatabase: boolean): Promise<void> {
        this._specification.notifiers.forEach(async notifier => {
            const toNotify = notifier(element, this._node);
            await toNotify.wasAddedBy(this._node, byDatabase);
        })
    }

    /**
     * notifies the element that this node was removed
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
    private async notifyRemoved(element: T, byDatabase: boolean): Promise<void> {
        this._specification.notifiers.forEach(async notifier => {
            const toNotify = notifier(element, this._node);
            await toNotify.wasRemovedBy(this._node, byDatabase);
        })
    }

    async wasAddedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        if (byDatabaseUpdate) {
            this._addedIds.delete(element.id);
            if (!this._removedIds.has(element.id) && this._loadLevel >= LoadLevel.Ids) {
                this._ids.add(element.id);
                if (this._loadLevel >= LoadLevel.Partial) {
                    this._elements.set(element.id, element);
                }
            }
        } else {
            if (this._specification.save) {
                await this.ensureAddDeleteLoadLevel();
            }
            if (this._loadLevel >= LoadLevel.Ids) {
                this._addedIds.add(element.id);
                this._removedIds.delete(element.id);
                this._ids.add(element.id);
                if (this._loadLevel >= LoadLevel.Partial) {
                    this._elements.set(element.id, element);
                } 
            }
        }
    }

    async wasRemovedBy(element: T, byDatabaseUpdate: boolean): Promise<void> {
        if (byDatabaseUpdate) {
            this._removedIds.delete(element.id);
            if (!this._addedIds.has(element.id) && this._loadLevel >= LoadLevel.Ids) {
                this._ids.delete(element.id);
                this._elements.delete(element.id);
            }
        } else {
            if (this._specification.save) {
                await this.ensureAddDeleteLoadLevel();
            }
            if (this._loadLevel >= LoadLevel.Ids) {
                this._removedIds.add(element.id);
                this._ids.delete(element.id);
                this._elements.delete(element.id);
            }
        }
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