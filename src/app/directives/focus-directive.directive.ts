import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[elFocus]'
})
export class FocusDirectiveDirective {
  @Input('elFocus') isFocused: boolean;

  constructor(private hostElement: ElementRef, private renderer: Renderer) { }

  ngOnInit() {
    if (this.isFocused) {
      this.renderer.invokeElementMethod(this.hostElement.nativeElement, 'focus');
    }
  }

}
