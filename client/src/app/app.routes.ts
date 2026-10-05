import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ListsComponent } from './components/lists/lists.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './components/errors/test-errors/test-errors.component';
import { NotFoundComponent } from './components/errors/not-found/not-found.component';
import { ServerErrorComponent } from './components/errors/server-error/server-error.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
     ]
  },
  { path: 'register', component: RegisterComponent },
  { path: 'members', component: MemberListComponent },
  { path: 'members/:id', component: MemberDetailComponent },
  { path: 'errors', component: TestErrorsComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },

  { path: '**', component: NotFoundComponent, pathMatch: 'full' }
  
];
