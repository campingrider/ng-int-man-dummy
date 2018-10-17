import { NgModule } from '@angular/core';
import { IntManLibComponent } from './int-man-lib.component';
import { AdminComponent } from './admin/admin.component';
import { IdDirective } from './id.directive';
import { SwitcherComponent } from './switcher/switcher.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AdminLanguageComponent } from './admin-language/admin-language.component';
import { AdminTranslationComponent } from './admin-translation/admin-translation.component';

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
    SwitcherComponent,
    AdminLanguageComponent,
    AdminTranslationComponent],
  exports: [AdminComponent, SwitcherComponent, IdDirective]
})
export class IntManLibModule { }
