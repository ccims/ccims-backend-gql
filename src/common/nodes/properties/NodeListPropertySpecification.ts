import { DatabaseCommand } from "../../database/DatabaseCommand";
import { CCIMSNode } from "../CCIMSNode";
import { Property } from "./Property";
import { AddRelationCommand } from "../../database/commands/save/AddRelationCommand";
import { RemoveRelationCommand } from "../../database/commands/save/RemoveRelationCommand";
import { PropertySpecification } from "./PropertySpecification";

/**
 * specification of property on the other side
 * @param T the type of the other node(s)
 * @param V the type of the node on which this property is
 */
export class NodeListPropertySpecification<T extends CCIMSNode, V extends CCIMSNode> implements PropertySpecification<T, V> {
    /**
     * general specification for a property
     * hint: you probably shoud not use this constructor, but the generator functions below
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param loadDynamic if true, the should always load as least as possible
     * @param save if true, the property must handle save
     * @param loadIds command generator to load all ids
     * @param loadFromIds command generator to load elements by a list of ids
     * @param loadElements command generator to load all elements
     * @param addRel command generator to add a relation to the relation table
     * @param removeRel command generator to remove a relation from the relation table
     * @param notifiers callbacks to get properties to notifiy changes
     */
    constructor(
        public readonly loadDynamic: boolean,
        public readonly save: boolean,
        public readonly loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        public readonly loadElements: (node: V) => DatabaseCommand<T[]>,
        public readonly notifiers: ((element: T, node: V) => Property<V>)[],
        public readonly loadIds?: (node: V) => DatabaseCommand<string[]>,
        public readonly addRel?: (id: string, node: V) => DatabaseCommand<void>,
        public readonly removeRel?: (id: string, node: V) => DatabaseCommand<void>
    ) {
        
    }

    /**
     * specifies that the property loads all elements once at least one element is needed, 
     * and does NOT try to load single nodes
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param loadFromIds command generator to load elements by a list of ids
     * @param loadElements command generator to load all elements
     */
    public static loadAll<T extends CCIMSNode, V extends CCIMSNode>(
        loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        loadElements: (node: V) => DatabaseCommand<T[]>
    ): NodeListPropertySpecificationBuilder<T, V> {
        return new NodeListPropertySpecificationBuilder<T, V>(loadFromIds, loadElements, false);
    }

    /**
     * specifies that the property loads an element only if it is necessary, and not more
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param loadIds command generator to load all ids
     * @param loadFromId command generator to load a single element by id
     * @param loadFromIds command generator to load elements by a list of ids
     * @param loadElements command generator to load all elements
     */
    public static loadDynamic<T extends CCIMSNode, V extends CCIMSNode>(
        loadIds: (node: V) => DatabaseCommand<string[]>,
        loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        loadElements: (node: V) => DatabaseCommand<T[]>
    ): NodeListPropertySpecificationBuilder<T, V> {
        return new NodeListPropertySpecificationBuilder<T, V>(
            loadFromIds,
            loadElements,
            true,
            loadIds
        );
    }
}

/**
 * builder for @see NodesPropertySpecification
 */
 class NodeListPropertySpecificationBuilder<T extends CCIMSNode, V extends CCIMSNode> {

    private notifiers: ((element: T, node: V) => Property<V>)[] = [];

    /**
     * creates a new NodesPropertySpecificationBuilder
     * normally, this is returned from one of the static mehtods on NodesPropertySpecification
     * @param loadDynamic if true, the should always load as least as possible
     * @param loadIds command generator to load all ids
     * @param loadFromId command generator to load a single element by id
     * @param loadFromIds command generator to load elements by a list of ids, undefined if !loadDynamic
     * @param loadElements command generator to load all elements, undefined if !loadDynamic
     */
    public constructor(
        private loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        private loadElements: (node: V) => DatabaseCommand<T[]>,
        private loadDynamic: boolean,
        private loadIds?: (node: V) => DatabaseCommand<string[]>,
    ) { 
        
    }

    /**
     * adds a notify callback when a change on this property occures
     * @param toNotify generates the property to notify out of element
     */
    public notifyChanged(toNotify: (element: T, node: V) => Property<V>): NodeListPropertySpecificationBuilder<T, V> {
        this.notifiers.push(toNotify);
        return this;
    }

    /**
     * specifies that the property should handle save
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param addRel command generator to add a relation to the relation table
     * @param removeRel command generator to remove a relation from the relation table
     */
    public save(
        addRel: (id: string, node: V) => DatabaseCommand<void>,
        removeRel: (id: string, node: V) => DatabaseCommand<void>,
    ): NodeListPropertySpecification<T, V> {
        return new NodeListPropertySpecification<T, V>(
            this.loadDynamic,
            true,
            this.loadFromIds,
            this.loadElements,
            this.notifiers,
            this.loadIds,
            addRel,
            removeRel
        )
    }

    /**
     * specifies that the property should handle save, and is the primary node
     * in the relation table
     * @param primary the name for the primary column
     * @param secundary the name for the secundary column
     */
    public saveOnPrimary(primary: string, secundary: string): NodeListPropertySpecification<T, V> {
        return new NodeListPropertySpecification (
            this.loadDynamic,
            true,
            this.loadFromIds,
            this.loadElements,
            this.notifiers,
            this.loadIds,
            AddRelationCommand.fromPrimary(primary, secundary),
            RemoveRelationCommand.fromPrimary(primary, secundary)
        )
    }

    /**
     * specifies that the property should handle save, and is the secundary node
     * in the relation table
     * @param primary the name for the primary column
     * @param secundary the name for the secundary column
     */
    public saveOnSecundary(primary: string, secundary: string): NodeListPropertySpecification<T, V> {
        return new NodeListPropertySpecification (
            this.loadDynamic,
            true,
            this.loadFromIds,
            this.loadElements,
            this.notifiers,
            this.loadIds,
            AddRelationCommand.fromSecundary(primary, secundary),
            RemoveRelationCommand.fromSecundary(primary, secundary)
        )
    }

    /**
     * specifies that the property should not handle save
     * in this case, it's (normally) up to the other side
     */
    public noSave(): NodeListPropertySpecification<T, V> {
        return new NodeListPropertySpecification<T, V>(
            this.loadDynamic,
            false,
            this.loadFromIds,
            this.loadElements,
            this.notifiers,
            this.loadIds,
        )
    }
 }
