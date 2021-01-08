import {Injectable} from '@angular/core';
import {CustomConverter, MappingOptions} from '../interfaces/cm-utils.interfaces';
import {Settings} from '../enumerations/cm-utils.enumerations';
import {Any, Multi, Tuple} from '../types/cm-utils.types';

@Injectable({
  providedIn: 'root'
})
export class CmUtilsService {

  private static getMappingProperty(obj: any, key: string): MappingOptions {
    return obj[Settings.MAPPING_PROPERTY][key];
  }

  private static getMappingPropertyFromConversionKey(obj: any, conversionKey: string): MappingOptions {
    const mappingProperties = obj[Settings.MAPPING_PROPERTY];
    // loop over keys and find that mapping property that has conversion key equals to the input one
    for (const mappingKey of Object.keys(mappingProperties)) {
      if (!CmUtilsService.isNil((mappingProperties[mappingKey] as MappingOptions).conversionMap) &&
        (mappingProperties[mappingKey] as MappingOptions).conversionMap.propertyKey === conversionKey) {
        return mappingProperties[mappingKey];
      }
    }
    return undefined;
  }

  /**
   * Checks if input parameter is undefined
   *
   * @parameter item
   * @returns true: if undefined, false: otherwise
   */
  static isUndefined(item: any): boolean {
    return item === undefined;
  }

  /**
   * Checks if input parameter is null
   *
   * @parameter item
   * @returns true: if null, false: otherwise
   */
  static isNull(item: any): boolean {
    return item === null;
  }

  /**
   * Checks if input parameter is undefined or null
   *
   * @parameter item
   * @returns true: if undefined or null, false: otherwise
   */
  static isNil(item: any): boolean {
    return CmUtilsService.isNull(item) || CmUtilsService.isUndefined(item);
  }

  /**
   * Checks if input parameter is empty (string, array or object)
   *
   * @parameter item
   * @returns true: if empty, false: otherwise
   */
  static isEmpty(item: any): boolean {
    if (!CmUtilsService.isNil(item)) {
      if (typeof (item) === 'string') {
        return item === '';
      } else if (typeof (item) === 'object') {
        if (Array.isArray(item)) {
          return item.length === 0;
        } else {
          return Object.keys(item).length === 0;
        }
      }
    } else {
      console.log('WARNING: The input parameter is undefined or null');
      return false;
    }
  }

  /**
   * Checks if input parameter is null, undefined or empty (string, array or object)
   *
   * @parameter item
   * @returns true: if null, undefined or empty, false: otherwise
   */
  static isNilty(item: any): boolean {
    return CmUtilsService.isNull(item) || CmUtilsService.isUndefined(item) || CmUtilsService.isEmpty(item);
  }

  /**
   * Default merger for arrays
   *
   * @parameter element: source element
   * @parameter sourceArray: source array
   * @parameter destinationArray: destination array
   */
  private static defaultMerger(elem: any, destinationArray: any[]) {
    if (typeof (elem) === 'object') {
      // check if element is present in the destination array
      if (destinationArray.findIndex(d => CmUtilsService.isEqual(d, elem)) === -1) {
        // push new element in the destination array
        destinationArray.push(elem);
      }
    } else {
      // check if element is present in the destination array
      if (destinationArray.indexOf(elem) === -1) {
        // push new element in the destination array
        destinationArray.push(elem);
      }
    }
  }

  /**
   * Merge source array into destination array
   * Attention: the elements of the destination array will be overwrite by those of the source array
   *
   * @parameter sourceItem: source array
   * @parameter destinationItem: destination array
   * @parameter merger: function to manage the merge operation for the arrays
   */
  private static mergeArray(sourceItem: any[], destinationItem: any[],
                               merger?: (a: any, b: any[], c: any[]) => void): void {
    if (!CmUtilsService.isNil(sourceItem) && !CmUtilsService.isNil(destinationItem)) {
      sourceItem.forEach((element, index) => {
        if (!CmUtilsService.isNil(element)) {
          if (Array.isArray(element)) {
            destinationItem[index] = !CmUtilsService.isNil(destinationItem[index]) ? destinationItem[index] : [];
            CmUtilsService.mergeArray(element, destinationItem[index], merger);
          } else if (merger) {
            merger(element, sourceItem, destinationItem);
          } else {
            CmUtilsService.defaultMerger(element, destinationItem);
          }
        }
      });
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Merge source object into destination object
   *
   * @parameter sourceItem: source object
   * @parameter destinationItem: destination object
   * @parameter merger: function to manage the merge operation for the arrays
   */
  private static mergeObj(sourceItem: any, destinationItem: any,
                  merger?: (a: any, b: any[], c: any[]) => void): void {
    if (!CmUtilsService.isNil(sourceItem) && !CmUtilsService.isNil(destinationItem)) {
      for (const key of Object.keys(sourceItem)) {
        // get property definition (property name and property type)
        const sourceItemMpPr = CmUtilsService.getMappingProperty(sourceItem, sourceItem.constructor.name + '.' + key);
        const destinationItemMpPr = CmUtilsService.getMappingProperty(destinationItem, destinationItem.constructor.name + '.' + key);
        if (!CmUtilsService.isNil(sourceItem[key]) && !CmUtilsService.isNilty(sourceItemMpPr) &&
          !CmUtilsService.isNilty(destinationItemMpPr)) {
          // check if property type is the same for source object and destination object
          if (sourceItemMpPr.classPropertyType === destinationItemMpPr.classPropertyType) {
            if (typeof (sourceItem[key]) === 'object' && !CmUtilsService.isNil(destinationItem[key])) {
              if (Array.isArray(sourceItem[key])) {
                CmUtilsService.mergeArray(sourceItem[key], destinationItem[key],
                  sourceItemMpPr.customFunctions.arrayMerger ? sourceItemMpPr.customFunctions.arrayMerger : merger);
              } else {
                CmUtilsService.mergeObj(sourceItem[key], destinationItem[key],
                  sourceItemMpPr.customFunctions.arrayMerger ? sourceItemMpPr.customFunctions.arrayMerger : merger);
              }
            } else {
              destinationItem[key] = sourceItem[key];
            }
          } else {
            console.log('WARNING: The property ' + key + ' has different type in source object and destination object:' +
              'it will be skipped');
          }
        } else {
          if (CmUtilsService.isNil(sourceItem[key])) {
            console.log('WARNING: The property ' + key + ' of source obj is undefined or null: it will be skipped');
          } else if (CmUtilsService.isNilty(sourceItemMpPr)) {
            console.log('WARNING: CmUtilsProperty is not defined for the property ' + key + ' of source object: it will be skipped');
          } else if (CmUtilsService.isNilty(destinationItemMpPr)) {
            console.log('WARNING: CmUtilsProperty is not defined for the property ' + key + ' of destination object: it will be skipped');
          }
        }
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Merge source item into destination item
   *
   * @parameter sourceItem: source item
   * @parameter destinationItem: destination item
   * @parameter merger: function to manage the merge operation for the arrays
   */
  static merge(sourceItem: any, destinationItem: any,
                             merger?: (a: any, b: any[], c: any[]) => void): void {
    if (!CmUtilsService.isNil(sourceItem) && !CmUtilsService.isNil(destinationItem)) {
      if (Array.isArray(sourceItem) && Array.isArray(destinationItem)) {
        CmUtilsService.mergeArray(sourceItem, destinationItem, merger);
      } else if (typeof sourceItem === 'object' && typeof  destinationItem === 'object') {
        CmUtilsService.mergeObj(sourceItem, destinationItem, merger);
      } else {
        console.log('WARNING: Both input must be of the same types');
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Clone item
   *
   * @param itemToClone: item to clone
   * @param classIntoClone: different class of result item
   */
  static cloneClass(itemToClone: any, classIntoClone?: new() => any): any {
    let itemCloned;
    if (!CmUtilsService.isNil(itemToClone)) {
      if (typeof (itemToClone) === 'object') {
        if (!Array.isArray(itemToClone)) {
          const classConstructor = CmUtilsService.isNilty(classIntoClone) ? itemToClone.constructor : classIntoClone;
          itemCloned = new classConstructor();
          for (const key of Object.keys(itemToClone)) {
            const elemMpPr = CmUtilsService.getMappingProperty(itemCloned, itemCloned.constructor.name + '.' + key);
            if (!CmUtilsService.isNilty(elemMpPr)) {
              itemCloned[key] = CmUtilsService.cloneClass(itemToClone[key], elemMpPr.classPropertyType);
            } else {
              console.log('WARNING: CmUtilsProperty is not defined for the property ' + key + ': it will be skipped');
            }
          }
        } else {
          itemCloned = [];
          itemToClone.forEach((elem) => {
            const classConstructor = CmUtilsService.isNilty(classIntoClone) ? undefined : classIntoClone;
            itemCloned.push(CmUtilsService.cloneClass(elem, classConstructor));
          });
        }
      } else {
        itemCloned = itemToClone;
      }
    } else {
      console.log('WARNING: The object to clone is undefined or null');
    }

    return itemCloned;
  }

  /**
   * Check if two object are equal
   *
   * @param itemForComparison: object for comparison
   * @param itemToCompare: object to compare
   * @returns true: if they are the same, false: otherwise
   */
  static isEqual(itemForComparison: any, itemToCompare: any): boolean {
    let isEqualBoolean = true;
    if (typeof (itemForComparison) === typeof (itemToCompare)) {
      if (typeof (itemForComparison) === 'object' && !CmUtilsService.isNil(itemForComparison) && !CmUtilsService.isNil(itemToCompare)) {
        if (!Array.isArray(itemForComparison)) {
          for (const key of Object.keys(itemForComparison)) {
            // get property definition (property name an property type)
            const itemForCompareMpPr = CmUtilsService.getMappingProperty(itemForComparison, itemForComparison.constructor.name + '.' + key);
            const itemToCompareMpPr = CmUtilsService.getMappingProperty(itemToCompare, itemToCompare.constructor.name + '.' + key);
            if (!CmUtilsService.isNilty(itemForCompareMpPr) && !CmUtilsService.isNilty(itemToCompareMpPr)) {
              // check if property type is the same for source object and destination object
              if (itemForCompareMpPr.classPropertyType === itemToCompareMpPr.classPropertyType) {
                if (isEqualBoolean === true) {
                  isEqualBoolean = CmUtilsService.isEqual(itemForComparison[key], itemToCompare[key]);
                } else {
                  break;
                }
              } else {
                console.log('WARNING: The property ' + key + ' has different type in source object and destination object');
                isEqualBoolean = false;
                break;
              }
            } else {
              if (CmUtilsService.isNilty(itemForCompareMpPr)) {
                console.log('WARNING: CmUtilsProperty is not defined for the property ' + key + ' of source object');
              } else if (CmUtilsService.isNilty(itemToCompareMpPr)) {
                console.log('WARNING: CmUtilsProperty is not defined for the property ' + key + ' of destination object');
              }
              isEqualBoolean = false;
              break;
            }
          }
        } else {
          if (itemForComparison.length === itemToCompare.length) {
            itemForComparison.forEach((elem, index) => {
              if (isEqualBoolean === true) {
                isEqualBoolean = CmUtilsService.isEqual(elem, itemToCompare[index]);
              } else {
                return false;
              }
            });
          } else {
            isEqualBoolean = false;
          }
        }
      } else {
        isEqualBoolean = itemForComparison === itemToCompare;
      }
    } else {
      isEqualBoolean = false;
    }
    return isEqualBoolean;
  }

  /**
   * Check for duplicates in array and remove them through the function chosen as input parameter
   * @param array: input array
   * @param comparator: function to manage the unique operation for the arrays
   * @returns the array without duplicates
   */
  static uniqueBy(array: any[], comparator?: (a: any, b: any[]) => boolean): any[] {
    const uniqueArray: any[] = [];

    for (const elem of array) {
      if (typeof (elem) === 'object') {
        // array of objects or array of arrays
        if (CmUtilsService.isNilty(comparator)) {
          if (uniqueArray.findIndex(u => CmUtilsService.isEqual(u, elem)) === -1) {
            uniqueArray.push(elem);
          }
        } else {
          if (!comparator(elem, uniqueArray)) {
            uniqueArray.push(elem);
          }
        }
      } else {
        // array of strings or numbers
        if (uniqueArray.indexOf(elem) === -1) {
          uniqueArray.push(elem);
        }
      }
    }
    return uniqueArray;
  }

  /**
   * Convert a variable into a specific type
   * @param operation: define the type of the operation
   * @param name: variable name
   * @param value: input value
   * @param destinationType: type of the variable serialized
   * @param propertyType: type of the variable to be serialized
   * @param converter: custom converter used for serialization
   * @returns convert a variable from type to another
   */
  private static variableConverter(operation: 'serialize' | 'deserialize', name: string, value, destinationType, propertyType,
                                            converter?: CustomConverter<any>): any {

    const stringConverter = function(dT, n: string, v) {
      if (dT === Number) {
        return Number(v);
      } else if (dT === Boolean) {
        return v === 'true';
      } else {
        console.log('WARNING: destination type for variable ' + n +
          ' has no primitive type (String, Number, Boolean, Any, Multi or Tuple)');
        return null;
      }
    };

    const numberConverter = function(dT, n: string, v) {
      if (dT === String) {
        return v.toString();
      } else if (dT === Boolean) {
        console.log('WARNING: conversion from Number to Boolean isn\'t possible for variable ' + n);
        return null;
      } else {
        console.log('WARNING: destination type for variable ' + n +
          ' has no primitive type (String, Number, Boolean, Any, Multi or Tuple)');
        return null;
      }
    };

    const booleanConverter = function(dT, n: string, v) {
      if (dT === String) {
        return v.toString();
      } else if (dT === Number) {
        console.log('WARNING: conversion from Boolean to Number isn\'t possible for variable ' + n);
        return null;
      } else {
        console.log('WARNING: destination type for variable ' + n +
          ' has no primitive type (String, Number, Boolean, Any, Multi or Tuple)');
        return null;
      }
    };

    const anyConverter = function(dT, v) {
      if (dT === String) {
        return v.toString();
      } else if (dT === Number) {
        return Number(v);
      } else if (dT === Boolean) {
        return v === true || v === 'true';
      }
    };

    const multiConverter = function(dT, n: string, v) {
      try {
        if (dT === String) {
          return v.toString();
        } else if (dT === Number) {
          return Number(v);
        } else if (dT === Boolean) {
          return v === true || v === 'true';
        } else {
          console.log('WARNING: destination type for variable ' + n +
            ' has no primitive type (String, Number, Boolean, Any, Multi or Tuple)');
          return null;
        }
      } catch (e) {
        console.log('WARNING: conversion isn\'t possible for variable ' + n, e);
        return null;
      }
    };

    if (CmUtilsService.isNil(value)) {
      return value;
    }
    if (converter) { // converter case
      return operation === 'serialize' ? converter.serialize(value) : converter.deserialize(value);
    } else { // no converter case
      if (destinationType === propertyType || destinationType === Any) { // same type conversion
        return value;
      } else if (destinationType instanceof Multi && propertyType instanceof Multi) { // multi type conversion
        // check if propertyType types are the same of destinationType types
        if (destinationType.types.length === propertyType.types.length &&
          destinationType.types.filter(dTV => propertyType.types.includes(dTV)).length === destinationType.types.length) {
          return value;
        }
        console.log('WARNING: variable ' + name + ' has a Multi types definition different from input one');
        return null;
      } else if (destinationType instanceof Multi && !(propertyType instanceof Multi)) { // multi type conversion
        // check if propertyType is present in destinationType types
        if (destinationType.types.indexOf(propertyType) > -1) {
          return value;
        }
        console.log('WARNING: variable ' + name + ' has a type not present in Multi types definition');
        return null;
      } else {
        try {
          // we have six primitive types: Number, String, Boolean, Any, Multi and Tuple
          if (propertyType === String) { // case string
            return stringConverter(destinationType, name, value);
          } else if (propertyType === Number) { // case number
            return numberConverter(destinationType, name, value);
          } else if (propertyType === Boolean) { // case boolean
            return booleanConverter(destinationType, name, value);
          } else if (propertyType === Any) { // case any
            return anyConverter(destinationType, value);
          } else if (propertyType instanceof Multi) { // case multi - for example: a property that can be string or number
            return multiConverter(destinationType, name, value);
          } else {
            console.log('WARNING: variable ' + name + ' has no primitive type (String, Number, Boolean, Any, Multi or Tuple)');
            return null;
          }
        } catch (e) {
          console.log('WARNING: variable ' + name + ' conversion error');
          console.log(e);
        }
      }
    }
  }

  /**
   * Convert an array into a specific class
   * @param array: input array
   * @param destinationType: type of the array deserialized
   * @param propertyType: type of the array to be deserialized
   * @param propertyName: name of the property whose value is the array to be deserialized
   * @param converter: custom converter used for deserialization
   * @returns the class array converted from the array in input
   */
  private static arrayDeserializer(array: any[], destinationType, propertyType, propertyName: string,
                                         converter?: CustomConverter<any>): any[] {
    if (!CmUtilsService.isNil(array) && !CmUtilsService.isNil(destinationType)) {
      // instantiate class
      const arrayDeserialized: any[] = [];

      // case tuple - for example an array where first element is a string and second element is a number
      // if one or both properties (source and destination) have Tuple definition, the types (in Tuple definition) and array must have the
      // same length
      if ((propertyType instanceof Tuple && !(destinationType instanceof Tuple) && propertyType.types.length !== array.length)
        || (destinationType instanceof Tuple && !(propertyType instanceof Tuple) && destinationType.types.length !== array.length)
        || (propertyType instanceof Tuple && destinationType instanceof Tuple && propertyType.types.length !==
          destinationType.types.length)) {
        console.log('WARNING: JSON array has different length respect to ' + propertyName + ' definition');
        return arrayDeserialized;
      }

      array.forEach((element, index) => {
        if (!CmUtilsService.isNil(element)) {
          // case tuple - for example an array where first element is a string and second element is a number
          const currPropertyType = propertyType instanceof Tuple ? propertyType.types[index] : propertyType;
          const currDestinationType = destinationType instanceof Tuple ? destinationType.types[index] : destinationType;
          if (typeof (element) === 'object') {
            if (Array.isArray(element)) {
              arrayDeserialized.push(CmUtilsService.arrayDeserializer(element, currDestinationType, currPropertyType,
                propertyName + '.' + index, converter));
            } else {
              arrayDeserialized.push(CmUtilsService.objectDeserializer(element, currDestinationType,
                propertyName + '.' + index, converter));
            }
          } else {
            arrayDeserialized.push(CmUtilsService.variableConverter('deserialize', propertyName + '.' + index, element,
              currDestinationType, currPropertyType, converter));
          }
        }
      });
      return arrayDeserialized;
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Convert an object into a specific class
   * @param object: input object
   * @param destinationClass: class of the object deserialized
   * @param propertyName: name of the property whose value is the object to be deserialized
   * @param converter: custom converter used for deserialization
   * @returns the class object converted from the object in input
   */
  private static objectDeserializer(object: any, destinationClass: new() => any, propertyName: string,
                                    converter?: CustomConverter<any>): any {
    if (!CmUtilsService.isNil(object) && !CmUtilsService.isNil(destinationClass)) {
      // instantiate class
      const objectDeserialized: any = new destinationClass();
      for (const key of Object.keys(object)) {
        // get property definition (property name and property type)
        const destinationItemMpPr = CmUtilsService.getMappingPropertyFromConversionKey(objectDeserialized, key);
        if (!CmUtilsService.isNilty(destinationItemMpPr) && !CmUtilsService.isNil(object[key])) {
          if (typeof (object[key]) === 'object') {
            if (Array.isArray(object[key])) {
              objectDeserialized[destinationItemMpPr.classPropertyName] =
                CmUtilsService.arrayDeserializer(object[key], destinationItemMpPr.classPropertyType,
                  destinationItemMpPr.conversionMap.propertyType, propertyName + '.' +
                  destinationItemMpPr.conversionMap.propertyKey, destinationItemMpPr.conversionMap.converter);
            } else {
              objectDeserialized[destinationItemMpPr.classPropertyName] =
                CmUtilsService.objectDeserializer(object[key], destinationItemMpPr.classPropertyType,
                  propertyName + '.' + destinationItemMpPr.conversionMap.propertyKey,
                  destinationItemMpPr.conversionMap.converter ? destinationItemMpPr.conversionMap.converter : converter);
            }
          } else {
            objectDeserialized[destinationItemMpPr.classPropertyName] = CmUtilsService.variableConverter('deserialize', key, object[key],
              destinationItemMpPr.classPropertyType, destinationItemMpPr.conversionMap.propertyType,
              destinationItemMpPr.conversionMap.converter ? destinationItemMpPr.conversionMap.converter : converter);
          }
        } else if (CmUtilsService.isNilty(destinationItemMpPr)) {
          console.log('WARNING: Property Map or Conversion Map are not defined for the property ' + key + ' of destination object: it will be skipped');
        } else if (CmUtilsService.isNil(object[key])) {
          console.log('WARNING: The property ' + key + ' of source obj is undefined or null: it will be skipped');
        }
      }
      return objectDeserialized;
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Convert a json into a specific class
   * @param item: input json
   * @param destinationClass: class of the item deserialized
   * @returns the class converted from the item in input
   */
  static deserializer(item: any, destinationClass: new() => any): any {
    if (!CmUtilsService.isNil(item) && !CmUtilsService.isNilty(destinationClass)) {
      if (Array.isArray(item)) {
        return CmUtilsService.arrayDeserializer(item, destinationClass, Any, 'root');
      } else if (typeof item === 'object') {
        return CmUtilsService.objectDeserializer(item, destinationClass, 'root');
      } else {
        console.log('WARNING: Input item must be an object or an array');
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Convert a specific class into an array
   * @param array: input array
   * @param destinationType: type of the array serialized
   * @param propertyName: name of the property whose value is the array to be serialized
   * @param propertyType: type of the array to be serialized
   * @param converter: custom converter used for serialization
   * @returns the array converted from the input class array
   */
  private static arraySerializer(array: any[], destinationType, propertyType,
                                         propertyName: string, converter?: CustomConverter<any>): any[] {
    if (!CmUtilsService.isNil(array) && !CmUtilsService.isNil(destinationType)) {
      // instantiate class
      const arraySerialized: any[] = [];

      // case tuple - for example an array where first element is a string and second element is a number
      // if one or both properties (source and destination) have Tuple definition, the types (in Tuple definition) and array must have the
      // same length
      if ((propertyType instanceof Tuple && !(destinationType instanceof Tuple) && propertyType.types.length !== array.length)
        || (destinationType instanceof Tuple && !(propertyType instanceof Tuple) && destinationType.types.length !== array.length)
        || (propertyType instanceof Tuple && destinationType instanceof Tuple && propertyType.types.length !==
          destinationType.types.length)) {
        console.log('WARNING: JSON array has different length respect to ' + propertyName + ' definition');
        return arraySerialized;
      }

      array.forEach((element, index) => {
        if (!CmUtilsService.isNil(element)) {
          // case tuple - for example an array where first element is a string and second element is a number
          const currPropertyType = propertyType instanceof Tuple ? propertyType.types[index] : propertyType;
          const currDestinationType = destinationType instanceof Tuple ? destinationType.types[index] : destinationType;
          if (typeof (element) === 'object') {
            if (Array.isArray(element)) {
              arraySerialized.push(CmUtilsService.arraySerializer(element, destinationType, currDestinationType, propertyName +
                '.' + index, converter));
            } else {
              arraySerialized.push(CmUtilsService.objectSerializer(element, propertyName + '.' + index, converter));
            }
          } else {
            arraySerialized.push(CmUtilsService.variableConverter('serialize', propertyName + '.' + index, element,
              currDestinationType, currPropertyType, converter));
          }
        }
      });
      return arraySerialized;
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Convert a specific class into an object
   * @param object: input object
   * @param propertyName: name of the property whose value is the object to be serialized
   * @param converter: custom converter used for serialization
   * @returns the corresponding object of the class in input
   */
  private static objectSerializer(object: any, propertyName: string, converter?: CustomConverter<any>): any {
    if (!CmUtilsService.isNil(object)) {
      const objectSerialized: any = {};
      for (const key of Object.keys(object)) {
        // get property definition (property name and property type)
        const sourceItemMpPr = CmUtilsService.getMappingProperty(object, object.constructor.name + '.' + key);
        if (!CmUtilsService.isNilty(sourceItemMpPr) && !CmUtilsService.isNil(object[key])) {
          if (typeof (object[key]) === 'object') {
            if (Array.isArray(object[key])) {
              objectSerialized[sourceItemMpPr.conversionMap.propertyKey] =
                CmUtilsService.arraySerializer(object[key], sourceItemMpPr.conversionMap.propertyType,
                  sourceItemMpPr.classPropertyType, propertyName + '.' +
                  sourceItemMpPr.classPropertyName, sourceItemMpPr.conversionMap.converter);
            } else {
              objectSerialized[sourceItemMpPr.conversionMap.propertyKey] =
                CmUtilsService.objectSerializer(object[key], propertyName + '.' + sourceItemMpPr.classPropertyName,
                  sourceItemMpPr.conversionMap.converter ? sourceItemMpPr.conversionMap.converter : converter);
            }
          } else {
            objectSerialized[sourceItemMpPr.conversionMap.propertyKey] = CmUtilsService.variableConverter('serialize',
              propertyName + '.' + key, object[key], sourceItemMpPr.conversionMap.propertyType, sourceItemMpPr.classPropertyType,
              sourceItemMpPr.conversionMap.converter ? sourceItemMpPr.conversionMap.converter : converter);
          }
        } else if (CmUtilsService.isNilty(sourceItemMpPr)) {
          console.log('WARNING: Property Map or Conversion Map are not defined for the property ' + key + ' of source object: it will be skipped');
        } else if (CmUtilsService.isNil(object[key])) {
          console.log('WARNING: The property ' + key + ' of source obj is undefined or null: it will be skipped');
        }
      }
      return objectSerialized;
    } else {
      console.log('WARNING: One or both input parameters are undefined or null');
    }
  }

  /**
   * Convert a specific class into a json
   * @param item: input item
   * @returns the json converted from the class in input
   */
  static serializer(item: any): any {
    if (!CmUtilsService.isNil(item)) {
      if (Array.isArray(item)) {
        return CmUtilsService.arraySerializer(item, Any, Any, 'root');
      } else if (typeof item === 'object') {
        return CmUtilsService.objectSerializer(item, 'root');
      } else {
        console.log('WARNING: Input item must be an object or an array');
      }
    } else {
      console.log('WARNING: Input parameter is undefined or null');
    }
  }

  /**
   * @param obj: source object
   * @param pathString: variable path string
   * @returns the value of the variable at the path defined in input
   */
  static deepFind(obj: any, pathString: string): any {
    if (!CmUtilsService.isNilty(pathString) && !CmUtilsService.isNilty(obj)) {
      try {
        const paths = pathString.split('.');
        while (paths.length >= 1) {
          const propertyKey = paths.shift();
          // check if current object has current property
          if (obj.hasOwnProperty(propertyKey)) {
            if (CmUtilsService.isNil(obj[propertyKey])) {
              return null;
            } else if (paths.length === 0) {
              return obj[propertyKey];
            } else {
              obj = obj[propertyKey];
            }
          } else {
            console.log('WARNING: Property ' + propertyKey + ' doesn\'t exist in current object');
            return null;
          }
        }
      } catch {
        return null;
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null or empty');
      return null;
    }
  }

  /**
   *
   * @param obj: source object
   * @param pathString: variable path string
   * @param newValue: new value of the variable to update
   */
  static deepUpdate(obj: any, pathString: string, newValue: any) {
    if (!CmUtilsService.isNilty(pathString) && !CmUtilsService.isNilty(obj)) {
      const paths = pathString.split('.');
      while (paths.length >= 1) {
        const propertyKey = paths.shift();
        // check if current object has current property
        if (obj.hasOwnProperty(propertyKey)) {
          if (CmUtilsService.isNil(obj[propertyKey])) {
            break;
          } else if (paths.length === 0) {
            obj[propertyKey] = newValue;
          } else {
            obj = obj[propertyKey];
          }
        } else {
          console.log('WARNING: Property ' + propertyKey + ' doesn\'t exist in current object');
          break;
        }
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null or empty');
    }
  }

  /**
   *
   * @param obj: source object
   * @param pathString: variable path string
   */
  static deepRemove(obj: any, pathString: string) {
    if (!CmUtilsService.isNilty(pathString) && !CmUtilsService.isNilty(obj)) {
      const paths = pathString.split('.');
      while (paths.length >= 1) {
        const propertyKey = paths.shift();
        // check if current object has current property
        if (obj.hasOwnProperty(propertyKey)) {
          if (CmUtilsService.isNil(obj[propertyKey])) {
            break;
          } else if (paths.length === 0) {
            if (Array.isArray(obj)) {
              obj.splice(Number(propertyKey), 1);
            } else {
              delete obj[propertyKey];
            }
          } else {
            obj = obj[propertyKey];
          }
        } else {
          console.log('WARNING: Property ' + propertyKey + ' doesn\'t exist in current object');
          break;
        }
      }
    } else {
      console.log('WARNING: One or both input parameters are undefined or null or empty');
    }
  }
}
