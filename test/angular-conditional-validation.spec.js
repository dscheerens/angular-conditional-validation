describe('"enable-validation" directive', function() {

	var $scope;
	var $compile;

	beforeEach(module('angularConditionalValidation'));

	beforeEach(inject(function(_$rootScope_, _$compile_) {
		$scope = _$rootScope_;
		$compile = _$compile_;
	}));

	function createTestForm(validationCondition) {
		return $compile(
			'<form name="form">' +
			'<input name="field" type="text" ng-model="model" ng-minlength="4" pattern="abcd" enable-validation="' + validationCondition + '">' +
			'</form>'
		)($scope);
	}

	it('supports literal boolean "true"', function() {
		createTestForm('true');
		$scope.model = 'abc';

		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeTruthy();
	});

	it('supports literal boolean "false"', function() {
		createTestForm('false');
		$scope.model = 'abc';

		$scope.$digest();

		expect($scope.form.$valid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeFalsy();
		expect($scope.form.field.$error.pattern).toBeFalsy();
	});

	it('supports object literals', function() {
		createTestForm('{ minlength: true, pattern: false }');
		$scope.model = 'abc';

		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeFalsy();
	});

	it('supports boolean values on scope', function() {
		createTestForm('enableValidation');
		$scope.model = 'abc';

		$scope.enableValidation = true;
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeTruthy();

		$scope.enableValidation = false;
		$scope.$digest();

		expect($scope.form.$valid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeFalsy();
		expect($scope.form.field.$error.pattern).toBeFalsy();

		$scope.enableValidation = true;
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeTruthy();
	});

	it('supports object values on scope', function() {
		createTestForm('enableValidation');
		$scope.model = 'abc';

		$scope.enableValidation = {
			minlength: false,
			pattern: true
		};
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeFalsy();
		expect($scope.form.field.$error.pattern).toBeTruthy();

		$scope.enableValidation = {
			minlength: true,
			pattern: false
		};
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeFalsy();
	});

	it('supports object values with default (\'*\')', function() {
		createTestForm('enableValidation');
		$scope.model = 'abc';

		$scope.enableValidation = {
			'*': true
		};
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeTruthy();

		$scope.enableValidation.pattern = false;
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeFalsy();

		$scope.enableValidation['*'] = false;
		$scope.$digest();

		expect($scope.form.$valid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeFalsy();
		expect($scope.form.field.$error.pattern).toBeFalsy();
	});

	it('supports function values on scope', function() {
		createTestForm('enableValidation');
		$scope.model = 'abc';
		
		$scope.enableValidation = function() {
			return {
				minlength: function() { return true; },
				pattern: function() { return false; }
			};
		}
		$scope.$digest();

		expect($scope.form.$invalid).toBeTruthy();
		expect($scope.form.field.$error.minlength).toBeTruthy();
		expect($scope.form.field.$error.pattern).toBeFalsy();
	});

});