/**
 * Information about a specific page
 */
export class PageInfo {

    public constructor(
        /**
         * `true` iff, there is another page with the current filter
         */
        public readonly hasNextPage: boolean,

        /**
         * `true` iff, there is a previous page with the current filter
         */
        public readonly hasPreviousPage: boolean,

        /**
         * The first cursor on the current page
         */
        public readonly startCursor?: string,

        /**
         * The last cursor on the current page
         */
        public readonly endCursor?: string,
    ) {

    }
}