import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// pipes
import {IsUndefinedPipe, IsNullPipe, IsNilPipe, IsEmptyPipe, IsNiltyPipe} from './pipes/cm-utils.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    IsUndefinedPipe,
    IsNullPipe,
    IsNilPipe,
    IsEmptyPipe,
    IsNiltyPipe
  ],
  exports: [
    IsUndefinedPipe,
    IsNullPipe,
    IsNilPipe,
    IsEmptyPipe,
    IsNiltyPipe
  ]
})

export class CmUtilsModule {

}
