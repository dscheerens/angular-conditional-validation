[![Build Status](https://api.travis-ci.org/dscheerens/angular-conditional-validation.svg?branch=master)](https://travis-ci.org/dscheerens/angular-conditional-validation)

Angular conditional validation module
=====================================

The conditional validation module provides an `enableValidation` attribute directive that can be used to conditionally enable/disable validation for elements with an `ngModel` directive.



Motivation
----------

Most (if not all) of the standard Angular validators can be disabled individually using *falsy* values.
For example when the expression for a `ngMin` attribute evaluates to `undefined`, then validation will be disabled for the `min` validator.
However, this requires that the logic that determines when validation should be enabled is combined with the logic that defines the values for parameterized validators.
At best you can write something like this:

```html
<input
  type="date"
  ng-model="myCtrl.startDate"
  ng-min="myCtrl.enableStartDateValidation && myCtrl.minStartDate">
```

The `enableValidation` directive provides a cleaner method to separate the logic.
When applied to the example above, the result looks like this:

```html
<input type="date"
  ng-model="myCtrl.startDate"
  ng-min="myCtrl.minStartDate"
  enable-validation="myCtrl.enableStartDateValidation">
```

Using the `enableValidation` directive it also easier to disable multiple validators at once.
If the example above is extended with a `max` validator, you can simply add the `ng-max` attribute without having to repeat `myCtrl.enableStartDateValidation &&` in the validator expression.
The result:

```html
<input type="date"
  ng-model="myCtrl.startDate"
  ng-min="myCtrl.minStartDate"
  ng-max="myCtrl.maxStartDate"
  enable-validation="myCtrl.enableStartDateValidation">
```

Another reason for using the `enableValidation` directive is when you use (custom) validators that do not provide a method to (conditionally) disable them.



Installation
------------

**NPM**

```
npm install angular-conditional-validation
```

**Bower**

```
bower install angular-conditional-validation
```


Usage
-----

To use the Angular conditional validation module in your application either include the script (`angular-conditional-validation(.min).js`) using a `<script>` tag or require/load it via a script loader.
Furthermore add `angularConditionalValidation` to the Angular dependencies of your application.

Now you should be able to use the `enableValidation` directive in your templates.

The directive supports three types of values:

* **Objects:** When object values are used to enable/disable validation for individual validators. The property keys of the object should match with the name of the validators. The value of a property (which may be a function) determines whether validation is enabled/disabled.
* **Functions:** Functions values will be invoked every time validation is triggered and the return value (which may be an object) is then used to determine whether validation is enabled or disabled.
* **Other:** Any other value type will be evaluated as an inherent boolean value, so any *truthy* value enables validation while *falsy* values disable validation.

Both synchronous and asynchronous validators are supported by the `enableValidation` directive.



Examples
--------

A set of demos can be found at the following JS Bin: [jsbin.com/necile](https://jsbin.com/necile/)

**Simple boolean validation condition**

*Inside Angular controller:*
```javascript
var ctrl = this;
ctrl.someValue = 'hello';
ctrl.anotherValue = true;
```

*Inside HTML template:*
```html
<input type="text" ng-model="ctrl.someValue" ng-minlength="5" enable-validation="ctrl.anotherValue">
```

**Function based validation condition**

*Inside Angular controller:*
```javascript
var ctrl = this;
ctrl.someValue = 'hello';
ctrl.shouldValidate = function() {
  return new Date().getDay() == 1; // Only validate on mondays :)
};
```

*Inside HTML template:*
```html
<input type="text" ng-model="ctrl.someValue" ng-minlength="5" enable-validation="ctrl.shouldValidate">
```

**Object based validation condition**

*Inside Angular controller:*
```javascript
var ctrl = this;
ctrl.someValue = 'hello';
ctrl.enabledValidators = {
  required: false,
  minlength: true,
  '*': false // Disable other validators.
};
```

*Inside HTML template:*
```html
<input
  type="text"
  ng-model="ctrl.someValue"
  required
  ng-minlength="4"
  ng-maxlength="6"
  pattern="abcde"
  enable-validation="ctrl.enabledValidators">
```

**Mixing functions and objects**

*Inside Angular controller:*
```javascript
var ctrl = this;
ctrl.someValue = 'hello';
ctrl.enabledValidators = function() {
  return {
    required: false,
    minlength: true,
    '*': function() {
      return new Date().getDay() == 2; // Other validators are only enabled on tuesday.
    }
  };
};
```

*Inside HTML template:*
```html
<input
  type="text"
  ng-model="ctrl.someValue"
  required
  ng-minlength="4"
  ng-maxlength="6"
  pattern="abcde"
  enable-validation="ctrl.enabledValidators">
```

Limitations
-----------

* Promises are not supported.
