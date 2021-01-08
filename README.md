# CmUtils

CmUtils is a library that contains some utility functions to manage objects and arrays.\
With this library we have:
* functions and pipes that **check if an element is undefined, null or empty** (they work on objects, arrays and variables)
* function to **merge two objects or two arrays**
* function to **clone an object**
* functions to **remove duplicates in an array** and **check if two elements are equal**
* function to **convert a json (maybe from an api) to a specific typescript class** and vice versa
* functions to **find, update and remove** properties deep into an object

This is based on:
* [**A**ngular 9](https://angular.io)

## Index

1. [Install](#install)
2. [How to use](#how-to-use)
3. [Utility functions](#utility-functions)
    * [isUndefined](#isundefined)
    * [isNull](#isnull)
    * [isNil](#isnil)
    * [isEmpty](#isempty)
    * [isNilty](#isnilty)
    * [merge](#merge)
    * [cloneClass](#cloneclass)
    * [isEqual](#isequal)
    * [uniqueBy](#uniqueby)
    * [deserialize](#deserialize)
    * [serialize](#serialize)
    * [deepFind](#deepfind)
    * [deepUpdate](#deepupdate)
    * [deepRemove](#deepremove)
4. [Pipes](#pipes)
5. [Authors](#authors)
6. [License](#license)

## Install

``npm install cm-utils --save``

Import in your app

```javascript
import { CmUtilsModule } from 'cm-utils';

@NgModule({
  imports: [ CmUtilsModule ],
  ...
})
```

## How to use

#### First define you model

 ```javascript
 import {CmUtilsProperty} from 'cm-utils';

 class SubClassName {
   @CmUtilsProperty(String) subkey1: string;
   @CmUtilsProperty(Boolean) subkey2: boolean;
 }
 
 class ClassName {
   @CmUtilsProperty(String) key1: string;
   @CmUtilsProperty(SubClassName) key2: SubClassName;
   @CmUtilsProperty(Number) key3: number;
   @CmUtilsProperty(String) key4: string[];
   @CmUtilsProperty(SubClassName) key5: SubClassName[];
 }
 ```

The first parameter in CmUtilsProperty decorator tells to utility functions what is the type of the property.\
Below the table that compares the typescript type with the type for the decorator:

| Decorator type            | TypeScript type       |
| ---                       | ---                   |
| String                    | string                |
| Number                    | number                |
| Boolean                   | boolean               | 
| ClassName                 | ClassName             |
| Any                       | any                   |
| Multi                     | multi types           |
| Tuple                     | tuple types           |

###### Multi types

Multi types are used for those variables that can have multi types at same time. For example a variable that can be a string, or a number.\
In this case model definition will be

 ```javascript
 import {CmUtilsProperty, Multi} from 'cm-utils';

 class ClassName {
   @CmUtilsProperty(new Multi(String, Number)) key1: string | number;
 }
 ```

###### Tuple types

Tuple types are used for those variables that are arrays with defined number of elements of different types. For example a variable that is an array with first element as string and second element as number.\
In this case model definition will be

 ```javascript
 import {CmUtilsProperty, Tuple} from 'cm-utils';

 class ClassName {
   @CmUtilsProperty(new Tuple(String, Number)) key1: [string, number];
 }
 ```

#### Use utility functions

 ```javascript
 import {CmUtilsService} from 'cm-utils';

 const firstObj = new ClassName();
 const secondObj = new ClassName();
 ...
 
 const newObj = CmUtilsService.mergeObj(firstObj, secondObj);
 ...
  ```

## Utility functions

### isUndefined

Checks if an element is undefined.

 ```javascript
 const elem = new ClassName();
...
 CmUtilsService.isUndefined(elem) 
  ```

It returns true if it is undefined, false otherwise

### isNull

Checks if an element is null.

 ```javascript
 const elem = new ClassName();
...
 CmUtilsService.isNull(elem) 
  ```
It returns true if it is null, false otherwise

### isNil

Checks if an element is null or undefined.

 ```javascript
 const elem = new ClassName();
...
 CmUtilsService.isNil(elem) 
  ```
It returns true if it is undefined or null, false otherwise

### isEmpty

Checks if an element is empty. It can be used with strings, arrays and objects.

 ```javascript
 const elem = new ClassName();
...
 CmUtilsService.isEmpty(elem) 
  ```
 It returns true if it is empty, false otherwise
 
### isNilty

Checks if an element is null or undefined or empty. It can be used with strings, arrays and objects.

 ```javascript
 const elem = new ClassName();
...
 CmUtilsService.isNilty(elem)
  ```
It returns true if it is undefined or null or empty, false otherwise 
 
### merge

Merge two items (arrays or objects).

 ```javascript
 const firstItem: ClassName = new ClassName();
 const secondItem: ClassName = new ClassName();
...
 CmUtilsService.merge(firstItem, secondItem)
  ```
It merges the first item into the second item.

##### array merge strategy

By default, array are merged pushing in destination array those elements that are in source array and aren't in destination array. For example:

 `[1,3,5] merged into [1,2,3] become [1,2,3,5]`
 
It's possible to change this behaviour in two ways:
* passing a merger function as third parameter in merge method
* passing a merger function into CmUtilsProperty decorator

In both cases merger function must be defined in this way:
 
```javascript
function merger (item, sourceArray, destinationArray) {
    // do something 
}
  ```

First case is useful if we call merge method to merge two arrays, or we want to merge two objects and apply the same merge strategy for all properties that are arrays.

```javascript
function merger (item, sourceArray, destinationArray) {
    // do something 
}

CmUtilsService.merge(firstArray, secondArray, merger)
  ```

Second case is useful if we want to merge two objects and apply different merge strategy for different properties.

```javascript
class ClassName {
   @CmUtilsProperty(String) key1: string;
   @CmUtilsProperty(Number) key2: number;
   @CmUtilsProperty(String, {arrayMerger: merger}) key3: string[];
 }

function merger (item, sourceArray, destinationArray) {
    // do something 
}

const firstObject: ClassName = new ClassName();
const secondObject: ClassName = new ClassName();

CmUtilsService.merge(firstObject, secondObject)
  ```
It is possible both define a custom merger as third parameter of the merge method and other mergers as property in decorators.\
In this case the first merger is used until the property doesn't have its own.

### cloneClass

Clone an object with specific class. \
It is possible to pass, as second parameter, a different class. If it is not provided, the cloned object will have the same class of that used for cloning.

 ```javascript
 const obj: ClassName = new ClassName();
...
 CmUtilsService.cloneClass(obj, optionalClass)
  ```

It returns the cloned object.

N.B. The second parameter is useful when the class used for cloning has more or fewer properties than the class of the result object, and the properties in common have the same types. This means that this method is useless if the properties in common have different types (for that case check the serializer method).

### isEqual

Checks if two items are equal.

 ```javascript
 const firstElem: ClassName = new ClassName();
 const secondElem: ClassName = new ClassName();
...
 CmUtilsService.isEqual(firstElem, secondElem)
  ```

It returns true if the elements are equal, false otherwise.

### uniqueBy

Check for duplicates in array and remove them. \
It is possible to use a function to define the strategy used to remove equal elements (for example we want remove the elements that have the same value for a specific key). If it is not provided, the default one will be used and only the elements perfectly equal will be removed.

 ```javascript
 const array: ClassName[] = [];
...
 CmUtilsService.uniqueBy(array, optionalFunction)
  ```

### deserialize

Convert a json into a specific class (it can be used also to convert class into another).

 ```javascript
 const json = {};
...
 CmUtilsService.deserializer(json, ClassName)
  ```

It returns the deserialized object.

#### property decorator configuration

If the property in json is the same (for the name and type) of the property in **ClassName** the decorator configuration is the default one:

 ```javascript
 class ClassName {
   @CmUtilsProperty(String) key1: string;
 }
 ```

If the property in json has different type or name or both, the decorator configuration will be:

 ```javascript
 class ClassName {
   @CmUtilsProperty(String, undefined, {propertyType: Number, propertyKey: 'key1different'}) key1: string;
 }
 ```

Where **propertyType** defines the type and **propertyKey** defines the name of the property in the json object. \
In case of the **propertyType** is not a primitive type (see table in [How to use](#how-to-use) section), or it is necessary to do some operation to convert the value, it is possible define a custom converter. \

 ```javascript
 class ClassName {
   @CmUtilsProperty(String, undefined, {propertyType: Number, converter: new NumberToStringConverter()}) key1: string;
 }
 ```
Where **converter** must be defined in this way:

```javascript
class NumberToStringConverter implements CustomConverter<String> {
  serialize(data: String): any {
  }

  deserialize(data: any): String {
    return data.toString().replace('.', ',');
  }

}
  ```

Each **converter** must implement **CustomConverter** interface and must have two methods:
* serialize (see [serialize](#serialize) section)
* deserialize

The **deserialize method** takes the json value of the property and returns the transformed value.

N.B.: The converter can be defined also on an array, and an object type property. \
In this case, the same converter is applied on each element/property of the array/object that doesn't have its own converter.

### serialize

Convert a specific class into a json.

 ```javascript
 class ClassName {
  ...   
 }
...
 CmUtilsService.serializer(ClassName)
  ```

It returns the serialized json.

#### property decorator configuration

If the property in **ClassName** is the same (for the name and type) of the property in json the decorator configuration is the default one:

 ```javascript
 class ClassName {
   @CmUtilsProperty(String) key1: string;
 }
 ```

If the property in **ClassName** has different type or name or both, the decorator configuration will be:

 ```javascript
 class ClassName {
   @CmUtilsProperty(String, undefined, {propertyType: Number, propertyKey: 'key1different'}) key1: string;
 }
 ```

Where **propertyType** defines the type and **propertyKey** defines the name of the property in the json object. \
In case of the **propertyType** is not a primitive type (see table in [How to use](#how-to-use) section), or it is necessary to do some operation to convert the value, it is possible define a custom converter. \

 ```javascript
 class ClassName {
   @CmUtilsProperty(String, undefined, {propertyType: Number, converter: new NumberToStringConverter()}) key1: string;
 }
 ```
Where **converter** must be defined in this way:

```javascript
class NumberToStringConverter implements CustomConverter<Number> {
  serialize(data: String): Number {
    return Number(data.replace(',', '.'));
  }

  deserialize(data: Number): String {
    return undefined;
  }

}
  ```

Each **converter** must implement **CustomConverter** interface and must have two methods:
* serialize
* deserialize (see [deserialize](#deserialize) section)

The **serialize method** takes the **ClassName** value of the property and returns the transformed value.

N.B.: The converter can be defined also on an array, and an object type property. \
In this case, the same converter is applied on each element/property of the array/object that doesn't have its own converter.

### deepFind

Given an object, returns the value of the property at a specific path.

 ```javascript
 const obj = new ClassName();
...
 CmUtilsService.deepFind(obj, 'path.to.key')
  ```
N.B.: the path must start from the root of the object and each level must be separated by a dot. \
For arrays, the key is the index of the element.

### deepUpdate

Given an object, update the value of the property at a specific path.

 ```javascript
 const obj = new ClassName();
...
 CmUtilsService.deepUpdate(obj, 'path.to.key', newValue)
  ```
N.B.: the path must start from the root of the object and each level must be separated by a dot. \
For arrays, the key is the index of the element.

### deepRemove

Given an object, remove the property at a specific path.

 ```javascript
 const obj = new ClassName();
...
 CmUtilsService.deepRemove(obj, 'path.to.key')
  ```
N.B.: the path must start from the root of the object and each level must be separated by a dot. \
For arrays, the key is the index of the element.

## Pipes

The library also provides the following pipes:
* **isUndefined**: check if element is undefined
* **isNull**: check if element is null
* **isNil**: check if element is null or undefined
* **isEmpty**: check if element is empty
* **isNilty**: check if element is null or undefined or empty

## Authors

* **Andrea Cimini**

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.
