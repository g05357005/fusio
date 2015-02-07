'use strict';

angular.module('fusioApp.action', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/action', {
    templateUrl: 'app/action/index.html',
    controller: 'ActionCtrl'
  });
}])

.controller('ActionCtrl', ['$scope', '$http', '$modal', '$timeout', function($scope, $http, $modal, $timeout){

	$scope.response = null;
	$scope.search = '';

	$scope.load = function(){
		var search = encodeURIComponent($scope.search);

		$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action?search=' + search).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.startIndex = 0;
			$scope.actions = data.entry;
		});
	};

	$scope.pageChanged = function(){
		var startIndex = ($scope.startIndex - 1) * 16;
		var search = encodeURIComponent($scope.search);

		$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action?startIndex=' + startIndex + '&search=' + search).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.actions = data.entry;
		});
	};

	$scope.doSearch = function(search){
		var search = encodeURIComponent(search);
		$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action?search=' + search).success(function(data){
			$scope.totalItems = data.totalItems;
			$scope.startIndex = 0;
			$scope.actions = data.entry;
		});
	};

	$scope.openCreateDialog = function(){
		var modalInstance = $modal.open({
			size: 'lg',
			templateUrl: 'app/action/create.html',
			controller: 'ActionCreateCtrl'
		});

		modalInstance.result.then(function(response){
			$scope.response = response;
			$scope.load();

			$timeout(function(){
				$scope.response = null;
			}, 2000);
		}, function(){
		});
	};

	$scope.openUpdateDialog = function(action){
		var modalInstance = $modal.open({
			size: 'lg',
			templateUrl: 'app/action/update.html',
			controller: 'ActionUpdateCtrl',
			resolve: {
				action: function(){
					return action;
				}
			}
		});

		modalInstance.result.then(function(response){
			$scope.response = response;
			$scope.load();

			$timeout(function(){
				$scope.response = null;
			}, 2000);
		}, function(){
		});
	};

	$scope.openDeleteDialog = function(action){
		var modalInstance = $modal.open({
			size: 'lg',
			templateUrl: 'app/action/delete.html',
			controller: 'ActionDeleteCtrl',
			resolve: {
				action: function(){
					return action;
				}
			}
		});

		modalInstance.result.then(function(response){
			$scope.response = response;
			$scope.load();

			$timeout(function(){
				$scope.response = null;
			}, 2000);
		}, function(){
		});
	};

	$scope.load();

}])

.controller('ActionCreateCtrl', ['$scope', '$http', '$modalInstance', 'formBuilder', function($scope, $http, $modalInstance, formBuilder){

	$scope.action = {
		name: "",
		class: "",
		config: {}
	};
	$scope.actions = [];
	$scope.config = null;

	$scope.create = function(action){
		$http.post('http://127.0.0.1/projects/fusio/public/index.php/backend/action', action)
			.success(function(data){
				$scope.response = data;
				if (data.success === true) {
					$modalInstance.close(data);
				}
			})
			.error(function(data){
				$scope.response = data;
			});
	};

	$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action/list')
		.success(function(data){
			$scope.actions = data.actions;

			if (data.actions[0]) {
				$scope.action.class = data.actions[0].class;
				$scope.loadConfig();
			}
		});

	$scope.close = function(){
		$modalInstance.dismiss('cancel');
	};

	$scope.loadConfig = function(){
		if ($scope.action.class) {
			$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action/form?class=' + encodeURIComponent($scope.action.class))
				.success(function(data){
					var linkFn = formBuilder.buildHtml(data.element);
					var el = linkFn($scope);
					var containerEl = angular.element(document.querySelector('#config-form'));

					containerEl.children().remove();
					containerEl.append(el);
				});
		}
	};

}])

.controller('ActionUpdateCtrl', ['$scope', '$http', '$modalInstance', 'action', 'formBuilder', function($scope, $http, $modalInstance, action, formBuilder){

	$scope.action = action;
	$scope.actions = [];
	$scope.config = null;

	$scope.update = function(action){
		$http.put('http://127.0.0.1/projects/fusio/public/index.php/backend/action/' + action.id, route)
			.success(function(data){
				$scope.response = data;
				if (data.success === true) {
					$modalInstance.close(data);
				}
			})
			.error(function(data){
				$scope.response = data;
			});
	};

	$scope.close = function(){
		$modalInstance.dismiss('cancel');
	};

	$scope.loadConfig = function(){
		if ($scope.action.class) {
			$http.get('http://127.0.0.1/projects/fusio/public/index.php/backend/action/form?class=' + encodeURIComponent($scope.action.class))
				.success(function(data){
					var linkFn = formBuilder.buildHtml(data.element);
					var el = linkFn($scope);
					var containerEl = angular.element(document.querySelector('#config-form'));

					containerEl.children().remove();
					containerEl.append(el);
				});
		}
	};

	$scope.loadConfig();
	
}])

.controller('ActionDeleteCtrl', ['$scope', '$http', '$modalInstance', 'action', function($scope, $http, $modalInstance, action){

	$scope.action = action;

	$scope.delete = function(action){
		$http.delete('http://127.0.0.1/projects/fusio/public/index.php/backend/action/' + action.id)
			.success(function(data){
				$scope.response = data;
				if (data.success === true) {
					$modalInstance.close(data);
				}
			})
			.error(function(data){
				$scope.response = data;
			});
	};

	$scope.close = function(){
		$modalInstance.dismiss('cancel');
	};

}]);
