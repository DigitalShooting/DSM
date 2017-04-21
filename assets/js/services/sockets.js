angular.module("dsm.services.sockets", [
	"btford.socket-io",
])



.factory('gatewaySocket', ["socketFactory", function (socketFactory) {
	var gatewaySocket = socketFactory({
		ioSocket: io.connect(dscGatewayUrl)
	});

	var auth = {key: dscAPIKey};

	gatewaySocket.api = {
		setNewTarget: function(line){
			gatewaySocket.emit("setLine", {
				method: "newTarget",
				line: line,
				data: {
					auth: auth,
				},
			});
		},
		setPart: function(line, partId){
			gatewaySocket.emit("setLine", {
				method: "setPart",
				line: line,
				data: {
					auth: auth,
					partId: partId,
				},
			});
		},
		// setSelectedSerie: function(line, index){
		// 	socket.emit("setSelectedSerie", {
		// 		auth: auth,
		// 		index: index,
		// 	})
		// },
		// setSelectedShot: function(line, index){
		// 	socket.emit("setSelectedShot", {
		// 		auth: auth,
		// 		index: index,
		// 	})
		// },
		setUser: function(line, user){
			gatewaySocket.emit("setLine", {
				method: "setUser",
				line: line,
				data: {
					auth: auth,
					user: user,
				},
			});
		},
		setDisziplin: function(line, disziplin){
			gatewaySocket.emit("setLine", {
				method: "setDisziplin",
				line: line,
				data: {
					auth: auth,
					disziplin: disziplin,
				},
			});
		},
		print: function(line){
			gatewaySocket.emit("setLine", {
				method: "print",
				line: line,
				data: {
					auth: auth,
				},
			});
		},
		getTempToken: function(line){
			gatewaySocket.emit("setLine", {
				method: "getTempToken",
				line: line,
				data: {
					auth: auth,
				},
			});
		},
		showMessage: function(line, type, title){
			gatewaySocket.emit("setLine", {
				method: "showMessage",
				line: line,
				data: {
					auth: auth,
					type: type,
					title: title,
				},
			});
		},
		hideMessage: function(line){
			gatewaySocket.emit("setLine", {
				method: "hideMessage",
				line: line,
				data: {
					auth: auth,
				},
			});
		},
		setPower: function(line, on){
			if (on == true) {
				gatewaySocket.emit("startLine", {
					line: line,
				});
			}
			else {
				gatewaySocket.emit("setLine", {
					method: "shutdown",
					line: line,
					data: {
						auth: auth,
					}
				});
			}
		},
		getData: function(line){
			gatewaySocket.emit("setLine", {
				method: "getData",
				line: line,
				data: {
					auth: auth,
				},
			});
		},
		loadData: function(line, data){
			gatewaySocket.emit("setLine", {
				method: "loadData",
				line: line,
				data: {
					auth: auth,
					data: data,
				}
			});
		},
	};

	return gatewaySocket;
}]);
