angular.module('dsc.services.dscAPI', [])


.factory('dscAPI', function(gatewaySocket){
	return function(id, auth){
		return {
			setNewTarget: function(){
				socket.emit("newTarget", {
					auth: auth,
				})
			},
			setPart: function(partId){
				socket.emit("setPart", {
					auth: auth,
					partId: partId,
				})
			},
			setSelectedSerie: function(index){
				socket.emit("setSelectedSerie", {
					auth: auth,
					index: index,
				})
			},
			setSelectedShot: function(index){
				socket.emit("setSelectedShot", {
					auth: auth,
					index: index,
				})
			},
			setUser: function(user){
				socket.emit("setUser", {
					auth: auth,
					user: user,
				})
			},
			setDisziplin: function(disziplin){
				gatewaySocket.emit("setDisziplin", {
					auth: auth,
					disziplin: disziplin,
				})
			},
			print: function(all){
				socket.emit("print", {
					auth: auth,
					all: all,
				})
			},
			getTempToken: function(){
				socket.emit("getTempToken", {
					auth: auth,
				})
			},


			showMessage: function(type, title){
				socket.emit("showMessage", {
					auth: auth,
					type: type,
					title: title,
				})
			},
			hideMessage: function(){
				socket.emit("hideMessage", {
					auth: auth,
				})
			},
		}
	}
})
