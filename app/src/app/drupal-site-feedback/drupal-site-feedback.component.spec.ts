import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrupalSiteFeedbackComponent } from './drupal-site-feedback.component';

describe('DrupalSiteFeedbackComponent', () => {
  let component: DrupalSiteFeedbackComponent;
  let fixture: ComponentFixture<DrupalSiteFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrupalSiteFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrupalSiteFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
