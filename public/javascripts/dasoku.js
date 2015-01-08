/*
 * 蛇足。canvasをthree.jsでくるくる
 */

var dasoku = function() {

	var width = 500;
	var height = 500;

	var camera, scene, renderer;
	var texture;

	var make_canvas_material = function(_canvasObj){
		// 動かない。。。

		var canvas = _canvasObj.get(0);

		// canvasをテクスチャとしてテクスチャオブジェクト生成
		texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial({map: texture});
		var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height);
		var canvasScreen = new THREE.Mesh(geometry, material);

		return canvasScreen;
	}

	var render = function() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	return {
		init: function(){

			// シーン
			scene = new THREE.Scene();

			// カメラ
			camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
			camera.position.set(0, 0, 500);

			// オブジェクトを追加
			scene.add(make_canvas_material($("#my_canvas")));

			//レンダー
			//renderer = new THREE.CanvasRenderer();
			renderer = new THREE.WebGLRenderer();
			renderer.setSize(width, height);
			renderer.setClearColor(0xffffff, 1);

			$("#show").on('click', function(){
				document.body.appendChild(renderer.domElement);
				render();
			});
		}
	}
}();