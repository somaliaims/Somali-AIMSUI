import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[elFocus]'
})
export class FocusDirective {
  @Input('elFocus') isFocused: boolean;

  constructor(private hostElement: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if (this.isFocused) {
      this.hostElement.nativeElement.focus();
    }
  }

}
