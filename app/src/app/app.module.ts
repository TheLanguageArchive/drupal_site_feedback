import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule, MatExpansionModule, MatFormFieldModule } from '@angular/material';
import { MatInputModule, MatDividerModule, MatButtonModule } from '@angular/material';
import { MatIconModule, MatListModule, MatProgressSpinnerModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DrupalApiService } from './api/drupal.api.service';
import { FormService } from './services/form.service';

@NgModule({
  declarations: [
    AppComponent,
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
  providers: [DrupalApiService, FormService],
  bootstrap: [AppComponent]
})
export class AppModule { }
