import './vendor.ts';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { EventqSharedModule, UserRouteAccessService } from './shared';
import { EventqHomeModule } from './home/home.module';
import { EventqAdminModule } from './admin/admin.module';
import { EventqAccountModule } from './account/account.module';
import { EventqEntityModule } from './entities/entity.module';
import {EventqQListModule} from './qlist/qlist.module';

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { LoadingModule } from 'ngx-loading';

import {
    JhiMainComponent,
    LayoutRoutingModule,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ActiveMenuDirective,
    ErrorComponent
} from './layouts';

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        LoadingModule,
        EventqSharedModule,
        EventqHomeModule,
        EventqAdminModule,
        EventqAccountModule,
        EventqEntityModule,
        EventqQListModule
    ],
    declarations: [
        JhiMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        ActiveMenuDirective,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ JhiMainComponent ]
})
export class EventqAppModule {}
