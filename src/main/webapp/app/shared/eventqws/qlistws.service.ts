import { Injectable, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs/Rx';

import { CSRFService } from '../auth/csrf.service';
import { WindowRef } from '../tracker/window.service';
import { AuthServerProvider } from '../auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';

@Injectable()
export class QListWSService {
    stompClient = null;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;
    alreadyConnectedOnce = false;
    private subscription: Subscription;
    self: any;

    constructor(
        private router: Router,
        private authServerProvider: AuthServerProvider,
        private $window: WindowRef,
        private csrfService: CSRFService
    ) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
        this.self = this;
    }

    connect(connectCallback) {
        // if (this.connectedPromise === null) {
        //   this.connection = this.createConnection();
        // }
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = '//' + loc.host + loc.pathname + 'websocket/qlist';
        const authToken = this.authServerProvider.getToken();
        if (authToken) {
            url += '?access_token=' + authToken;
        }
        this.connectAndReconnect(url, this.onConnected, connectCallback);
        // const socket = new SockJS(url);
        // this.stompClient = Stomp.over(socket);
        // const headers = {};
        // this.stompClient.connect(headers, () => {
        //     this.connectedPromise('success');
        //     this.connectedPromise = null;
        //     // this.sendActivity();
        //     if (!this.alreadyConnectedOnce) {
        //         this.subscription = this.router.events.subscribe((event) => {
        //           if (event instanceof NavigationEnd) {
        //             // this.sendActivity();
        //           }
        //         });
        //         this.alreadyConnectedOnce = true;
        //     }
        // });
    }

    private connectAndReconnect(url, successCallback, connectCallback) {
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        this.stompClient .connect({}, (frame) => {
            successCallback(this, connectCallback);
        }, () => {
            setTimeout(() => {
                this.connectAndReconnect(url, successCallback, connectCallback);
            }, 30000);
        });
    }

    private onConnected(parent: QListWSService, connectCallback) {
        if (parent.connectedPromise === null) {
            parent.connection = parent.createConnection();
        }
        parent.connectedPromise('success');
        parent.connectedPromise = null;
        // this.sendActivity();
        connectCallback();
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

    receive() {
        return this.listener;
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

    sendActivity() {
        if (this.stompClient !== null && this.stompClient.connected) {
            this.stompClient.send(
                '/topic/qlist-activity', // destination
                JSON.stringify({'page': this.router.routerState.snapshot.url}), // body
                {} // header
            );
        }
    }

    subscribe(eventCode: string) {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe('/topic/qlist-subscriber/' + eventCode, (data) => {
                this.listenerObserver.next(JSON.parse(data.body));
            });
        });
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

    private createListener(): Observable<any> {
        return new Observable((observer) => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => this.connectedPromise = resolve);
    }
}
