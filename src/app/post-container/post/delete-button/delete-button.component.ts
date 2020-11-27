import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.sass']
})
export class DeleteButtonComponent implements OnInit {
  confirm: boolean = false;
  @Output() onClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onClickDelete() {
    this.confirm = true;
  }

  onClickCancel() {
    this.confirm = false;
  }

  onClickConfirm() {
    this.confirm = false;
    this.onClick.emit();
  }

}
