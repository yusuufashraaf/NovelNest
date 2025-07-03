import {
  Directive,
  ElementRef,
  Input,
  HostListener,
  Output,
  EventEmitter
} from '@angular/core';

@Directive({
  selector: '[appAuthDirective]'
})
export class AuthDirective {
  @Input() appAuthDirective!: string;
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>(); 

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    const regex = new RegExp(this.appAuthDirective);
    this.isValid.emit(regex.test(inputValue));
  }
}
