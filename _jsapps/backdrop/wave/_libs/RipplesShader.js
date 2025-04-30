/**
 * @author felixturner / http://airtight.cc/
 *
 * Draw image on rippling mesh
 */

 THREE.RipplesShader = {

	uniforms: {

		"texture": { type: "t", value: null },
		"noiseTime": { type: "f", value: 1.0 },
		"noiseSize": { type: "f", value: 2.0 },
		"noiseDepth": { type: "f", value: 300 },
		"dispDepth": { type: "f", value: 300 },
		"stretch": { type: "f", value: 10.0 },
		"timeX": { type: "f", value: 0.0 },
		"timeY": { type: "f", value: 0.0 },
		"brighten": { type: "f", value: 0.0 },


	},

	vertexShader: [


		"varying vec2 vUv;",
		"varying float vDisp;",

		"uniform sampler2D texture;",
		"uniform float noiseTime;",
		"uniform float noiseSize;",
		"uniform float dispDepth;",
		"uniform float noiseDepth;",
		"uniform float stretch;",
		"uniform float timeX;",
		"uniform float timeY;",

		// Start Ashima 2D Simplex Noise

		//outputs in range -1 to 1

		"vec3 mod289(vec3 x) {",
		  "return x - floor(x * (1.0 / 289.0)) * 289.0;",
		"}",

		"vec2 mod289(vec2 x) {",
		  "return x - floor(x * (1.0 / 289.0)) * 289.0;",
		"}",

		"vec3 permute(vec3 x) {",
		  "return mod289(((x*34.0)+1.0)*x);",
		"}",

		"float snoise(vec2 v) {",

			"const vec4 C = vec4(0.211324865405187,",  // (3.0-sqrt(3.0))/6.0
			"				  0.366025403784439,",  // 0.5*(sqrt(3.0)-1.0)
			"				 -0.577350269189626,",  // -1.0 + 2.0 * C.x
			"				  0.024390243902439);", // 1.0 / 41.0",

			"vec2 i  = floor(v + dot(v, C.yy) );",
			"vec2 x0 = v -   i + dot(i, C.xx);",

			"vec2 i1;",
			"i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
			"vec4 x12 = x0.xyxy + C.xxzz;",
			"x12.xy -= i1;",

			"i = mod289(i); // Avoid truncation effects in permutation",
			"vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
			"	+ i.x + vec3(0.0, i1.x, 1.0 ));",

			"vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
			"m = m*m ;",
			"m = m*m ;",

			"vec3 x = 2.0 * fract(p * C.www) - 1.0;",
			"vec3 h = abs(x) - 0.5;",
			"vec3 ox = floor(x + 0.5);",
			"vec3 a0 = x - ox;",

			"m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",

			"vec3 g;",
			"g.x  = a0.x  * x0.x  + h.x  * x0.y;",
			"g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
			"return 130.0 * dot(m, g);",
		"}",

		// End Ashima 2D Simplex Noise

		//normal disp
		"void main() {",
			"vUv = uv*4.0 ;",

			//move on X + Y axis
			//mirror every other copy of image to give seamless edges
			//however gives reversed image 1/2 the time
			"vUv.x = 1.0 - abs(2.0 * fract((timeX+ vUv.x+0.5)/2.0 ) - 1.0)  ;",
			"vUv.y = 1.0 - abs(2.0 * fract((timeY + vUv.y+0.5)/2.0 ) - 1.0) ;",

			//noise disp
			"float noiseDisp = snoise(vUv*noiseSize + noiseTime) * noiseDepth;",

			//brightness disp
			"vec4 color = texture2D( texture, vUv );",
			"float value = ( color.r + color.g + color.b ) / 3.0;",
			"float brightDisp = value * dispDepth;",

			"vDisp = brightDisp + noiseDisp;",

			"vec3 newPosition = position + normal * vDisp;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",

		"}",

	].join("\n"),

	fragmentShader: [

		"const vec3 black = vec3(0.0, 0.0, 0.0);",

		"uniform float noiseTime;",
		"uniform float brighten;",
		"uniform sampler2D texture;",

		"varying vec2 vUv;",
		"varying float vDisp;",

		"void main() {",

			//get orig color
  			"vec3 c = texture2D(texture, vUv).rgb;",

			//brighten and darken based on disp
			"vec3 fragcol = mix(c, black, -vDisp * brighten);", //
			"gl_FragColor = vec4(fragcol, 1.0);",

		"}",

		].join("\n")

	};
