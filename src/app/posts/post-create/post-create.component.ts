import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';

  /**
   * Variable to track two modes: create & edit.
   * create: variable is set to `create` if a post is newly generated component.
   * edit: variable is set to `edit` if its an existing post which needs to be editted/ updated.
   * @default `create`
   */
  private mode = 'create';

  /**
   * Saves the postId fetched from the onInit function to search from the list of posts.
   */
  private postId: string;

  /**
   * Saves the fetched post from service with the help of postId.
   */
  post: Post;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  /**
   * `paramMap` is an observable. Observables pass information between different parts of your application.
   * This obervable fetches parameters from the url link whilst we are on the posts page.
   * Pro: avoids unnecessary re-rendering of the entire component.
   * `subscribe()` is a means to activate the observable.
   * All built in observables never need to unsubscribe.
   *
   * @returns paramMap.get(...) string
   */
  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPosts(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content
      );
    }
    form.resetForm();
  }
}
