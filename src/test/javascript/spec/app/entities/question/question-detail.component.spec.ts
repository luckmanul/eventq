import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateUtils, DataUtils, EventManager } from 'ng-jhipster';
import { EventqTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { QuestionDetailComponent } from '../../../../../../main/webapp/app/entities/question/question-detail.component';
import { QuestionService } from '../../../../../../main/webapp/app/entities/question/question.service';
import { Question } from '../../../../../../main/webapp/app/entities/question/question.model';

describe('Component Tests', () => {

    describe('Question Management Detail Component', () => {
        let comp: QuestionDetailComponent;
        let fixture: ComponentFixture<QuestionDetailComponent>;
        let service: QuestionService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [EventqTestModule],
                declarations: [QuestionDetailComponent],
                providers: [
                    DateUtils,
                    DataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    QuestionService,
                    EventManager
                ]
            }).overrideTemplate(QuestionDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(QuestionDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(QuestionService);
        });


        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Question(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.question).toEqual(jasmine.objectContaining({id:10}));
            });
        });
    });

});
