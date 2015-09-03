angular.module("dsm.services.confirm", [])
	.directive('confirm', [function () {
		return {
			priority: 100,
			restrict: 'A',
			link: {
				pre: function (scope, element, attrs) {
					var msg = attrs.confirm || "Are you sure?";

					element.bind("click", function (event) {
						if (!confirm(msg)) {
							event.stopImmediatePropagation();
							event.preventDefault;
						}
					});
				}
			}
		};
	}]);
