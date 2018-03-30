import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from '../entities/event/event.model';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import {Question} from '../entities/question/question.model';
import { QuestionService } from './qlist.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../shared';
import { PaginationConfig } from '../blocks/config/uib-pagination.config';
import {EventService} from '../entities/event/event.service';
import {DatePipe} from '@angular/common';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'jhi-qlist',
    templateUrl: './qlist.component.html'
})
export class QListComponent implements OnInit, OnDestroy {

    static EVENTCODE: string;
    eventCode: string;
    event: Event;
    showQuestion: boolean;
    public loading: boolean;
    questions: Question[];
    currentAccount: any;
    eventSubscriber: Subscription;
    itemsPerPage: number;
    links: any;
    page: any;
    predicate: any;
    queryCount: any;
    reverse: any;
    totalItems: number;

    constructor(
        private questionService: QuestionService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private parseLinks: ParseLinks,
        private principal: Principal,
        private eventService: EventService,
        private datePipe: DatePipe
    ) {
        this.showQuestion = false;
        this.loading = false;
        this.questions = [];
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 0;
        this.links = {
            last: 0
        };
        this.predicate = 'id';
        this.reverse = true;
    }

    loadAll() {
        this.questionService.query({
            page: this.page,
            size: this.itemsPerPage,
            sort: this.sort()
        }).subscribe(
            (res: ResponseWrapper) => this.onSuccess(res.json, res.headers),
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    regEvent(code: string) {
        this.eventCode = code;
        QListComponent.EVENTCODE = code;
        this.loading = true;
        this.eventService.findByCode(code).subscribe((event) => {
            event.createDate = this.datePipe
                .transform(event.createDate, 'yyyy-MM-ddThh:mm');
            this.event = event;
            this.reset();
        }, (event) => {
            this.showQuestion = false;
            this.alertService.error('Event is not found');
        });
    }

    reset() {
        this.page = 0;
        this.questions = [];
        this.loadAll();
    }

    loadPage(page) {
        this.page = page;
        this.loadAll();
    }
    ngOnInit() {
        if (!isNullOrUndefined(QListComponent.EVENTCODE)) {
            this.regEvent(QListComponent.EVENTCODE);
        }
        // this.loadAll();
        // this.principal.identity().then((account) => {
        //     this.currentAccount = account;
        // });
        this.registerChangeInQuestions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Question) {
        return item.id;
    }
    registerChangeInQuestions() {
        this.eventSubscriber = this.eventManager.subscribe('questionListModification', (response) => this.reset());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.questions.push(data[i]);
        }
        this.showQuestion = true;
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
        this.showQuestion = false;
    }
}
