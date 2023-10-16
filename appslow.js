import * as THREE from 'three';
import * as d3 from 'd3';

import { resizeRendererToDisplaySize, addControls } from './utils.mjs';

function createInstances(data, geometry, color ) {

	let objs = [];
	const material = new THREE.MeshPhongMaterial( { color } );
	for (let i = 0; i < data.length ; i++) {
		let row = data[i];
		let obj = new THREE.Mesh( geometry, material );
		obj.position.x = row.x;
		obj.position.y = row.y;
		objs.push(obj);
	}
	console.log(data[0]);
	return objs;
}

function mainLoader() {

    const canvas = document.querySelector('#main-canvas');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
	
	const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(...[364.57700309166603, 307.9672371396837, 465.3726709034871]);
	[397.9259348568531, 299.0683723303443, 628.5298969520331]

    let controls = addControls(camera, renderer.domElement);

	const scene = new THREE.Scene();
    {
        const color = 0xFFFFFF;
        const intensity = 1.5;
		
        const light1 = new THREE.DirectionalLight(color, intensity);
        light1.position.set(-1, 2, 4);
        scene.add(light1);

        const light2 = new THREE.DirectionalLight(color, intensity);
        light2.position.set(-1, 2, -2);
        scene.add(light2);
    }

	d3.text("NOx/B_NOx_12.dat").then(text => {
		let tt = text.split("\n");
		let head = tt[0];
		let bd = tt.slice(1, tt.length - 1).join("\n");
		let regex = / +/g;

		let data = d3.csvParse(("ignore1,"+ head + ",ignore2" + "\n" + bd).replaceAll(regex, ","), d3.autoType)
			.map(d => {
				delete d.ignore1;
				delete d.ignore2;
				return d;
			});
		
		let partial = data.slice(500);
		partial.columns = data.columns;

		const radius =  3.6 / 5;
		const height = 10.0 / 5;  
		const radialSegments = 8;  
		const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
	
		let objects = [];
		objects = createInstances(partial, geometry, "crimson")
	
		for (let i = 0; i < objects.length ; i++) {
			scene.add(objects[i]);
		}

		// renderer.render(scene, camera);
		function render( time ) {
			time *= 0.001; // convert time to seconds
			
			if (resizeRendererToDisplaySize(renderer)) {
				const canvas = renderer.domElement;
				camera.aspect = canvas.clientWidth / canvas.clientHeight;
				camera.updateProjectionMatrix();
			}
			
			// objects.forEach( ( obj, ndx ) => {
	
			// 	const speed = 3 + ndx * .1;
			// 	const rot = time * speed;
			// 	obj.rotation.x = rot;
			// 	obj.rotation.y = rot;
			// });
	
			controls.update();
			renderer.render(scene, camera);
			requestAnimationFrame(render);
		}
		requestAnimationFrame(render);		
	});

	d3.select("#log-button").on("click", function() {
		console.log(camera);
	});

	d3.select("#main-canvas").on("dblclick", function() {
		camera.position.set(...[0,8,14]);
	});

}
mainLoader();