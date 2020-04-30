# Object adaptation js

> Adapt plain objects freely

[ ![npm version](https://img.shields.io/npm/v/object-adaptation-js.svg?style=flat) ](https://npmjs.com/package/object-adaptation-js 'View this project on npm')

## Usage

Object Adaption Js allows you to adapt plain objects through mutations. Mutations are functions used to partially adapt object properties. Decide what properties to adapt and write structured mutations for it, quite easy! See below examples on how it can look in practice.

## Example 1: Capitalize Names

```js
const {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape
} = require('object-adaptation-js')

const person = { firstName: 'john', lastName: 'doe' }
const capitalizeString = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

const firstNameMutation = createShapeMutation(['firstName'], (key, value) => {
  const capitalizedFirstName = capitalizeString(value)
  return { [key]: capitalizedFirstName }
})

const lastNameMutation = createShapeMutation(['lastName'], (key, value) => {
  const capitalizedLastName = capitalizeString(value)
  return { [key]: capitalizedLastName }
})

const shapeConfiguration = createShapeConfiguration(['firstName', 'lastName'], {
  mutations: [firstNameMutation, lastNameMutation]
})

// Results in: { firstName: 'John', lastName: 'Doe' }
return adaptToShape(person, shapeConfiguration)
```

## Example 2: Construct Fullname Property

```js
const {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape
} = require('object-adaptation-js')

const person = { firstName: 'John', lastName: 'Doe' }

const fullNameMutation = createShapeMutation(
  ['firstName', 'lastName'],
  (key, value, mutatedPerson) => {
    if (key === 'firstName') {
      return { [key]: value, fullName: value }
    }
    if (key === 'lastName') {
      const { fullName } = mutatedPerson
      return { [key]: value, fullName: `${fullName} ${value}` }
    }
    return mutatedPerson
  }
)

const shapeConfiguration = createShapeConfiguration(['firstName', 'lastName'], {
  mutations: [fullNameMutation]
})

// Results in: { firstName: 'John', lastName: 'Doe', fullName: 'John Doe' }
return adaptToShape(person, shapeConfiguration)
```

## Example 3: Merge properties

```js
const {
  createShapeMutation,
  createShapeConfiguration,
  adaptToShape
} = require('object-adaptation-js')

const person = {
  firstName: 'John',
  lastName: 'Doe',
  address: {
    street: 'John Doe Street 12',
    city: 'Stockholm',
    country: 'Sweden',
    zip: 12345
  }
}

const addressMutation = createShapeMutation(['address'], (key, value) => {
  const { street, city, zip } = value
  return { [key]: `${street}, ${zip}, ${city}` }
})

const shapeConfiguration = createShapeConfiguration(
  ['firstName', 'lastName', 'address'],
  {
    mutations: [addressMutation]
  }
)

// Results in: { firstName: 'John', lastName: 'Doe', address: 'John Doe Street 12, 12345, Stockholm' }
return adaptToShape(person, shapeConfiguration)
```
