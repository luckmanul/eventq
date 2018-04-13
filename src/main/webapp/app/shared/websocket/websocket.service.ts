import { Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs/Rx';

import { CSRFService } from '../auth/csrf.service';
import { WindowRef } from '../tracker/window.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';
import {EventManager, AlertService} from 'ng-jhipster/index';

@Injectable()
export class WebsocketService {
    stompClient = null;
    subscriberPublic = null;
    subscriberManage = null;
    connection: Promise<any>;
    connectedPromise: any;

    // user authenticated
    listenerManage: Observable<any>;
    listenerManageObserver: Observer<any>;

    // anonymous
    listenerPublic: Observable<any>;
    listenerPublicObserver: Observer<any>;

    alreadyConnectedOnce = false;
    private subscription: Subscription;
    self: any;

    constructor(
        private router: Router,
        private authServerProvider: AuthServerProvider,
        private $window: WindowRef,
        private csrfService: CSRFService,
        private eventManager: EventManager,
        private alertService: AlertService
    ) {
        this.connection = this.createConnection();
        this.listenerManage = this.createManageListener();
        this.listenerPublic = this.createPublicListener();
        this.self = this;
    }

    connect() {
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = '//' + loc.host + loc.pathname + 'websocket/qlist';
        const authToken = this.authServerProvider.getToken();
        if (authToken) {
            url += '?access_token=' + authToken;
        }
        this.connectAndReconnect(url, this.connectionSuccessCallback);
    }

    private connectAndReconnect(url, successCallback) {
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        this.stompClient .connect({}, (frame) => {
            successCallback(this);
        }, () => {
            this.eventManager.broadcast({ name: 'websocketConnection', content: 'DISCONNECTED'});
            setTimeout(() => {
                this.connectAndReconnect(url, successCallback);
            }, 30000);
        });
    }

    private connectionSuccessCallback(parent: WebsocketService) {
        if (parent.connectedPromise === null) {
            parent.connection = parent.createConnection();
        }
        parent.connectedPromise('success');
        parent.connectedPromise = null;
        // this.sendActivity();
        // connectCallback();
        parent.eventManager.broadcast({ name: 'websocketConnection', content: 'CONNECTED'});
        if (!parent.alreadyConnectedOnce) {
            parent.subscription = parent.router.events.subscribe((event) => {
                if (event instanceof NavigationEnd) {
                    // this.sendActivity();
                }
            });
            parent.alreadyConnectedOnce = true;
        }
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.alreadyConnectedOnce = false;
    }

    receiveManage() {
        return this.listenerManage;
    }

    receivePublic() {
        return this.listenerPublic;
    }

    sendQListActivity(eventCode: string, page: number, itemsPerPage: number) {
        if (this.stompClient !== null && this.stompClient.connected) {
            this.stompClient.send(
                '/topic/qlist-activity/' + eventCode,
                JSON.stringify( { 'eventCode' : eventCode, 'page': page, 'size': itemsPerPage } ), // body
                {} // header
            );
        }
    }

    sendQManageActivity(eventCode: string, page: number, itemsPerPage: number) {
        if (this.stompClient !== null && this.stompClient.connected) {
            this.stompClient.send(
                '/topic/qmanage-activity',
                JSON.stringify( { 'eventCode' : eventCode, 'page': page, 'size': itemsPerPage } ), // body
                {} // header
            );
        }
    }

    subscribePublic(eventCode: string) {
        this.connection.then(() => {
            this.subscriberPublic = this.stompClient.subscribe('/topic/qlist-subscriber/' + eventCode, (data) => {
                this.listenerPublicObserver.next(JSON.parse(data.body));
            });
        });
    }

    subscribeManage() {
        this.connection.then(() => {
            this.subscriberManage = this.stompClient.subscribe('/topic/qmanage-subscriber', (data) => {
                this.listenerManageObserver.next(JSON.parse(data.body));
            });
        });
    }

    unsubscribePublic() {
        if (this.subscriberPublic !== null) {
            this.subscriberPublic.unsubscribe();
        }
        this.listenerPublic = this.createPublicListener();
    }

    unsubscribeManage() {
        if (this.subscriberManage !== null) {
            this.subscriberManage.unsubscribe();
        }
        this.listenerManage = this.createManageListener();
    }

    private createManageListener(): Observable<any> {
        return new Observable((observer) => {
            this.listenerManageObserver = observer;
        });
    }

    private createPublicListener(): Observable<any> {
        return new Observable((observer) => {
            this.listenerPublicObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => this.connectedPromise = resolve);
    }
}
