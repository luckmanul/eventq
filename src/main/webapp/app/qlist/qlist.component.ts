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
import {QListWSService} from '../shared/eventqws/qlistws.service';
import {QManageWSService} from '../shared/eventqws/qmanagews.service';
import {Page} from './page.model';
import {LocalStorageService} from 'ng2-webstorage/dist/app';

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

    likes: Map<string, boolean> = new Map<string, boolean>();

    constructor(
        private questionService: QuestionService,
        private alertService: AlertService,
        private eventManager: EventManager,
        private parseLinks: ParseLinks,
        private principal: Principal,
        private eventService: EventService,
        private datePipe: DatePipe,
        private qListWSService: QListWSService,
        private qManageWSService: QManageWSService,
        private $localStorage: LocalStorageService
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
        this.questionService.queryPublish({
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
            this.subscribeWebSocket(this.event.code);
        }, (event) => {
            this.showQuestion = false;
            this.alertService.error('Event is not found');
        });
    }

    subscribeWebSocket(eventCode: string) {
        this.qListWSService.subscribe(eventCode);
        this.qListWSService.receive().subscribe(
            (pageQuestion: Page<Question>) => {
                console.log('message {}', pageQuestion);
                this.page = 0;
                this.questions = [];
                this.links = '';
                // this.links = this.parseLinks.parse(headers.get('link'));
                this.totalItems = pageQuestion.totalElements;
                for (let i = 0; i < pageQuestion.content.length; i++) {
                    this.questions.push(pageQuestion.content[i]);
                }
                this.showQuestion = true;
            }
        );
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
        this.qListWSService.connect();
        this.qManageWSService.connect();
        // this.loadAll();
        // this.principal.identity().then((account) => {
        //     this.currentAccount = account;
        // });
        this.registerChangeInQuestions();
        const json: string = this.$localStorage.retrieve('likes');
        this.likes = this.jsonToMap(json);
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.qListWSService.unsubscribe();
    }

    trackId(index: number, item: Question) {
        return item.id;
    }

    registerChangeInQuestions() {
        this.eventSubscriber = this.eventManager.subscribe('questionListModification', (response) => {
            this.qListWSService.sendQListActivity(this.eventCode, this.page, this.itemsPerPage);
            this.qManageWSService.sendQManageActivity(this.eventCode, this.page, this.itemsPerPage);
            // this.reset()
        });
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    public likeButtonEnabled(question: Question): boolean {
        return this.likes.get(question.eventId + '_' + question.id);
    }

    public like(question: Question) {
        this.likes.set(question.eventId + '_' + question.id, true);
        this.$localStorage.clear('likes');
        // this.$localStorage.store('likes', this.likes);
        // this.$localStorage.store('likes', JSON.stringify(this.likes));
        // let likesJson: string = this.mapToString(this.likes);
        const likesJson: string = this.mapToJson(this.likes);
        this.$localStorage.store('likes', likesJson);
        this.questionService.like(question.id).subscribe((result: boolean) => {
            console.log('Result like {}', result);
            this.qListWSService.sendQListActivity(this.eventCode, this.page, 100000);
            this.qManageWSService.sendQManageActivity(this.eventCode, this.page, 100000);
        }, (err: any) => {
            console.log('Result dislike {}', err);
        });
    }

    public dislike(question: Question) {
        this.likes.set(question.eventId + '_' + question.id, false);
        this.$localStorage.clear('likes');
        // this.$localStorage.store('likes', this.likes);
        // let likesJson: string = this.mapToString(this.likes);
        const likesJson: string = this.mapToJson(this.likes);
        this.$localStorage.store('likes', likesJson);
        this.questionService.dislike(question.id).subscribe((result: boolean) => {
            console.log('Result dislike {}', result);
            this.qListWSService.sendQListActivity(this.eventCode, this.page, 100000);
            this.qManageWSService.sendQManageActivity(this.eventCode, this.page, 100000);
        }, (err: any) => {
            console.log('Result dislike {}', err);
        });
    }

    mapToJson(map): string {
            const result: string = JSON.stringify(
                Array.from(map.entries()).reduce((o, [key, value]) => {
                        o[key] = value;
                        return o;
                    }, {})
            );
            return result;
    }

    jsonToMap(jsonStr): Map<string, boolean> {
        const obj = JSON.parse(jsonStr);
        return this.objToMap(obj);
    }

    objToMap(obj) {
        const result = new Map();
        for (const key of Object.keys(obj)) {
            result.set(key, obj[key]);
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
