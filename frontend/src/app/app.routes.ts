import { Routes } from '@angular/router';
import { TutorialList } from './components/tutorial-list/tutorial-list';
import { TutorialDetails } from './components/tutorial-details/tutorial-details';
import { AddTutorial } from './components/add-tutorial/add-tutorial';

export const routes: Routes = [
    { path: '', redirectTo: 'tutorials', pathMatch: 'full' },
  { path: 'tutorials', component: TutorialList },
  { path: 'tutorials/:id', component: TutorialDetails },
  { path: 'add', component: AddTutorial }
];
