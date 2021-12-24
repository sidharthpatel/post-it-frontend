import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  /**
   * Constructor that will be called upon execution of the application.
   * @param http Gets data from the update or created post and add it to the backend.
   * @param router Injects router to redirect the page to messages or all the available posts after creating or updating a post.
   */
  constructor(private http: HttpClient, private router: Router) {}
  /**
   * Objects in typescript and javascript are of reference type.
   * When you copy reference types, you are copying the address in memory, not the object itself.
   * To make a true copy of the posts, we will use the Spread Operator.
   * Spread Operator:
   * ... - Takes all the elements of another array and adds it to the new array.
   * It will also prevent any changes to the original array mentioned above.
   */

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    /* asObservable method allows you to listen, but prevent you from emitting. */
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // Expliciting defining the get method to return the type of data to get back.
    // In this case, an ID, Title, and Content.
    return this.http.get<{ _id: string; title: string; content: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);

        // Re-routes the user back to root page, so he can see the post that was newly generated or updated.
        this.router.navigate(['/']);
      });
  }

  /**
   * Updates post upon editing it.
   */
  updatePost(id: string, title: string, content: string) {
    // post to be inserted in the post list
    const post: Post = { id: id, title: title, content: content };
    this.http
      .put('http://localhost:3000/api/posts/' + id, post)
      .subscribe((response) => {
        // Cloned verison of original posts
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex((p) => p.id === post.id);

        // Replace old post with new post
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);

        //Once the post is updated, this segment of code will re-direct page to root path where the user can see the updated post.
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete('http://localhost:3000/api/posts/' + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter((post) => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
