import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { TutorialService } from '../../services/tutorial';
import { Tutorial } from '../../models/tutorial.model';


@Component({
  selector: 'app-tutorials-list',

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './tutorial-list.html',
  styleUrl: './tutorial-list.css'
})
export class TutorialList implements OnInit {

  private readonly tutorialService =
    inject(TutorialService);


  tutorials = signal<Tutorial[]>([]);

  currentTutorial?: Tutorial;

  currentIndex = -1;

  title = '';


  ngOnInit(): void {

    this.retrieveTutorials();
  }


  retrieveTutorials(): void {

    console.log('retrieveTutorials called');

    this.tutorialService.getAll().subscribe({

      next: (data) => {

        console.log(
          'API returned:',
          data
        );

        this.tutorials.set(
          data ?? []
        );
      },

      error: (error) => {

        console.error(
          'Error loading tutorials:',
          error
        );

        this.tutorials.set([]);
      }

    });
  }


  refreshList(): void {

    this.retrieveTutorials();

    this.currentTutorial = undefined;

    this.currentIndex = -1;
  }


  setActiveTutorial(
    tutorial: Tutorial,
    index: number
  ): void {

    this.currentTutorial = tutorial;

    this.currentIndex = index;
  }


  removeAllTutorials(): void {

    this.tutorialService
      .deleteAll()
      .subscribe({

        next: () => {
          this.refreshList();
        },

        error: (error) => {
          console.error(error);
        }

      });
  }


  searchTitle(): void {

    this.currentTutorial = undefined;

    this.currentIndex = -1;

    this.tutorialService
      .findByTitle(this.title)
      .subscribe({

        next: (data) => {

          this.tutorials.set(
            data ?? []
          );
        },

        error: (error) => {

          console.error(error);

          this.tutorials.set([]);
        }

      });
  }

}