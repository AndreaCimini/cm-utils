import {Pipe, PipeTransform} from '@angular/core';

import {CmUtilsService} from '../services/cm-utils.service';

@Pipe({
  name: 'isUndefined',
  pure: false
})
export class IsUndefinedPipe implements PipeTransform {
  constructor() {
  }

  transform(content) {
    return CmUtilsService.isUndefined(content);
  }
}

@Pipe({
  name: 'isNull',
  pure: false
})
export class IsNullPipe implements PipeTransform {
  constructor() {
  }

  transform(content) {
    return CmUtilsService.isNull(content);
  }
}

@Pipe({
  name: 'isNil',
  pure: false
})
export class IsNilPipe implements PipeTransform {
  constructor() {
  }

  transform(content) {
    return CmUtilsService.isNil(content);
  }
}

@Pipe({
  name: 'isEmpty',
  pure: false
})
export class IsEmptyPipe implements PipeTransform {
  constructor() {
  }

  transform(content) {
    return CmUtilsService.isEmpty(content);
  }
}

@Pipe({
  name: 'isNilty',
  pure: false
})
export class IsNiltyPipe implements PipeTransform {
  constructor() {
  }

  transform(content) {
    return CmUtilsService.isNilty(content);
  }
}
