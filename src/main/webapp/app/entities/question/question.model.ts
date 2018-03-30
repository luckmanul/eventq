import {Event} from '../event/event.model';
export class Question {
    constructor(
        public id?: number,
        public title?: string,
        public description?: string,
        public feedback?: string,
        public createDate?: any,
        public eventId?: number,
        public event?: Event
    ) {
    }
}
