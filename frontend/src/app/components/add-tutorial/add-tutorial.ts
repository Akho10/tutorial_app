import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TutorialService } from '../../services/tutorial';

import { Tutorial } from
  '../../models/tutorial.model';

@Component({
  selector: 'app-add-tutorial',

  imports: [
    FormsModule
  ],

  templateUrl: './add-tutorial.html',
  styleUrl: './add-tutorial.css'
})
export class AddTutorial {

  private readonly tutorialService =
    inject(TutorialService);


  tutorial = new Tutorial(
    '',
    '',
    false
  );


  submitted = false;


  saveTutorial(): void {

    this.tutorialService
      .create(this.tutorial)
      .subscribe({

        next: (data) => {

          this.tutorial = data;

          this.submitted = true;

          console.log(data);
        },

        error: (error) => {
          console.error(error);
        }
      });
  }


  newTutorial(): void {

    this.submitted = false;

    this.tutorial = new Tutorial(
      '',
      '',
      false
    );
  }
}