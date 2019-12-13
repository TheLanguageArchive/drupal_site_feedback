import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';

import { MatCardModule, MatExpansionModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatDividerModule, MatButtonModule } from '@angular/material';
import { MatIconModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';

import { DrupalSiteFeedbackComponent } from './drupal-site-feedback/drupal-site-feedback.component';
import { DrupalApiService } from './services/drupal-api.service';
import { FormService } from './services/form.service';

@NgModule({
  declarations: [
    DrupalSiteFeedbackComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  entryComponents: [DrupalSiteFeedbackComponent],
  providers: [DrupalApiService, FormService],
})
export class AppModule {

  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {

    const feedbackElement = createCustomElement(DrupalSiteFeedbackComponent, {
      injector: this.injector
    });

    customElements.define('drupal-site-feedback', feedbackElement);
  }
}
