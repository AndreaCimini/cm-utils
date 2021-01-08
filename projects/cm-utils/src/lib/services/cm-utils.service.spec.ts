import {TestBed} from '@angular/core/testing';

import {CmUtilsService} from './cm-utils.service';
import {CmUtilsProperty} from '../decorators/cm-utils.decorators';
import {CustomConverter} from '../interfaces/cm-utils.interfaces';
import {Multi, Tuple} from '../types/cm-utils.types';

describe('CmUtilsService', () => {
  let service: CmUtilsService;

  it('should be created', () => {
    service = TestBed.inject(CmUtilsService);
    expect(service).toBeTruthy();
  });

  it('should be UNDEFINED', () => {
    expect(CmUtilsService.isUndefined(undefined)).toBeTruthy();
  });

  it('should be NULL', () => {
    expect(CmUtilsService.isNull(null)).toBeTruthy();
  });

  it('should be NIL', () => {
    expect(CmUtilsService.isNil(null)).toBeTruthy();
    expect(CmUtilsService.isNil(undefined)).toBeTruthy();
  });

  it('should be EMPTY', () => {
    expect(CmUtilsService.isEmpty('')).toBeTruthy();
    expect(CmUtilsService.isEmpty([])).toBeTruthy();
    expect(CmUtilsService.isEmpty({})).toBeTruthy();
  });

  it('should be NILTY', () => {
    expect(CmUtilsService.isNilty(null)).toBeTruthy();
    expect(CmUtilsService.isNilty(undefined)).toBeTruthy();
    expect(CmUtilsService.isNilty('')).toBeTruthy();
    expect(CmUtilsService.isNilty([])).toBeTruthy();
    expect(CmUtilsService.isNilty({})).toBeTruthy();
  });

  it('MERGE ARRAY', () => {
    class ArrayMergeSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string;
    }
    class ArrayMergeClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(String) key2: string;
      @CmUtilsProperty(ArrayMergeSubClass) key3: ArrayMergeSubClass;
      @CmUtilsProperty(ArrayMergeSubClass) key4: ArrayMergeSubClass[];
    }
    const arrayForMerge = [];
    arrayForMerge[0] = new ArrayMergeClass();
    arrayForMerge[0].key1 = 'array0key1';
    arrayForMerge[0].key2 = 'array0key2';
    arrayForMerge[1] = new ArrayMergeClass();
    arrayForMerge[1].key1 = 'array1key1';
    arrayForMerge[1].key2 = 'array1key2';
    arrayForMerge[1].key3 = new ArrayMergeSubClass();
    arrayForMerge[1].key3.subkey1 = 'array1key3subkey1';
    arrayForMerge[1].key3.subkey2 = 'array1key3subkey2';

    const arrayToMerge = [];
    arrayToMerge[0] = new ArrayMergeClass();
    arrayToMerge[0].key1 = 'array0key1';
    arrayToMerge[0].key2 = 'array0key2';
    arrayToMerge[1] = new ArrayMergeClass();
    arrayToMerge[1].key1 = 'array2key1';
    arrayToMerge[1].key3 =  new ArrayMergeSubClass();
    arrayToMerge[1].key3.subkey1 = 'array2key3subkey1';
    arrayToMerge[1].key3.subkey2 = 'array2key3subkey2';

    const arrayMerged = [];
    arrayMerged[0] = new ArrayMergeClass();
    arrayMerged[0].key1 = 'array0key1';
    arrayMerged[0].key2 = 'array0key2';
    arrayMerged[1] = new ArrayMergeClass();
    arrayMerged[1].key1 = 'array2key1';
    arrayMerged[1].key3 =  new ArrayMergeSubClass();
    arrayMerged[1].key3.subkey1 = 'array2key3subkey1';
    arrayMerged[1].key3.subkey2 = 'array2key3subkey2';
    arrayMerged[2] = new ArrayMergeClass();
    arrayMerged[2].key1 = 'array1key1';
    arrayMerged[2].key2 = 'array1key2';
    arrayMerged[2].key3 = new ArrayMergeSubClass();
    arrayMerged[2].key3.subkey1 = 'array1key3subkey1';
    arrayMerged[2].key3.subkey2 = 'array1key3subkey2';


    CmUtilsService.merge(arrayForMerge, arrayToMerge);

    expect(arrayToMerge).toEqual(arrayMerged);
  });

  it('MERGE OBJECT', () => {
    class ObjMergeSubSubClass {
      @CmUtilsProperty(String) subsubkey1: string;
    }

    class ObjMergeSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(ObjMergeSubSubClass) subkey2: ObjMergeSubSubClass;
    }

    class ObjMergeClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjMergeSubClass) key2: ObjMergeSubClass;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
      @CmUtilsProperty(ObjMergeSubClass) key5: ObjMergeSubClass[];
    }
    const sourceObj = new ObjMergeClass();
    sourceObj.key1 = 'key1';
    sourceObj.key2 = new ObjMergeSubClass();
    sourceObj.key2.subkey1 = 'key2subkey1';
    sourceObj.key4 = ['key4array0', 'key4array1', 'key4array3'];
    sourceObj.key5 = [];
    sourceObj.key5[0] = new ObjMergeSubClass();
    sourceObj.key5[0].subkey1 = 'key5array0subkey1';
    sourceObj.key5[1] = new ObjMergeSubClass();
    sourceObj.key5[1].subkey1 = 'key5array1subkey1';

    const destinationObj = new ObjMergeClass();
    destinationObj.key2 = new ObjMergeSubClass();
    destinationObj.key2.subkey1 = 'key2subkey1tooverride';
    destinationObj.key2.subkey2 = new ObjMergeSubSubClass();
    destinationObj.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    destinationObj.key3 = 'key3';
    destinationObj.key4 = ['key4array0', 'key4array1', 'key4array2'];
    destinationObj.key5 = [];
    destinationObj.key5[0] = new ObjMergeSubClass();
    destinationObj.key5[0].subkey1 = 'key5array0subkey1';
    destinationObj.key5[1] = new ObjMergeSubClass();
    destinationObj.key5[1].subkey2 = new ObjMergeSubSubClass();
    destinationObj.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    destinationObj.key5[2] = new ObjMergeSubClass();
    destinationObj.key5[2].subkey1 = 'key5array2subkey1';

    const objMerged = new ObjMergeClass();
    objMerged.key1 = 'key1';
    objMerged.key2 = new ObjMergeSubClass();
    objMerged.key2.subkey1 = 'key2subkey1';
    objMerged.key2.subkey2 = new ObjMergeSubSubClass();
    objMerged.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    objMerged.key3 = 'key3';
    objMerged.key4 = ['key4array0', 'key4array1', 'key4array2', 'key4array3'];
    objMerged.key5 = [];
    objMerged.key5[0] = new ObjMergeSubClass();
    objMerged.key5[0].subkey1 = 'key5array0subkey1';
    objMerged.key5[1] = new ObjMergeSubClass();
    objMerged.key5[1].subkey2 = new ObjMergeSubSubClass();
    objMerged.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    objMerged.key5[2] = new ObjMergeSubClass();
    objMerged.key5[2].subkey1 = 'key5array2subkey1';
    objMerged.key5[3] = new ObjMergeSubClass();
    objMerged.key5[3].subkey1 = 'key5array1subkey1';

    CmUtilsService.merge(sourceObj, destinationObj);

    expect(destinationObj).toEqual(objMerged);
  });

  it('MERGE OBJECT with CUSTOM MERGER', () => {
    class ObjMergeSubSubClass {
      @CmUtilsProperty(String) subsubkey1: string;
    }

    class ObjMergeSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(ObjMergeSubSubClass) subkey2: ObjMergeSubSubClass;
    }

    class ObjMergeClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjMergeSubClass) key2: ObjMergeSubClass;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String, {
        arrayMerger: (a, b, c) => {
          c.shift();
          c.push(a);
        }
      }) key4: string[];
      @CmUtilsProperty(ObjMergeSubClass) key5: ObjMergeSubClass[];
    }
    const sourceObj = new ObjMergeClass();
    sourceObj.key1 = 'key1';
    sourceObj.key2 = new ObjMergeSubClass();
    sourceObj.key2.subkey1 = 'key2subkey1';
    sourceObj.key4 = ['key4array0', 'key4array1'];
    sourceObj.key5 = [];
    sourceObj.key5[0] = new ObjMergeSubClass();
    sourceObj.key5[0].subkey1 = 'key5array0subkey1';
    sourceObj.key5[1] = new ObjMergeSubClass();
    sourceObj.key5[1].subkey1 = 'key5array1subkey1';

    const destinationObj = new ObjMergeClass();
    destinationObj.key2 = new ObjMergeSubClass();
    destinationObj.key2.subkey1 = 'key2subkey1tooverride';
    destinationObj.key2.subkey2 = new ObjMergeSubSubClass();
    destinationObj.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    destinationObj.key3 = 'key3';
    destinationObj.key4 = ['key4array0tooverride', 'key4array1tooverride', 'key4array2'];
    destinationObj.key5 = [];
    destinationObj.key5[0] = new ObjMergeSubClass();
    destinationObj.key5[0].subkey1 = 'key5array0subkey1';
    destinationObj.key5[1] = new ObjMergeSubClass();
    destinationObj.key5[1].subkey2 = new ObjMergeSubSubClass();
    destinationObj.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    destinationObj.key5[2] = new ObjMergeSubClass();
    destinationObj.key5[2].subkey1 = 'key5array2subkey1';

    const objMerged = new ObjMergeClass();
    objMerged.key1 = 'key1';
    objMerged.key2 = new ObjMergeSubClass();
    objMerged.key2.subkey1 = 'key2subkey1';
    objMerged.key2.subkey2 = new ObjMergeSubSubClass();
    objMerged.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    objMerged.key3 = 'key3';
    objMerged.key4 = ['key4array2', 'key4array0', 'key4array1'];
    objMerged.key5 = [];
    objMerged.key5[0] = new ObjMergeSubClass();
    objMerged.key5[0].subkey1 = 'key5array0subkey1';
    objMerged.key5[1] = new ObjMergeSubClass();
    objMerged.key5[1].subkey1 = 'key5array1subkey1';
    objMerged.key5[1].subkey2 = new ObjMergeSubSubClass();
    objMerged.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    objMerged.key5[2] = new ObjMergeSubClass();
    objMerged.key5[2].subkey1 = 'key5array2subkey1';

    const merger = function (a, b, c) {
      if (typeof (a) === 'object') {
        // check if element is present in the recipient array
        if (c.findIndex(elem => CmUtilsService.isEqual(elem, a)) === -1) {
          const elementIndex = b.findIndex(elem => CmUtilsService.isEqual(elem, a));
          if (c[elementIndex]) {
            // override the element at same index
            CmUtilsService.merge(a, c[elementIndex], merger);
          } else {
            // push new element in the recipient array
            c.push(a);
          }
        }
      } else {
        // check if element is present in the recipient array
        if (c.indexOf(a) === -1) {
          const elementIndex = b.indexOf(a);
          if (c[elementIndex]) {
            // override the element at same index
            c[elementIndex] = a;
          } else {
            // push new element in the recipient array
            c.push(a);
          }
        }
      }
    };

    CmUtilsService.merge(sourceObj, destinationObj, merger);

    expect(destinationObj).toEqual(objMerged);
  });

  it('CLONE CLASS', () => {
    class ObjCloneSubSubClass {
      @CmUtilsProperty(String) subsubkey1: string;
    }

    class ObjCloneSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(ObjCloneSubSubClass) subkey2: ObjCloneSubSubClass;
    }

    class ObjCloneClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjCloneSubClass) key2: ObjCloneSubClass;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
      @CmUtilsProperty(ObjCloneSubClass) key5: ObjCloneSubClass[];
    }

    class ObjCloneDifferentSubClass {
      @CmUtilsProperty(String) subkey1: string;
    }

    class ObjCloneDifferentClass {
      @CmUtilsProperty(ObjCloneDifferentSubClass) key2: ObjCloneDifferentSubClass;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
    }

    const objToClone = new ObjCloneClass();
    objToClone.key1 = 'key1';
    objToClone.key2 = new ObjCloneSubClass();
    objToClone.key2.subkey1 = 'key2subkey1';
    objToClone.key2.subkey2 = new ObjCloneSubSubClass();
    objToClone.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    objToClone.key3 = 'key3';
    objToClone.key4 = ['key4array0', 'key4array1', 'key4array2'];
    objToClone.key5 = [];
    objToClone.key5[0] = new ObjCloneSubClass();
    objToClone.key5[0].subkey1 = 'key5array0subkey1';
    objToClone.key5[1] = new ObjCloneSubClass();
    objToClone.key5[1].subkey1 = 'key5array1subkey1';
    objToClone.key5[1].subkey2 = new ObjCloneSubSubClass();
    objToClone.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    objToClone.key5[2] = new ObjCloneSubClass();
    objToClone.key5[2].subkey1 = 'key5array2subkey1';

    const objDifferentClonedForComparison = new ObjCloneDifferentClass();
    objDifferentClonedForComparison.key2 = new ObjCloneDifferentSubClass();
    objDifferentClonedForComparison.key2.subkey1 = 'key2subkey1';
    objDifferentClonedForComparison.key3 = 'key3';
    objDifferentClonedForComparison.key4 = ['key4array0', 'key4array1', 'key4array2'];

    const objCloned = CmUtilsService.cloneClass(objToClone);
    const objDifferentCloned = CmUtilsService.cloneClass(objToClone, ObjCloneDifferentClass);

    expect(objToClone).toEqual(objCloned as ObjCloneClass);
    expect(objDifferentCloned).toEqual(objDifferentClonedForComparison);
  });

  it('should be EQUAL', () => {
    class ObjSubSubClass {
      @CmUtilsProperty(String) subsubkey1: string;
    }

    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(ObjSubSubClass) subkey2: ObjSubSubClass;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
      @CmUtilsProperty(ObjSubClass) key5: ObjSubClass[];
    }

    const objToCompare = new ObjClass();
    objToCompare.key1 = 'key1';
    objToCompare.key2 = new ObjSubClass();
    objToCompare.key2.subkey1 = 'key2subkey1';
    objToCompare.key2.subkey2 = new ObjSubSubClass();
    objToCompare.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1';
    objToCompare.key3 = 'key3';
    objToCompare.key4 = ['key4array0', 'key4array1', 'key4array2'];
    objToCompare.key5 = [];
    objToCompare.key5[0] = new ObjSubClass();
    objToCompare.key5[0].subkey1 = 'key5array0subkey1';
    objToCompare.key5[1] = new ObjSubClass();
    objToCompare.key5[1].subkey1 = 'key5array1subkey1';
    objToCompare.key5[1].subkey2 = new ObjSubSubClass();
    objToCompare.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    objToCompare.key5[2] = new ObjSubClass();
    objToCompare.key5[2].subkey1 = 'key5array2subkey1';

    const objToCompareDifferent = new ObjClass();
    objToCompareDifferent.key1 = 'key1';
    objToCompareDifferent.key2 = new ObjSubClass();
    objToCompareDifferent.key2.subkey1 = 'key2subkey1';
    objToCompareDifferent.key2.subkey2 = new ObjSubSubClass();
    objToCompareDifferent.key2.subkey2.subsubkey1 = 'key2subkey2subsubkey1different';
    objToCompareDifferent.key5 = [];
    objToCompareDifferent.key5[0] = new ObjSubClass();
    objToCompareDifferent.key5[0].subkey1 = 'key5array0subkey1';
    objToCompareDifferent.key5[1] = new ObjSubClass();
    objToCompareDifferent.key5[1].subkey1 = 'key5array1subkey1';
    objToCompareDifferent.key5[1].subkey2 = new ObjSubSubClass();
    objToCompareDifferent.key5[1].subkey2.subsubkey1 = 'key5array1subkey2subsubkey1';
    objToCompareDifferent.key5[2] = new ObjSubClass();
    objToCompareDifferent.key5[2].subkey1 = 'key5array2subkey1';

    expect(CmUtilsService.isEqual(objToCompare, objToCompare)).toEqual(true);
    expect(CmUtilsService.isEqual(objToCompare, objToCompareDifferent)).toEqual(false);
  });

  it('UNIQUE (without Comparator)', () => {
    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(String) key2: string;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
    }

    const objToUnique = [];
    objToUnique[0] = new ObjClass();
    objToUnique[0].key1 = 'key1-0';
    objToUnique[0].key2 = 'key2-0';
    objToUnique[0].key3 = 'key3-0';
    objToUnique[0].key4 = ['key4-0array0', 'key4-0array1', 'key4-0array2'];
    objToUnique[1] = new ObjClass();
    objToUnique[1].key1 = 'key1-0';
    objToUnique[1].key2 = 'key2-0';
    objToUnique[1].key3 = 'key3-0';
    objToUnique[1].key4 = ['key4-0array0', 'key4-0array1', 'key4-0array2'];
    objToUnique[2] = new ObjClass();
    objToUnique[2].key1 = 'key1-2';
    objToUnique[2].key2 = 'key2-2';
    objToUnique[2].key3 = 'key3-2';
    objToUnique[2].key4 = ['key4-2array0', 'key4-2array1', 'key4-2array2'];


    const objAfterUnique = [];
    objAfterUnique[0] = new ObjClass();
    objAfterUnique[0].key1 = 'key1-0';
    objAfterUnique[0].key2 = 'key2-0';
    objAfterUnique[0].key3 = 'key3-0';
    objAfterUnique[0].key4 = ['key4-0array0', 'key4-0array1', 'key4-0array2'];
    objAfterUnique[1] = new ObjClass();
    objAfterUnique[1].key1 = 'key1-2';
    objAfterUnique[1].key2 = 'key2-2';
    objAfterUnique[1].key3 = 'key3-2';
    objAfterUnique[1].key4 = ['key4-2array0', 'key4-2array1', 'key4-2array2'];

    expect(CmUtilsService.uniqueBy(objToUnique)).toEqual(objAfterUnique);
  });

  it('UNIQUE (with Comparator)', () => {
    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(String) key2: string;
      @CmUtilsProperty(String) key3: string;
      @CmUtilsProperty(String) key4: string[];
    }

    const objToUnique = [];
    objToUnique[0] = new ObjClass();
    objToUnique[0].key1 = 'key1-0';
    objToUnique[0].key2 = 'key2-0';
    objToUnique[0].key3 = 'key3-0';
    objToUnique[0].key4 = ['key4-0array0', 'key4-0array1', 'key4-0array2'];
    objToUnique[1] = new ObjClass();
    objToUnique[1].key1 = 'key1-0';
    objToUnique[1].key2 = 'key2-1';
    objToUnique[1].key3 = 'key3-1';
    objToUnique[1].key4 = ['key4-1array0', 'key4-1array1', 'key4-1array2'];
    objToUnique[2] = new ObjClass();
    objToUnique[2].key1 = 'key1-2';
    objToUnique[2].key2 = 'key2-2';
    objToUnique[2].key3 = 'key3-2';
    objToUnique[2].key4 = ['key4-2array0', 'key4-2array1', 'key4-2array2'];


    const objAfterUnique = [];
    objAfterUnique[0] = new ObjClass();
    objAfterUnique[0].key1 = 'key1-0';
    objAfterUnique[0].key2 = 'key2-0';
    objAfterUnique[0].key3 = 'key3-0';
    objAfterUnique[0].key4 = ['key4-0array0', 'key4-0array1', 'key4-0array2'];
    objAfterUnique[1] = new ObjClass();
    objAfterUnique[1].key1 = 'key1-2';
    objAfterUnique[1].key2 = 'key2-2';
    objAfterUnique[1].key3 = 'key3-2';
    objAfterUnique[1].key4 = ['key4-2array0', 'key4-2array1', 'key4-2array2'];

    expect(CmUtilsService.uniqueBy(objToUnique, (a, b) => {
      return b.findIndex(elem => elem.key1 === a.key1) > -1;
    })).toEqual(objAfterUnique);
  });

  it('OBJECT DESERIALIZER', () => {
    class NumberToStringConverter implements CustomConverter<String> {
      serialize(data: String): any {
      }

      deserialize(data: any): String {
        return data.toString().replace('.', ',');
      }

    }

    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String, undefined, {propertyKey: 'subkey2different'}) subkey2: string[];
      @CmUtilsProperty(String, undefined, {propertyType: Number}) subkey3: string;
      @CmUtilsProperty(String, undefined, {propertyType: Number, converter: new NumberToStringConverter()}) subkey4: string;
      @CmUtilsProperty(Number, undefined, {propertyType: new Multi(String, Number)}) subkey5: number;
      @CmUtilsProperty(Number, undefined, {propertyType: new Tuple(String, Number)}) subkey6: [number, number];
    }

    class ObjClass {
      @CmUtilsProperty(String, undefined, {propertyKey: 'key1different'}) key1: string;
      @CmUtilsProperty(ObjSubClass, undefined, {propertyKey: 'key2different'}) key2: ObjSubClass;
      @CmUtilsProperty(Boolean, undefined, {propertyType: String}) key3: boolean;
    }

    const objToDeserialize = {
      key1skipped: 'key1skipped',
      key1different: 'key1',
      key2different: {
        subkey1: 'subkey1',
        subkey2different: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23,
        subkey5: '1.3',
        subkey6: ['1', 4.6]
      },
      key3: 'true'
    };

    const objDeserialized = new ObjClass();
    objDeserialized.key1 = 'key1';
    objDeserialized.key2 = new ObjSubClass();
    objDeserialized.key2.subkey1 = 'subkey1';
    objDeserialized.key2.subkey2 = ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'];
    objDeserialized.key2.subkey3 = '10';
    objDeserialized.key2.subkey4 = '10,23';
    objDeserialized.key2.subkey5 = 1.3;
    objDeserialized.key2.subkey6 = [1, 4.6];
    objDeserialized.key3 = true;

    expect(CmUtilsService.deserializer(objToDeserialize, ObjClass)).toEqual(objDeserialized);
  });

  it('OBJECT SERIALIZER', () => {
    class NumberToStringConverter implements CustomConverter<Number> {
      serialize(data: String): Number {
        return Number(data.replace(',', '.'));
      }

      deserialize(data: Number): String {
        return undefined;
      }

    }

    class ArrayConverter implements CustomConverter<String> {
      serialize(data: String): String {
        return data + '_modified';
      }

      deserialize(data: String): String {
        return undefined;
      }

    }

    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String, undefined, {propertyKey: 'subkey2different', converter: new ArrayConverter()}) subkey2: string[];
      @CmUtilsProperty(String, undefined, {propertyType: Number}) subkey3: string;
      @CmUtilsProperty(String, undefined, {propertyType: Number, converter: new NumberToStringConverter()}) subkey4: string;
      @CmUtilsProperty(Number, undefined, {propertyType: new Tuple(String, Number)}) subkey5: [number, number];
    }

    class ObjClass {
      @CmUtilsProperty(String, undefined, {propertyKey: 'key1different'}) key1: string;
      @CmUtilsProperty(ObjSubClass, undefined, {propertyKey: 'key2different'}) key2: ObjSubClass;
      @CmUtilsProperty(Boolean, undefined, {propertyType: String}) key3: boolean;
    }

    const objSerialized = {
      key1different: 'key1',
      key2different: {
        subkey1: 'subkey1',
        subkey2different: ['subkey2-array0_modified', 'subkey2-array1_modified', 'subkey2-array3_modified'],
        subkey3: 10,
        subkey4: 10.23,
        subkey5: ['1', 2]
      },
      key3: 'true'
    };

    const objToSerialize = new ObjClass();
    objToSerialize.key1 = 'key1';
    objToSerialize.key2 = new ObjSubClass();
    objToSerialize.key2.subkey1 = 'subkey1';
    objToSerialize.key2.subkey2 = ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'];
    objToSerialize.key2.subkey3 = '10';
    objToSerialize.key2.subkey4 = '10,23';
    objToSerialize.key2.subkey5 = [1, 2];
    objToSerialize.key3 = true;

    expect(CmUtilsService.serializer([objToSerialize])).toEqual([objSerialized]);
  });

  it('DEEP FIND OBJECT', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    expect(CmUtilsService.deepFind(obj, 'key2.subkey3')).toEqual(10);
  });

  it('DEEP FIND ARRAY', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    expect(CmUtilsService.deepFind(obj, 'key2.subkey2.1')).toEqual('subkey2-array1');
  });

  it('DEEP UPDATE OBJECT', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    const objectUpdated: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 45,
        subkey4: 10.23
      },
      key3: true
    };

    CmUtilsService.deepUpdate(obj, 'key2.subkey3', 45);

    expect(obj).toEqual(objectUpdated);
  });

  it('DEEP UPDATE ARRAY', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    const objectUpdated: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3-updated'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    CmUtilsService.deepUpdate(obj, 'key2.subkey2.2', 'subkey2-array3-updated');

    expect(obj).toEqual(objectUpdated);
  });

  it('DEEP REMOVE OBJECT', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3?: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    const objectUpdated: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey4: 10.23
      },
      key3: true
    };

    CmUtilsService.deepRemove(obj, 'key2.subkey3');

    expect(obj).toEqual(objectUpdated);
  });

  it('DEEP REMOVE ARRAY', () => {
    class ObjSubClass {
      @CmUtilsProperty(String) subkey1: string;
      @CmUtilsProperty(String) subkey2: string[];
      @CmUtilsProperty(String) subkey3: number;
      @CmUtilsProperty(String) subkey4: number;
    }

    class ObjClass {
      @CmUtilsProperty(String) key1: string;
      @CmUtilsProperty(ObjSubClass) key2: ObjSubClass;
      @CmUtilsProperty(Boolean) key3: boolean;
    }

    const obj: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array0', 'subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    const objectUpdated: ObjClass = {
      key1: 'key1',
      key2: {
        subkey1: 'subkey1',
        subkey2: ['subkey2-array1', 'subkey2-array3'],
        subkey3: 10,
        subkey4: 10.23
      },
      key3: true
    };

    CmUtilsService.deepRemove(obj, 'key2.subkey2.0');

    expect(obj).toEqual(objectUpdated);
  });
});
