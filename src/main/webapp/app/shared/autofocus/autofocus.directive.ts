/**
 * Created by Lukmanul Hakim on 4/14/2018.
 */

import { Directive, AfterViewInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[jhiAutofocus]'
})
export class AutofocusDirective implements AfterViewInit {

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        this.el.nativeElement.focus();
    }

}
