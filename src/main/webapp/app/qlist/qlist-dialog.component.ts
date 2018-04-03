import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Question } from '../entities/question/question.model';
import { Event } from '../entities/event/event.model';
import { QListPopupService } from './qlist-popup.service';
import { QuestionService } from './qlist.service';
import { EventService } from '../entities/event/event.service';
import { ResponseWrapper } from '../shared';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'jhi-question-dialog',
    templateUrl: './qlist-dialog.component.html'
})
export class QListDialogComponent implements OnInit {

    event: Event;
    question: Question;
    authorities: any[];
    isSaving: boolean;

    events: Event[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private questionService: QuestionService,
        private eventService: EventService,
        private eventManager: EventManager,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        // this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.authorities = [];
        // this.eventService.query()
        //     .subscribe((res: ResponseWrapper) => { this.events = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        this.question.eventId = this.event.id;
        // this.question.event = this.event;
        // this.question.createDate = this.datePipe.transform(this.question.createDate, 'yyyy-MM-ddThh:mm');
        if (this.question.id !== undefined) {
            this.subscribeToSaveResponse(
                this.questionService.update(this.question), false);
        } else {
            this.subscribeToSaveResponse(
                this.questionService.create(this.question), true);
        }
    }

    private subscribeToSaveResponse(result: Observable<Question>, isCreated: boolean) {
        result.subscribe((res: Question) =>
            this.onSaveSuccess(res, isCreated), (res: Response) => this.onSaveError(res));
    }

    private onSaveSuccess(result: Question, isCreated: boolean) {
        this.alertService.success(
            isCreated ? 'eventqApp.question.created'
            : 'eventqApp.question.updated',
            { param : result.id }, null);

        this.eventManager.broadcast({ name: 'questionListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.isSaving = false;
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }

    trackEventById(index: number, item: Event) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-qlist-popup',
    template: ''
})
export class QListPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QListPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['eventId'] ) {
                this.modalRef = this.questionPopupService
                    .openWithDefaultEvent(QListDialogComponent, params['eventId']);
            } else {
                this.modalRef = this.questionPopupService
                    .openWithDefaultEvent(QListDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
