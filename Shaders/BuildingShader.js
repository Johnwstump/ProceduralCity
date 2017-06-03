THREE.BuildingShader = {

uniforms: THREE.UniformsUtils.merge( [

    THREE.UniformsLib[ "fog" ],

    {
    
    "texture" : { type: "t" },
		"texture2" : { type: "t"},
    "height" : {type:"float"},
    "width" : {type:"float"},
    "rColor" : {type: "vec3"}

    }

] ),

fragmentShader: [
    
    "uniform sampler2D texture;",
    "uniform sampler2D texture2;",
    "uniform vec3 rColor;",
    "uniform float height;",
    "uniform float width;",
    "varying vec2 vUv;",
    "varying vec2 vUv2;",
    "varying vec3 vModelPosition;",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "fog_pars_fragment" ],

    "void main() {",
        "vec4 tColor = texture2D( texture, vUv);",
        "vec4 tColor2 = texture2D( texture2, vUv2);",
        
        "float yPos = vModelPosition.y;",
        
        "tColor.r = tColor.r + rColor.r;",
        "tColor.g = tColor.g + rColor.g;",
        "tColor.b = tColor.b + rColor.b;",
        
        // I do not mix the window texture (texture2) at the very bottom or
        // top of the geometry.
        "if (yPos >= height -.5){",
          "gl_FragColor = vec4(tColor.rgb, 1.0);",
        "}",    
        "else if (yPos >= -height + 1.0){",
          "gl_FragColor = vec4(mix(tColor.rgb, tColor2.rgb, tColor2.a ), 1.0 );",
        "}",
        "else {",
          "gl_FragColor = vec4(tColor.rgb, 1.0);",
        "}",
        
        // Load in fog chunk to mix fog value
       THREE.ShaderChunk[ "fog_fragment" ],
    "}"

].join("\n"),

vertexShader: [
    "#define USE_ENVMAP",
    
    "uniform float width;",
    "uniform float height;",
    "uniform vec3 rColor;",
    "varying vec3 vModelPosition;",
    "varying vec2 vUv;",
    "varying vec2 vUv2;",
    
    THREE.ShaderChunk[ "common" ],
    
    "void main() {",
      
      // Manually multiply uv to set repeat values
      "vUv.x = uv.x * width * 2.0;",
      "vUv.y = uv.y * height * 2.0;",

      "vUv2.x = uv.x * (width/2.0);",
      "vUv2.y = uv.y * (height/2.0 - .25);",
          
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "vModelPosition = position;",
      
    "}"

].join("\n")

};