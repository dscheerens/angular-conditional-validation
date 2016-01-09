/*!
 * angular-conditional-validation
 * @version v0.1.1
 * @link https://github.com/dscheerens/angular-conditional-validation
 * @license MIT
 */
;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['angular'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('angular'));
  } else {
    root.angularConditionalValidation = factory(root.angular);
  }
}(this, function(angular) {
var angularConditionalValidation = angular.module('angularConditionalValidation', ['ng'])
	.directive('enableValidation', ['$parse', '$q', function($parse, $q) { return {
		
		restrict: 'A',

		require: 'ngModel',

		link: function(scope, element, attributes, modelController) {

			var enableValidation = $parse(attributes.enableValidation)(scope);

			var validatorSets = [
				{
					validators: modelController.$validators,
					wrapper: createValidatorWrapper(true),
					isWrapped: {},
				}, {
					validators: modelController.$asyncValidators,
					wrapper: createValidatorWrapper($q.resolve(true)),
					isWrapped: {},
				}
			];

			// Monitor result of expression in 'enableValidation' attribute for changes. When this happens then the value `enableValidation`
			// should be updated and a validation check should be triggered.
			scope.$watch(attributes.enableValidation, function(value) {
				enableValidation = value;
				modelController.$validate();
			}, true);

			// Monitor validator sets for changes so new validators can be wrapped in order to override their validation behavior.
			scope.$watch(function validatorSetWatch() {
				var validatorsChanged = validatorSets.reduce(function(otherSetsWereChanged, validatorSet) {
					return updateValidatorWrappers(validatorSet) || otherSetsWereChanged;
				}, false);

				if (validatorsChanged) {
					modelController.$validate();
				}
			});

			function updateValidatorWrappers(validatorSet) {

				// Check for added validators.
				var hasNewValidators = Object.keys(validatorSet.validators).reduce(function(validatorAdded, validatorKey) {

					if (validatorSet.isWrapped[validatorKey]) {
						return validatorAdded;
					}

					var wrapValidator = validatorSet.wrapper;
					var validationEnabledChecker = createValidationEnabledChecker(validatorKey);
					var originalValidator = validatorSet.validators[validatorKey];
					validatorSet.validators[validatorKey] = wrapValidator(originalValidator, validationEnabledChecker);
					validatorSet.isWrapped[validatorKey] = true;

					return true;

				}, false);

				// Check for removed validators.
				var hasRemovedValidators = Object.keys(validatorSet.isWrapped).reduce(function(validatorRemoved, validatorKey) {

					if (!validatorSet.isWrapped[validatorKey] || validatorSet.validators[validatorKey]) {
						return validatorRemoved;
					}

					validatorSet.isWrapped[validatorKey] = false;

					return true;

				}, false);

				// Let caller know whether changes were detected.
				return hasNewValidators || hasRemovedValidators;
			}

			function createValidationEnabledChecker(validatorKey) {
				return function isValidationEnabled() {

					var validationEnabled = evaluate(enableValidation);

					if (angular.isObject(validationEnabled)) {
						if (validationEnabled.hasOwnProperty(validatorKey)) {
							return !!evaluate(validationEnabled[validatorKey])
						} else if (validationEnabled.hasOwnProperty('*')) {
							return !!evaluate(validationEnabled['*'])
						} else {
							return true;
						}
					} else {
						return !!validationEnabled;
					}
				};
			}

			function evaluate(expression) {
				if (angular.isFunction(expression)) {
					return expression();
				} else {
					return expression;
				}
			}

			function createValidatorWrapper(validationSuccessValue) {
				return function wrapValidator(validator, isValidationEnabled) {
					return function wrappedValidator(modelValue, viewValue) {
						if (isValidationEnabled()) {
							return validator(modelValue, viewValue);
						} else {
							return validationSuccessValue;
						}
					};
				};
			}

		}

	}}]);
return angularConditionalValidation;
}));
