import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {

  constructor(private el: ElementRef,
    private render: Renderer2) { }

  @HostListener('mouseenter') onMouseEnter(){
    this.render.addClass(this.el.nativeElement, 'highlight')
  }

  @HostListener('mouseleave') onMouseLeave(){
    this.render.removeClass(this.el.nativeElement, 'highlight');
  }

}
