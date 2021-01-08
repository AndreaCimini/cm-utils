import {ConversionMap, CustomFunctions, MappingOptions} from '../interfaces/cm-utils.interfaces';
import {Settings} from '../enumerations/cm-utils.enumerations';

export function CmUtilsProperty(propertyType: any, customFunctions?: CustomFunctions, conversionMap?: ConversionMap) {
  return function (target, propertyKey: string) {
    if (target[Settings.MAPPING_PROPERTY] === undefined) {
      target[Settings.MAPPING_PROPERTY] = {};
    }

    if (!customFunctions) {
      customFunctions = {};
    }

    if (!conversionMap) {
      conversionMap = {};
    }
    // adding missed information to conversion map
    conversionMap.propertyKey = conversionMap.propertyKey ? conversionMap.propertyKey : propertyKey;
    conversionMap.propertyType = conversionMap.propertyType ? conversionMap.propertyType : propertyType;

    const className = target.constructor.name;
    target[Settings.MAPPING_PROPERTY][className + '.' + propertyKey] = {
      classPropertyName: propertyKey,
      classPropertyType: propertyType,
      conversionMap,
      customFunctions
    } as MappingOptions;
  };
}
