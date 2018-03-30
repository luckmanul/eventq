import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { EventqSharedModule } from '../shared';
import {
    QuestionService,
    QListPopupService,
    QListComponent,
    QListDetailComponent,
    QListDialogComponent,
    QListPopupComponent,
    questionRoute,
    questionPopupRoute,
} from './';

const ENTITY_STATES = [
    ...questionRoute,
    ...questionPopupRoute,
];

@NgModule({
    imports: [
        EventqSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        QListComponent,
        QListDetailComponent,
        QListDialogComponent,
        QListPopupComponent
    ],
    entryComponents: [
        QListComponent,
        QListDialogComponent,
        QListPopupComponent
    ],
    providers: [
        QuestionService,
        QListPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventqQListModule {}
