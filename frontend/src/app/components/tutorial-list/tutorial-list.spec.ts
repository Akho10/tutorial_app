import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorialList } from './tutorial-list';

describe('TutorialList', () => {
  let component: TutorialList;
  let fixture: ComponentFixture<TutorialList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialList],
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
