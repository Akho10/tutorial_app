import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTutorial } from './add-tutorial';

describe('AddTutorial', () => {
  let component: AddTutorial;
  let fixture: ComponentFixture<AddTutorial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTutorial],
    }).compileComponents();

    fixture = TestBed.createComponent(AddTutorial);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
