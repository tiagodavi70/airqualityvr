import * as THREE from 'three';
import * as d3 from 'd3';

import { resizeRendererToDisplaySize, addControls } from './utils.mjs';

function createInstances(data, normal) {
	let color = d3.scaleLinear()
		.range(["white", "red"])
		.domain([0, d3.max(data, d => d.vel)]);

	// console.log(color.range(), color.domain());
	let geometry = new THREE.BufferGeometry();

	// const material = new THREE.MeshPhongMaterial( { color } );
	let positions = [];
	let colors = [];
	let normals = [];
	for (let i = 0; i < data.length ; i++) {
		let row = data[i];
		positions.push(row.x, 1, row.y);
		// colors.push(new THREE.Color(color(row.vel)));
		let c = d3.color(color(row.vel));
		
		colors.push(c.r / 255., c.g / 255., c.b / 255., 1);
		normals.push(...normal);
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4));
	// geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, normal.length));
	// geometry.computeVertexNormals();
	// geometry.normalizeNormals();
	geometry.computeBoundingSphere();

	let material = new THREE.PointsMaterial({
		size: 2,
		vertexColors: true
	});
	// let material = new THREE.MeshPhongMaterial( {
	// 	color: 0xd5d5d5, specular: 0xffffff, shininess: 250,
	// 	side: THREE.DoubleSide, vertexColors: true, transparent: true
	// });

	let points = new THREE.Points(geometry, material);
	// console.log(data[0]);
	return points;
}

function mainLoader() {

    const canvas = document.querySelector('#main-canvas');
    const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
	
	const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 2000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(...[397, 299, 628]);
	

    let controls = addControls(camera, renderer.domElement);

	const scene = new THREE.Scene();
    {
        const color = 0xAFAFFF;
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
				d.vel = Number(d.vel + "");
				
				if (isNaN(d.vel)) {
					d.vel = 0;
				}
				return d;
			});
		
		let partial = data.slice(500);
		partial.columns = data.columns;

		const radius =  3.6 / 5;
		const height = 10.0 / 5;  
		const radialSegments = 8;  
		const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
		console.log(geometry);

		scene.add(createInstances(data, geometry.attributes.normal.array));
		scene.background = new THREE.Color(0x0F6F05);

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