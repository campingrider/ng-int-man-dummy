import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntManLibModule } from 'int-man-lib';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IntManLibModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
