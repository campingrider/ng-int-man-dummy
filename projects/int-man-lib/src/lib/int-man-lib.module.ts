import { NgModule } from '@angular/core';
import { IntManLibComponent } from './int-man-lib.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
  imports: [
  ],
  declarations: [IntManLibComponent, AdminComponent],
  exports: [AdminComponent]
})
export class IntManLibModule { }
