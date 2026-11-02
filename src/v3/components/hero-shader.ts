/**
 * The hero's picture, as a fragment shader.
 *
 * One full-screen triangle; every pixel decides for itself what it is. Two
 * orbs — the purple one sliced into bands, the blue one a glass sphere — sit
 * on a field of noise and stars, and where they overlap the picture burns to
 * white with a corona and an anamorphic streak. `uIntro` carries the orbs in
 * from apart to overlapping over the first seconds; `uScroll` pushes them
 * further into each other as the page leaves the hero; `uMouse` leans both
 * towards the pointer.
 */
export const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

export const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime, uIntro, uFade, uScroll; uniform vec2 uMouse;
const vec3 ORCHID = vec3(.86,.455,.925);
const vec3 COBALT = vec3(.118,.41,.965);
const vec3 CORONA = vec3(1.,.84,.62);
float hash(vec2 p){ p = fract(p*vec2(123.34,456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y); }
float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
void main(){
  vec2 uv = (gl_FragCoord.xy - .5*uRes) / uRes.y;
  float aspect = uRes.x / uRes.y;
  float R = min(.27, .3*aspect);
  float cy = aspect < 1. ? .015 : 0.;
  float sep = mix(3.2, 1.24, uIntro) * R;
  sep = mix(sep, .62*R, uScroll);
  vec2 m = uMouse;
  vec2 cN = vec2(-sep*.5, cy) + m*vec2(.012,.008);
  vec2 cY = vec2( sep*.5, cy) - m*vec2(.008,.006);
  vec2 pN = uv - cN, pY = uv - cY;
  float sdN = length(pN) - R, sdY = length(pY) - R;
  float sdLens = max(sdN, sdY);
  vec2 lc = (cN + cY) * .5;
  vec2 pl = uv - lc;
  float rl = length(pl);
  vec2 dir = rl > 0. ? pl / rl : vec2(1.,0.);
  float ov = clamp((2.*R - sep) / (.76*R), 0., 1.3);
  float aa = 1.6 / uRes.y;

  /* deep space */
  vec3 col = vec3(.004,.004,.016);
  float neb = fbm(uv*1.4 + vec2(uTime*.008, 0.) + m*.03);
  col += mix(ORCHID, COBALT, smoothstep(-.7,.7, uv.x + (neb-.5)*1.2)) * pow(neb, 3.2) * .16;
  vec2 sg = (uv + m*.006) * 210.; vec2 si = floor(sg); float sh = hash(si);
  if (sh > .982) {
    vec2 sf = fract(sg) - .5 - (vec2(hash(si+1.3), hash(si+7.1)) - .5) * .55;
    float tw = .55 + .45*sin(uTime*(.8+sh*2.6) + sh*50.);
    col += vec3(.92,.9,1.) * smoothstep(.1, 0., length(sf)) * tw * (sh-.982) * 55.;
  }

  /* corona behind the orbs */
  float fil = fbm(dir*2.4 + vec2(rl*5. - uTime*.11, uTime*.03));
  float glowD = max(sdLens, 0.);
  float corona = exp(-glowD / (R*(.05 + .30*fil*fil))) * ov;
  float rays = pow(noise(dir*16. + uTime*.05), 5.) * exp(-rl/(R*1.5)) * ov;
  float wide = exp(-rl/(R*.9)) * ov;
  col += CORONA * (corona*1.15 + rays*1.6) + mix(ORCHID, COBALT, .5)*wide*.10;

  /* NO orb: orchid, sliced by slits */
  vec2 qN = pN / R; float zN = sqrt(max(1.-dot(qN,qN), 0.)); vec3 nN = vec3(qN, zN);
  float inN = 1. - smoothstep(-aa, aa, sdN);
  float lit = .18 + .82*clamp(ov, 0., 1.);
  float difN = max(dot(nN, normalize(vec3(1.,.12,.5))), 0.);
  vec3 orbN = ORCHID * (.06 + 1.05*difN*lit) + ORCHID*pow(1.-zN, 3.)*.55*lit;
  orbN += vec3(.28,.12,.4) * max(dot(nN, normalize(vec3(-.6,.7,.5))), 0.) * .22;
  float bands = 9.;
  float s = fract((uv.y - cN.y) / (2.*R) * bands + .5);
  float px = aa / (2.*R) * bands;
  float slit = 1. - smoothstep(.115 - px, .115 + px, abs(s - .115));
  col = mix(col, orbN, inN * (1. - slit));
  col += CORONA * slit * inN * exp(-length(uv-lc)/(R*.8)) * ov * 1.4;
  col += ORCHID * exp(-max(sdN,0.)/(R*.035)) * (1.-inN) * .28 * lit;

  /* YES orb: cobalt glass */
  vec2 qY = pY / R; float zY = sqrt(max(1.-dot(qY,qY), 0.)); vec3 nY = vec3(qY, zY);
  float inY = 1. - smoothstep(-aa, aa, sdY);
  float difY = max(dot(nY, normalize(vec3(-1.,.12,.5))), 0.);
  vec3 orbY = COBALT * (.05 + 1.1*difY*lit) + vec3(.45,.65,1.)*pow(1.-zY, 3.)*.5*lit;
  vec3 hv = normalize(normalize(vec3(-.9,.45,.6)) + vec3(0.,0.,1.));
  orbY += vec3(.85,.92,1.) * pow(max(dot(nY, hv), 0.), 70.) * .55 * lit;
  orbY += vec3(.1,.2,.5) * max(dot(nY, normalize(vec3(.6,.7,.4))), 0.) * .18;
  col = mix(col, orbY, inY);
  col += COBALT * exp(-max(sdY,0.)/(R*.035)) * (1.-inY) * (1.-inN) * .35 * lit;

  /* the lens where they overlap: white-hot */
  float inL = 1. - smoothstep(-aa, aa, sdLens);
  float rim = exp(min(sdLens, 0.) / (R*.05));
  float core = exp(-dot(pl, pl) / (R*R*.05));
  vec3 lens = mix(vec3(1.,.95,.88), CORONA, .5 - .3*rim) * (.72 + 1.5*rim + .5*core);
  lens *= 1. - slit*.16;
  col = mix(col, lens, inL * clamp(ov*3., 0., 1.));

  /* bloom + anamorphic streak on top */
  col += CORONA * exp(-glowD/(R*.04)) * ov * .55;
  float streak = exp(-abs(pl.y)/(R*.010)) * exp(-abs(pl.x)/(R*3.2)) * ov;
  col += vec3(.78,.84,1.) * streak * .55;
  col += vec3(.9,.8,1.) * exp(-abs(pl.y)/(R*.07)) * exp(-abs(pl.x)/(R*1.4)) * ov * .08;

  /* filmic tone + vignette + grain */
  col = max(col * 1.08, 0.);
  col = (col*(2.51*col+.03)) / (col*(2.43*col+.59)+.14);
  vec2 vg = uv * vec2(.55, 1.);
  col *= 1. - .55*dot(vg, vg);
  col += (hash(gl_FragCoord.xy + fract(uTime)*100.) - .5) * .025;
  gl_FragColor = vec4(clamp(col, 0., 1.) * uFade, 1.);
}`;

export type EclipseUniforms = {
  uRes: WebGLUniformLocation | null;
  uTime: WebGLUniformLocation | null;
  uIntro: WebGLUniformLocation | null;
  uFade: WebGLUniformLocation | null;
  uScroll: WebGLUniformLocation | null;
  uMouse: WebGLUniformLocation | null;
};

/** Compiles the program and binds the one triangle. Null where WebGL will not. */
export function initEclipse(gl: WebGLRenderingContext): EclipseUniforms | null {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const location = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  return {
    uRes: gl.getUniformLocation(program, 'uRes'),
    uTime: gl.getUniformLocation(program, 'uTime'),
    uIntro: gl.getUniformLocation(program, 'uIntro'),
    uFade: gl.getUniformLocation(program, 'uFade'),
    uScroll: gl.getUniformLocation(program, 'uScroll'),
    uMouse: gl.getUniformLocation(program, 'uMouse'),
  };
}
