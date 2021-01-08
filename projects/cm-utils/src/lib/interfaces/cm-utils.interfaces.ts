export interface CustomFunctions {
  arrayMerger?: (a: any, b: any[], c: any[]) => void;
}

export interface ConversionMap {
  propertyKey?: string;
  propertyType?: any;
  primitiveTypes?: any[];
  converter?: CustomConverter<any>;
}

export interface CustomConverter<T> {
  /**
   * Converts an incoming TypeScript object to a plain JSON object.
   * @param data TypeScript object
   * @return JSON object
   */
  deserialize(data: T): any;

  /**
   * Converts an incoming JSON object to a TypeScript object.
   * @param data JSON object
   * @return TypeScript object
   */
  serialize(data: any): T;
}

export interface ConversionMap {
  propertyKey?: string;
  propertyType?: any;
  converter?: CustomConverter<any>;
}

export interface MappingOptions {
  classPropertyName: string;
  classPropertyType: any;
  conversionMap?: ConversionMap;
  customFunctions?: CustomFunctions;
}
