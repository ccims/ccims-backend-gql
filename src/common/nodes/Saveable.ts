/**
 * on a saveable, save should be called when the instance should be saved 
 */
export interface Saveable {
    /**
     * saves this savable
     */
    save(): void;
}