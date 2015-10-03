angular.module('ds.services.grafik', [])


.directive('target', ['$timeout', '$window', function($timeout, $window){

	return {
		template: '<canvas width="2000" height="2000" style="position: relative;"></canvas>',
		scope: {
			scheibe: '=',
			serie: '=',
			zoomlevel: '=',
			selectedshotindex: '=',
			probeecke: '=',
			size: '=', // undefined for dynamic
		},
		link: function postlink(scope, element, attrs){
			var canvas = element.find('canvas')[0];
			var canvas2D = !!$window.CanvasRenderingContext2D;


			var currentRing = {}

			function drawScheibe(context, scheibe, serie, zoom, selectedShotIndex, probeEcke){
				var lastRing = scheibe.ringe[scheibe.ringe.length-1]

				for (var i = scheibe.ringe.length-1; i >= 0; i--){
					var ring = scheibe.ringe[i]

					context.globalAlpha = 1.0
					context.fillStyle = ring.color;
					context.beginPath();
					context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
					context.closePath();

					context.fill();
					context.strokeStyle = ring.textColor
					context.lineWidth = 15;
					context.stroke();
					context.fillStyle = "black";

					if (ring.text == true){
						context.font = "bold "+(scheibe.text.size*zoom.scale)+"px verdana, sans-serif";
						context.fillStyle = ring.textColor
						context.fillText(ring.value, (lastRing.width/2 - ring.width/2 + scheibe.text.left)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2 + ring.width/2 + scheibe.text.right)*zoom.scale+zoom.offset.x, (lastRing.width/2+scheibe.text.width)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 + ring.width/2 + scheibe.text.down)*zoom.scale+zoom.offset.y);
						context.fillText(ring.value, (lastRing.width/2-scheibe.text.width)*zoom.scale+zoom.offset.x, (lastRing.width/2 - ring.width/2 + scheibe.text.up)*zoom.scale+zoom.offset.y);
					}
				}

				for (var i = scheibe.ringeDrawOnly.length-1; i >= 0; i--){
					var ring = scheibe.ringeDrawOnly[i]

					context.globalAlpha = 1.0
					context.fillStyle = ring.color;
					context.beginPath();
					context.arc(lastRing.width/2*zoom.scale+zoom.offset.x, lastRing.width/2*zoom.scale+zoom.offset.y, ring.width/2*zoom.scale, 0, 2*Math.PI);
					context.closePath();

					context.fill();
					context.strokeStyle = ring.textColor
					context.lineWidth = 15;
					context.stroke();
					context.fillStyle = "black";
				}

				// Probeecke
				if (probeEcke == true){
					context.beginPath()
					context.moveTo(1450,50)
					context.lineTo(1950,50)
					context.lineTo(1950,550)
					context.fillStyle = scheibe.probeEcke.color
					context.globalAlpha = scheibe.probeEcke.alpha
					context.fill();
				}
			}

			function drawShot(context, scheibe, shot, zoom, last){
				var lastRing = scheibe.ringe[scheibe.ringe.length-1]
				var currentRing = scheibe.ringe[scheibe.ringe.length - shot.ring.int]

				if (last){
					if (currentRing){
						context.fillStyle = currentRing.hitColor
					}
					else {
						context.fillStyle = scheibe.defaultHitColor
					}
					context.globalAlpha = 1.0
				}
				else {
					context.fillStyle = "#cccccc";
					context.globalAlpha = 0.5
				}
				context.beginPath();
				context.arc((lastRing.width/2 + shot.x/1000)*zoom.scale+zoom.offset.x, (lastRing.width/2 - shot.y/1000)*zoom.scale+zoom.offset.y, scheibe.kugelDurchmesser/2*zoom.scale, 0, 2*Math.PI);
				context.closePath();
				context.fill();
			}

			function drawMode(context, scheibe, serie, zoom, selectedShotIndex){
				if (serie){
					for (i in serie){
						if (i != selectedShotIndex){
							drawShot(context, scheibe, serie[i], zoom, false)
						}
					}
					if (serie.length > selectedShotIndex && selectedShotIndex > -1){
						var selectedShot = serie[selectedShotIndex]
						drawShot(context, scheibe, selectedShot, zoom, true)
					}
				}
			}

			function resize() {
				if (scope.size == undefined){
					var width = element.parent().outerWidth(true)
					var height = element.parent().outerHeight(true)

					var newHeight = width

					// if (newHeight > height) {
					// 	width = height
					// }
					// else {
						height = newHeight
					// }

					canvas.style.top = (element.parent().height() - height) / 2 + "px";
					canvas.style.width = width+'px';
					canvas.style.height = height+'px';
				}
				else {
					canvas.style.width = scope.size
					canvas.style.height = scope.size
				}

			}
			window.addEventListener('load', resize, false);
			window.addEventListener('resize', resize, false);

			var render = function(a_canvas){
				var context = a_canvas.getContext("2d");
				context.clearRect(0, 0, a_canvas.width, a_canvas.height);
				resize()

				var scheibe = scope.scheibe
				var serie = scope.serie
				var zoomLevel = scope.zoomlevel
				var selectedShotIndex = scope.selectedshotindex
				var probeEcke = scope.probeecke

				if (scheibe != undefined && serie != undefined && zoomLevel != undefined && selectedShotIndex != undefined){
					drawScheibe(context, scheibe, serie, zoomLevel, selectedShotIndex, probeEcke)
					drawMode(context, scheibe, serie, zoomLevel, selectedShotIndex)
				}
			};

			$timeout(function(){
				scope.$watch('probeecke', function(value, old){
					render(canvas)
				})
				scope.$watch('scheibe', function(value, old){
					render(canvas)
				})
				scope.$watch('serie', function(value, old){
					render(canvas)
				})
				scope.$watch('zoomlevel', function(value, old){
					render(canvas)
				})
				scope.$watch('selectedshotindex', function(value, old){
					render(canvas)
				})
				scope.$watch('size', function(value, old){
					render(canvas)
				})

			});
		}
	};
}]);
