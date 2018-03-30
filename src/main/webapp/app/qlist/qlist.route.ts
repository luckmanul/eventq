import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QListComponent } from './qlist.component';
import { QListDetailComponent } from './qlist-detail.component';
import { QListPopupComponent } from './qlist-dialog.component';

import { Principal } from '../shared';

export const questionRoute: Routes = [
    {
        path: 'qlist',
        component: QListComponent,
        data: {
            authorities: [],
            pageTitle: 'eventqApp.question.home.title'
        }
        // ,canActivate: [UserRouteAccessService]
    }, {
        path: 'qlist/:id',
        component: QListDetailComponent,
        data: {
            authorities: [],
            pageTitle: 'eventqApp.question.home.title'
        }
        // ,canActivate: [UserRouteAccessService]
    }
];

export const questionPopupRoute: Routes = [
    {
        path: 'qlist-new/:eventId',
        component: QListPopupComponent,
        data: {
            authorities: [],
            pageTitle: 'eventqApp.question.home.title'
        },
        // canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
