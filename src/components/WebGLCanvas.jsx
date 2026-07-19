import React, { useEffect, useRef } from 'react';

export default function WebGLCanvas({ isHome }) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    let gl;
    try {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      console.error('WebGL not supported', e);
      return;
    }
    if (!gl) return;

    // Fix resolution: set internal canvas size to match the video's RGB portion
    const width = 678;
    const height = 720;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Enable alpha blending
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = position * 0.5 + 0.5;
        vUv.y = 1.0 - vUv.y;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform sampler2D u_texture;
      varying vec2 vUv;
      void main() {
        vec2 rgbUv = vec2(vUv.x, vUv.y * 0.5);
        vec2 alphaUv = vec2(vUv.x, vUv.y * 0.5 + 0.5);
        
        vec3 rgb = texture2D(u_texture, rgbUv).rgb;
        float alpha = texture2D(u_texture, alphaUv).r;
        
        gl_FragColor = vec4(rgb * alpha, alpha);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0
    ]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    let animationFrameId;

    function render() {
      if (video.readyState >= video.HAVE_CURRENT_DATA) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    }

    const onPlay = () => {
      animationFrameId = requestAnimationFrame(render);
    };

    video.addEventListener('play', onPlay);

    if (!video.paused && video.readyState >= video.HAVE_CURRENT_DATA) {
      animationFrameId = requestAnimationFrame(render);
    }

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const fallbackPlay = () => {
          video.play();
          document.body.removeEventListener('click', fallbackPlay);
        };
        document.body.addEventListener('click', fallbackPlay);
      });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      video.removeEventListener('play', onPlay);
    };
  }, []);

  return (
    <div 
      className="canvas-container" 
      id="canvas-container"
      style={{
        opacity: isHome ? 1 : 0,
        pointerEvents: isHome ? 'auto' : 'none'
      }}
    >
      <div className="black-line"></div>
      <canvas ref={canvasRef} id="three-canvas"></canvas>
      <video 
        ref={videoRef} 
        id="three-video" 
        src="https://video.wixstatic.com/video/11062b_e117c5a14ded4ed3bf6f9efafa1896d9/720p/mp4/file.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        crossOrigin="anonymous"
      ></video>
      <p className="description-text" id="description-text">
        He Jin Jang Dance is a choreographic project group rooted in embodied research, collective ritual, and artistic kinship — led by He Jin Jang
      </p>
    </div>
  );
}
