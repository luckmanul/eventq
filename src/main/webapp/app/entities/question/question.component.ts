import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { EventManager, ParseLinks, PaginationUtil, JhiLanguageService, AlertService } from 'ng-jhipster';

import { Question } from './question.model';
import { QuestionService } from './question.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';
// import { PaginationConfig } from '../../blocks/config/uib-pagination.config';
import {DatePipe} from '@angular/common';
// import {QListWSService} from '../../shared/eventqws/qlistws.service';
// import {QManageWSService} from '../../shared/eventqws/qmanagews.service';
import {Page} from '../../qlist/page.model';
import {WebsocketService} from '../../shared/websocket/websocket.service';
import {isNullOrUndefined} from 'util';

@Component({
    selector: 'jhi-question',
    templateUrl: './question.component.html'
})
export class QuestionComponent implements OnInit, OnDestroy {

    questions: Question[];
    currentAccount: any;
    eventSubscriber: Subscription;
    websocketConnectionSubscriber: Subscription;
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
        private datePipe: DatePipe,
        private websocketService: WebsocketService
    ) {
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
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInQuestions();
        this.loadAll();
        this.subscribeWebSocket();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
        this.eventManager.destroy(this.websocketConnectionSubscriber);
    }

    trackId(index: number, item: Question) {
        return item.id;
    }

    registerChangeInQuestions() {
        this.eventSubscriber = this.eventManager.subscribe('questionListModification', (response) => {
            console.log('Question Change event : {}', response);
            if (!isNullOrUndefined(response) && !isNullOrUndefined(response.item)) {
                const question: Question = response.item;
                this.websocketService.sendQListActivity(question.event.code, 0, 1000000);
            }
            this.reset();
        });
        this.websocketConnectionSubscriber = this.eventManager.subscribe('websocketConnection', (response) => {
            console.log('websocket connection response {}', response);
            if (!isNullOrUndefined(response)) {
                if ('CONNECTED' === response.content) {
                    this.subscribeWebSocket();
                    // this.alertService.addAlert({
                    //     type: 'info',
                    //     msg: 'websocket.connected',
                    //     params: {},
                    //     timeout: 10000,
                    //     toast: true
                    // }, []);
                } else {
                    this.unsubscribeWebSocket();
                    // this.alertService.addAlert({
                    //     type: 'info',
                    //     msg: 'websocket.disconnected',
                    //     params: {},
                    //     timeout: 10000,
                    //     toast: true
                    // }, []);
                }
            }
        });
    }

    subscribeWebSocket() {
        this.websocketService.subscribeManage();
        this.websocketService.receiveManage().subscribe(
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
            }
        );
    }

    unsubscribeWebSocket() {
        this.websocketService.unsubscribeManage();
        // this.websocketService.unsubscribePublic();
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    publish(question: Question) {
        question.publish = true;
        question.createDate = this.datePipe.transform(question.createDate, 'yyyy-MM-ddThh:mm');
        this.save(question);
    }

    unpublish(question: Question) {
        question.publish = false;
        question.createDate = this.datePipe.transform(question.createDate, 'yyyy-MM-ddThh:mm');
        this.save(question);
    }

    save(question: Question) {
        this.questionService.update(question).subscribe(
            (res: Question) => {
                this.reset();
                this.websocketService.sendQListActivity(question.event.code, 0, 1000000);
            }, (res: Response) => {
                this.onError({ message: 'Update failed'});
            });
    }

    private onSuccess(data, headers) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = headers.get('X-Total-Count');
        for (let i = 0; i < data.length; i++) {
            this.questions.push(data[i]);
        }
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }
}
