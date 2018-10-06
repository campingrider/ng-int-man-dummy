import { NgModule } from '@angular/core';
import { IntManLibComponent } from './int-man-lib.component';
import { AdminComponent } from './admin/admin.component';
import { IdDirective } from './id.directive';
import { SwitcherComponent } from './switcher/switcher.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [
    IntManLibComponent,
    AdminComponent,
    IdDirective,
    SwitcherComponent],
  exports: [AdminComponent, SwitcherComponent, IdDirective]
})
export class IntManLibModule { }
