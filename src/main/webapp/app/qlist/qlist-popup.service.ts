import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Question } from '../entities/question/question.model';
import { Event } from '../entities/event/event.model';
import { QuestionService } from './qlist.service';
import { EventService } from '../entities/event/event.service';

@Injectable()
export class QListPopupService {
    private isOpen = false;
    constructor(
        private datePipe: DatePipe,
        private modalService: NgbModal,
        private router: Router,
        private questionService: QuestionService,
        private eventService: EventService

    ) {}

    open(component: Component, id?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (id) {
            this.questionService.find(id).subscribe((question) => {
                question.createDate = this.datePipe
                    .transform(question.createDate, 'yyyy-MM-ddThh:mm');
                this.questionModalRef(component, question, null);
            });
        } else {
            return this.questionModalRef(component, new Question(), null);
        }
    }

    openWithDefaultEvent(component: Component, eventId?: number | any): NgbModalRef {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;

        if (eventId) {
            this.eventService.find(eventId).subscribe((event) => {
                event.createDate = this.datePipe
                    .transform(event.createDate, 'yyyy-MM-ddThh:mm');
                this.questionModalRef(component, new Question(), event);
            });
        } else {
            return this.questionModalRef(component, new Question(), null);
        }
    }

    questionModalRef(component: Component, question: Question, event: Event): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.question = question;
        modalRef.componentInstance.event = event;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.isOpen = false;
        });
        return modalRef;
    }
}
