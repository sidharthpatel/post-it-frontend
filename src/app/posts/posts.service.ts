import {Post} from './post.model';
import {Injectable} from '@angular/core';
/* Event emitter: helps pass around objects in the application, essentially. */
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PostsService{
  /* Initializing the array empty initially. Can set it to undefined too. */
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts() {
    /**
     * Objects in typescript and javascript are of reference type.
     * When you copy reference types, you are copying the address in memory, not the object itself.
     * To make a true copy of the posts, we will use the Spread Operator.
     * Spread Operator:
     * [] - creates a new array.
     * ... - Takes all the elements of another array and adds it to the new array.
     * It will also prevent any changes to the original array mentioned above.
     */
    return [...this.posts];
  }

  getPostUpdateListener() {
    /* asObservable method allows you to listen, but prevent your from emitting. */
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    /* Created a new variable called post */
    const post: Post = {title: title, content: content};
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
