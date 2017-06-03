THREE.SkyShader = {

uniforms: THREE.UniformsUtils.merge( [

    THREE.UniformsLib[ "fog" ],

    {
    
    "texture" : { type: "t" },
    "height" : {type:"float"},
    "horizon" : {type:"float"},
    }

] ),

fragmentShader: [
    
    "uniform sampler2D texture;",
    "uniform float horizon;",
    "uniform float height;",
    "varying vec2 vUv;",
    "varying vec3 vModelPosition;",

    THREE.ShaderChunk[ "common" ],
    THREE.ShaderChunk[ "fog_pars_fragment" ],

    "void main() {",
      "vec4 tColor = texture2D( texture, vUv);",
      "float yPos = vModelPosition.y;", 
      "gl_FragColor = vec4(tColor.rgb, 1.0);",
        
      "float depth = gl_FragCoord.z / gl_FragCoord.w;",
      
      // Rather than stepping from fogNear to fogFar, as we normally would,
      // I step from HEIGHT, the height of the skydome, to HORIZON, a point at or
      // near the horizon where I want the fog to be fully applied. This 
      // generates fog near the horizon but none overhead.
      "float fogFactor = smoothstep( height, horizon/1.25, yPos );",
    
      "gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );",
    
    "}"

].join("\n"),

vertexShader: [
    "#define USE_ENVMAP",
    
    "varying vec3 vModelPosition;",
    "varying vec2 vUv;",
    "varying vec3 vViewPosition;",
    
    THREE.ShaderChunk[ "common" ],
    
    "void main() {",
      
      "vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
          
      "vViewPosition = -mvPosition.xyz;",
      "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "vModelPosition = position;",
      
    "}"

].join("\n")

};