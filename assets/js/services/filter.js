angular.module("dsm.services.filter", [])
.filter("propsFilter", function() {
	return function(items, props) {
		var out = [];
		if (angular.isArray(items)) {
			var keys = Object.keys(props);
			items.forEach(function(item) {
				var itemMatches = false;
				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					if (props[prop] != undefined && item[prop] != undefined){
						var text = props[prop]
						if (props[prop].toLowerCase != undefined){
							text = props[prop].toLowerCase();
						}
						if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
							itemMatches = true;
							break;
						}
					}
				}
				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
			out = items;
		}
		return out;
	};
});
