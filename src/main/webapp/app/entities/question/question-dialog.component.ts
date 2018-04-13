import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService } from 'ng-jhipster';

import { Question } from './question.model';
import { QuestionPopupService } from './question-popup.service';
import { QuestionService } from './question.service';
import { Event, EventService } from '../event';
import { ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-question-dialog',
    templateUrl: './question-dialog.component.html'
})
export class QuestionDialogComponent implements OnInit {

    question: Question;
    authorities: any[];
    isSaving: boolean;

    events: Event[];

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private questionService: QuestionService,
        private eventService: EventService,
        private eventManager: EventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.eventService.query()
            .subscribe((res: ResponseWrapper) => { this.events = res.json; }, (res: ResponseWrapper) => this.onError(res.json));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
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

        this.eventManager.broadcast({
            name: 'questionListModification',
            content: 'OK',
            item: result
        });
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
    selector: 'jhi-question-popup',
    template: ''
})
export class QuestionPopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QuestionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.modalRef = this.questionPopupService
                    .open(QuestionDialogComponent, params['id']);
            } else {
                this.modalRef = this.questionPopupService
                    .open(QuestionDialogComponent);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
