import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContentChange, QuillEditorBase, QuillEditorComponent, QuillFormat } from 'ngx-quill';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Post } from '../../services/apiClasses/post';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.sass']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Output() onSubmitError = new EventEmitter<string>();
  @Output() onSubmitSuccess = new EventEmitter<void>();

  editing: boolean = false;
  editContent: string;

  constructor(public auth: AuthService, private api: ApiService) { 
  }

  ngOnInit(): void {
    this.editContent = this.post.content;
  }

  edit(): void {
    if (this.auth.username() === this.post.userId)
      this.editing = true;
  }

  async delete(): Promise<void> {
    const auth = this.auth.auth();

    if (typeof auth !== "string") {
      return;
    }

    const res = await this.api.deletePost(this.post.postId, auth);
    res.match(val => {
      this.onSubmitSuccess.emit();
    },
    err => {
      this.onSubmitError.emit(err);
    });
  }

  async save(): Promise<void> {
    const auth = this.auth.auth();

    if (typeof auth !== "string") {
      this.auth.logout();
      return;
    }

    const res = await this.api.updatePost(this.post.postId, this.editContent, auth);
    res.match(val => {
      this.onSubmitSuccess.emit();
    },
    err => {
      this.onSubmitError.emit(err);
    });
  }

  cancel(): void {
    this.editing = false;
  }

  formatDate(s: string): string {
    try {
      const date = new Date(s);
      return `${date.getMonth().toString().padStart(2, "0")}-${date.getDay().toString().padStart(2, "0")}-${date.getFullYear()} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
    catch (e) {
      return s;
    }
  }
}
