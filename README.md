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
<input type="date" ng-model="myCtrl.startDate" ng-min="myCtrl.enableStartDateValidation && myCtrl.minStartDate">
```

The `enableValidation` directive provides a cleaner method to separate the logic.
When applied to the example above, the result looks like this:

```html
<input type="date" ng-model="myCtrl.startDate" ng-min="myCtrl.minStartDate" enable-validation="myCtrl.enableStartDateValidation">
```

Using the `enableValidation` directive it also easier to disable multiple validators at once.
If the example above is extended with a `max` validator, you can simply add the `ng-max` attribute without having to repeat `myCtrl.enableStartDateValidation &&` in the validator expression.
The result:

```html
<input type="date" ng-model="myCtrl.startDate" ng-min="myCtrl.minStartDate" ng-max="myCtrl.maxStartDate" enable-validation="myCtrl.enableStartDateValidation">
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



Examples
--------

*Todo: write this section*



Limitations
-----------

*Todo: write this section*