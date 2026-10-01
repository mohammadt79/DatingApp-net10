import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-output-child',
  standalone: true,
  templateUrl: './input-output-child.component.html',
  styleUrl: './input-output-child.component.css',
})
export class InputOutputChildComponent {
  @Input() parentName = '';
  @Output() notifyParent = new EventEmitter<string>();

  sendMessageToParent() {
    this.notifyParent.emit(`سلام ${this.parentName}! این پیام از Child آمده است.`);
  }
}