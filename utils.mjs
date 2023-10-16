import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function resizeRendererToDisplaySize(renderer) {
	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if (needResize) {
		renderer.setSize(width, height, false);
	}
	return needResize;
}

function addControls(camera, elm) {
	const controls = new OrbitControls( camera, elm );

	controls.enablePan = true;
	controls.enableZoom = true;
	controls.rotateSpeed = .5;
	controls.keyPanSpeed = 50;
	controls.listenToKeyEvents(window);

	controls.mouseButtons = {
		LEFT: THREE.MOUSE.PAN, MIDDLE: THREE.MOUSE.DOLLY,
		RIGHT: THREE.MOUSE.ROTATE
	}
	controls.keys = {
		LEFT: 'KeyA', UP: 'KeyW',
		RIGHT: 'KeyD', BOTTOM: 'KeyS' // down arrow
	}
	controls.update();
	return controls;
}

export {resizeRendererToDisplaySize, addControls}