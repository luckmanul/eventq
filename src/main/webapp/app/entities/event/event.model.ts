export class Event {
    constructor(
        public id?: number,
        public code?: string,
        public name?: string,
        public type?: string,
        public description?: string,
        public createDate?: any,
        public questionsId?: number
    ) {
    }
}
