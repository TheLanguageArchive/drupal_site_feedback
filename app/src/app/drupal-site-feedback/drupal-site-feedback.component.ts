import { Component, ViewChildren, QueryList, OnInit, Input, ViewChild, Query, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatExpansionPanel, MatInput } from '@angular/material';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { FormInputGroup, FormCaptcha } from '../form-input';
import { DrupalApiService } from '../services/drupal-api.service';
import { FormService } from '../services/form.service';
import { CaptchaService } from '../services/captcha.service';

@Component({
  templateUrl: './drupal-site-feedback.component.html',
  styleUrls: ['./drupal-site-feedback.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('shown', style({opacity: 1, marginBottom: '10px'})),
      state('hidden', style({opacity: 0, marginBottom: '-50px'})),
      transition('* => *', animate('.5s')),
    ]),
    trigger('toggler', [
      transition('hidden <=> shown', [
        style({transform: 'scale(1.5)', opacity: 0}),
        animate('.2s 0s ease-out')
      ])
    ])
  ],
})
export class DrupalSiteFeedbackComponent implements OnInit {

  title        = 'Feedback';
  visibility   = 'hidden';
  done         = [1];
  submitting   = false;
  submitted    = false;
  error        = false;
  success      = false;
  captchaError = false;
  firstShown   = false;

  @Input() url: string;
  @Input() width: number = 300;

  @ViewChildren('panels') panels: QueryList<MatExpansionPanel>;

  formInput: FormInputGroup;
  formManager: FormGroup;

  constructor(private drupalApiService: DrupalApiService, private formService: FormService, private captchaService: CaptchaService) {
  }

  ngOnInit() {

    this.drupalApiService.setUrl(this.url);
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

    if (this.visibility === 'shown' && false === this.firstShown) {

      this.firstShown = true;
      this.captchaService.render(this.formInput);
    }
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
    return this.isSubmitting() && !this.isSuccess() && !this.isError() && !this.isCaptchaError();
  }

  isSuccess() {
    return true === this.success;
  }

  isError() {
    return true === this.error;
  }

  isCaptchaError() {
    return true === this.captchaError;
  }

  submit() {

    this.submitting = true;

    this.drupalApiService
      .submitForm(this.formInput, this.formManager)
      .subscribe(

        (data: any) => {

          console.log(data);
          if (data.type === 'error') {

            if (data.code === DrupalApiService.CAPTCHA_INVALID) {

              this.captchaError = true;
              this.captchaService.resetCaptcha(this.formInput, this.formManager, data.captcha);

            } else {
              this.error = true;
            }

            setTimeout(_ => {

              this.submitting   = false;
              this.submitted    = false;
              this.error        = false;
              this.success      = false;
              this.captchaError = false;

              if (data.code !== DrupalApiService.CAPTCHA_INVALID) {

                this.done = [1];
                this.panels.forEach((panel, idx) => {
                  panel.expanded = idx === 0;
                });
              }

            }, 3000);

          } else {

            this.success = true;

            setTimeout(_ => {
              this.resetForm(data.captcha);
            }, 3000);
          }
        },

        error => {

          this.error = true;

          setTimeout(_ => {

            this.submitting   = false;
            this.submitted    = false;
            this.error        = false;
            this.success      = false;
            this.captchaError = false;

          }, 3000);
        }
      );
  }

  resetForm(captcha: FormCaptcha) {

    this.formManager.reset();

    this.done         = [1];
    this.submitting   = false;
    this.submitted    = false;
    this.error        = false;
    this.success      = false;
    this.captchaError = false;

    this.panels.forEach((panel, idx) => {
      panel.expanded = idx === 0;
    });

    this.captchaService.resetCaptcha(this.formInput, this.formManager, captcha);
  }

  dump(data: any) {
    console.log(data);
  }
}
