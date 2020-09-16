/**
 * base interface of a property, this can be a propety on the many or on the one side
 */
export interface Property<T> {
    /**
     * called to notify a corresponding property that an add update occured
     * @param element the element that added the element on which this property is
     * @param byDatabaseUpdate true if a database update caused this update
     */
    wasAddedBy(element: T, byDatabaseUpdate: boolean): Promise<void>;
    /**
     * called to notify a corresponding property that an remove update occured
     * @param element the element that removed the element on which this property is
     * @param byDatabaseUpdate true if a database update caused this update
     */
    wasRemovedBy(element: T, byDatabaseUpdate: boolean): Promise<void>;
}