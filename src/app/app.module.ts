import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { IntManLibModule } from 'int-man-lib';
import { SwitcherComponent, IdDirective } from 'projects/int-man-lib/src/public_api';

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
