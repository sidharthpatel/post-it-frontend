import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';
/**
 * `path: 'edit/:postId`
 * Generating a dynamic element referred to as `/:postId`
 */
const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard],
  },
  // Lazy loading login and signup paths
  // {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((module) => {
        return module.AuthModule;
      }),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
