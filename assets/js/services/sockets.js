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
.factory("lines", function (socketFactory, dscAPI) {
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
		line.dscAPI = dscAPI(line.socket, {key: 123})

		watch(line)

		lines.push(line)
	}

	return lines;
})
