/*
 * お絵かき用js
 */

var kakizome = function() {
	var offset = 5;
	var startX;
	var startY;
	var flag = false;

	var canvas = null;
	var context = null;

	var canvas_action_mousedown = function(e, canvas){
		flag = true;
		startX = e.pageX - canvas.offset().left - offset;
		startY = e.pageY - canvas.offset().top - offset;

		// peerに座標を送信
		var msg = ["start", startX, startY].join(",");
		rtc_manager.send(msg);

		$("#myfude").css({
			'display':'block',
			'top': e.pageY-80,
			'left': e.pageX+10
		});

		return false; // for chrome
	}

	var canvas_action_mousemove = function(e){
		if (flag) {
			var endX = e.pageX - $('canvas').offset().left - offset;
			var endY = e.pageY - $('canvas').offset().top - offset;
			context.lineWidth = 5;
			context.lineJoin = "round";
			context.beginPath();
			context.moveTo(startX, startY);
			context.lineTo(endX, endY);
			context.stroke();
			context.closePath();

			// peerに座標を送信
			var msg = ["move", startX, startY, endX, endY].join(",");
			rtc_manager.send(msg);

			startX = endX;
			startY = endY;

			$("#myfude").css({
				'display':'block',
				'top': e.pageY-80,
				'left': e.pageX+10
			});

		}
	}

	var canvas_action_mouseout = function(){
		flag = false;

		// peerに座標を送信
		var msg = ["end", startX, startY].join(",");
		rtc_manager.send(msg);

		$("#myfude").css({
			'display':'none',
		});
	}

	var canvas_clear = function(){
		context.clearRect(0, 0, canvas.width(), canvas.height());
	}

	var others = {}

	return {
		init : function(_id) {

			// canvas関連
			canvas = $("#"+_id);
			context = canvas.get(0).getContext('2d');

			canvas.on('mousedown',function(e){
				canvas_action_mousedown(e, canvas);
			});

			canvas.on('mousemove',function(e){
				canvas_action_mousemove(e);
			});

			canvas.on('mouseup', function(){
				canvas_action_mouseout();
			});

			canvas.on('mouseleave', function(){
				canvas_action_mouseout();
			});

			$("#clear").on('click', function(){
				canvas_clear();
			});

		},

		set_other_canvas: function(_pid) {
			$('<canvas '+ 'id=canvas_' + _pid + ' width="240" height="333"></canvsas>').appendTo($("#other_canvas"));
			$('<div class="fude"' + ' id=fude_' + _pid + '><img src="/images/fude.png"></div>').appendTo($("#other_canvas"));

			others[_pid] = {
				"flag" : false,
				"canvas": $("#" + "canvas_" + _pid),
				"fude": $("#" + "fude_" + _pid)
			};
		},

		drow_operate: function(_pid, _data) {
			var mouse_info = _data.split(",");
			switch(mouse_info[0]) {
				case "start": 
					others[_pid]["flag"] = true;
					others[_pid]["startX"] = mouse_info[1];
					others[_pid]["startY"] = mouse_info[2];
				break;

				case "move":
					if (others[_pid]["flag"]) {
						var context = others[_pid]["canvas"].get(0).getContext('2d');
						context.lineWidth = 2;
						context.beginPath();
						context.moveTo(others[_pid]["startX"], others[_pid]["startY"]);
						context.lineTo(mouse_info[3], mouse_info[4]);
						context.stroke();
						context.closePath();

						others[_pid]["startX"] = mouse_info[3];
						others[_pid]["startY"] = mouse_info[4];

						var point = others[_pid]["canvas"].position();
						console.log(point);

			others[_pid]["fude"].css({
				'display':'block',
				'top': Number(mouse_info[2]) + point.top - 80,
				'left': Number(mouse_info[1]) + point.left + 10
			});
					}
				break;
			}
		}
	}
}();