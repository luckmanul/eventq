import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertService, EventManager } from 'ng-jhipster';

import { Question } from './question.model';
import { QuestionPopupService } from './question-popup.service';
import { QuestionService } from './question.service';

@Component({
    selector: 'jhi-question-delete-dialog',
    templateUrl: './question-delete-dialog.component.html'
})
export class QuestionDeleteDialogComponent {

    question: Question;

    constructor(
        private questionService: QuestionService,
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.questionService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'questionListModification',
                content: 'Deleted an question'
            });
            this.activeModal.dismiss(true);
        });
        this.alertService.success('eventqApp.question.deleted', { param : id }, null);
    }
}

@Component({
    selector: 'jhi-question-delete-popup',
    template: ''
})
export class QuestionDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private questionPopupService: QuestionPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.questionPopupService
                .open(QuestionDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
