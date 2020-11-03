import { Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.sass']
})
export class DialogComponent implements OnInit, OnChanges {
  @Input() title: string | undefined;
  @Input() timeoutMs: number | undefined;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();

  hidden = true;

  constructor() { 
    this.hidden = !this.show;
  }

  ngOnInit(): void {
    if (this.timeoutMs != null) {
      setTimeout(this.close, this.timeoutMs);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.show) {
      this.hidden = false;
    }
  }

  close(): void {
    this.show = false;
    this.onClose.emit();
  }
}
