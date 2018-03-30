export class Page<T> {
    constructor(
        public totalElements?: number,
        public content?: Array<T>,
        public totalPages?: number,
        public last?: boolean,
        public size?: number,
        public numberOfElements?: number
    ) {
    }
}
