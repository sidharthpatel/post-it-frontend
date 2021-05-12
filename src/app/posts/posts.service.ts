import {Post} from './post.model';
import {Injectable, ɵgetDebugNode__POST_R3__} from '@angular/core';
/* Event emitter: helps pass around objects in the application, essentially. */
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService{
  /* Initializing the array empty initially. Can set it to undefined too. */
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {

  }
  /**
   * Objects in typescript and javascript are of reference type.
   * When you copy reference types, you are copying the address in memory, not the object itself.
   * To make a true copy of the posts, we will use the Spread Operator.
   * Spread Operator:
   * [] - creates a new array.
   * ... - Takes all the elements of another array and adds it to the new array.
   * It will also prevent any changes to the original array mentioned above.
   */
  
  getPosts() {
    this.http.get<{message: string; posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map(post => {
        return {
          title: post.title,
          content: post.content,
          id: post._id
        }
      });
    }))
    .subscribe((transformedPost) => {
      this.posts = transformedPost;
      this.postsUpdated.next([...this.posts]);
    });
    // return [...this.posts];
  }

  getPostUpdateListener() {
    /* asObservable method allows you to listen, but prevent your from emitting. */
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    /* Created a new variable called post */
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post).pipe().subscribe((responseData) => {
      console.log(responseData.message);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
    
  }
}
