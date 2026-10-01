import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailComponent } from './components/members/member-detail/member-detail.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ListsComponent } from './components/lists/lists.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'members', component: MemberListComponent },
  { path: 'members/:id', component: MemberDetailComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'lists', component: ListsComponent },

  { path: '**', redirectTo: '' },
  
];
