import { Component, ViewChildren, QueryList } from '@angular/core';
import { FormInputGroup } from './form-input';

import { DrupalApiService } from './api/drupal.api.service';
import { FormGroup } from '@angular/forms';
import { FormService } from './services/form.service';
import { MatExpansionPanel } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({opacity: 1, marginBottom: '10px'})),
      state('hidden', style({opacity: 0, marginBottom: '-50px'})),
      transition('* => *', animate('.5s')),
    ])
  ],
})
export class AppComponent {

  title      = 'Feedback';
  visibility = 'hidden';
  done       = [1];
  submitting = false;
  submitted  = false;
  error      = false;
  success    = false;

  @ViewChildren('panels') panels: QueryList<MatExpansionPanel>;

  formInput: FormInputGroup;
  formManager: FormGroup;

  constructor(private drupalApiService: DrupalApiService, private formService: FormService) {
  }

  ngOnInit() {

    this.drupalApiService.getForm()
      .subscribe(
        data => {

          this.formInput   = data;
          this.formManager = this.formService.buildManager(this.formInput);
        },
        error => {
          console.log(error);
        }
      );
  }

  validate(key: string) {
    return this.formManager.get(key).valid;
  }

  toggleForm() {
    this.visibility = this.visibility === 'shown' ? 'hidden' : 'shown';
  }

  nextStep(group: FormInputGroup) {

    let idx          = group.order - 1;
    let currentPanel = this.panels.find((_, index) => index === idx);
    let nextPanel    = this.panels.find((_, index) => index === (idx + 1));

    if (!currentPanel || !nextPanel) {

      // could not go to next panel
      return;
    }

    if (this.done.indexOf(group.order + 1) === -1) {
      this.done.push(group.order + 1);
    }

    currentPanel.expanded = false;
    nextPanel.expanded    = true;
  }

  previousStep(group: FormInputGroup) {

    let idx           = group.order - 1;
    let currentPanel  = this.panels.find((panel, index) => index === idx);
    let previousPanel = this.panels.find((panel, index) => index === (idx - 1));

    if (!currentPanel || !previousPanel) {

      // could not go to previous panel
      return;
    }

    currentPanel.expanded  = false;
    previousPanel.expanded = true;
  }

  isPanelDisabled(group: FormInputGroup) {
    return this.done.indexOf(group.order) === -1;
  }

  isPreviousStepButtonDisabled(group: FormInputGroup) {
    return group.order === 1;
  }

  isLastStep(group: FormInputGroup) {
    return group.order === this.formInput.items.length;
  }

  isSubmitting() {
    return true === this.submitting;
  }

  isProcessing() {
    return this.isSubmitting() && !this.isSuccess() && !this.isError();
  }

  isSuccess() {
    return true === this.success;
  }

  isError() {
    return true === this.error;
  }

  submit() {

    this.submitting = true;

    this.drupalApiService
      .submitForm(this.formManager.value)
      .subscribe(

        data => {

          this.success = true;
          console.log(data);
        },

        error => {
          this.error = true;

          setTimeout(_ => {

            this.success    = false;
            this.error      = false;
            this.submitting = false;

          }, 3000);
        }
      );
  }
}
