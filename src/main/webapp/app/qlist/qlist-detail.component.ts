import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager  } from 'ng-jhipster';

import { Question } from '../entities/question/question.model';
import { QuestionService } from './qlist.service';

@Component({
    selector: 'jhi-qlist-detail',
    templateUrl: './qlist-detail.component.html'
})
export class QListDetailComponent implements OnInit, OnDestroy {

    question: Question;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: EventManager,
        private questionService: QuestionService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInQuestions();
    }

    load(id) {
        this.questionService.find(id).subscribe((question) => {
            this.question = question;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInQuestions() {
        this.eventSubscriber = this.eventManager.subscribe(
            'questionListModification',
            (response) => this.load(this.question.id)
        );
    }
}
