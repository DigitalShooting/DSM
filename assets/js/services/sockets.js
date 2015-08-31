angular.module("dsm.services.sockets", ["btford.socket-io"])
.factory("dsmSocket", function (socketFactory) {
	var myIoSocket = io.connect();
	mySocket = socketFactory({
		ioSocket: myIoSocket
	});

	return mySocket;
})
.factory("lines", ["socketFactory", function (socketFactory) {
	var lines = []

	function watch(line){
		line.socket.on("connect", function(){
			line.isConnected = true
		})
		line.socket.on("disconnect", function(){
			line.isConnected = false
		})
	}

	for (var key in config.lines){
		var line = config.lines[key]
		line.socket = socketFactory({
			ioSocket: io.connect(line.ip+":"+line.port)
		})

		watch(line)

		lines.push(line)
	}

	return lines;
}])
