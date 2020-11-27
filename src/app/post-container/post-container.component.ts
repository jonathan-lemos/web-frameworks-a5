import { Component, OnInit } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { ApiService } from '../services/api.service';
import { Post } from '../services/apiClasses/post';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.sass']
})
export class PostContainerComponent implements OnInit {

  posts: Post[] | undefined = undefined;

  newPostTitle: string = "";
  newPostContent: string = "";

  error: string = "";
  errorTitle: string = "";

  constructor(public auth: AuthService, private api: ApiService) { }

  async ngOnInit(): Promise<void> {
    const auth = this.auth.auth();

    const res = await this.api.getPosts(auth ?? undefined);
    res.match(val => {
      this.posts = val.sort((a, b) => b.lastUpdated.localeCompare(a.lastUpdated));
    },
    err => {
      this.errorTitle = "Could not get posts";
      this.error = err;
    });
  }

  onUpdateSuccess(): void {
    this.ngOnInit();
  }

  onUpdateError(s: string): void {
    this.errorTitle = "Could not update post";
    this.error = s;
  }

  async addPost(): Promise<void> {
    const auth = this.auth.auth();

    if (typeof auth !== "string") {
      this.auth.logout();
      return;
    }

    const res = await this.api.addPost(this.newPostTitle, this.newPostContent, "", auth);
    res.match(val => {
      this.newPostTitle = "";
      this.newPostContent = "";
      this.ngOnInit();
    },
    err => {
      this.errorTitle = "Could not add post";
      this.error = err;
    });
  }
}
