import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { TutorialService } from
  '../../services/tutorial';

import { Tutorial } from
  '../../models/tutorial.model';


@Component({
  selector: 'app-tutorial-details',

  imports: [
    FormsModule
  ],

  templateUrl: './tutorial-details.html',
  styleUrl: './tutorial-details.css'
})
export class TutorialDetails implements OnInit {

  private readonly tutorialService =
    inject(TutorialService);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  tutorial = signal<Tutorial | null>(null);

  message = signal('');


  ngOnInit(): void {

    const idParam =
      this.route.snapshot.paramMap.get('id');

    console.log('Route id:', idParam);


    if (idParam === null) {

      console.error(
        'No tutorial ID found in the URL'
      );

      return;
    }


    const id = Number(idParam);

    console.log(
      'Loading tutorial id:',
      id
    );


    this.getTutorial(id);
  }


  getTutorial(id: number): void {

    this.tutorialService.get(id).subscribe({

      next: (data) => {

        console.log(
          'Tutorial received:',
          data
        );

        this.tutorial.set(data);
      },

      error: (error) => {

        console.error(
          'Error loading tutorial:',
          error
        );

        this.tutorial.set(null);
      }

    });
  }


  updatePublished(status: boolean): void {

    const current =
      this.tutorial();

    if (!current?.id) {
      return;
    }


    const updatedTutorial =
      new Tutorial(
        current.title,
        current.description,
        status,
        current.id
      );


    this.tutorialService
      .update(
        current.id,
        updatedTutorial
      )
      .subscribe({

        next: (data) => {

          this.tutorial.set(data);

          this.message.set(
            'The status was updated successfully.'
          );
        },

        error: (error) => {

          console.error(error);
        }

      });
  }


  updateTutorial(): void {

    const current =
      this.tutorial();

    if (!current?.id) {
      return;
    }


    this.tutorialService
      .update(
        current.id,
        current
      )
      .subscribe({

        next: (data) => {

          this.tutorial.set(data);

          this.message.set(
            'The tutorial was updated successfully.'
          );
        },

        error: (error) => {

          console.error(error);
        }

      });
  }


  deleteTutorial(): void {

    const current =
      this.tutorial();

    if (!current?.id) {
      return;
    }


    this.tutorialService
      .delete(current.id)
      .subscribe({

        next: () => {

          this.router.navigate([
            '/tutorials'
          ]);
        },

        error: (error) => {

          console.error(error);
        }

      });
  }

}