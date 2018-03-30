import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { PaginationUtil } from 'ng-jhipster';

import { QuestionComponent } from './question.component';
import { QuestionDetailComponent } from './question-detail.component';
import { QuestionPopupComponent } from './question-dialog.component';
import { QuestionDeletePopupComponent } from './question-delete-dialog.component';

import { Principal } from '../../shared';

export const questionRoute: Routes = [
    {
        path: 'question',
        component: QuestionComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eventqApp.question.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'question/:id',
        component: QuestionDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eventqApp.question.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const questionPopupRoute: Routes = [
    {
        path: 'question-new',
        component: QuestionPopupComponent,
        data: {
            // authorities: ['ROLE_USER'],
            authorities: [],
            pageTitle: 'eventqApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question/:id/edit',
        component: QuestionPopupComponent,
        data: {
            // authorities: ['ROLE_USER'],
            authorities: [],
            pageTitle: 'eventqApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'question/:id/delete',
        component: QuestionDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'eventqApp.question.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
