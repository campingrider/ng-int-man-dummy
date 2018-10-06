import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { TextContainer } from './text-container';
import { IntManLibService } from './int-man-lib.service';

@Directive({
  selector: '[intmanId]'
})
export class IdDirective implements OnInit {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private intManLibService: IntManLibService
  ) {  }

  textContainer: TextContainer;

  @Input() intmanId: string;


  ngOnInit() {
    this.textContainer = new TextContainer(this.intmanId, this.el.nativeElement, this.renderer, this.intManLibService);
    this.intManLibService.getCurrentLanguage().subscribe(lang => this.textContainer.switchLanguage(lang));
  }

}
