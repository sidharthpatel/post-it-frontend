import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

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

  getPosts(postsPerPage: number, currentPage: number) {
    /**
     * `` -> means its a template expression.
     */
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
                creator: post.creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((transformedPostData) => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdateListener() {
    /* asObservable method allows you to listen, but prevent you from emitting. */
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    // Expliciting defining the get method to return the type of data to get back.
    // In this case, an ID, Title, and Content.
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  /** Editing add posts function because up to this point, we were adding content through Json or text-based format, but file uploads do not work that way */
  addPost(title: string, content: string, image: File) {
    // Provided by JS. FormData is a data format which allows us to combine text & blob (file) values.
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    // Params: field name, content, alternative text to refer to the content. Similar to HTML img tag with src and alt.
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData) => {
        // Re-routes the user back to root page, so he can see the post that was newly generated or updated.
        this.router.navigate(['/']);
      });
  }

  /**
   * Updates post upon editing it.
   * Defined image param such that it can either be of type File or String
   */
  updatePost(id: string, title: string, content: string, image: File | string) {
    // post to be inserted in the post list
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe((response) => {
        //Once the post is updated, this segment of code will re-direct page to root path where the user can see the updated post.
        this.router.navigate(['/']);
      });
  }

  /**
   * Delete and refresh posts.
   */
  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }
}
