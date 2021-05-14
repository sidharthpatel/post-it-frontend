import { Component, Input, OnInit, OnDestroy } from "@angular/core";

import {Post} from '../post.model';
import { PostsService } from "../posts.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'First Post', content: 'This is the first post\'s content'},
  //   {title: 'Second Post', content: 'This is the second post\'s content'},
  //   {title: 'Third Post', content: 'This is the second post\'s content'},
  // ];

  // @Input() posts: Post[] = [];
  posts: Post[] = [];
  private postsSub: Subscription;

  // postsService: PostsService;
  /* Dependency Injection */
  // constructor(postsService: PostsService) {
  //   this.postsService = postsService;
  // }

  /* Simpler version of what is written above. */
  constructor(public postsService: PostsService) {}

  /* special onInit method. */
  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}

/**
 * What is the CORS error (Cross Origin Resource Sharing)?
 * Our client, angular, and our server, server.js, want to talk to each other. Unfortunately they are not on the same path or localhost: port <-
 * If they were, we would be able to communicate without any issues. 
 * The reason why it can't is due to security mechanism.
 * Solution: disable this mechanism in Server-side code.
 */