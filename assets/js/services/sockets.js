angular.module("dsm.services.sockets", [
	"btford.socket-io",
	"dsc.services.dscAPI",
])


.factory("dsmSocket", function (socketFactory) {
	var myIoSocket = io.connect();
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
})





.factory('gatewaySocket', ["socketFactory", function (socketFactory) {
	var gatewaySocket = socketFactory({
		ioSocket: io.connect(dscGatewayUrl)
	})

	gatewaySocket.api = {
		setNewTarget: function(line){
			gatewaySocket.emit("setLine", {
				method: "newTarget",
				line: line,
				data: {
					auth: {key: "123"},
				},
			})
		},
		setPart: function(line, partId){
			gatewaySocket.emit("setLine", {
				method: "setPart",
				line: line,
				data: {
					auth: {key: "123"},
					partId: partId,
				},
			})
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
		// setUser: function(line, user){
		// 	socket.emit("setUser", {
		// 		auth: auth,
		// 		user: user,
		// 	})
		// },
		setDisziplin: function(line, disziplin){
			gatewaySocket.emit("setLine", {
				method: "setDisziplin",
				line: line,
				data: {
					auth: {key: "123"},
					disziplin: disziplin,
				},
			})
		},
		print: function(line){
			gatewaySocket.emit("setLine", {
				method: "print",
				line: line,
				data: {
					auth: {key: "123"},
				},
			})
		},
		// getTempToken: function(line){
		// 	socket.emit("getTempToken", {
		// 		auth: auth,
		// 	})
		// },


		// showMessage: function(line, type, title){
		// 	socket.emit("showMessage", {
		// 		auth: auth,
		// 		type: type,
		// 		title: title,
		// 	})
		// },
		// hideMessage: function(line){
		// 	socket.emit("hideMessage", {
		// 		auth: auth,
		// 	})
		// },
	};

	return gatewaySocket
}])
