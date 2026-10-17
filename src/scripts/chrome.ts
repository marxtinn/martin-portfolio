// Liquid-chrome ribbons rendered with a single WebGL2 fragment shader.
// Ribbons are level sets of one flowing field: they bundle together on the left
// and fan out to the right. Each is shaded as a chrome tube reflecting a soft
// studio environment, with thin-film iridescence near its edges.

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform vec3 uBg;
out vec4 outColor;

float env(vec3 r) {
  float e = 0.88;
  e += 0.14 * smoothstep(0.1, 0.9, r.y);                              // bright sky
  e += 0.35 * exp(-pow((r.y - 0.42) / 0.07, 2.0));                    // glossy studio strip
  e -= 0.34 * exp(-pow((r.y + 0.10) / 0.14, 2.0));                    // horizon band
  e -= 0.14 * exp(-pow((r.x - 0.55) / 0.22, 2.0));                    // flag on the right
  e += 0.25 * exp(-pow((r.x + 0.38) / 0.10, 2.0)) * smoothstep(-0.1, 0.6, r.y); // softbox
  e -= 0.12 * smoothstep(0.2, -0.9, r.y);                             // floor
  return e;
}

// Soft pastel thin-film palette: pink, ice blue, peach.
vec3 filmColor(float k) {
  vec3 pink = vec3(1.0, 0.72, 0.86);
  vec3 blue = vec3(0.66, 0.82, 1.0);
  vec3 peach = vec3(1.0, 0.86, 0.66);
  float f = fract(k);
  vec3 c = mix(pink, blue, smoothstep(0.0, 0.33, f));
  c = mix(c, peach, smoothstep(0.33, 0.66, f));
  return mix(c, pink, smoothstep(0.66, 1.0, f));
}

void main() {
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float xn = p.x / (0.5 * aspect);                                // -1..1 across the width
  float t = uTime;

  // Center line of the bundle: low on the left, rising toward the top right.
  float yc = -0.22 + 0.26 * xn + 0.035 * sin(xn * 2.6 + t * 0.35) + 0.04 * uMouse.y * (xn + 1.0);
  // Ribbon spacing widens left to right (converge, then fan out).
  float fan = smoothstep(-1.1, 1.0, xn);
  float spacing = 0.028 + 0.17 * fan * fan;
  float warp = 0.012 * sin(xn * 5.0 - t * 0.5) + 0.01 * sin(xn * 9.0 + t * 0.7 + uMouse.x);
  float f = (p.y - yc - warp) / spacing;

  float idx = floor(f + 0.5);
  float u = f - idx;                                              // -0.5..0.5 across one period
  float w = mix(0.5, 0.34, smoothstep(-0.9, 0.2, xn));            // touching on the left, gaps on the right
  float x = u / w;                                                // -1..1 inside a ribbon

  float keep = step(abs(idx), 2.0);
  float ax = abs(x);
  float aa = fwidth(x) * 1.2;
  float alpha = (1.0 - smoothstep(1.0 - aa, 1.0, ax)) * keep;

  vec2 g = normalize(vec2(dFdx(f), dFdy(f)) + 1e-6);
  float nz = sqrt(max(1.0 - x * x, 0.0));
  vec3 n = normalize(vec3(g * x * 1.1, nz));
  vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);

  float e = env(r);
  // Slight per-ribbon variation so the bundle doesn't read as one flat strip.
  e *= 0.94 + 0.06 * sin(idx * 2.3 + 1.0);
  vec3 col = vec3(e) * vec3(0.93, 0.93, 0.98);

  // Thin-film iridescence: strongest along the rims and where the bundle bends.
  float bend = 0.5 + 0.5 * sin(xn * 3.2 + idx * 0.9 + t * 0.25);
  float rim = smoothstep(0.35, 0.95, ax) * (0.35 + 0.65 * bend);
  vec3 film = filmColor(ax * 0.9 + xn * 0.25 + idx * 0.17 + t * 0.03);
  col = mix(col, col * film * 1.12, rim * 0.85);

  // Gentle edge falloff to define the silhouette without going grey.
  col *= mix(1.0, 0.84, smoothstep(0.9, 1.0, ax));
  col = pow(clamp(col, 0.0, 1.2), vec3(0.9));

  // Fade ribbons at the far left edge so they emerge rather than start abruptly.
  alpha *= smoothstep(-1.05, -0.75, xn);
  // ...and clear the strip under the header so nav links stay legible.
  alpha *= 1.0 - smoothstep(0.36, 0.47, p.y);

  outColor = vec4(mix(uBg, col, alpha), 1.0);
}`;

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader');
  return s;
}

function readBg(): [number, number, number] {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  const m = hex.match(/^#([0-9a-f]{6})$/i);
  if (!m) return [0.98, 0.98, 0.98];
  const v = parseInt(m[1], 16);
  return [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
}

function isSoftwareRenderer(gl: WebGL2RenderingContext) {
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER));
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer);
}

export function mountChrome(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!gl) {
    canvas.dataset.fallback = 'true';
    return;
  }

  // Without GPU acceleration (VMs, remote desktops, CI) the shader runs on the CPU and stalls
  // the page, so use the still image there. ?force-webgl skips this check for testing.
  if (isSoftwareRenderer(gl) && !new URLSearchParams(location.search).has('force-webgl')) {
    canvas.dataset.fallback = 'true';
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return;
  }

  const prog = gl.createProgram()!;
  try {
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  } catch {
    canvas.dataset.fallback = 'true';
    return;
  }
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uBg = gl.getUniformLocation(prog, 'uBg');

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Phones and tablets: 30 fps is visually identical for this slow motion and halves GPU work.
  const minFrameMs = matchMedia('(pointer: coarse)').matches ? 1000 / 30 : 0;
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  let bg = readBg();
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let lastDraw = 0;
  let time = 8;
  let lost = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.round(canvas.clientWidth * dpr);
    const h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  const draw = () => {
    resize();
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.uniform3f(uBg, bg[0], bg[1], bg[2]);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    if (now - lastDraw >= minFrameMs - 1) {
      lastDraw = now;
      draw();
    }
    raf = visible && !lost ? requestAnimationFrame(loop) : 0;
  };

  const start = () => {
    if (reduce || raf || lost) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };

  new ResizeObserver(() => !lost && (reduce || !raf) && draw()).observe(canvas);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
  }).observe(canvas);

  if (!reduce && matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
  }

  window.addEventListener('themechange', () => {
    bg = readBg();
    if (!lost && (reduce || !raf)) draw();
  });

  // If the GPU drops the context (driver reset, memory pressure), show the still image instead.
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    canvas.dataset.fallback = 'true';
  });

  draw();
  start();
}
