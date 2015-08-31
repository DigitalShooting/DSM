angular.module("dsm.services.sockets", ["btford.socket-io"])
.factory("dsmSocket", function (socketFactory) {
	var myIoSocket = io.connect();
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
})
.factory("lines", ["socketFactory", function (socketFactory) {
	var staende = []

	function watch(stand){
		stand.socket.on("connect", function(){
			stand.isConnected = true
		})
		stand.socket.on("disconnect", function(){
			stand.isConnected = false
		})
	}

	for (var key in config.staende){
		var stand = config.staende[key]
		stand.socket = socketFactory({
			ioSocket: io.connect(stand.ip+":"+stand.port)
		})

		watch(stand)

		staende.push(stand)
	}

	return staende;
}])
