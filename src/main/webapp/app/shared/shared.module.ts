import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import {
    EventqSharedLibsModule,
    EventqSharedCommonModule,
    CSRFService,
    AuthServerProvider,
    AccountService,
    UserService,
    StateStorageService,
    LoginService,
    LoginModalService,
    Principal,
    JhiTrackerService,
    HasAnyAuthorityDirective,
    JhiLoginModalComponent
} from './';
import {QListWSService} from '../shared/eventqws/qlistws.service';
import {QManageWSService} from '../shared/eventqws/qmanagews.service';
import {WebsocketService} from './websocket/websocket.service';
import {AutofocusDirective} from './autofocus/autofocus.directive';

@NgModule({
    imports: [
        EventqSharedLibsModule,
        EventqSharedCommonModule
    ],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        AutofocusDirective
    ],
    providers: [
        CookieService,
        LoginService,
        LoginModalService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        JhiTrackerService,
        AuthServerProvider,
        UserService,
        DatePipe,
        QListWSService,
        QManageWSService,
        WebsocketService
    ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        EventqSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        AutofocusDirective,
        DatePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class EventqSharedModule {}
