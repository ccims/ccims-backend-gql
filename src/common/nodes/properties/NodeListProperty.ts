import { CCIMSNode } from "../CCIMSNode";
import { DatabaseManager } from "../../database/DatabaseManager";
import { NodeListPropertySpecification } from "./NodeListPropertySpecification";
import { LoadNodeListCommand } from "../../database/commands/load/nodes/LoadNodeListCommand";
import { Property } from "./Property";
import { DatabaseCommand } from "../../database/DatabaseCommand";
import { ListProperty } from "./ListProperty";

/**
 * property which represents the many side of a relation
 * @param T the type of the other node(s)
 * @param V the type of the node on which this property is
 */
export class NodeListProperty<T extends CCIMSNode, V extends CCIMSNode> extends Property<T, V> implements ListProperty<T> {
    /**
     * the specification of the property
     */
    private readonly _specification: NodeListPropertySpecification<T, V>;
    /**
     * the current load level
     */
    private _loadLevel: LoadLevel = LoadLevel.None;
    /**
     * list with all ids from the other nodes
     */
    private _ids: Set<string> = new Set<string>();
    /**
     * map from id to other node
     */
    private _elements: Map<string, T> = new Map<string, T>();
    /**
     * set with all new added other nodes (id)
     */
    private _addedIds: Set<string> = new Set<string>();
    /**
     * set with all removed other nodes (id)
     */
    private _removedIds: Set<string> = new Set<string>();


    /**
     * create a new NodesProperty with the provided specification
     * @param databaseManager the databaseManager used to execute DatabaseCommands
     * @param specification the specification for the command
     * @param node the node proviced to all generators as last parameter
     */
    public constructor(databaseManager: DatabaseManager, specification: NodeListPropertySpecification<T, V>, node: V) {
        super(databaseManager, node, specification);
        this._specification = specification;
    }

    /**
     * get the ids of all elements
     */
    public async getIds(): Promise<string[]> {
        await this.ensureLoadLevel(LoadLevel.Ids);
        return Array.from(this._ids);
    }

    /**
     * returnes true if this property contains the specified id
     * @param id the id to check for
     */
    public async hasId(id: string): Promise<boolean> {
        await this.ensureLoadLevel(LoadLevel.Ids);
        return this._ids.has(id);
    }

    /**
     * get all elements
     */
    public async getElements(): Promise<T[]> {
        await this.ensureLoadLevel(LoadLevel.Complete);
        return Array.from(this._elements, ([key, value]) => value);
    }

    /**
     * gets all elements which are in this relation and returned from filter
     * @param filter the filter to filter other nodes
     * @returns the array of filtered elements
     */
    public async getFilteredElements<S extends T>(filter: LoadNodeListCommand<S>): Promise<S[]> {
        await this.ensureAddDeleteLoadLevel();
        filter.ids = Array.from((this._ids));
        this._databaseManager.addCommand(filter);
        await this._databaseManager.executePendingCommands();
        filter.getResult().forEach(element => {
            this._elements.set(element.id, element);
        });
        return filter.getResult();
    }

    /**
     * gets a single element
     * @param id the id of the element to get
     * @returns the element if existing, otherwise undefined
     */
    public async getElement(id: string): Promise<T | undefined> {
        await this.ensureAddDeleteLoadLevel();
        if (this._elements.has(id)) {
            return this._elements.get(id);
        } else if (this._ids.has(id) && this._specification.loadDynamic) {
            const loadCommand = this._specification.loadFromIds([id], this._node);
            this._databaseManager.addCommand(loadCommand);
            await this._databaseManager.executePendingCommands();
            const resultElement = loadCommand.getResult()[0];
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
    public async add(element: T): Promise<void> {
        await this.ensureAddDeleteLoadLevel();
        if (!this._ids.has(element.id)) {
            this._ids.add(element.id);
            this._addedIds.add(element.id);
            if (this._loadLevel > LoadLevel.Ids) {
                this._elements.set(element.id, element);
            }
            await this.notifyAdded(element, false);
            if (this._specification.save) {
                this.markChanged();
            }
        }
    }

    public async addAll(elements: T[]): Promise<void> {
        await Promise.all(elements.map(element => this.add(element)));
    }

    /**
     * removes an element from this property if possible
     * @param element
     */
    public async remove(element: T): Promise<void> {
        await this.ensureAddDeleteLoadLevel();
        if (this._ids.has(element.id)) {
            this._ids.delete(element.id);
            this._elements.delete(element.id);
            await this.notifyRemoved(element, false);
            this._removedIds.add(element.id);
            if (this._specification.save) {
                this.markChanged();
            }
        }
    }

    /**
     * removes all elements
     */
    public async clear(): Promise<void> {
        const elements = await this.getElements();
        await Promise.all(elements.map(element => this.remove(element)));
    }

    /**
     * saves all changes on this property if necessary
     */
    public save(): void {
        super.save();
        if (this._specification.save) {
            const addRel = this._specification.addRel as (((id: string, node: V) => DatabaseCommand<void>));
            const removeRel = this._specification.removeRel as (((id: string, node: V) => DatabaseCommand<void>));
            this._addedIds.forEach(id => {
                this._databaseManager.addCommand(addRel(id, this._node));
            });
            this._removedIds.forEach(id => {
                this._databaseManager.addCommand(removeRel(id, this._node));
            });
            this._addedIds.clear();
            this._removedIds.clear();
        }

    }

    /**
     * ensures a load level high enough to add or remove nodes
     */
    private async ensureAddDeleteLoadLevel(): Promise<void> {
        if (this._specification.loadDynamic) {
            await this.ensureLoadLevel(LoadLevel.Ids);
            if (this._loadLevel === LoadLevel.Ids) {
                this._loadLevel = LoadLevel.Partial;
            }
        } else {
            await this.ensureLoadLevel(LoadLevel.Complete);
        }
    }

    /**
     * ensures that the load level is high enough
     * @param level the level to reach
     */
    private async ensureLoadLevel(level: LoadLevel): Promise<void> {
        if (this._loadLevel < level) {
            if (level === LoadLevel.Ids && this._specification.loadDynamic) {
                if (!this._specification.loadIds) {
                    throw new Error("necessary generator not present");
                }
                const getIdsCommand = this._specification.loadIds(this._node);
                this._databaseManager.addCommand(getIdsCommand);
                await this._databaseManager.executePendingCommands();
                await this.setIds(getIdsCommand.getResult());
            } else if (level > LoadLevel.None) {
                if (this._loadLevel >= LoadLevel.Ids) {
                    const notLoadedIds = Array.from(this._ids).filter(id => !this._elements.has(id));
                    const loadOtherCommand = this._specification.loadFromIds(notLoadedIds, this._node);
                    this._databaseManager.addCommand(loadOtherCommand);
                    await this._databaseManager.executePendingCommands();
                    loadOtherCommand.getResult().forEach(element => {
                        this._elements.set(element.id, element);
                        // a notify is not necessary because this was already done when the ids were loaded
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
                    await this.setElements(loadAllCommand.getResult());
                }
            }
        }
    }

    /**
     * set the id list
     * this should only be used when loaded from the database
     * this MUST NOT be used to change the elements list!
     * @param ids the list of ids
     */
    async setIds(ids: string[]): Promise<void> {
        const idsSet = new Set(ids);
        this._removedIds.forEach(id => idsSet.delete(id));
        ids = Array.from(idsSet);

        await Promise.all(Array.from(this._ids).map(async id => {
            if (!ids.includes(id)) {
                this._removedIds.delete(id);
                const element = this._elements.has(id) ? this._elements.get(id) : (this._databaseManager.getCachedNode(id) as T);
                if (element) {
                    await this.notifyRemoved(element, true);
                }
            }
        }));
        await Promise.all(ids.map(async id => {
            if (!this._ids.has(id)) {
                const element = this._elements.has(id) ? this._elements.get(id) : (this._databaseManager.getCachedNode(id) as T);
                if (element) {
                    await this.notifyAdded(element, true);
                }
            }
        }));

        this._ids = new Set<string>(ids);
        if (this._loadLevel > LoadLevel.Ids) {
            const allKnownIds = [...ids, ...this._addedIds];
            this._ids = new Set(allKnownIds);
            const newElements: Map<string, T> = new Map<string, T>();

            const idsToLoad: string[] = [];
            await Promise.all(allKnownIds.map(async id => {
                const availableElement = this._elements.get(id);
                if (availableElement) {
                    newElements.set(id, availableElement);
                } else {
                    idsToLoad.push(id);
                }
            }));
            if (this._loadLevel === LoadLevel.Complete) {
                const loadCommand = this._specification.loadFromIds(idsToLoad, this._node);
                this._databaseManager.addCommand(loadCommand);
                await this._databaseManager.executePendingCommands();
                const res = loadCommand.getResult();
                res.forEach(element => newElements.set(element.id, element));
                idsToLoad.forEach(id => {
                    if (!newElements.has(id)) {
                        this._ids.delete(id);
                    }
                })
            }

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
    async setElements(elements: T[]): Promise<void> {
        await this.setIds(elements.map(element => element.id));
        const newElements = Array.from(this._addedIds).map(id => this._elements.get(id));
        this._elements = elements.reduce((map, element, index, items) => map.set(element.id, element), new Map<string, T>());
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
                this.markChanged();
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

    /**
     * notifies the element that this node was removed
     * @param element the element to notify
     * @param byDatabase true if caused by database
     */
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
                this.markChanged();
            }
            if (this._loadLevel >= LoadLevel.Ids) {
                this._removedIds.add(element.id);
                this._ids.delete(element.id);
                this._elements.delete(element.id);
            }
        }
    }

}

/**
 * different load levels of the property
 */
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