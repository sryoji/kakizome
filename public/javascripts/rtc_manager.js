/*
 * kakizomeのメインjavascriptソース
 *
 */

var rtc_manager = function() {

	//var APIKEY = "6165842a-5c0d-11e3-b514-75d3313b9d05";
	var APIKEY = "99k1gp3h8n2ep14i";
	var DEBUG_MODE = 0;

	var peer = null;
	var myid = null;
	var connectId = null;
	var receive_action = null; //func

	var connect = function(c) {
		console.log("peer.on('connection') called." + c.peer);
		connectId = c.peer;

		// canvasを準備
		kakizome.set_other_canvas(connectId);
		c.on('data', receive);
	}

	var receive = function(data) {
		//console.log('Received: ' + data);

		if(receive_action != null) {
			receive_action(this.peer, data);
		}
	}

	return {
		// 最初に呼ぶ
		init : function() {
			peer = new Peer({key : APIKEY, debug : DEBUG_MODE});
			peer.on('open', function(id) {
				myid = id;
				console.log('My peer ID is: ' + myid);
				$("#pid").html(myid);
			});
			peer.on('connection', connect);
		},

		// 最初に接続するときに呼ぶ
		connecting : function(to) {
			console.log("connect to " + to);
			connectId = to;
			var conn = peer.connect(to);
			conn.on('open', function(){
				console.log("conn.on('data') called.");
				conn.send("Hello!");
				connect(conn);
			});
		},

		send : function(msg) {
			if (Object.keys(peer.connections).length != 0) {
				var conn = peer.connections[connectId][0];
				conn.send(msg);
			}else {
				console.log("no connections");
			}
		},

		close : function() {
			if (!!peer && !peer.destroyed) {
				peer.destroy();
			}
		},

		getmyid : function() {
			return myid;
		},

		setReceiveAction : function(_func) {
			// _funcが関数かどうか判定
			// if(){return;}
			receive_action = _func;
		}
	}
}();