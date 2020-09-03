import { DatabaseCommand } from "../../database/DatabaseCommand";
import { CCIMSNode } from "../CCIMSNode";

export class NodesPropertySpecification<T extends CCIMSNode, V extends CCIMSNode> {
    /**
     * general specification for a property
     * hint: you probably shoud not use this constructor, but the generator functions below
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param loadDynamic if true, the should always load as least as possible
     * @param save if true, the property must handle save
     * @param loadIds command generator to load all ids
     * @param loadFromId command generator to load a single element by id
     * @param loadFromIds command generator to load elements by a list of ids
     * @param loadElements command generator to load all elements
     * @param addRel command generator to add a relation to the relation table
     * @param removeRel command generator to remove a relation from the relation table
     */
    constructor(
        public readonly loadDynamic: boolean,
        public readonly save: boolean,
        public readonly loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        public readonly loadElements: (node: V) => DatabaseCommand<T[]>,
        public readonly loadIds?: (node: V) => DatabaseCommand<string[]>,
        public readonly loadFromId?: (id: string, node: V) => DatabaseCommand<T>,
        public readonly addRel?: (id: string, node: V) => DatabaseCommand<void>,
        public readonly removeRel?: (id: string, node: V) => DatabaseCommand<void>
    ) {
        
    }

    /**
     * specifies that the property loads all elements as one element is needed, 
     * and does NOT try to load single nodes
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param loadFromIds command generator to load elements by a list of ids
     * @param loadElements command generator to load all elements
     */
    public static loadAll<T extends CCIMSNode, V extends CCIMSNode>(
        loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        loadElements: (node: V) => DatabaseCommand<T[]>
    ): NodesPropertySpecificationBuilder<T, V> {
        return new NodesPropertySpecificationBuilder<T, V>(loadFromIds, loadElements, false);
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
        loadFromId: (id: string, node: V) => DatabaseCommand<T>,
        loadFromIds: (ids: string[], node: V) => DatabaseCommand<T[]>,
        loadElements: (node: V) => DatabaseCommand<T[]>
    ): NodesPropertySpecificationBuilder<T, V> {
        return new NodesPropertySpecificationBuilder<T, V>(
            loadFromIds,
            loadElements,
            true,
            loadIds,
            loadFromId
        );
    }
}

/**
 * builder for @see NodesPropertySpecification
 */
 class NodesPropertySpecificationBuilder<T extends CCIMSNode, V extends CCIMSNode> {
    /**
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
        private loadFromId?: (id: string, node: V) => DatabaseCommand<T>
    ) { 
        
    }

    /**
     * specifies that the property should handle save
     * node is normally the node which hosts the property, and is necessary to get e.g. the id
     * @param addRel command generator to add a relation to the relation table
     * @param removeRel command generator to remove a relation from the relation table
     */
    public save(
        addRel: (id: string, node: V) => DatabaseCommand<void>,
        removeRel: (id: string, node: V) => DatabaseCommand<void>
    ): NodesPropertySpecification<T, V> {
        return new NodesPropertySpecification<T, V>(
            this.loadDynamic,
            true,
            this.loadFromIds,
            this.loadElements,
            this.loadIds,
            this.loadFromId,
            addRel,
            removeRel
        )
    }

    /**
     * specifies that the property should not handle save
     * in this case, it's (normally) up to the other side
     */
    public noSave(): NodesPropertySpecification<T, V> {
        return new NodesPropertySpecification<T, V>(
            this.loadDynamic,
            false,
            this.loadFromIds,
            this.loadElements,
            this.loadIds,
            this.loadFromId
        )
    }
 }