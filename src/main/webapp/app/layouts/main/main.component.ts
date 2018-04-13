import {Component, OnInit, OnDestroy} from '@angular/core';
import { Router, ActivatedRouteSnapshot, NavigationEnd, RoutesRecognized } from '@angular/router';

import { JhiLanguageService } from 'ng-jhipster';
import { JhiLanguageHelper, StateStorageService } from '../../shared';
import { WebsocketService } from '../../shared/websocket/websocket.service';

@Component({
    selector: 'jhi-main',
    templateUrl: './main.component.html'
})
export class JhiMainComponent implements OnInit, OnDestroy {

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private router: Router,
        private $storageService: StateStorageService,
        private websocketService: WebsocketService
    ) {
        // Just for forcing translation loading
        jhiLanguageService.setLocations(['all']);
    }

    private getPageTitle(routeSnapshot: ActivatedRouteSnapshot) {
        let title: string = (routeSnapshot.data && routeSnapshot.data['pageTitle']) ? routeSnapshot.data['pageTitle'] : 'eventqApp';
        if (routeSnapshot.firstChild) {
            title = this.getPageTitle(routeSnapshot.firstChild) || title;
        }
        return title;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.jhiLanguageHelper.updateTitle(this.getPageTitle(this.router.routerState.snapshot.root));
            }
        });
        this.websocketService.connect();
    }

    ngOnDestroy() {
        this.websocketService.unsubscribeManage();
        this.websocketService.unsubscribePublic();
        this.websocketService.disconnect();
    }
}
