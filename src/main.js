import './style.css';

// ============================================
// WebGL Transparent Video Player
// Decodes the packed video (RGB top, Alpha bottom)
// ============================================
function initWebGLVideo() {
  const canvas = document.getElementById('three-canvas');
  const video = document.getElementById('three-video');
  if (!canvas || !video) return;

  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  if (!gl) return;

  // Fix resolution: set internal canvas size to match the video's RGB portion
  // The video is 678x1440, RGB is the top 678x720
  const width = 678;
  const height = 720;
  
  // Apply device pixel ratio for sharp rendering on high-DPI (Retina) displays
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
      // Flip Y since WebGL coordinates start from bottom-left
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

  function render() {
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      
      // Clear the canvas
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    requestAnimationFrame(render);
  }

  // Handle video playback
  video.addEventListener('play', () => {
    requestAnimationFrame(render);
  });
  
  // Force play if it was already playing
  if (!video.paused && video.readyState >= video.HAVE_CURRENT_DATA) {
    requestAnimationFrame(render);
  }

  // Attempt autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Auto-play was prevented
      // Adding a click listener as fallback
      document.body.addEventListener('click', () => video.play(), { once: true });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initWebGLVideo();
  // Call init on mutations too in case router reloads the canvas
  const observer = new MutationObserver(() => {
    if (!document.getElementById('three-canvas').getAttribute('data-initialized')) {
      document.getElementById('three-canvas').setAttribute('data-initialized', 'true');
      initWebGLVideo();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
});

// ============================================
// Single Page Application (SPA) Router
// Dynamically rendering subpages on hejinjang.com
// ============================================

const routes = {
  '/': {
    title: 'Home | He Jin Jang Dance',
    render: () => ''
  },
  '/about-bio': {
    title: 'About | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                
                
<div class="N8MGzv _v6ohL PO9MfV comp-j82tiuiu wixui-rich-text" data-testid="richTextElement" id="comp-j82tiuiu"><p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">He Jin Jang Dance​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">He Jin Jang Dance is a choreographic project group that works across contemporary dance, experimental performance, sound, writing, and installation — often involving fluid constellations of collaborators tailored to each project. Rather than functioning as a fixed ensemble, the group unfolds as a porous structure — a space that holds kinship, critical collaboration, and embodied knowledge production. At the heart of the collective lies an ongoing inquiry into the invisible: invisible bodies, unspoken grief, minor gestures, and non-linear rituals of togetherness. HJJD explores bodily vulnerability through the Eastern concept of mind-body, focusing on the four stages of life — birth, aging, illness, and death. Led by choreographer and researcher He Jin Jang, the group produces performances, writings, discourses, and workshops that blur the boundaries between contemplation and monstrosity, personal memory and collective dreaming. Since its debut in the United States with <span class="wixui-rich-text__text" style="font-style:italic;">open skin inscribed</span> (2008), which investigated inherited skin trauma as a threshold between internal and external realities, HJJD has presented works in over 30 cities worldwide — including Seoul International Dance Festival (KR), MODAFE (KR), Platform-L Live Arts Program (KR), Laboratorio Condensación (MX), National Museum of Contemporary Arts (RO), Temps d'Image Festival (RO), Musikfestival Bern (CH), New York Live Arts (US), and The Kitchen (US). Using somatic improvisation, text, imagery, and socio-political commentary — grounded in both Western and non-Western methodologies — HJJD creates spaces for collective lucid dreaming and rehearsals for survival. The group’s work has been supported by Seoul Foundation for Arts and Culture, Arts Council Korea, and Korea Arts Management Service, and has been described by the press as work that “humbles us all” (Indy Week, US).</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">He Jin Jang</span></span></span></p>
<blockquote class="font_8 wixui-rich-text__text" style="font-size:15px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Described by Dance Magazine MOMM (KR) as “a daring and candid choreographer,” He Jin Jang is a multicity-based choreographer and researcher born and raised in Seoul, Korea. Her practice approaches choreography as a method of sensing, remembering, and unmaking—exploring the nervous systems of vulnerability shaped by grief, memory, and sensory dissonance. Grounded in somatic movement, feminist theory, and indigenous healing practices, her work spans choreography, research, performance coaching, curatorial care, and dramaturgy. She has served as a mentor or performance coach with institutions such as the Asian Cultural Center (KR), University of the Arts (US), New York Foundation for the Arts (US), and the Korea National Contemporary Dance Company. Jang has provided dramaturgical support to artists including Ursula Eagly, James Cousins, Yunkyung Hur, and Ae-Soon Ahn. She has co-curated numerous programs, including Brick-Break Platform at Arts Council Korea Theater, Seoul International Choreography Workshop, and Choreo-Lab at the Korea National Contemporary Dance Company. Her international residencies and fellowships include the Saison Foundation Online Artist-in-Residence (JP), Laboratorio Condensación (MX), DanceWeb Fellowship (AT), Artist-in-Residence at Movement Research (US), and Fresh Tracks at New York Live Arts (US). She is currently based in Singapore, where she is a fellow of T:Works’ Artistic Director Academy, and a core member of the choreographic collective Tangerine.</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">Current Research</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Jang is currently pursuing a practice-based PhD in Creativity at Transart Institute, in partnership with Liverpool John Moores University. Her research investigates choreography as a ritualistic methodology of resilience and embodied historiography. She reimagines rehearsal as a speculative, socio-political, and sensory site — one that traverses inherited trauma, collective repair, and invisible embodiment. Through somatic whispering, proprioceptive exploration, and artistic autoethnography, she constructs listening environments that operate with and through the body. She is also a certified Franklin Method® educator, a somatic practice grounded in Dynamic Neurocognitive Imagery™, which informs her movement education and embodied research.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;">E<span class="wixui-rich-text__text" style="font-weight:bold;">nglish CV</span></span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">혜진장댄스</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">He Jin Jang Dance는 생로병사를 겪는 연약한 몸, 그리고 그 몸이 사회적 구조와 관계 맺는 방식을 감각하고 질문하는 프로젝트 그룹이다. 춤 창작과 리서치, 퍼포먼스, 집필, 담론, 워크숍을 오가며, 프로젝트마다 유동적으로 구성되는 협업자들과 함께 작업을 확장해 왔다. 고정된 앙상블이 아니라, 친밀성과 비판적 협업, 신체 기반 지식 생산이 교차하는 다공성 구조(porous constellation)로 작동한다. 관심의 중심에는 늘 보이지 않는 것들이 있다 — 보이지 않는 몸, 말해지지 않은 슬픔, 사소한 몸짓, 비선형적인 공동체적 의례. 동양의 심신 철학을 기반으로, 탄생과 노화, 질병과 죽음이라는 생의 네 단계를 가로지르며 몸의 취약함을 예술 언어로 탐색해왔다. 2008년 미국에서 발표한 첫 작업 <span class="wixui-rich-text__text" style="font-style:italic;">open skin inscribed</span>는 유전성 피부병에 관한 가족사를 리서치하여, 몸과 사회를 구성하는 감각의 표면으로서 피부에 주목한 안무였다. 이 작업은 『인디 위크』로부터 “우리 모두를 겸허하게 만드는 작품”이라는 평을 받았다. 이후 서울국제무용제, MODAFE, 플랫폼-엘 PLAP, Laboratorio Condensación(멕시코), 부쿠레슈티 국립현대미술관(루마니아), Temps d'Image Festival (루마니아), Musikfestival Bern(스위스), 뉴욕 라이브 아츠, 더 키친 등 30여 개 도시의 예술기관과 페스티벌에서 작업을 발표하며, 퍼포먼스, 전시, 워크숍, 렉처, 대화 등 다양한 형태로 리서치를 공유해 왔다. 한국문화예술위원회, 서울문화재단, 예술경영지원센터 등의 지원 아래 진행된 작업들은, 소매틱 즉흥, 심상, 언어, 사회적 비평을 연결하며 집단 자각몽의 순간을 불러낸다. 이러한 예술적 사건들은 고통과 유머, 과거와 미래, 외부와 내부, 개인과 공동의 기억을 넘나들며, 공동 생존의 감각을 리허설하는 공간을 구성한다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">장혜진 </span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">장혜진은 서울에서 태어나 다양한 도시를 기반으로 활동해온 안무가이자 리서처다. 인간이 피할 수 없는 연약함에 대해 몸이 반응하는 방식을 감각하고, 그 신경계의 움직임을 안무로 조직하며, 생존의 리듬을 라이브 아트의 언어로 탐구해왔다. 『월간 몸』은 그녀를 “대담무쌍하고 솔직한 안무가”로 소개한 바 있다. 그녀의 작업은 소매틱 움직임, 페미니즘 이론, 토착 치유 지식을 기반으로 하며, 안무 창작과 연구, 퍼포먼스 코칭, 예술 기획과 드라마투르기를 넘나들며 펼쳐진다. 그간 오스트리아 DanceWeb 펠로우십(2011), 뉴욕 Movement Research 상주예술가(2009–11), 루마니아 무빙 다이얼로그 교환안무가(2011), 뉴욕 라이브 아츠 Fresh Tracks 상주예술가(2014–15), Knowing Dance More 초청 안무가(2017), 멕시코 Laboratorio Condensación 초청 안무가(2018), 일본 Saison Foundation 온라인 상주예술가(2021–22), 캐나다 지브랄타 포인트 상주예술가(2024) 등에 선정되며, 국제적 네트워크 안에서 다층적인 리서치를 이어왔다. 동료 예술가들의 작업을 돌보는 퍼포먼스 코치, 예술 자문, 드라마투르그로서의 활동도 꾸준히 지속해왔으며, 뉴욕예술재단 안무 멘토(2014), 서울무용센터 자문위원(2016–19), 아시아문화전당 안무랩 멘토(2019–21), 미국 유아츠 대학원 안무 멘토(2019–21), 국립현대무용단 퍼포먼스 코치(2022–23)로도 참여해왔다. 어술리 이글리, 제임스 커즌즈, 안애순, 이은경, 허윤경 등의 작업에 드라마투르그로 함께했다. 또한 국립현대무용단 Choreo-Lab(2016), 서울문화재단 서울국제안무워크숍(2017), 아르코예술극장 Brick-Break Platform(2021) 등을 공동 기획하며, 안무와 공동체적 실천이 만나는 새로운 예술적 구조를 구상하고 실현해왔다. 서울대학교 체육교육과 무용전공을 졸업하고, 미시간대학교에서 무용 석사과정을 수료했으며, 미국 홀린즈대학교에서 안무 석사를 마쳤다. 현재는 싱가포르에 거주하며, T:Works의 Artistic Director Academy 펠로우로 활동 중, 탠저린 콜렉티브의 공동 멤버이기도 하다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text" style="color:#FF00CB;">최근 연구</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="color:#000000;">장혜진은 현재 Transart Institute와 Liverpool John Moores University의 공동 프로그램으로 실천 기반 박사과정(Practice-Based PhD)에 재학 중이다. 그녀의 연구는 안무를 회복력과 몸의 역사 쓰기를 위한 의례적 방법론으로 바라보며, 리허설을 상상적이고, 사회정치적이며, 감각적인 실천의 장소로 새롭게 정의한다. </span><span class="wixui-rich-text__text" style="color:#000000;">그녀는 유전된 트라우마, 공동 회복, 비가시적 몸의 현존을 다루며, 소매틱 속삭임(somatic whispering), 고유수용감각 탐색(proprioceptive guidance), 예술적 자문화기술지(artistic autoethnography)를 활용해 몸으로 듣는 리서치 환경을 구축한다. </span><span class="wixui-rich-text__text" style="color:#000000;">또한, Franklin Method® 공인 교육자로서, Dynamic Neurocognitive Imagery™ 기반의 소매틱 접근법을 자신의 무브먼트 교육 및 연구에 적극적으로 적용하고 있다.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="color:#000000;">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;">국문 CV</span></span></span><span class="wixui-rich-text__text" style="color:#000000;">​</span>​</span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 849/566; max-width: 849px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_2297e8f0e68e48f89b1818f21e2028ee~mv2.jpeg/v1/fill/w_849,h_566,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_2297e8f0e68e48f89b1818f21e2028ee~mv2.jpeg">
                    <span class="placeholder-label">Image:  (849x566)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-j8lb81gy wixui-rich-text" data-testid="richTextElement" id="comp-j8lb81gy"><p class="font_9 color_14 wixui-rich-text__text" style="line-height:normal; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:din-next-w01-light,din-next-w02-light,din-next-w10-light,sans-serif;"><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">© 2024 by He Jin J</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">ang</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);"> Dance. all right reserved.</span></span></p></div>
      </div>
    `
  },
  '/upcoming': {
    title: 'Upcoming | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                
                
<div class="N8MGzv _v6ohL PO9MfV comp-mft9un5k wixui-rich-text" data-testid="richTextElement" id="comp-mft9un5k"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-style:italic;">Upcoming</span></span></span></span></h6></div>
<div class="N8MGzv _v6ohL PO9MfV comp-mft9un8x1 wixui-rich-text" data-testid="richTextElement" id="comp-mft9un8x1"><p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">Sep 18–21, 2025:  Unseaming. — SIDance Festival, Korea</span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;"><span class="wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">Sep 22 · Artist’s Talk &amp; Workshop at Korea National University of the Arts</span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><br class="wixui-rich-text__text"/>
<span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">2025 Oct 13–24 · Guest Choreographer — LASALLE College of the Arts, Singapore</span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><br class="wixui-rich-text__text"/>
<span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">2025 Nov 5 · Lecture Performance — NAFA Research Café, Singapore</span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><br class="wixui-rich-text__text"/>
<span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">2025 Nov 15 · QUANDARY Performance — MIAO Dance, Singapore</span></span></span></p>
<p class="font_7 wixui-rich-text__text" dir="rtl" style="line-height:1.4em; text-align:left; font-size:16px;"><br class="wixui-rich-text__text"/>
<span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;">2025 Nov 28 – Dec 7 · Inbetween Space Lab with Marie France Forcier &amp; Heidi Strauss,</span></span></span><span class="color_42 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-shadow:#ffffff 0px 0px 6px;"><span class="wixui-rich-text__text" style="font-weight:bold;"> Singapore</span></span></span></p></div>
<div class="N8MGzv _v6ohL PO9MfV comp-j8lb81gy wixui-rich-text" data-testid="richTextElement" id="comp-j8lb81gy"><p class="font_9 color_14 wixui-rich-text__text" style="line-height:normal; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:din-next-w01-light,din-next-w02-light,din-next-w10-light,sans-serif;"><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">© 2024 by He Jin J</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">ang</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);"> Dance. all right reserved.</span></span></p></div>
      </div>
    `
  },
  '/contact': {
    title: 'Contact | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzcs2att wixui-rich-text" data-testid="richTextElement" id="comp-lzcs2att"><p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:2em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:20px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">He Jin Jang Dance</span></span><br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Email /<span class="wixui-rich-text__text" style="color:#0080FF;"> <span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" data-auto-recognition="true" href="mailto:hejinjangdance@gmail.com">hejinjangdance@gmail.com</a></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:2em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">Youtube / <span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" data-auto-recognition="true" href="https://www.youtube.com" target="_blank">https://www.youtube.com</a>@hejinjangdance</span></span><br class="wixui-rich-text__text"/>
Instagram / <a class="wixui-rich-text__text" href="https://www.instagram.com/hejinjangdance/" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;">@hejinjangdance</span></span></a></span></p></div>
<div class="N8MGzv _v6ohL PO9MfV comp-j8lb81gy wixui-rich-text" data-testid="richTextElement" id="comp-j8lb81gy"><p class="font_9 color_14 wixui-rich-text__text" style="line-height:normal; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:din-next-w01-light,din-next-w02-light,din-next-w10-light,sans-serif;"><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">© 2024 by He Jin J</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);">ang</span><span class="wixui-rich-text__text" style="color:rgb(255, 0, 203);"> Dance. all right reserved.</span></span></p></div>
      </div>
    `
  },
  '/press-review': {
    title: 'Press | He Jin Jang Dance',
    render: () => `
      <div class="press-page">
        <h1 class="press-title">Press Reviews</h1>
        <div class="press-grid">
          <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" class="press-card" data-link>
            <h3 class="press-card-title">Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, &lt;투명인간이 되든, 춤을 추든&gt;, 유화정 평론가</h3>
            <p class="press-card-excerpt">
              “He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together by 'those who move,' 'those who observe the movement,' and 'those who are observing those who observe the movement' is nothing other than rhythm itself. The spontaneous rhythm of the space, created with invisibleout a clear cause-and-effect relationship, enables a unique solidarity among the participants on the spot. For her, dance seems to be not about conveyi...
            </p>
          </a>
          
          <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" class="press-card" data-link>
            <h3 class="press-card-title">Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, &lt;당신이 그런 것을 입게 될 줄 알았어&gt;</h3>
            <p class="press-card-excerpt">
              “In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...
            </p>
          </a>

          <a href="/post/복제-투명인간이-되든-춤을-추든" class="press-card" data-link>
            <h3 class="press-card-title">Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, &lt;당신이 그런 것을 입게 될 줄 알았어&gt; ,박성혜 평론가</h3>
            <p class="press-card-excerpt">
              "I bet you’d put that on is not merely a simple play with blankets; it is simultaneously a play with corpses and a meticulously designed...
            </p>
          </a>

          <a href="/post/2023년-『아트신』-1월호-김민관-평론가-당신이-그런-것을-입게-될-줄-알았어" class="press-card" data-link>
            <h3 class="press-card-title">Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, &lt;당신이 그런 것을 입게 될 줄 알았어&gt;, 2023년, 김민관 평론가</h3>
            <p class="press-card-excerpt">
              "The audience is held on the mat and experiences the distortion of their body on the fluid ground, not through seeing or hearing. The...
            </p>
          </a>

          <a href="/post/당신은x-being을-초대하지-않을-수-없다" class="press-card" data-link>
            <h3 class="press-card-title">Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, &lt;당신은 x-being을 초대하지 않을 수 없다&gt; 2022년, 김민관 평론가</h3>
            <p class="press-card-excerpt">
              “Kim's critique addresses the opacity of the performer's body occupying time and space, inviting the audience to encounter the presence of the other and experience encounters with the uncontrollable...”
            </p>
          </a>

          <a href="/post/2021년-신빛나리-드라마터그-당신은-x-being을-초대하지-않을-수-없다" class="press-card" data-link>
            <h3 class="press-card-title">You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / &lt;당신은 x-being을 초대하지 않을 수 없다&gt;, 2021년, 신빛나리 드라마터그</h3>
            <p class="press-card-excerpt">
              “Shin's dramaturgical approach closely weaves a critical collaboration that allows the sensing of invisible presence across the boundaries of the body...”
            </p>
          </a>

          <a href="/post/2021년-『월간잡지-몸』-11월호-김남수-안무비평-흐르는" class="press-card" data-link>
            <h3 class="press-card-title">Dance Magazine MOMM, November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호, &lt;흐르는. &gt;, 2021년, 김남수 안무비평가</h3>
            <p class="press-card-excerpt">
              “The flowing conveys a deep sensory tremor to the audience beyond visual representation, leading to a decentering liberation where choreography escapes from human-centered movements...”
            </p>
          </a>

          <a href="/post/2021년-조형빈-평론가-흐르는" class="press-card" data-link>
            <h3 class="press-card-title">Hyungbin Jo (Critic), 2021, the flowing. / &lt;흐르는. &gt; , 2021년, 조형빈 평론가</h3>
            <p class="press-card-excerpt">
              “Jo's critical perspective points out the raw sense of physical reality that blooms when choreography escapes human control and resonates with the flow of chance and matter...”
            </p>
          </a>
        </div>
      </div>
    `
  },
  '/available-2011': {
    title: 'Available (2011) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzclmbqe wixui-rich-text" data-testid="richTextElement" id="comp-lzclmbqe"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">Available</span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"> (2011)<br class="wixui-rich-text__text"/>
어베일러블 (2011)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Cosmin Manolescu and Gabriella Maiorino</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 783/508; max-width: 783px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_25775b60301b43cead3f8a79a14dad60~mv2.jpg/v1/crop/x_0,y_0,w_1200,h_778/fill/w_783,h_508,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202024-01-22%20%EC%98%A4%ED%9B%84%201_01_51%20copy.jpg">
                    <span class="placeholder-label">Image: 스크린샷 2024-01-22 오후 1.01.51 copy.jpg (783x508)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzclmbqp4 wixui-rich-text" data-testid="richTextElement" id="comp-lzclmbqp4"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span><span class="wixui-rich-text__text">​​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">Three choreographers from three different cities – Bucharest, Amsterdam, Seoul – engage in creating a co-authorship performance entirely based on online communication during a 4-month period. Each of them makes themselves “available” to the others, committing to developing a solo performance based on Facebook communication, Skype calls, YouTube links, messages, and photos proposed by the others. The three solos clashed and developed into an evening-length performance during a two-week-long residency at the National Contemporary Art Museum of Bucharest in Romania.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">Choreography/Performance by Cosmin Manolescu and Gabriella Maiorino<br class="wixui-rich-text__text"/>
Management/Communication by Stefania Ferchedau<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Supported by Dancemakers Amsterdam, Danslab The Hague, Museum of Contemporary Arts in Bucharest, National Dance Center in Bucharest, New York Live Arts Suitcase Fund</span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">Venue.<br class="wixui-rich-text__text"/>
2011 National Museum of Contemporary Arts, Romania<br class="wixui-rich-text__text"/>
2011 Temps d'Image Festival @ Paintbrush Factory, Romania</span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">한국, 루마니아, 이탈리아 출신의 3명의 안무가들이 온라인 소통을 통해 4개월간의 협업을 진행했다. 각 안무가들은 국경을 초월하여 얼마만큼 상대에게 자신을 "소용이 닿는 상태로 (available)" 만드는 지를 페이스북, 스카이프, 유튜브 링크, 메신저, 사진의 교환을 통해 실험했다. 이 3개의 솔로는 루마니아 국립현대미술관에서 부딪히고 2주의 레지던시와 함께 공연으로 발전하며, 기이한 공동체를 실현한다.​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">안무/퍼포먼스. 코즈민 마놀레스쿠, 가브리엘라 마이오리노, 장혜진<br class="wixui-rich-text__text"/>
매니지먼트/커뮤니케이션. 스테파니아 퍼르치다우<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
후원. 미국 New York Live Arts, 미국 Suitcase Fund, 네덜란드 Dancemakers, 네덜란드 Danslab, 루마니아 국립무용단</span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">베뉴.</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">2011 부카레스트 국립현대미술관, 루마니아<br class="wixui-rich-text__text"/>
2011 Temps d’Image Festival 투어 공연, Paintbrush Factory, 루마니아</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p></div>
      </div>
    `
  },
  '/book-publication': {
    title: 'Book Publication | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzp3gcmu wixui-rich-text" data-testid="richTextElement" id="comp-lzp3gcmu"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Book Publication<span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:24px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"> </span></span></span></span><br class="wixui-rich-text__text"/>
책 출판</span></span></span><span class="wixui-rich-text__text" style="font-size:24px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"> </span></span></span></span><br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
 </h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 428/384; max-width: 428px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_ec21a97b53644aab993500bc888e461c~mv2.jpg/v1/crop/x_29,y_74,w_738,h_662/fill/w_428,h_384,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6210.jpg">
                    <span class="placeholder-label">Image: IMG_6210.jpg (428x384)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 404/384; max-width: 404px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_039b2cb675bd48a6a43dbeff14d99422~mv2.jpg/v1/crop/x_0,y_102,w_828,h_787/fill/w_404,h_384,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/9_%20Im_6212.jpg">
                    <span class="placeholder-label">Image: 9. Im_6212.jpg (404x384)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/473; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_94e7c700cfe04abe909235c30a2007dc~mv2.jpg/v1/crop/x_1,y_226,w_827,h_463/fill/w_827,h_463,al_c,q_85,enc_avif,quality_auto/IMG_6209.jpg">
                    <span class="placeholder-label">Image: IMG_6209.jpg (845x473)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzp3gcnl1 wixui-rich-text" data-testid="richTextElement" id="comp-lzp3gcnl1"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em; text-align:center;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="letter-spacing:-0.02em;"><span class="wixui-rich-text__text" style="font-size:14px;">Open and Write the Flatten Choreography - I want you to read these last words out loud (2022)</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="letter-spacing:-0.02em;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Choreography as performative writing. The book juxtaposes the 'score' of a performance with the 'last words' left behind before disappearing. Readers can access the choreography by reading these words aloud, thereby summoning forgotten voices into the space. Published by invitation as part of the project "Open and Write the Flatten Choreography" by Gidaran Publishing House.<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Publication: Gidaran</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><a class="wixui-rich-text__text" href="https://www.aladin.co.kr/m/mproduct.aspx?ItemId=310346612&amp;srsltid=AfmBOoonxAnxO0XptvZHa6e00_l3ci56eHsxkzQgO1QrB-w16FV9ZHas" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:underline;">Purchase link</span></span></span></a></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​<span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em; text-align:center;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;">『납작한 안무를 열어 쓰기』 - 나는 당신이 이 유언을 소리 내어 읽어주었으면 해요 (2022)</span></span><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">글과 안무. 공연예술의 ‘스코어’와 소멸되기 전에 남겨지는 ‘유언’을 병치시킨 수행적 글쓰기로서의 안무. 독자는 소리 내어 유언을 읽으며 안</span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">무에 접속하게 되고, 잊혀진 목소리를 공간에 소환한다. 기다란 출판사의 『납작한 안무를 열어 쓰기』라는 기획의 초대로 출판</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">출판: 기다란</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><a class="wixui-rich-text__text" href="https://www.aladin.co.kr/m/mproduct.aspx?ItemId=310346612&amp;srsltid=AfmBOoonxAnxO0XptvZHa6e00_l3ci56eHsxkzQgO1QrB-w16FV9ZHas" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:underline;">구매링크</span></span></span></a></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text">​</span></span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/757; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_d8c70ece8a17426996518bd6d273e8e9~mv2.jpg/v1/crop/x_0,y_49,w_960,h_861/fill/w_845,h_757,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7674_JPG.jpg">
                    <span class="placeholder-label">Image: IMG_7674.JPG (845x757)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 422/412; max-width: 422px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_b75d8a94f0fd4cd09e36a79128ba28fc~mv2.jpg/v1/crop/x_0,y_6,w_828,h_808/fill/w_422,h_412,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EB%AF%B8%EC%86%8C%EB%AA%B8%ED%88%B4%EB%B0%95%EC%8A%A4_%EC%B1%85%EC%82%AC%EC%A7%84.jpg">
                    <span class="placeholder-label">Image: 미소몸툴박스_책사진.jpg (422x412)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 414/412; max-width: 414px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4fd249395f4c4e40aa20d6f36c89a711~mv2.jpg/v1/crop/x_4,y_0,w_822,h_818/fill/w_414,h_412,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_9431.jpg">
                    <span class="placeholder-label">Image: IMG_9431.jpg (414x412)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqieuv3 wixui-rich-text" data-testid="richTextElement" id="comp-lzqieuv3"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em; text-align:center;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;"><span class="wixui-rich-text__text" style="letter-spacing:-0.02em;"><span class="wixui-rich-text__text" style="font-style:italic;">Microhabitat Body Tool Box</span> (2019)</span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">The Microhabitat Body Tool Box is an assemblage of tools for choreography and its survival. One year after the performance of Microhabitat Body, the choreographer re-located tools that had been explored in the creation of the work. It serves as a structure that transcribes the performances of "observing and commenting on each other as choreography." The book is composed of layered annotations upon annotations, allowing readers to add their own comments on pages that resemble a stage. By publishing this book, the choreographer questions whether revisiting the event of choreography could also be the microhabitat (the minimum condition) for choreography. Here, publishing becomes an act of choreography itself. ItAnd it seeks to find ways for collective survival alongside the immaterial tools of choreography.<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Publication: He Jin Jang Dance</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="color_39 wixui-rich-text__text"><a class="wixui-rich-text__text" href="https://drive.google.com/file/d/0B2QlZx3_OBXpay16dkJsc0Nfb0hCWUlKamxZV1E2U2owMUpN/view?usp=sharing&amp;resourcekey=0-WGZwQ3VJOS7nSa4D6x9PMw" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="text-decoration:underline;">Link to English Summary</span></a></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​<span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em; text-align:center;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;"><span class="wixui-rich-text__text" style="letter-spacing:-0.02em;">『미소서식지 몸 툴 박스』 (2019)</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">책으로 실험한 . 안무와 안무의 생존을 위한 도구들의 집합체이다. 공연이 발생하고 1년 후 작품 제작 과정에서 탐구했던 도구들을 재위치 시킨다. ‘관찰하여 서로에게 각주달기’를 수행한 공연에 대한 기록으로, 겹겹히 쌓인 관찰과 각주를 페이지에 옮겨놓아 독자도 각주를 추가할 수 있는 구조이다. 이때 페이지는 스테이지와도 닮았으며, 안무가는 안무의 사건을 되돌아보는 것 또한 안무의 미소서식지, 즉 최소한의 조건이 될 수 있는지 질문한다. 글쓰기는 안무의 행위가 되며, 안무의 비물질적 도구와 함께 공동 생존을 모색한다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">출판: He Jin Jang Dance</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><a class="wixui-rich-text__text" href="https://docs.google.com/forms/d/1HXmztpq8nxEJun-s7eT6aPERPtFEm3u7Rs2ji-h4o5I/edit" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="text-decoration:underline;">구매링크</span></a></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></p></div>
      </div>
    `
  },
  '/contributed-articles': {
    title: 'Contributed Articles | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-mejnx1du wixui-rich-text" data-testid="richTextElement" id="comp-mejnx1du"><h6 class="font_6 wixui-rich-text__text" style="text-align:center; font-size:28px;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:25px;">기고글</span><span class="wixui-rich-text__text" style="font-size:24px;"> </span></span></span></span></h6></div>
<div class="N8MGzv _v6ohL PO9MfV comp-mejnx1g6 wixui-rich-text" data-testid="richTextElement" id="comp-mejnx1g6"><ul class="font_8 wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular; font-size:14px;">
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=OUT&amp;div=&amp;zom_idx=513&amp;page=13&amp;field=&amp;keyword=" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2020년 3월『춤in』춤과 액트-션 시리즈 #2 액션으로서의 연구</span></a></span></span></span></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=OUT&amp;div=03&amp;zom_idx=505&amp;page=1&amp;field=&amp;keyword=" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2019년 12월『춤in』춤과 액트-션 시리즈 #1 제롬 벨의 기후행동</span></span></span></a></span></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=OUT&amp;div=&amp;zom_idx=405&amp;page=19&amp;field=&amp;keyword=" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2018년 11월『춤in』멕시코 라보라토리오: 콘덴사시옹에서의  &lt;미소서식지 몸&gt;</span></span></span></a></span></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><a class="wixui-rich-text__text" href="https://drive.google.com/file/d/1qwDKjCsr_l3bmEfJqLglla1nOUT7MIRV/view?usp=sharing" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="letter-spacing:-0.05em;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2017년 10월『제1회 서울국제안무워크숍 저널』 코레오그래픽 아쌍블라쥬 by 장혜진, 마이라 모랄리스</span></span></span></span></span></a></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="http://koreadance.kr/board/board_view.php?view_id=620&amp;board_name=rating&amp;page=1&amp;search_category=&amp;search_field=subcontents&amp;search_text=%EC%9E%A5%ED%98%9C%EC%A7%84&amp;search_operator=and" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2017년 4월『춤웹진』해외춤기행_뉴욕/필라델피아 프로젝트</span></span></span></a></span></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="http://koreadance.kr/board/board_view.php?view_id=601&amp;board_name=rating&amp;page=1&amp;search_category=&amp;search_field=subcontents&amp;search_text=%EC%9E%A5%ED%98%9C%EC%A7%84&amp;search_operator=and" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="letter-spacing:-0.05em;">2016년 8월『춤웹진』해외춤기행_프랑스 몽펠리에댄스페스티벌: 시각의 비틀거림, 특권, 수사학 그리고 춤</span></span></span></span></a></span></p>
</li>
<li class="wixui-rich-text__text" style="line-height:2.1em;">
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:2.1em;; text-align: justify;"><a class="wixui-rich-text__text" href="https://movementresearch.org/publications/performance-journal/issue-48-2/" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="color:#0080FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;">He Jin Jang, Migrating Words: Embodying Seoul, Movement Research, Issue #48, Spring, 2016</span></span></span></a></p>
</li>
</ul></div>
      </div>
    `
  },
  '/do-not-lean-on-door-2008-09': {
    title: 'Do Not Lean On Door (2008-09) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lypg8lhk wixui-rich-text" data-testid="richTextElement" id="comp-lypg8lhk"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Do not lean on door </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2008-09)<br class="wixui-rich-text__text"/>
기대지 마시오 (2008-09)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/600; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7ce8d0c0acae442ca3d12eecbc4432c2~mv2.jpg/v1/crop/x_37,y_0,w_1127,h_800/fill/w_845,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/080927_61_H_Jang_022.jpg">
                    <span class="placeholder-label">Image: 080927_61_H_Jang_022.jpg (845x600)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lypg8lix wixui-rich-text" data-testid="richTextElement" id="comp-lypg8lix"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text" style="font-size:13px;">​</span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;">Do not lean on door </span>deals with the phenomenon of 'no place' and ‘no voice’ inside transnational female bodies. In imagining altered ways to exit and speak out in the in-between space, the female performers create a fantasy world through repetitive movements.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept/Choreography by He Jin jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Creation/Performance by He Jin Jang, Lyndsey Karr</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2011 Movement Research at the Judson Church, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 DUMBO Dance Festival, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Draftworks, American Dance Festival, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Im_flieger, WUK, Austria</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">장소와 목소리를 잃어버린 초국가적 여성의 몸들은 어디에 기대야 할까? 다른 방식으로 목소리를 내며 ‘사이 공간’에 존재하기 위해 그녀들은 반복적인 움직임을 수행하며 포털을 열어낸다</span>.</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉/안무. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">퍼포먼스/창작. 장혜진, 린지 카</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2011 Movement Research at Judson Church, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 DUMBO 댄스 페스티벌, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Draftworks, 아메리칸 댄스 페스티벌, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Im_flieger, WUK, 오스트리아</span></span></p></div>
      </div>
    `
  },
  '/drifting-body-2015-17': {
    title: 'Drifting Body (2015-17) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyo74cli wixui-rich-text" data-testid="richTextElement" id="comp-lyo74cli"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Drifting Body </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2015-17)<br class="wixui-rich-text__text"/>
표류하는 몸 (2015-17)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/801; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4bb4c14427ea4b8b8f10ff4afe65cf24~mv2.jpeg/v1/crop/x_0,y_278,w_720,h_682/fill/w_719,h_682,al_c,q_85,enc_avif,quality_auto/3_%20%ED%91%9C%EB%A5%98%ED%95%98%EB%8A%94%EB%AA%B8_%EC%9E%A5%ED%98%9C%EC%A7%84.jpeg">
                    <span class="placeholder-label">Image: 3. 표류하는몸_장혜진.jpeg (845x801)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/600; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_fc4599b32d274a31b93f470fe2adcf1c~mv2.jpeg/v1/crop/x_1,y_0,w_959,h_682/fill/w_845,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%91%9C%EB%A5%98%ED%95%98%EB%8A%94%EB%AA%B8_%EC%84%9C%EC%9A%B8%EB%8C%80.jpeg">
                    <span class="placeholder-label">Image: 표류하는몸_서울대.jpeg (845x600)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1132; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4182819c1c0347bc9c751ebc7f1256b8~mv2.jpg/v1/crop/x_39,y_86,w_1130,h_1514/fill/w_845,h_1132,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/process38_arko.jpg">
                    <span class="placeholder-label">Image: process38_arko.jpg (845x1132)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lyo74cm61 wixui-rich-text" data-testid="richTextElement" id="comp-lyo74cm61"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">In this lecture performance, three Korean artists share their ruptured and empathetic sense of body-life in the era of the refugee crisis. The discourse among choreographer He Jin Jang, media artist Jiwon Kim, and dramaturg Ziyea Hyun morphs into a lecture performance as they realize this (dis)organizing act of trying-to-have-difficult-conversation resembles a choreographic process. There are three creative methods they integrate to manifest and facilitate this private conversations into the choreographic: 1) Find choreographic devices that can capture the non-linear thinking and feeling process, 2) Finding a structure of writing/archiving that can mirror the complexity of the discourse, 3) Welcoming any spontaneous embodied reactions to each other. They call this act as a choreographic questioning of the refugee body. As they share and articulate kinesthetic thoughts and empathy, they encounter the eventfulness of how they find choreography in social crises. How  are the concepts of body without citizenship, body as mass, and missing body felt here?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span>​​​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Creation/Direction by He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Co-creation/Media Art by Jeewon Kim</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Dramaturgy by Ziyea Hyun</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Korea Arts and Management Service, University of the Arts, Invited by ARKO Transdisciplinary Ocean Art Lab</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 Arts Council Korea Transdisciplinary Ocean Art Lab @ Artist’s House, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 Dance and Science Conference, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 Museum of Art, Seoul National University, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 World Dance Alliance Asia Pacific, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2017 Knowing Dance More, UArts, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">난민 사태로 발생한 몸-생명 의미의 굴곡, 이에 관한 표류하는 생각과 대화가 렉처 퍼포먼스로 발화된다. 코레오그래피가 어떻게 사회적 사건에서 발견되는 지에서부터 대화가 시작되며, 난민사태라는 재난의 상황이 한국인 안무가 장혜진과 미디어 아티스트 김지원, 그리고 드라마터그 현지예에게 왜 ‘참 하기 어려운 이야기'인지 토로하게 된다. 이 어려운 과정은 안무적 과정과도 유사하게 박동하는 생각들의 발화로 이어지며, 1. 비선형적 사고를 캡처할 안무적 장치의 발견, 2. 담론의 복잡성을 반영할 글쓰기 도구의 출연, 3. 서로의 실천과 연구에 언제든 체화적으로 반응하기 등의 규칙을 통해 신체적 공감에 도래한다. 시민권이 없는 몸, 사라진 몸, 무게로서의 몸 등에 어렵게 공감하는 동안 이들의 몸도 표류하게 될까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">창작/연출/글. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">공동창작/미디어아트/글. 장혜진, 김지원</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">드라마투르기. 현지예</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 한국문화예술위원회, 문화체육관광부, 예술경영지원센터, 미국 University of the Arts</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 아르코 융복합 해양예술 랩, 예술가의 집, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 무용과학회, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 서울대학교 미술관, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 세계무용총회, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2017 Knowing Dance More, University of the Arts, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/entanglement-residency-2020': {
    title: 'Entanglement Residency (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzch3ztc wixui-rich-text" data-testid="richTextElement" id="comp-lzch3ztc"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">Entanglement Residency</span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"> (2020)<br class="wixui-rich-text__text"/>
얽힘 레지던시 (2020)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Tangerine Collective</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 783/743; max-width: 783px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_f32187e58d7b44d3a7f1bebc6689a851~mv2.jpg/v1/crop/x_54,y_64,w_844,h_801/fill/w_783,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%96%BD%ED%9E%98%EB%A0%88%EC%A7%80%EB%8D%98%EC%8B%9C%EB%A1%9C%EA%B3%A0_JPG.jpg">
                    <span class="placeholder-label">Image: 얽힘레지던시로고.JPG (783x743)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzch3ztw2 wixui-rich-text" data-testid="richTextElement" id="comp-lzch3ztw2"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">There are forces and connections that operate even within distance. The phenomenon of the force is called “quantum entanglement,” a physics theory that unfolds on the premise that two separate entities were originally one, allowing simultaneous communication even in the absence of direct contact. What does a project that explores the movement of entanglement in and out of distance look like? Can a virtual residency that utilizes telepathic, non-face-to-face sensations create a kind of sense of companionship? This project, exploring these questions, is also an experiment on 'curation,' bringing artists together to generate common social and artistic meaning.<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Choreographer He Jin Jang, Choreographer Jee-Ae Lim, and Dramaturg Jaelee Kim tried to communicate with domestic and foreign artists through email from June 19 to August 1, 2020 and ‘"lived together in a tangled way.’" They developed a total of 26 scores to connect with 26 artists from all over the world. Artists invited by email were then able to participate in the process of accompaniment in a virtual space, being BCC-ed in emails sent to other artists. It was to create a "snow-ball effect." This page is a space of 'open reference. We’ve created this space to share scores and excerpted letters with a wider audience. You can also use the scores here to entangle someone from a distance.</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;">​​​​​​​​​​​​​​​​​​​​​​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">Curation and Creation by Collective Tangerine(He Jin Jang, Jaelee Kim, Jee-ae Lim)<br class="wixui-rich-text__text"/>
Graphic Design by Dongkyu Kim<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Supported by Seoul Foundation for Arts and Culture, Seoul Metropolitan City</span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><a class="wixui-rich-text__text" href="https://www.instagram.com/collective_tangerine" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:13px;">Link to Score Archive</span></span></span></a></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">거리두기 안에서도 작동하는 힘과 연결성이 있다. </span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">그 힘의 현상은 “양자얽힘” 혹은 “인탱글먼트</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">Entanglement”라 불린다. 이는 떨어져 있는 두 개가 본래 하나였다는 전제에서 전개되는 물리학 이론으로 접촉이 없는 상태에서도 동시적인 교감이 가능하다. 거리두기와 잠시멈춤 안팎에서 작용하는 얽힘의 운동성을 예술적 실천으로 실험하는 프로젝트는 어떤 모습일까? 텔레파틱 비대면 기술감각을 활용한 가상의 레지던시는 일종의 동행의 감각을 만들어 낼 수 있을까? 위와 같은 질문들을 탐험하는 이 프로젝트는 예술가들을 한데 모으고 공동의 사회적, 예술적 의미를 발생시키는 큐레이션에 관한 실험이기도 하다. 장혜진 안무가, 임지애 안무가 그리고 김재리 드라마터그 세 명의 작업자들은 6월 19일부터 8월 1일까지 이메일을 통해 국내외 예술가들과 교감을 시도하며 매일을 “얽힘적으로 함께 살았다.” 그들은 26명의 전 세계 각지에 떨어져 있는 예술인들과 연결되기 위해서 총 26개의 스코어를 개발했다. 이메일로 초청된 예술가들은 그다음 예술가들에게 보내는 이메일에 숨은참조(Bcc)가 되면서 가상의 공간에서 동행의 과정에 함께 참여할 수 있었다. 이 페이지는 텍스트, 그림, 영상, 사진 등으로서의 스코어와 발췌된 편지들을 더 많은 사람들과 공유하기 위해 만든 '열린참조'의 공간이다. 당신도 멀리 있는 그 누군가와의 얽힘을 위해 여기의 스코어들을 활용해 볼 수 있을 것이다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><a class="wixui-rich-text__text" href="https://www.instagram.com/collective_tangerine" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:13px;">스코어 아카이브 링크</span></span></span></a></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/562; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_32049a24a48743a4b26188b7004ff077~mv2.jpg/v1/crop/x_0,y_50,w_2500,h_1663/fill/w_845,h_562,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0747_JPG.jpg">
                    <span class="placeholder-label">Image: IMG_0747.JPG (845x562)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/exhibition-weekly-weakly-2020': {
    title: 'Weekly Weakly: Exhibition (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyo3nzex wixui-rich-text" data-testid="richTextElement" id="comp-lyo3nzex"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">전시: 위클리 위-클리 (2020)  </span></span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Exhibition: Weekly Weakly </span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2020) </span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/643; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_2d1d7645b1934ebb8f2540662253c35d~mv2.jpg/v1/crop/x_225,y_129,w_1051,h_799/fill/w_845,h_643,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6303_JPG.jpg">
                    <span class="placeholder-label">Image: IMG_6303.JPG (845x643)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1153; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_efd55d5cca0f4f97a2e0b5c94b9fa126~mv2.png/v1/crop/x_35,y_0,w_2955,h_4032/fill/w_845,h_1153,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6241%202.png">
                    <span class="placeholder-label">Image: IMG_6241 2.jpg (845x1153)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1153; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_81ffbccc1ddc47418715ab04953e7612~mv2.jpg/v1/crop/x_0,y_81,w_1200,h_1637/fill/w_845,h_1153,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0791_JPG.jpg">
                    <span class="placeholder-label">Image: IMG_0791.JPG (845x1153)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lyo3nzff1 wixui-rich-text" data-testid="richTextElement" id="comp-lyo3nzff1"><p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">What if weakness were not a limitation, but a choreographic condition? Weekly Weakly is a weekly laboratory for choreography and feminist thinking, where precarity, softness, slowness, and hesitation are practiced not as failure, but as form. For its 23rd iteration, this shared practice entered a gallery space—not as documentation, but as practice-as-exhibition.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Over three days, the exhibition unfolded as a porous installation of process and pause. Fragments of choreography, traces of philosophical musing, and quiet scores filled the space — not to be passively viewed, but to be sensed, inhabited, and refigured in relation. Like its performance counterpart, the work invites attention toward the minor, the unfinished, and the relational. How can feminist weakness be curated without being framed? How might an exhibition hold a practice that resists display?</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Curated by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Activated by He Jin Jang, Hyeongbin Cho, Myoung Gyu Song, Yunkyung Hur, Ziyea Hyun</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Graphic Design by Dongkyu Kim</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​Organized by He Jin Jang Dance</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, ONSU GONG-GAN</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Venue: ONSU GONG-GAN, Korea​​​​​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">연약함이 한계가 아니라 안무의 조건이라면 어떨까?《위클리 위-클리》는 매주 진행된 안무 및 여성주의 사고의 실험실로, 불안정함과 부드러움, 느림과 머뭇거림을 실패가 아닌 하나의 ‘형태’로 연습하는 장이다. 그 23번째 실천이 이번에는 전시의 형식—실천으로서의 전시(practice-as-exhibition)로 공간에 들어섰다. 3일간 열린 이번 전시에서는 연약함에 관한 스코어 수행이 공간 곳곳에서 펼쳐졌고, ‘과정’과 ‘멈춤’이 교차하는 다공적 설치로 구성되었다. 안무의 파편, 철학적 사유의 흔적, 그리고 스코어들이 전시장을 채웠고, 이는 수동적으로 감상되는 대상이 아닌, 몸으로 감지하고 머무는 공간이 되었다. 이 작업은 작고 미완성된 것들, 관계 속에서 생겨나는 감각들에 주의를 기울이도록 초대한다. 여성주의적 연약함을 틀에 가두지 않고 어떻게 큐레이팅할 수 있을까? 보여주기를 거부하는 실천을 전시는 어떻게 품을 수 있을까?</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">기획. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">스코어 수행. 장혜진, 조형빈, 송명규, 허윤경, 현지예</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">그래픽 디자인. 김동규</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">주최/주관. He Jin Jang Dance​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">베뉴. 온수공간, 한국​​​</p></div>
      </div>
    `
  },
  '/franklin-method-workshop-session': {
    title: 'Franklin Method Workshop & 1:1 Session | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqp09vf wixui-rich-text" data-testid="richTextElement" id="comp-lzqp09vf"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Franklin Method® Workshop &amp; 1:1 Session<br class="wixui-rich-text__text"/>
프랭클린 메소드® 워크숍 &amp; 1:1 세션</span><br class="wixui-rich-text__text"/>
 </h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 231/244; max-width: 231px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_550d963d6e634fbdb605d9b0b01a4f57~mv2.png/v1/fill/w_231,h_244,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/FM_Logo.png">
                    <span class="placeholder-label">Image: FM_Logo.png (231x244)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 559/244; max-width: 559px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_df6c452a19a54a78a329d5301a3985b2~mv2.png/v1/fill/w_559,h_244,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo_dni.png">
                    <span class="placeholder-label">Image: logo_dni.png (559x244)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqp09vi1 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp09vi1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​He Jin Jang is certified in the Franklin Method®. The Franklin Method® is a somatic method and modern therapy exercise that integrates imagery, experiential anatomy, touch, self-talk, and movement. Developed by Eric Franklin of Switzerland, it was originally designed to help dancers to activate the body and mind function, and later it has evolved to cater to all disciplines of movement. The Franklin Method® teaches how the body is naturally designed to move, enhancing function, releasing tension, improving balance, coordination and strength, and fostering awareness that can be applied to all aspects of our life.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">The Franklin Method® uses Dynamic Neuro-cognitive Imagery™, anatomical embodiment and educational skills, to create lasting positive changes in our body and mind. One of the greatest discoveries of the 21st century is the plasticity of the brain; that the lives we live shape the brain we develop. At the forefront of applied neuro-plasticity, the Franklin Method® is demonstrating how to harness the power of our brain to enhance our body’s function. Our entire body is part of a symphony of coordinated movement. In a sense, our posture is reinvented at every instant. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">Franklin Method® workshops and private sessions aim to help you understand and embody your natural anatomical structure and functions to improve  functional and performative abilities. Clients and students experience easeful movement of limbs and joints, reduction of pain and discomfort, increased body awareness, better relationship with gravity, and enhanced flexibility, stability, mobility, breathing, and more. In addition to the physical benefits, many report feeling more calm, relaxed, present, and capable of focusing and thinking more clearly. You can experience the power of proprioception and improve range of motion by learning about the body’s way of perceiving its position in space called the ‘proprioceptive nervous system.’ Both professional dancers and individuals with no previous movement experience can benefit from Franklin Method®.​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">장혜진은 프랭클린 메소드® 공인 움직임 교육자이다. 프랭클린 메소드®는 심상, 체험적 해부학, 촉각, 자기 대화, 움직임을 통합하는 소매틱 메소드이자 현대적 치료 운동이다. 스위스의 에릭 프랭클린이 개발한 이 메소드는 원래 무용수들의 신체와 정신 기능을 활성화하기 위해 고안되었으며, 이후 모든 운동 분야에 적용될 수 있도록 발전해 왔다. 프랭클린 메소드®를 통해 신체가 어떻게 움직이도록 설계되었는지를 배우며, 긴장 완화와 기능, 균형, 조정력 및 근력 향상에 도움을 받아 삶의 모든 측면에 적용할 수 있는 신체 인식을 깨울 수 있다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">프랭클린 메소드®는 역동적 신경 인지 심상™이라는 해부학적 체화 및 학습 기술을 사용하여 몸과 마음에 지속적이고 긍정적인 변화를 일으킨다. 21세기의 가장 위대한 발견 중 하나인 ‘뇌 가소성’은 우리가 사는 삶의 패턴이 뇌의 발달 변화를 형성한다는 것에 기반한 이론이다. 프랭클린 메소드®는 실용적 신경 가소성의 최전선에 있으며, 몸의 기능을 개선하기 위해 뇌를 사용하는 방법의 예시를 알려준다. 우리 몸 전체는 조화로운 움직임으로 이루어진 교향곡의 일부이며, 어떤 의미에서 우리의 자세는 매 순간 새롭게 재창조되는 것이다. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">프랭클린 메소드® 1:1 세션과 그룹 워크숍은 자연스러운 해부학적 구조와 기능을 이해하고 구현하여 기능과 수행 능력을 향상하는 데 도움이 되도록 설계된다. 수강자들은 팔다리와 관절의 손쉬운 움직임, 통증과 불편함의 감소, 신체 인식의 향상, 중력과의 관계, 유연성, 안정성, 이동성, 호흡 등의 개선을 경험하게 된다. 이러한 신체적 이점 외에도 대부분의 사람들이 더 차분하고, 편안하며, 현재에 집중하고, 명확하게 생각할 수 있게 되었다고 말하기도 한다. 참여자들은 ‘고유 수용성 신경계’라는 우리 몸이 공간에서 자신의 위치를 파악하는 방법에 대해 배우면서, 고유 수용성의 힘을 경험하고 운동 범위를 향상시킬 수 있다. 전문 무용수나 움직임 경험이 없는 사람 모두 프랭클린 메소드®의 혜택을 누릴 수 있다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/ghost-shower-2020-21': {
    title: 'Ghost Shower (2020-21) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzao63bo wixui-rich-text" data-testid="richTextElement" id="comp-lzao63bo"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">Ghost Shower </span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;">(2021)<br class="wixui-rich-text__text"/>
유령기류 (2021)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Sleungst and Friends</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 843/725; max-width: 843px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_681ce271fdf540d69ac54bcf9894d1cc~mv2.jpg/v1/crop/x_0,y_0,w_828,h_712/fill/w_828,h_712,al_c,q_85,enc_avif,quality_auto/IMG_4293%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_4293 copy.jpg (843x725)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzao63c33 wixui-rich-text" data-testid="richTextElement" id="comp-lzao63c33"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​​​</span><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-style:italic;">Ghost Shower</span> is a co-created transdisciplinary work involving 4 choreographers and 1 film artist. This GPS-based application allows users to record memories of ‘not being able to take care of someone,’ and these voices travel the world as ghosts with algorithmic choreography. Users can place their voices anywhere in the world using this app, and when other users approach the area, they can listen to the voices of the released memories. They can also watch how the voices move and “dance” like weather patterns on the map via the application.<br class="wixui-rich-text__text"/>
​​​​​​​​​​​​​​​​​​​​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Created and Produced by Sleungst and Friends (He Jin Jang, Bittnarie Shin, Min Kyung Lee, Seyoung Jeong, Su-Mi Jang)</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">App Advising by Boram Kim</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Illustration by Minha Yoo</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Sound Design by Rémi Klemensiewicz</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Project Manager by Nayoung Kim</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">App Development by Laidback</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by: Seoul Foundation for Arts and Culture, Seoul Metropolitan City</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><a class="wixui-rich-text__text" href="https://apptopia.com/ios/app/1550017283/about" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">Link to App</span></span></span></span></a></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">슬릉쓰트와 친구들 콜렉티브 공동기획 GPS 기반 앱 창작.‘누군가를 돌보지 못한 기억’을 녹음하고 앱의 지도 위에 놓아주면, 그 목소리는 알고리듬 안무에 의해 세계를 유령처럼 여행한다. 세계 어디에서나 위치 반경 안에 들어가면 그 목소리를 들을 수 있으며, 팬데믹 시대의 돌봄 행위가 안무된다. 팬데믹 시대에 우리는 어떤 방식으로 만날 수 있을까? 둘 이상의 영혼이 만날 때 일어나야 하는 일은 결국 돌봄아닐까? 예술과 테라피, 게임이 만난 어플에서 접속자는 각자 속에 숨어지낸 유령을 만난다.</span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">공동기획 및 제작. 슬릉쓰트와 친구들 (신빛나리, 이민경, 장수미, 장혜진, 정세영)</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">앱 연출 자문. 김보람</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">일러스트레이션. 유민하</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드 디자인. 해미 클레멘세비츠</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">프로듀서. 김나영</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">앱 개발. 레이드백</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 서울문화재단, 서울특별시</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://apptopia.com/ios/app/1550017283/about" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">​앱 링크</span></a></span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 277/600; max-width: 277px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_ffaa9df8d21b4c32b39015d41dbc52c3~mv2.jpg/v1/fill/w_277,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9C%A0%EB%A0%B9%EA%B8%B0%EB%A5%98_%EB%A9%94%EB%89%B4%ED%8E%98%EC%9D%B4%EC%A7%80%20copy.jpg">
                    <span class="placeholder-label">Image: 유령기류_메뉴페이지 copy.jpg (277x600)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 277/600; max-width: 277px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_dd84b7763db246169ad373fef9f8e764~mv2.jpg/v1/fill/w_277,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9C%A0%EB%A0%B9%EA%B8%B0%EB%A5%98_%EC%98%88%EB%B3%B4%EB%AC%B4%EB%A6%AC%20copy.jpg">
                    <span class="placeholder-label">Image: 유령기류_예보무리 copy.jpg (277x600)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 277/600; max-width: 277px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7302fd679c0644038d479d138cf2ec24~mv2.jpg/v1/fill/w_277,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_2777%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_2777 copy.jpg (277x600)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/i-bet-you-d-put-that-on-2022': {
    title: 'I Bet You’d Put That On (2022) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lsk08g7b wixui-rich-text" data-testid="richTextElement" id="comp-lsk08g7b"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">I Bet You’d Put That On </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2022) </span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">당신이 그런 것을 입게 될 줄 알았어 </span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 459/637; max-width: 459px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_a20af54c445143adbcfb5c5a16b40dc4~mv2.png/v1/fill/w_459,h_637,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/poster-for-web-big-ver_edited.png">
                    <span class="placeholder-label">Image: poster-for-web-big-ver_edited.png (459x637)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 382/637; max-width: 382px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_cbf308103cb0442cbdd25e5083d647ae~mv2.jpg/v1/crop/x_52,y_0,w_539,h_900/fill/w_382,h_637,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/14_%20hjdance28_edited.jpg">
                    <span class="placeholder-label">Image: 14_ hjdance28_edited.jpg (382x637)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 852/515; max-width: 852px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_fc7733ced44f4321916eb039ab999968~mv2.png/v1/fill/w_840,h_508,al_c,lg_1,q_90,enc_avif,quality_auto/hjdance3_edited.png">
                    <span class="placeholder-label">Image: hjdance3_edited.png (852x515)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lsk08g7f wixui-rich-text" data-testid="richTextElement" id="comp-lsk08g7f"><blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">“It is not merely a play with blankets—it is also a play with corpses, a collective ritual, and a precisely designed device.”</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">— Dance Magazine MOMM, 2023</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">I Bet You’d Put That On</span> transforms a boxing mat into a site of collective dreaming, relational uncertainty, and quiet disappearance. This intimate, multi-sensory performance reimagines rehearsal not as preparation for a future performance, but as a ritualistic soft technology—one that trains the body for grief, care, and the endurance of disappearance. </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Borrowing from the etymological proximity between rehearsal and hearse—a vehicle for transporting the dead—the piece frames re-hearse-ing as a speculative practice of collective mourning. It holds space for the not-yet, for what has been lost, but not disappeared entirely, for what might still return. </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">In each iteration, two performers invite four audience members to lie on a blue sports mat. With eyes closed, bodies are gently rearranged through whispered texts and tactile cues. Together, they enter a hypnagogic state—a space between waking and dreaming—where identity and vulnerability are quietly rewritten. The boxing mat, typically a site of contest, becomes a ground for unmaking, an affective device for sensing what has been rendered invisible. </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">After participating, audience members may return to watch from the outside. Four viewing chairs offer a mirrored choreography of proximity and distance, intimacy and estrangement. Over 42 iterations, the work has carved a lucid, speculative form of being-together—part ritual, part rehearsal, part shared dream. </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">In a time of mounting political and social tension in South Korea—marked by renewed censorship, ideological polarization, and the erasure of dissenting voices—<span class="wixui-rich-text__text" style="font-style:italic;">I Bet You’d Put That On</span> offers a shared space to rehearse a different kind of presence: porous, grieving, and unresolved. It oscillates between sincerity and artifice, presence and absence—rehearsing not for performance, but for a future in which erased bodies, voices, and histories might re-emerge. </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“The tactile experience using the mat enhances the experiential dimension of rehearsal… as if one had performed without ever performing.” </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">— Dance Webzine, 2023</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“The work destabilizes ‘I’ and ‘You,’ staging disappearance as a political gesture.” </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">— Art Scene, 2023</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">42 performances. 8 spectators per iteration. 1 shared dream.</span></p>
</blockquote>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.4em; text-align:justify;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://tewonderland.wixsite.com/hejinjang-dance" rel="noreferrer noopener" target="_blank">Link to Choreographer’s Note</a></span> </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​​​​</span></span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span>​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Concept and Artistic Direction by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Performance and Interpretation by Kwonkeum Ko, Myeungshin Kim, Hyunjin Kim, Sunghee Wee, So Young Lee</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Research Participation by Myoung Gyu Song</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Dramaturgy by Ziyea Hyun</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Sound Design by Jimmy Sert</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Stage Direction by Doyeop Lee</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Video Documentation by Bokco</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Photo Documentation by Sukhyun Hyun (Filmbausch)</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Graphic Design by Kyungsub Lim (Saeseoul Society)</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Producer by Hyeyeon Kim (We All Really Matter)</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Produced and Hosted by: He Jin Jang Dance</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Korea Creative Content Agency, Dancers Career Development Center</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Venue: Ob/scene Space, Korea</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​​​​​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">“</span></span><span class="wixui-rich-text__text" style="font-size:15px;">〈당신이 그런 것을 입게 될 줄 알았어〉</span><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">는 단순한 이불 놀이가 아니라 시체 놀이인 동시에 세밀하게 설계된 장치요, 안무에 있어서는 이중 구조로 설계된 정밀한 작업”<br class="wixui-rich-text__text"/>
—  2023년『월간잡지 몸』</span></span></p>
<blockquote class="font_8 wixui-rich-text__text" style="font-size:15px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">〈당신이 그런 것을 입게 될 줄 알았어〉는 권투 매트를 집단적 꿈, 관계의 불확실성, 그리고 조용한 소멸의 현장으로 전환시키는 작업이다. 이 친밀하고 다감각적인 퍼포먼스는 리허설을 미래의 공연을 준비하는 절차가 아니라, 돌봄과 애도, 사라짐을 견디는 몸의 훈련을 위한 부드럽고 의례적인 기술로 다시 상상한다. ‘리허설’(rehearsal)과 ‘영구차’(hearse)라는 단어 사이의 어원적 인접성에서 출발해, 이 작업은 re-hearse-ing—즉, 다시 장례를 치르는 것—을 집단적 애도의 사변적 실천으로 제안한다. 이것은 아직 도래하지 않은 것, 이미 잃었지만 완전히 사라지지 않은 것, 언젠가 돌아올지도 모르는 것들을 위한 공간이다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">각 회차마다 두 명의 퍼포머는 네 명의 관객을 파란 스포츠 매트 위로 초대한다. 눈을 감은 채, 관객의 몸은 속삭이는 말과 조심스러운 촉각의 신호에 따라 천천히 재배열된다. 이들은 잠과 깨어남의 경계에 놓인 최면 상태에 들어가며, 정체성과 취약함이 조용히 다시 써진다. 대결의 장소였던 권투 매트는 해체와 감각의 장치, 보이지 않게 된 것들을 감지하는 토대로 변모한다. 퍼포먼스에 참여한 관객은 이후 외부에서 이를 관찰할 수 있다. 네 개의 관람용 의자는 거리와 밀착, 낯섦과 친밀함 사이의 안무를 반영한다. 총 42회의 반복을 통해, 이 작업은 의례이자 리허설이자 공동의 꿈이라는 투명하고 사변적인 존재 방식을 구축해 왔다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">검열과 이념의 분열, 그리고 다르게 존재하려는 몸들이 점점 자취를 감추게 되는 한국 사회에서,〈당신이 그런 것을 입게 될 줄 알았어〉는 경계를 허물고, 애도의 감각을 품으며, 미완의 상태를 수용하는 또 다른 존재 방식을 함께 리허설하는 공간을 만든다. 이 작업은 진심과 연기, 현존과 부재 사이를 진동하며, 지워졌던 몸과 목소리, 기억이 다시 떠오를 수 있는 미래를 상상하는 리허설로 이어진다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​<span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">“몇몇 관객은 가수면 상태에 이르는 경험을 갖는다...공연을 하지 않았지만 공연을 한 것처럼 경험하는 리허설과 유사하다. 매트를 사용한 촉각적 경험 역시 리허설의 경험을 도모하는 역할을 수행한다."<br class="wixui-rich-text__text"/>
—  2023년『춤웹진』 </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​​​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">“매트 위에 관객은 붙잡히며, 유동하는 땅(ground)에서 자신의 몸이 굴절되는 것을 체험한다... ‘나’와 ‘너’의 고정된 위치를 끊임없이 불안정한 것으로 만든다.”<br class="wixui-rich-text__text"/>
—  2023년『아트신』</span></span></p>
<p class="wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">• 42회 공연<br class="wixui-rich-text__text"/>
• 회차당 관객 8명 참여<br class="wixui-rich-text__text"/>
• 단 하나의 공유된 꿈</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.4em; text-align:justify;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://tewonderland.wixsite.com/hejinjang-dance" rel="noreferrer noopener" target="_blank">안무가의 글 링크</a></span> </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">컨셉/안무/연출. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">공동창작/출연. 고권금, 김명신, 김현진, 위성희, 이소영</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">리서치참여. 송명규</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">드라마투르기. 현지예</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">사운드. 지미 세르</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">기술감독. 이도엽 (걸작)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">그래픽디자인. 임경섭 (새서울소사이어티)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">영상기록. 이진원 (복코)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">사진기록. 현석현 (필름바우쉬)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">프로듀서. 김혜연 (위올리얼리매터)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">주최/주관. He Jin Jang Dance</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부, 한국콘텐츠진흥원, 전문무용수지원센터</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">베뉴. 옵/신 스페이스, 한국​​</p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 852/568; max-width: 852px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_56cc95be09c946c39dc1ae0e6baa59af~mv2.jpg/v1/fill/w_852,h_568,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_56cc95be09c946c39dc1ae0e6baa59af~mv2.jpg">
                    <span class="placeholder-label">Image:  (852x568)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/judson-drama-2020': {
    title: 'Judson Drama (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzchei9e wixui-rich-text" data-testid="richTextElement" id="comp-lzchei9e"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">Judson Drama </span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;">(2020)<br class="wixui-rich-text__text"/>
저드슨 드라마 (2020)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Judson Drama</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 627/889; max-width: 627px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_6bfb60ea16f24e61aa9e0e9913175c21~mv2.jpg/v1/fill/w_627,h_889,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0247%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_0247 copy.jpg (627x889)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzchei9p1 wixui-rich-text" data-testid="richTextElement" id="comp-lzchei9p1"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​​​</span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-style:italic;">Judson Drama</span> is a transdisciplinary work co-created by 11 Korean transdisciplinary artists. The Collective was founded to initiate the “New Judson Church Movement” in Korea, inspired by the groundbreaking, adventurous collective that pioneered the post-modern dance era back in the 1970s. To re-create Judson Drama here in Seoul in 2020, the collective placed performative objects hidden around the city during September and October 2020 and invited audience/users to find these objects using the GPS-based application, providing directions and information. In this participatory treasure-hunting performance, the city of Seoul becomes the site for drama and performance, reminiscent of the Judson Church Movement back in the days.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Creation/Collaboration by Byungjun Kwon, Sung-chool Kim, Mu:p, Yeong Ran Suh, Bittnarie Shin, Abhijan Toto, Min Kyung Lee, Su-Mi Jang, He Jin Jang, Seyoung Jeong, Remi Klemensiewicz</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Poster Design by Yuna Kim</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">App Development by Jinpil Yoo</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Director of Camera by Sunyoung Lee</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Creative Producer by Jaemin Shin</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Organized by Min Kyung Lee and Seyoung Jeong </span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.5em; text-align:justify;"> </p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="background-color:transparent; color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Supported by Seoul Foundation for Arts and Culture, Art Space Geumcheon, </span><span class="wixui-rich-text__text" style="background-color:rgb(255, 255, 255); color:rgb(0, 0, 0); font-style:normal; font-weight:400; text-decoration:none;">Seoul Metropolitan City</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"> </p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><a class="wixui-rich-text__text" href="https://apkpure.com/%EC%A0%80%EB%93%9C%EC%8A%A8-%EB%93%9C%EB%9D%BC%EB%A7%88/com.judson_drama_app" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="background-color:transparent; font-style:normal; font-weight:400;">Link to App (Android)</span></span></span></span></span></a></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="https://apptopia.com/ios/app/1531085405/about" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">​Link to App</span></span></span></span></span></span></a></span></span></span></span><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="https://apptopia.com/ios/app/1531085405/about" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;"> (IOS)</span></span></span></span></span></span></a></span></span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">저드슨 드라마 콜렉티브 공동창작 GPS 앱 기반 능동형 보물찾기 공연. "저드슨 처치를 세워라"라는 이름의 퍼즐을 제작하여 서울 전역에 숨겨두었다. 앱 지도를 통해 보물을 찾으면 “퍼즐 만드는 손을 위한 음악”을 청취하며 저드슨 처치 모양의 퍼즐을 맞출 수 있다. 퍼즐을 다 맞추면 또 하나의 큐알코드가 발견되고, 가상의 세계에 입장하며 공공의 장소와 공동체를 돌보는 행위에 대해 사유하게 된다.</span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">창작/협업. 권병준, 김성출, 뭎, 서영란, 신빛나리, 아비잔 토토, 이민경, 장수미, 장혜진, 정세영, 헤미 클레벤세비츠</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">포스터 디자인. 김유나</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">앱개발. 유진필</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">촬영. 이선영</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">크리에이티브 프로듀서. 신재민</span></span></span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">제작. 이민경, 정세영</span>​​​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"> </p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="text-decoration:none;">후원. 서울문화재단, 금천예술공장, 서울특별시</span></span></span></p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:13px; line-height:1.5em;; text-align: justify;"> </p>
<p class="wixui-rich-text__text" dir="ltr" style="font-size:14px; line-height:1.5em;; text-align: justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="https://apkpure.com/%EC%A0%80%EB%93%9C%EC%8A%A8-%EB%93%9C%EB%9D%BC%EB%A7%88/com.judson_drama_app" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">​</span><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">앱 링크 (Android)</span></span></span></span></a></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><a class="wixui-rich-text__text" href="https://apptopia.com/ios/app/1531085405/about" rel="noreferrer noopener" target="_blank"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="color_39 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">​</span><span class="wixui-rich-text__text" style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;">앱 링크 (IOS)</span></span></span></span></span></span></a></span></span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​​​​​​​​​​​<span class="wixui-rich-text__text">​</span>​​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em; text-align:justify;"><span class="wixui-rich-text__text">​</span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 321/468; max-width: 321px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7b21a2cb943045659cacf4c35b600329~mv2.jpg/v1/fill/w_321,h_468,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%A0%80%EB%93%9C%EC%8A%A8%EB%93%9C%EB%9D%BC%EB%A7%88_%EB%BD%91%EA%B8%B0%EA%B3%B5_%ED%8D%BC%EC%A6%90%20copy.jpg">
                    <span class="placeholder-label">Image: 저드슨드라마_뽑기공_퍼즐 copy.jpg (321x468)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 314/466; max-width: 314px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_451a4a8ff1be4878818ef75fbdad06c0~mv2.jpg/v1/fill/w_314,h_466,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0234%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_0234 copy.jpg (314x466)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 649/486; max-width: 649px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_8d53f19a9740466a81eae1d4e4c9db02~mv2.jpg/v1/crop/x_0,y_2,w_1200,h_898/fill/w_649,h_486,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_0187%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_0187 copy.jpg (649x486)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/latent-in-pre-chaos-2024': {
    title: 'Latent in Pre-Chaos (2024) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-maqdv91u wixui-rich-text" data-testid="richTextElement" id="comp-maqdv91u"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;">Latent in Pre-chaos (2024)</span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;">태역에 속도가 묻어있어서</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 700/466; max-width: 700px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_0d08db23991b4ebcb2c09ef9ec900efd~mv2.jpg/v1/fill/w_700,h_466,al_c,lg_1,q_80,enc_avif,quality_auto/073f40_0d08db23991b4ebcb2c09ef9ec900efd~mv2.jpg">
                    <span class="placeholder-label">Image: 태역에 속도가 묻어있어서.JPG (700x466)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-maqdv93f1 wixui-rich-text" data-testid="richTextElement" id="comp-maqdv93f1"><p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Latent in Pre-chaos is video installation works that expands upon the research on the "Eunhyeongbeop" from Dongui Bogam (The Principles and Practice of Eastern Medicine) (1610), which began in 2023. Choreographer He Jin Jang regards the practice of "the method of concealing the body’s form," rehearsed during times of war and epidemic 400 years ago, as a kind of score. Together with her collaborators, she engaged in speculative dialogue, literature research, movement studies, storytelling, and personal insights, culminating in a multisensory performance in August 2023 that invited the audience into this process. The remaining questions from this project were: "What were the notions of body, community, and care to our ancestors during moments of disaster and disease? What might this indigenous wisdom have to say in the current era of the 'Ontological Turn'?"</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">During July and August 2024, He Jin Jang worked with performer Sung Uk Hoh to explore the concept of “Taeyeok (what is latent in pre-chaos)” and "Hon-ryun" (the state of being before differentiation into form) from the body concepts that form the basis of Eunhyeongbeop. These concepts refers to the state of existence before a body or matter takes on its form, energy, or texture—before it acquires the qualities of Qi, form, or substance. Through literature research and movement exploration, they began to investigate what it means to exist in these state, and what kind of dance might emerge from them. This film integrates these concepts, movements, and the text-making practices they engaged in, offering the audience the possibility of experiencing the state of Taeyeok and Honryun through viewing and listening. What if these indigenous bodily perspectives of Korea can be considered somatic materials and resources that have so much uncover here and now via dancing?</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept, Artistic Direction &amp; Script by He Jin Jang</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Film Co-direction by He Jin Jang, Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Cast by He Jin Jang, Sung Uk Hoh</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Cinematography / Edit / Color by Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Recording by Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Music by Namreyoung Kim</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Sound Mixing by Minwoo Seo</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Thanks to Yewon Seo</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by: Art Project Bora</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue: 2025 Chore-graphy, Power Plant at Seoul National University, Korea</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">&lt;태역에 속도가 묻어있어서&gt;는 2023년에 시작된 동의보감 ‘은형법’에 대한 연구가 확장된 영상 설치 작업이다. 400년 전 왜란과 전염병의 시대에 연습되어진 ‘몸의 형체를 숨기는 법’을 일종의 스코어로 인식한 장혜진 안무가는 공동연구자들과 사변적 대화, 문헌연구, 움직인 연구, 스토리텔링, 개인적 깨달음의 시간을 가지며, 작년 2023년 8월 멀티센소리 공연으로 발전시켜 관객을 초대했다. 이를 통해 남겨진 질문은 다음과 같았다. “재난과 질병의 순간 조상들에게 몸, 공동체, 돌봄은 무엇이었을까? 이러한 토착적 지혜가 지금 ‘존재론적 전환(Ontological Turn)’의 시대에 던질 수 있는 이야기는 무엇일까?” 2024년 7-8월, 두 달의 기간 동안 장혜진 안무가는 허성욱 퍼포머와 은형법의 배경이 되는 신체관을 천천히 살펴보았다. 우리 조상들의 토착적 신체관은 어떻게 지금 우리의 존재 방식과 평행하게 어긋나며 만나게 될까?</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉, 감독, 각본. 장혜진</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">공동연출. 이도현, 장혜진 </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">출연. 장혜진, 허성욱 </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">촬영, 편집, 색보정. 이도현 </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">녹음. 이도현</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">음악. 김남령</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드 믹싱. 서민우 </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">도움. 서예원 </span></span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">제작지원. 아트프로젝트 보라 </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. 2024 코레오-그래피 @ 서울대학교 파워플랜트, 한국</span></span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 687/387; max-width: 687px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_2c50be3925714d9980b2e709b0304515~mv2.png/v1/fill/w_687,h_387,al_c,lg_1,q_85,enc_avif,quality_auto/073f40_2c50be3925714d9980b2e709b0304515~mv2.png">
                    <span class="placeholder-label">Image: 태역속도_스크립트 사진.png (687x387)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/living-without-2017': {
    title: 'living without (      ) (2017) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyo5xjxz wixui-rich-text" data-testid="richTextElement" id="comp-lyo5xjxz"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">living without ( ) </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2017) <br class="wixui-rich-text__text"/>
괄호 없이 살기 (2017)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/473; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_fe6910cafea14583bc5c57e22bd5b189~mv2.png/v1/crop/x_0,y_0,w_1200,h_672/fill/w_845,h_473,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202017-03-28%20at%206_26_47%20AM.png">
                    <span class="placeholder-label">Image: Screen Shot 2017-03-28 at 6.26.47 AM.png (845x473)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/473; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_fa30c2d235f6422b9adc7a2ddd654285~mv2.png/v1/crop/x_2,y_0,w_1195,h_669/fill/w_845,h_473,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/Screen%20Shot%202017-03-28%20at%206_30_38%20AM.png">
                    <span class="placeholder-label">Image: Screen Shot 2017-03-28 at 6.30.38 AM.png (845x473)</span>
                  </div>
                </div>
                

            <div class="about-image-container" style="max-width: 849px; margin: 40px 0;">
              <div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                <iframe src="https://www.youtube.com/embed/Q030plCTc7M" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
              </div>
            </div>
            
      </div>
    `
  },
  '/microhabitat-body-2018': {
    title: 'Microhabitat Body (2018) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyo5gbeg1 wixui-rich-text" data-testid="richTextElement" id="comp-lyo5gbeg1"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"><span class="wixui-rich-text__text" style="font-style:italic;">Microhabitat Body </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2018)<br class="wixui-rich-text__text"/>
미소서식지 몸 (2018) </span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/563; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4feeb573a14a49f188116fdc652c2107~mv2.jpg/v1/crop/x_0,y_0,w_1199,h_800/fill/w_845,h_563,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E2%88%9A%C2%A2%C2%BF%E2%82%AC%CE%A9%C2%AB%C2%AB%C3%8B_20180223-HeJinJangDance009_JPG.jpg">
                    <span class="placeholder-label">Image: √¢¿€Ω««Ë_20180223-HeJinJangDance009.JPG (845x563)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/563; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_f4d1e18337254f158a24f7f7f6279812~mv2.jpg/v1/fill/w_845,h_563,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E2%88%9A%C2%A2%C2%BF%E2%82%AC%CE%A9%C2%AB%C2%AB%C3%8B_20180223-HeJinJangDance006_JPG.jpg">
                    <span class="placeholder-label">Image: √¢¿€Ω««Ë_20180223-HeJinJangDance006.JPG (845x563)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/563; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_0364cbef036f4a23b89a85292cfa0c3d~mv2.jpg/v1/fill/w_845,h_563,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E2%88%9A%C2%A2%C2%BF%E2%82%AC%CE%A9%C2%AB%C2%AB%C3%8B_20180223-HeJinJangDance001_JPG.jpg">
                    <span class="placeholder-label">Image: √¢¿€Ω««Ë_20180223-HeJinJangDance001.JPG (845x563)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/563; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_9600d228b59b44208f48f151ec8e0ef7~mv2.jpg/v1/crop/x_0,y_1,w_6568,h_4376/fill/w_845,h_563,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%E2%88%9A%C2%A2%C2%BF%E2%82%AC%CE%A9%C2%AB%C2%AB%C3%8B_20180223-HeJinJangDance011_JPG.jpg">
                    <span class="placeholder-label">Image: √¢¿€Ω««Ë_20180223-HeJinJangDance011.JPG (845x563)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lyo5gbey wixui-rich-text" data-testid="richTextElement" id="comp-lyo5gbey"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;">Microhabitat Body </span>is a project that explores the minimum conditions for choreography to emerge. The choreographer creates a situation where the audience and performers can see ‘missing/not-yet-manifested bodies’ and their bodies that are seeing what is missing are once again seen. In this one-on-one performance, the concept of 'taa or atta', a Korean phrase meaning ‘you are me and I am you,’ is embodied through the kinetics of viewing nothing from each other. The moment is being seen and commented on by primate scientists and cultural scholars again. The sense of symbiosis is explored in multiple layers with a sense of play.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span>​​​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Direction by He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Creation/Performance by He Jin Jang, Myoung Gyu Song, Yunkyung Hur</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Dramaturgy by Ziyea Hyun</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Music by Tim Motzer</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Observation and Commentary by Sanha Kim Hyeongbin Cho</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Graphic Design by Donkyu Kim</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Producer by Hyojin Kwon</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue. Oil Tank Cultural Park as part of 2017 Arts Council Korea Experiment Showcase</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">&lt;미소서식지 몸&gt;은 안무를 위한 최소한의 조건을 탐색하는 작업이다. 안무가는 퍼포머와 관객이 ‘없는 몸/아직 나타나지 않은 몸'을 볼 수 있는 환경을 조성한다. 없는 것을 보는 몸은 타자에게 보여지게 되며 안무가 발생한다. 1인의 퍼포머와 1인의 관객이 페어링 되어 서로 없는 것을 관찰하고, 이 순간을 다시 야생영장류 학자와 문화연구자가 관찰한다. 서로는 서로를 보고 (없는 것에 대한) 살아있는 각주를 첨가하면서 공생의 의미를 되찾는다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉/안무. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">공동구성/퍼포먼스. 송명규, 장혜진, 허윤경</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">드라마투르기. 현지예</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드. 팀 모처</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">관찰. 김산하 (야생영장류 학자), 조형빈</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">그래픽 디자인. 김동규</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">프로듀서. 권효진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">영상기록. 복코</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 한국문화예술위원회, 문화체육관광부</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. 문화비축기지, 한국</span></span></p></div>
      </div>
    `
  },
  '/microhabitat-body-last-words-2020': {
    title: 'Microhabitat Body: Last Words (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lymqf2ju wixui-rich-text" data-testid="richTextElement" id="comp-lymqf2ju"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Microhabitat Body: Last Words</span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"> </span></span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">  (2020)</span></span></span><br class="wixui-rich-text__text"/>
<span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">미소서식지 몸: 유언</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/525; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_144fe7f548924126a0470e4408988ac3~mv2.jpg/v1/crop/x_0,y_0,w_1200,h_746/fill/w_845,h_525,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/1%EA%B3%BC7%ED%8C%9D%EC%BD%98.jpg">
                    <span class="placeholder-label">Image: 1과7팝콘.jpg (845x525)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/400; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_bba2993de89746f3b6cc4b0e8349487e~mv2.jpg/v1/fill/w_845,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/5_%202%EC%9B%94%EC%87%BC%EC%BC%80%EC%9D%B4%EC%8A%A4%EC%82%AC%EC%A7%84%ED%81%AC%EB%A0%88%EB%94%A76_%ED%8C%9D%EC%BD%98.jpg">
                    <span class="placeholder-label">Image: 5. 2월쇼케이스사진크레 딧6_팝콘.jpg (845x400)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lymqf2kj2 wixui-rich-text" data-testid="richTextElement" id="comp-lymqf2kj2"><blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">“My name was called. A guide addressed only to me unfolded, and I was gently drawn into the still and quiet depth of the work’s world.”<br class="wixui-rich-text__text"/>
— Audience Member, 2020</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">Part of The Umbrella Project: <span class="wixui-rich-text__text" style="font-style:italic;">Microhabitat Body</span>, this choreographic work explores the minimum conditions under which a dance might appear—the moment when a trace, a breath, or a last word gains just enough gravity to take form. Here, last words are not fixed or final. They become microhabitats: intimate spaces for what lingers, what remains unspoken, and what demands to be held.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">Audience members wear headphones and listen to an mp3 soundtrack recorded specifically for them—each name softly spoken, each address uniquely tailored. “The use of mp3 was astonishing,” one recalled. “It echoed through my body long after the piece ended.” While this intimate audio unfolds, three performers gradually move among the audience, enacting anonymous, low-to-the-ground gestures. They evolve into ghostly witnesses, massaging black anonymous objects. Three choreographic “last word” scores are activated: one on the senses detaching from the body, one on death mid-performance, and one on the bequeathal of personal farewells. These are not theatrically staged, but physically absorbed—between reading and listening, sensing and moving, stillness and tremor.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">Eventually, the audience is invited to lie down. Eyes closed, bodies horizontal, they enter a shared but deeply private threshold. As each person exits, they receive a sealed mini-book labeled: “Open at 7am Tomorrow.” A final instruction. A delayed offering. The work asks how we carry last things—not as closures, but as quiet beginnings of what has yet to arrive.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">“We, who had been ‘the audience,’ became simply ‘I’—eyes closed, discovering myself lying still.”<br class="wixui-rich-text__text"/>
“This echo stretched for 12 more hours. It stayed with me until morning.”<br class="wixui-rich-text__text"/>
“It felt like I was part of a collective experience, but at the same time, I was being addressed as an individual—by name. It wasn’t about forcing audience participation or setting up artificial situations. Instead, it created a truly multisensory experience that I could just fall into.”<br class="wixui-rich-text__text"/>
— Performance Attendee, 2020</p>
</blockquote>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Choreographed and Conceived by He Jin Jang in collaboration with the performers</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Performed by He Jin Jang, Myoung Gyu Song, Yunkyung Hur</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Dramaturgy by Ziyea Hyun</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Sound Design by Jimmy Sert </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Project Management by Hyojin Kwon</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Graphic Design by Dongkyu Kim</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Video Documentation by Bokco</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Photo Documentation by Pop Con</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Sinchon Arts Space, Space Bon Courage</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Venue:</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2020 Seoul International Dance Festival, Korea</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2020 Arts Council Korea Experimental Arts Showcase @ Oil Tank Cultural Park, Korea​​​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">“나의 이름이 불렸고, 나만을 위한 고유한 안내가 펼쳐졌습니다. 조용하고 깊게, 작업의 세계로 이끌려 들어갔습니다.”<br class="wixui-rich-text__text"/>
– 2020년 관객</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">엄브렐라 프로젝트 ‘미소서식지 몸’ 연작의 일환인 이 공연은, 춤이 출현하기 위한 최소한의 조건을 탐색한다. 아직 살아지지 않은 생의 흔적이 움직임으로 번역되는 감각의 문턱에서, ‘유언’은 끝맺는 언어가 아니라 머무르고, 말해지지 않았으며, 여전히 소환되는 무언가를 담는 미세한 서식지가 된다.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">관객은 무선 헤드폰을 착용한 채, 자신의 이름이 불리는 mp3 사운드트랙을 듣는다. “mp3의 사용에 감탄했습니다. 작품이 끝난 후에도 그 울림이 오래 남아 있었습니다.”는 관객의 피드백처럼, 이 오디오는 각자의 이름과 감각 지시를 통해 오직 한 사람만을 위한 안내서를 조용히 펼쳐낸다. 점차 세 명의 퍼포머는 어둡고 낮은 움직임으로 관객 사이를 흐르며, 검은 오브제를 어루만지고 몸을 조율하는 익명의 제스처들을 펼쳐낸다. 공연 전반에는 세 개의 ‘유언’ 스코어가 활성화된다: 몸에서 감각이 이탈하는 순간, 공연 도중 죽음이 고개를 기울이는 장면, 개인적 작별 인사의 나눔. 이 스코어들은 연극적으로 제시되지 않고, 읽기와 듣기, 감각과 움직임, 멈춤과 떨림 사이에서 신체적으로 흡수된다.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">공연 후반, 관객은 자리에 누워 눈을 감고 각자의 내밀한 문턱 공간에 진입하게 된다. 공연장을 나설 때는 ‘내일 아침 7시에 열어보세요’라는 문구가 적힌 봉인된 미니북을 받는다. 이 지시는 작품의 감각을 다음 날까지 연장시키는 장치가 된다. 이 작업은 마지막이라는 것을 끝이 아닌, 아직 도착하지 않은 무언가의 시작으로 다시 묻는다.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">“‘관객’이라는 집합에서 빠져나온 ‘나’들은, 눈을 감고 누워 있는 자신의 몸을 발견하게 된다.”<br class="wixui-rich-text__text"/>
“이미지의 잔상은 메아리쳤고, 그 메아리들은 서로 간섭하며 나를 어지럽게 했다. 그 여운은 12시간 동안 지속되었다.”<br class="wixui-rich-text__text"/>
“관객으로서의 집단적 경험과, 개인으로서 호명되는 개별적 경험이 병치되었습니다. 작위적인 공간 개입이나 관객 참여가 아닌, 감각을 열어주는 공감각적 경험이었습니다.”<br class="wixui-rich-text__text"/>
– 2020년 관객</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://prezi.com/6fujbqmvel-a/1/" rel="noreferrer noopener" target="_blank">드라마터그 리서치 맵 링크</a></span></span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span>​​<span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">컨셉/안무. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">출연/공동리서치. 송명규, 장혜진, 허윤경</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">드라마터그. 현지예</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">에디토리얼 드라마터그. 조형빈</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">사운드디자인. 지미 세르</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">프로듀서. 권효진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">그래픽디자인. 김동규</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">영상. 복코</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">사진기록. 팝콘</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부, 신촌문화발전소, 봉쿠라지</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">베뉴. </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2020 SIDance 국제 페스티벌, 한국</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2020 한국문화예술위원 창작의 과정, 문화비축기지, 한국​​</p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/525; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4acdb35352fe429b8c363a89b05181de~mv2.jpg/v1/fill/w_845,h_525,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_4acdb35352fe429b8c363a89b05181de~mv2.jpg">
                    <span class="placeholder-label">Image:  (845x525)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/migrant-self-the-speed-of-a-door-2012-16': {
    title: 'migrant-self the speed of a door (2012) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lypf9zay1 wixui-rich-text" data-testid="richTextElement" id="comp-lypf9zay1"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">migrant-self the speed of a door  </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2012-16)<br class="wixui-rich-text__text"/>
이주하는 자아 문의 속도 (2012-16)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/600; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_6d155c3abcb345dca707e124499b2ec7~mv2.jpg/v1/crop/x_37,y_0,w_1127,h_800/fill/w_845,h_600,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/migrantself2.jpg">
                    <span class="placeholder-label">Image: migrantself2.jpg (845x600)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1132; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_301d991a3d2e4816a8bf6bce3e8252a9~mv2.jpg/v1/crop/x_30,y_0,w_899,h_1204/fill/w_845,h_1132,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_6474.jpg">
                    <span class="placeholder-label">Image: IMG_6474.jpg (845x1132)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lypf9zbs2 wixui-rich-text" data-testid="richTextElement" id="comp-lypf9zbs2"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;">migrant-self the speed of a door </span>explores perceptible and imperceptible timing and aging in relation to migrating. In the act of traveling home and abroad for 5 years, time becomes hybrid, fictional and bendable. Bruised by time, one faces fragile becoming in the waiting room. By reflecting the sense of paradoxical time into the choreographic process, the choreographer asks the following questions: How do certain body parts reflect this ruptured sense of time and duration? What if coming and going happen in the same doorway metaphysically and corporeally? This solo work migrated and toured more than 15 times over 5 years. It is a practice-as-performance as well as a ‘diagnostic artistic work’ of which structure and contents shift as time passes by. Each version is unique as the body ages.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept/Choreography/Performance. He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Sound by He Jin Jang, Sigur Ros</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Movement Research, Jerome Foundation, New York Live Arts, Suitcase Fund</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Selected Venue.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 MODAFE Festival, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 World Dance Alliance Asia-Pacific Showcase, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 New York Live Arts, U.S </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2013 American Dance Festival. U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2013 Eleanor D. Wilson Museum, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2012 Spring Movement Festival, Center for Performance Research, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span>​</span>​<span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">이주하는 신체가 가지는 ‘시간/시제’에 대한 행위적 개념을 탐구하는 작업이다. 5년간의 이주 행위와 함께, 시간은 기이하고, 허구적이고, 변형 가능한 것이 된다. 시간에 의해 타격을 입으며, 기다림 안에서 조각난 존재가 되어간다. 이러한 모순된 시간이 안무적 과정에 반영되며, 다음과 같은 질문을 던진다. 이주하는 신체는 어떻게 이러한 시간성을 반영하는가? 떠나감과 돌아옴이 몸이라는 같은 문지방에서 일어난다면 어떨까? 이 공연은 5년의 시간 동안 15회 이상 공연되며, ‘수행으로서의 공연 practice-as-performance’이자 ‘진단적 예술 작업 diagnostic artistic work’으로 자리했다. 각 버전의 구조와 내용은 시간의 흐름 그리고 노화에 따라 함께 변해가고 있다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉/안무/퍼포먼스. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드. 장혜진, 시규어 로스</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 미국 Movement Research, New York Live Arts, Jerome Foundation</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 MODAFE 국제 페스티벌, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2016 세계무용연맹 아시아-퍼시픽 쇼케이스, 한국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2015 New York Live Arts, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2013 American Dance Festival, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2013 Eleanor D. Museum, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2012 Center for Performance Research, 미국 외 다수</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/mirror-neuron-salon-2017': {
    title: 'Mirror Neuron Salon (2017) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzchyarb wixui-rich-text" data-testid="richTextElement" id="comp-lzchyarb"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">Mirror Neuron Salon</span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"> (2017)<br class="wixui-rich-text__text"/>
거울 뉴런 살롱 (2017)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Ursula Eagly</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/743; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_5e4d35ee0a514e62b5aeb88db881e52f~mv2.jpeg/v1/crop/x_0,y_25,w_960,h_911/fill/w_845,h_743,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EA%B1%B0%EC%9A%B8%EB%89%B4%EB%9F%B0%EC%82%B4%EB%A1%B1.jpeg">
                    <span class="placeholder-label">Image: 거울뉴런살롱.jpeg (845x743)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/743; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_b033ce27628843a5bfc4c47b1af21ae4~mv2.jpeg/v1/crop/x_0,y_48,w_800,h_703/fill/w_800,h_703,al_c,q_85,enc_avif,quality_auto/%EA%B1%B0%EC%9A%B8%EB%89%B4%EB%9F%B0%EC%82%B4%EB%A1%B12.jpeg">
                    <span class="placeholder-label">Image: 거울뉴런살롱2.jpeg (845x743)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzchyarl1 wixui-rich-text" data-testid="richTextElement" id="comp-lzchyarl1"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;">Two dance artists from the East and West dig into the concept of mirror neurons. Using score activate them, they share thoughts and questions with the audience. What is the link between mirror neurons and empathy? Between empathy and morality? How can mirror neurons be agents of dance? How would interpersonal neurological responses operate across the roles of performer and audience? This is a salon-type performance.</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:14px;">​​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">Concept/Co-creation/Performance by Ursula Eagly and He Jin Jang<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Supported by Seoul Dance Center<br class="wixui-rich-text__text"/>
Venue. Seoul Dance Center, Korea</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:14px;">거울 뉴런 반응을 파헤치는 동서양의 두 안무가. 이 뉴런 반응을 자극하는 스코어를 통해, 거울 뉴런과 공감, 도덕성, 춤, 관객과의 관계를 탐험하는 살롱형 퍼포먼스이다.</span></p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" dir="ltr" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="text-decoration:none;">컨셉/공동창작/출연. 어술라 이글리, 장혜진<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
후원. 서울무용센터<br class="wixui-rich-text__text"/>
베뉴. 서울무용센터</span></span></p></div>
      </div>
    `
  },
  '/movement-class-dance-with-fascia-biom': {
    title: 'Movement Class: Dance with Fascia & Biom | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqp0jb7 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp0jb7"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Movement Class: Dance with Fascia &amp; Biomechanics<br class="wixui-rich-text__text"/>
움직임 수업: 근막 그리고 생체역학과 함께 춤추기</span></h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 465/462; max-width: 465px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_61391cae730545e083986203e3b6fcfc~mv2.jpg/v1/fill/w_465,h_462,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7186.jpg">
                    <span class="placeholder-label">Image: IMG_7186.jpg (465x462)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 307/462; max-width: 307px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_9116f8b5c0494b6fb543761e11d386e7~mv2.jpg/v1/fill/w_307,h_462,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/hejinjang_photo_credit_gibeom_kim%20(1).jpg">
                    <span class="placeholder-label">Image: hejinjang_photo_credit_gibeom_kim (1).jpg (307x462)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqp0jbi1 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp0jbi1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Wise body is strong and political. Body wisdom awakens our bodily voices and artistic citizenship. Incorporating some of the concepts in fascial anatomy and biomechanics of our bodies (potential/kinetic energy, inertia, centripetal force, wavelength, elasticity of fascia,etc.), we move to free and empower the individuals in us in this workshop. This class explores the pathway of a released and off-balanced dancing body while finding stillness and surprise in it.<br class="wixui-rich-text__text"/>
Why fascia and biomechanics? Fascia is a soft membrane that surrounds and supports organs, blood vessels, bones, nerve fibers, and muscles, and is a dense connective tissue that runs in three dimensions from head to toe, providing structural support and stability. Physics, as the study of matter, energy, and the interaction between them, is applied in movement to better organize our moving bodies in relation to energy. Once we yield our bodies to the energy source and anatomical design to understand the fundamental nature of being, we are able to reach a sense of the metaphysical body. What if the pathway of fascia in our body helps us process elastic movement that resonates with the outer world? Class activities include hands-on-body work, improvisation, floor work, and locomotion to create a collective of wise and political bodies.</span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixGuard wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">현명한 몸은 강하고 정치적이다. 몸의 지혜는 우리 몸의 소리와 예술적 시민성을 일깨운다. 이 움직임 수업은 근막과 생체 역학 개념(위치/운동 에너지, 관성, 구심력, 파장, 근막의 탄성 등)에 접근하며 개개인을 안쪽 깊은 곳에서부터 자유롭게 하고 힘을 실어주는 움직임을 탐구한다. 몸의 고요함과 놀라움을 찾으면서 이완되고 역동적인 춤의 경로를 탐색한다.왜 근막과 생체역학일까? 근막은 장기, 혈관, 뼈, 신경섬유, 근육을 둘러싸고 지지하는 부드러운 막으로, 머리부터 발끝까지를 3차원으로 연결하여 구조적 지지와 안정성을 제공하는 치밀한 결합조직이다. 이때 물질과 에너지 그리고 이들 사이의 상호작용을 연구하는 학문인 물리학은, 움직이는 몸과 에너지와의 긴밀한 조우를위해 탐구될 수 있다. 몸을 에너지원과 해부학적 설계에 내맡기고 존재의 근본적인 본질을 이해하게 되면, 우리는 형이상학적 몸의 느낌에 도달할 수도 있다. 반동을 수반한 탄성적인 움직임을 지닌 우리 몸의 근막이, 세상과의 공명을 이끌 수 있지 않을까? 이 수업은 핸즈온 작업, 즉흥, 플로어 워크, 중심이동 등의 프랙티스로 구성되어 있으며, 이를 통해 현명하고 정치적인 몸의 공동체에 접근한다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/navigating-uncertain-terrain-with-generosity-2023': {
    title: 'Navigating Uncertain.. (2023-ongoing) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lsu0vly3 wixui-rich-text" data-testid="richTextElement" id="comp-lsu0vly3"><p class="font_8 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-style:italic;">Navigating Uncertain Terrain with Generosity </span>(2023 - )</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">불특정한 지형을 관대하게 탐색하기 (2023 - )</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:20px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">with in-between space lab</span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 517/647; max-width: 517px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_4583c9366a7c40ca9af45616bed6c585~mv2.jpeg/v1/crop/x_2,y_0,w_1022,h_1280/fill/w_517,h_647,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%89%90%EC%96%B4%EB%A7%81%20%ED%8F%AC%EC%8A%A4%ED%84%B0%20%EC%B5%9C%EC%A2%85.jpeg">
                    <span class="placeholder-label">Image: 쉐어링 포스터 최종.jpeg (517x647)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lsu0vly71 wixui-rich-text" data-testid="richTextElement" id="comp-lsu0vly71"><p class="font_8 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">2023 in-between space lab</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">Navigating Uncertain Terrain with Generosity</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">in-between space lab is a triangular cultural exchange research project among three choreographers from Korea and Canada: He Jin Jang, Heidi Strauss and Marie France Forcier. Their research on the ‘audience as neuro-divergent community’ was conducted in the year of 2023, spanning one week in July in Liverpool, UK, another week in September in Calgary, Canada, and the final week in November in Seoul, Korea. During this time, they shared a profound sense of companionship by moving/talking/eating/laughing-crying/critiquing/reading /writing/and sharing space.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;">Workshop</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">The workshop titled <span class="wixui-rich-text__text" style="font-style:italic;">Navigating Uncertain Terrain with Generosity</span> happened in and around Seoul Dance Center in November 2023. Here, the artists and participants together attempted to connect with space, time, history, memories, and encounters, embracing a sense of uncertainty via the felt-body. This workshop explored developing practices that the artists have been researching, aimed at stimulating the senses and expanding awareness. By sharing these simple acts, they learned how audience-attentive experiments can act as amplifiers for co-presence. Playing with notions of accompaniment both by human and more-than-human, participants were guided to the experience developed through exchange and generosity. The artists’ intention to share their practice with the participants further extended this exchange, offering opportunities for brief individual and group reflections. They together questioned and altered habitual tendencies with generosity with the hope to become more open to uncertainty.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;">Online sharing </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">Participants from any parts of the world were invited to an online sharing hosted by in-between space lab in December 2023. Over this  two-hour session, choreographers/researchers Marie France Forcier, He Jin Jang, and Heidi Strauss reflected on the initial development phase and workshop towards a collaborative practice of “navigating uncertainty with generosity.” They walked through where the process had taken them, sharing perspectives they had gained, workshop images, personal revelations, and their hopes for the project’s future. By attempting to connect with space, time, and encounters with a sense of uncertainty via the felt-body, they questioned in what (neurodivergent) ways audience-attentive experiments could act as amplifiers for co-presence. A Canada/Korea exchange, the event was conducted in both English and Korean. This project was made possible with support from Arts Council Korea's International Partnership in Support of Arts Creation, Canada Council for the Arts, University of Calgary, Seoul Dance Center, and adelheid dance projects.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">1) Research Map - <a class="wixui-rich-text__text" href="https://www.hejinjang.com/_files/ugd/073f40_7599d2cf5a7b4e7f93d7eb4a508b15be.pdf?index=true" target="_blank"><span class="wixui-rich-text__text" style="color:#00B3FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;">Download</span></span></a></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Project Initiation, Research and Workshop. He Jin Jang, Marie France Forcier, Heidi Strauss</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Interpretation and Translation. Adela Shin</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Management and Archive. Yewon Seo</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">English Archive. Hyeonhwa Lee<br class="wixui-rich-text__text"/>
Photography Documentation. Sukkuhn Oh<br class="wixui-rich-text__text"/>
Video Documentation. Jinwon Lee</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Research Map Design. Kyujin Shim</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Producer. Eunji Park</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Arts Council Korea's International Partnership in Support of Arts Creation, Canada Council for the Arts, University of Calgary, Seoul Dance Center, adelheid dance projects<br class="wixui-rich-text__text"/>
Organized and Hosted by He Jin Jang Dance</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 Liverpool John Moore University, UK (Residency #1)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 University of Calgary, Canada (Residency #2)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 Seoul Dance Center, Korea (Residency #3  &amp; Workshop)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 On-line via Zoom (Online Research &amp; Sharing)</span></span></p>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"> </h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span>​</span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-style:normal;"><span class="wixui-rich-text__text" style="color:#000000;">2023 한국-캐나다 협력 리서치 프로그램:인-비트윈 스페이스 랩</span></span></span></span></h5>
<h5 class="font_5 wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;">2023 in-between space lab</span></span></span></span></h5>
<p class="font_9 wixui-rich-text__text" style="font-size:18px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​​​​​​​​​​​​​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">인-비트윈 스페이스 랩 in-between space lab은 한국인 안무가 장혜진과 2명의 캐나다 안무가 마리 프랑스 포시에르 Marie France Forcier &amp; 하이디 스트라우스 Heidi Strauss 사이의 트라이앵글 문화교류 리서치이다. 이들은 ‘신경다양적인 개인이자 공동체로서의 관객 Audience as neurodivergent individual and collective’을 탐구하기 위해 2023년 여름부터 리서치를 시작했고, 7월에는 영국 리버풀에서 일주일, 9월 캐나다 캘거리에서 일주일, 그리고 11월 5-11일에는 서울에 모여 일주일을 함께 한다. 이 시간 동안 이들은 움직이기/이야기하기/먹기/웃고 울기/비판하기/읽기/쓰기 등의 과정을 통해 자신의 공간을 나누고, 동행하고 있다.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;">워크숍 &lt;불확실한 지형을 관대하게 탐색하기&gt;​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">서울무용센터 안팎에서 진행될 [워크숍: 불확실한 지형을 관대하게 탐색하기]에서는 ‘느끼고 있는 몸 felt-body’를 통해 시간과 공간, 역사와 기억 그리고 만남에 보다 불확실하게 접속하기를 시도한다. 이들은 그간 감각을 자극하고, 인식을 확장할 수 있는 단순한 프랙티스를 수행해왔고, 이를 당신과 나누며 ‘관객에게 주의를 기울이는 공연 실험 Audience-attentive performance experiment'이 공동 실존의 감각을 증폭시킬 수 있는 방법들에 대해 고민을 털어놓고자 한다. 우리는 ‘동반(인간이든 비인간이든)’의 느낌을 통해 서로를 안내하고 나눔과 관대함에 다가갈 것이다. 그 나눔의 연장선에서, 이 워크숍을 통해 당신과 함께 개인과 공동체에 대해 성찰하고 싶은 마음이다. 우리의 습관과 경향에 대해 질문을 던지는 동시에 ‘관대하게’ 더 불확실해질 것을 기대한다.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:14px;">프로젝트 &lt;불확실한 지형을 관대하게 탐색하기&gt; 온라인 과정 공유회</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">2023 인-비트윈 스페이스 랩의 온라인 공유에 초대합니다. 안무가이자 연구자인 마리 프랑스 포르시에(Marie France Forcier), 장혜진(He Jin Jang), 하이디 스트라우스(Heidi Strauss)가 2023년 하반기에 진행된 한국-캐나다 협력 프로젝트 &lt;불확실한 지형을 관대하게 탐색하기&gt;의 초기 개발 단계와 워크숍 과정을 공유한다. 과정을 통해 도달하게 된 관점, 개인적인 질문, 이미지와 영상, 그리고 프로젝트의 미래에 대해 영어와 한국어로 나눌 예정이다. 시간과 공간, 감각과 만남에 보다 불확실하게 접속하기 위한 신체 실천을 탐색하며, ‘관객에게 주의를 기울이는 공연 실험(Audience-attentive performance experiment)'이 공동 실존의 감각을 증폭시킬 수 있는 신경 다양적인 방법들에 대해 고민해왔다. 개인과 공동체에 대한 사유는 우리의 습관, 배경, 기억, 역사에 대해 질문을 던지게 했고, 이를 초대된 사람들과 편안하게 공유하는 시간이 될 것이다.</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">1) 리서치 맵 - <a class="wixui-rich-text__text" href="https://www.hejinjang.com/_files/ugd/073f40_7599d2cf5a7b4e7f93d7eb4a508b15be.pdf" target="_blank"><span class="wixui-rich-text__text" style="color:#00B3FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;">PDF 파일 다운로드</span></span></a></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">프로젝트/리서치/워크숍 진행. 장혜진, Marie France Forcier, Heidi Strauss</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">통역/번역. 신재윤 </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">매니지먼트/기록. 서예원 </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">영문기록. 이현화</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사진기록. 오석근</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">영상기록. 이진원</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">리서치맵 디자인. 심규진</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">프로듀서. 박은지</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 한국문화예술위원회 한국-캐나다 교류 국제예술공동기금, 문화체육관광부, 서울무용센터, Canada Council for the Arts, University of Calgary, adelheid dance projects</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">제작. He Jin Jang Dance</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴.</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 리버풀 존무어 대학교 아트 &amp; 디자인 센터, 영국 (레지던시 #1)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 캘거리 대학교 무용센터, 캐나다 (레지던시 #2)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 서울무용센터, 한국 (레지던시 #3 &amp; 워크숍)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2023 온라인 줌 (온라인 리서치 &amp; 과정 공유회)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​​​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​</span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​</span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​</span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​​</span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="letter-spacing:0em;">​</span></span></span><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:13px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 300/400; max-width: 300px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_83a928ccfa9c43e4aff2e9b58acabd1c~mv2.png/v1/fill/w_300,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_5335_HEIC.png">
                    <span class="placeholder-label">Image: IMG_5335.HEIC (300x400)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 538/400; max-width: 538px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_bddbd9d0c9734d2a9a786a031190518a~mv2.jpg/v1/fill/w_538,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_1732%20copy.jpg">
                    <span class="placeholder-label">Image: IMG_1732 copy.jpg (538x400)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 300/400; max-width: 300px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_31329f1cece54e858fa3ed7a38211860~mv2.png/v1/fill/w_300,h_400,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EB%AC%B8%ED%99%94%EB%B9%84%EC%B6%95%EA%B8%B0%EC%A7%80_%EB%92%A4%EB%A1%9C%20%EA%B1%B7%EA%B8%B0_HEIC.png">
                    <span class="placeholder-label">Image: 문화비축기지_뒤로 걷기.HEIC (300x400)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 538/400; max-width: 538px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_a502673f31214784bee172cfc413b88c~mv2.jpg/v1/fill/w_538,h_400,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9B%8C%ED%81%AC%EC%88%8D%20%EC%A7%84%ED%96%89%20%EC%9D%B4%EB%AF%B8%EC%A7%80_JPG.jpg">
                    <span class="placeholder-label">Image: 워크숍 진행 이미지.JPG (538x400)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/open-skin-inscribed-2008': {
    title: 'Open Skin Inscribed (2008) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lypgdzgg wixui-rich-text" data-testid="richTextElement" id="comp-lypgdzgg"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">open skin inscribed </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2008)<br class="wixui-rich-text__text"/>
열린 피부에 적힌 (2008)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/542; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_09e1cf8f62be4ec39a084865d9143270~mv2.png/v1/crop/x_0,y_82,w_1728,h_1108/fill/w_845,h_542,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7%202020-05-15%20%EC%98%A4%EC%A0%84%2010_26_56.png">
                    <span class="placeholder-label">Image: 스크린샷 2020-05-15 오전 10.26.56.png (845x542)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lypgdzgw wixui-rich-text" data-testid="richTextElement" id="comp-lypgdzgw"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;">open skin inscribed </span>is a performance that explores the skin as  a surface that constitutes a thin line between the body and society. The choreographer delves into the open wounds within her family’s medical history, discovering accumulated narratives inscribed on the skin. Through tactile choreography, the story unfolds.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept/Choreography by He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Performance by He Jin Jang, Chang Doo Jang, Yeonhee Cho</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">VIsual Collaboration by Kate Abarbanell</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 American Dance Festival, USA</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Congress on Research in Dance, USA</span></span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">몸과 사회 사이 가느다란 표면으로서의 피부와 피부병(가족병력)에 대한 리서치를 안무화한 공연이다. 안무가는 피부의 열린 상처에 주목하며 거기에 무엇이 적혀있는지 발견해 간다. 생로병사를 겪는 몸으로서 사회에 존재하는 의미에 대해 촉각적 안무와 함께 사유하는 작업.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉/안무. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">퍼포먼스. 장혜진, 장창두, 조연희</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">비주얼 협력. 케이트 아바바나</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 아메리칸 댄스 페스티벌, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2008 Congress on Research in Dance, 미국</span></span></p></div>
      </div>
    `
  },
  '/porous-research-2023': {
    title: 'Porous Research (2023) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyphhn181 wixui-rich-text" data-testid="richTextElement" id="comp-lyphhn181"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-style:italic;">Porous Research: The Resilience Dance by the Invisible </span> (2023)</span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">뚫린 연구:  투명인간의 회복탄력성 춤</span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 534/755; max-width: 534px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_a65bd9f5faee4572a9dde6b26cb9ae8b~mv2.jpeg/v1/crop/x_0,y_1,w_1200,h_1697/fill/w_534,h_755,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/16856817941.jpeg">
                    <span class="placeholder-label">Image: 16856817941.jpeg (534x755)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lyphhn1l1 wixui-rich-text" data-testid="richTextElement" id="comp-lyphhn1l1"><p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">As part of the development of Slow Carnival World, this seven-week residency at Sinchon Arts Space became a site for what we called “porous research”—a choreographic investigation that questioned closed systems of rehearsal and production. Rather than generating knowledge through finalized performance, the research emphasized the minor, the disrupted, and the relational as sites of knowledge production. Through talks and movement-based sessions, the process unfolded ‘transparently, by making holes’—releasing what had been obscured or held in. The sessions invited participants not as passive observers, but as transparent presences: sensing, reflecting, and embodying the porous rhythms of the research itself. This residency did not conceal trial and friction, but honored them as generative. Mistakes, interruptions, and care became methodologies. What emerged was not a polished product, but an opening: a perforated field of slow-thinking, bodily intuition, and shared inquiry.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">* Public Sessions:</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">1. Talk – July 4<br class="wixui-rich-text__text"/>
An introduction to the research, including sensory exploration, walking-talking, and open discussion.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2. Movement Workshop – July 6<br class="wixui-rich-text__text"/>
A shared experiment in embodied methodology, followed by collective reflection</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Research Concept and Direction by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Movement Research by Kwonkeum Ko, Hyunjin Kim, Myoung Gyu Song, HeeSeung Lee, Sung Uk Hoh</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Livelihood Research by Eunji Park</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Archival Research by Yewon Seo</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Palate Research by Ocbong</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Sound Research by Namreyoung Kim</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Visual Research by Bokco</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Presented &amp; Hosted by<br class="wixui-rich-text__text"/>
He Jin Jang Dance, in partnership with Sinchon Arts Space</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span>​​​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​​​​<span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​<span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">《투명인간이 되든, 춤을 추든》의 창작 과정 중 일부로 진행된 7주간의 신촌문화발전소 레지던시는 ‘뚫린 연구(porous research)’라 명명한 안무적 탐구의 현장이다. 이 리서치는 리허설과 제작 방식의 폐쇄적 시스템에 의문을 던지며, 공연이라는 완성물을 통해 지식을 산출하기보다는, 작고 불완전하며 관계적인 지점들을 지식 생성의 기반으로 삼는다. 감각적이고 느린 경로를 통해 지식이 발생할 수 있다는 믿음 아래, 이 레지던시는 시행착오와 마찰을 감추지 않고 오히려 생성적인 요소로 존중한다. 실수와 중단, 돌봄은 하나의 방법론이 되며, 작고 불완전한 틈들은 기념된다. 토크와 움직임 기반 세션을 통해 이 과정은 ‘투명하게, 구멍을 뚫어서’ 펼쳐진다—그간 가려져 있거나 억눌려온 것들을 해방시키며. 이 공유 세션에서 참여자들은 수동적 관객이 아닌 ‘투명한 존재’로 초대된다. 감각하고, 반추하며, 리서치의 다공적 리듬을 신체로 체화하는 존재들이다. 매끄럽게 마감된 결과물이 아니라, 신체로 직관하고 함께 탐색할 수 있는 하나의 장—‘구멍 난 장(field of perforation)’을 공연에 앞서 감각적으로 드러난다.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">*공개 세션</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">1. 토크 – 7월 4일(화)<br class="wixui-rich-text__text"/>
연구와 그 과정을 소개하며, 미각 탐험, 산책, 감각 기반의 토론이 이어진다.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">2. 움직임 워크숍 – 7월 6일(목)<br class="wixui-rich-text__text"/>
움직임 방법론 일부를 참여자들과 함께 실험하고 이에 관해 나눈다.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">개념 및 안무 디렉션. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">움직임 연구. 고권금, 김현진, 송명규, 이희승, 허성욱</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">살림 연구. 박은지</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">기록 연구. 서예원</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">미각 연구. 옥봉</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">청각 연구. 김남령</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">시각 연구. 복코</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">주최 및 주관. He Jin Jang Dance, 신촌문화발전소​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<ul class="font_8 wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular; font-size:13px;">
<li class="wixui-rich-text__text"> </li>
</ul></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 843/467; max-width: 843px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_f195fa811dd24f63a4273e38a07a25f5~mv2.jpg/v1/fill/w_843,h_467,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9B%8C%ED%81%AC%EC%88%8D4_edited.jpg">
                    <span class="placeholder-label">Image: 워크숍4_edited.jpg (843x467)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 843/561; max-width: 843px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7b9d211ddd8e46b2844af0ec297ef4c3~mv2.jpg/v1/fill/w_843,h_561,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_7b9d211ddd8e46b2844af0ec297ef4c3~mv2.jpg">
                    <span class="placeholder-label">Image:  (843x561)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 850/567; max-width: 850px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_57b5c90fef664cfa99d3815bc9930812~mv2.jpg/v1/fill/w_850,h_567,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_57b5c90fef664cfa99d3815bc9930812~mv2.jpg">
                    <span class="placeholder-label">Image:  (850x567)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 850/638; max-width: 850px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_52d74d0e88884ea0b96ce6f9e7dcb4e2~mv2.jpeg/v1/fill/w_850,h_638,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_52d74d0e88884ea0b96ce6f9e7dcb4e2~mv2.jpeg">
                    <span class="placeholder-label">Image:  (850x638)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/post/2021년-『월간잡지-몸』-11월호-김남수-안무비평-흐르는': {
    title: 'Dance Magazine MOMM,  November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호,  <흐르는. >, 2021년, 김남수 안무비평가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Dance Magazine MOMM,  November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호,  <흐르는. >, 2021년, 김남수 안무비평가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/2021년-신빛나리-드라마터그-당신은-x-being을-초대하지-않을-수-없다': {
    title: 'You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / <당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / <당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/2021년-조형빈-평론가-흐르는': {
    title: 'Hyungbin Jo (Critic), 2021, the flowing. / <흐르는. > , 2021년, 조형빈 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Hyungbin Jo (Critic), 2021, the flowing. / <흐르는. > , 2021년, 조형빈 평론가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/2023년-『아트신』-1월호-김민관-평론가-당신이-그런-것을-입게-될-줄-알았어': {
    title: 'Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든': {
    title: 'Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/당신은x-being을-초대하지-않을-수-없다': {
    title: 'Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin': {
    title: 'Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어> | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/post/복제-투명인간이-되든-춤을-추든': {
    title: 'Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
        <div class="about-section">
          <h2 class="about-title">Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h2>
          <p class="about-text" style="font-style: italic; color: #999999;">
            Detailed project archives are being prepared for this workspace.
          </p>
        </div>
        
      </div>
    `
  },
  '/silence-replaced-2009-12': {
    title: 'Silence Replaced: (2009-12) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lypfv2s1 wixui-rich-text" data-testid="richTextElement" id="comp-lypfv2s1"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">silence replaced: </span></span></span></span></span><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2009-12)<br class="wixui-rich-text__text"/>
대체된 침묵: (2009-12)</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/600; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_d7684d96713e407ba45a4e24fd7a3f87~mv2.jpg/v1/crop/x_126,y_0,w_570,h_405/fill/w_684,h_486,al_c,lg_1,q_80,enc_avif,quality_auto/silencereplaced.jpg">
                    <span class="placeholder-label">Image: silencereplaced.jpg (845x600)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lypfv2sj1 wixui-rich-text" data-testid="richTextElement" id="comp-lypfv2sj1"><p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">A performative act to problematize the expectation of silence imposed on Asian women. A woman and her bizarre preparations for going-out create a space of slow voicing. With a lit candle placed on her hair spread across the floor, she becomes the voice of feminist speculative fabulation. The synesthesia of the voice flips the space and time upside down.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;">​​​</span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept/Choreography/Performance by He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Sound by He Jin Jang</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Movement Research, Jerome Foundation, National Dance Center in Bucharest, Romania</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2012 Pop-up Performance at One Arm Red, U.S</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2011 Moving Dialogue Residency @ Atelierul de Productie, Romania</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2009 The 41st Conference of Congress on Research in Dance: Dance Studies and Global Feminisms, U.S</span><a class="wixui-rich-text__text" href="https://mybox.naver.com/share/list/viewer/3472569162229199696?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="color:rgb(0, 179, 255); font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular; font-style:italic;"><span class="wixui-rich-text__text" style="text-decoration:underline;">​</span></span></a>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixGuard wixui-rich-text__text">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">침묵이 요구되어 온 아시아 여성의 몸은 기이한 외출 준비를 통해 목소리를 찾는다. 불이 붙은 초를 바닥에 펼쳐진 머리카락 위에 올려놓고 온몸을 쓸어 이를 운반하며 외출을 준비하는 그녀는 여성주의 사변적 우화의 주인공이 된다. 목소리의 공감각적 발생은 시간과 공간을 뒤집는다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉/안무/퍼포먼스. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드. 장혜진</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 미국 Movement Research, Jerome Foundation, 루마니아 국립무용센터</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2012 팝업 퍼포먼스, One Arm Red, 미국</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2011 무빙 다이알로그 레지던시, Atelierul de Productie, 루마니아 </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; line-height:1.8em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">2009 제 41회 Congress on Research in Dance 학회: 예술 연구와 글로벌 페미니즘, 미국 </span></span></p></div>
      </div>
    `
  },
  '/slow-carnival-world-2023': {
    title: 'Slow Carnival World (2023-ongoing) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lsssd0sa wixui-rich-text" data-testid="richTextElement" id="comp-lsssd0sa"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-style:italic;">Slow Carnival World </span>(2023 - ongoing)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">투명인간이 되든, 춤을 추든</span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 282/438; max-width: 282px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_df8de628b39f4398a75f3382ae4f4ee1~mv2.jpg/v1/fill/w_282,h_438,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%A5%ED%98%9C%EC%A7%84%20%EC%95%88%EB%AC%B4%EA%B0%80_%EC%88%98%EC%A0%95_-22.jpg">
                    <span class="placeholder-label">Image: 장혜진 안무가_수정_-22.jpg (282x438)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 555/438; max-width: 555px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_82a46ee449aa4acabfee8f54d10fbabb~mv2.jpg/v1/fill/w_555,h_438,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%A5%ED%98%9C%EC%A7%84%20%EC%95%88%EB%AC%B4%EA%B0%80_%EC%88%98%EC%A0%95_-19.jpg">
                    <span class="placeholder-label">Image: 장혜진 안무가_수정_-19.jpg (555x438)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lsssk29o wixui-rich-text" data-testid="richTextElement" id="comp-lsssk29o"><p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“Jang’s works offer a multisensory experience through the body, reflecting a new social role assigned to contemporary dancers. The spontaneous rhythm of the space enables a unique solidarity among participants on the spot.” </span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">— Hwajung Yu (Dance Critic)</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">Slow Carnival World</span> is a multi-sensory performance rooted in the speculative reading of Eun-Hyung-beop—a 17th-century Korean healing method of hiding the body, found in the <span class="wixui-rich-text__text" style="font-style:italic;">Donguibogam</span> (1610). Here, invisibility is not disappearance, but a quiet return to the porous, collective body. What if becoming unseen was a technology of endurance—an ancestral gesture of resistance and survival passed down through generations? The work unfolds as an immersive, durational experience shaped by slowness, delay, and porous rhythms. Bodies move with temporal dissonance, entangling without clear beginnings or ends. Dance becomes a soft protest and a shared lucid dream—a slow carnival where mantra-like texts, food, fabric, sound, and gesture form a space for collective unmaking. Visitors are invited to chew, rest, drift, and listen. Together, we resist the grammar of legibility, embracing relational opacity and unbordered time. Slow Carnival World is a quiet rehearsal for surviving together—through the invisible.​  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">Slow Carnival World </span>is structured with two main events: Common Ritual and Floating Action; If Common Ritual is a choreographed score of repetition, stillness, and shared presence,  Floating Action is a liminal zone of drifting attention: ambient gestures, quiet conversations, subtle shifts between performance and exhibition.  Visitors may arrive early or linger late, choosing how to participate.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">August 11 (Fri)<br class="wixui-rich-text__text"/>
3–4pm: COMMON RITUAL<br class="wixui-rich-text__text"/>
4–6pm: floating action<br class="wixui-rich-text__text"/>
6–7pm: COMMON RITUAL</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">August 12 (Sat)<br class="wixui-rich-text__text"/>
12–1pm: COMMON RITUAL<br class="wixui-rich-text__text"/>
1–3pm: floating action<br class="wixui-rich-text__text"/>
3–4pm: COMMON RITUAL<br class="wixui-rich-text__text"/>
4–6pm: floating action<br class="wixui-rich-text__text"/>
6–7pm: COMMON RITUAL</span></p>
<p class="wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><a class="wixui-rich-text__text" href="https://drive.google.com/file/d/1HgUU2c3EzzJSKXaDRv1Et4BJenmHrBaJ/view?usp=sharing" rel="noreferrer noopener" target="_blank"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:15px;">Link to Research Map</span></span></span></a></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span>​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​Concept/Direction/Script by He Jin Jang<br class="wixui-rich-text__text"/>
Performance/Research/Interpretation by Kwonkeum Ko, Hyun Jin Kim, Myounggyu Song, HeeSeung Lee, He Jin Jang, Sung Uk Hoh<br class="wixui-rich-text__text"/>
Creative Process Assistant by Sung Uk Hoh<br class="wixui-rich-text__text"/>
Edible Design by Ocbong<br class="wixui-rich-text__text"/>
Sound Design by Namreyoung Kim<br class="wixui-rich-text__text"/>
Visual Consultant by Donghee Kim<br class="wixui-rich-text__text"/>
Props Design by Hyuna Yi<br class="wixui-rich-text__text"/>
Props Assistant by Heesong Kang</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Producer by Eunji Park</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Management/Research by Yewon Seo<br class="wixui-rich-text__text"/>
Technical/Stage Director by Tae Young Maeng<br class="wixui-rich-text__text"/>
Stage Crew by Kyeong Yun Eom<br class="wixui-rich-text__text"/>
Sound Operator by Eunsaem Jeong<br class="wixui-rich-text__text"/>
Video Recording/Teaser by Bokco<br class="wixui-rich-text__text"/>
Photography by Jaewoo Oh</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">Produced &amp; Hosted by: He Jin Jang Dance<br class="wixui-rich-text__text"/>
Sponsored by: Platform-L Contemporary Art Center, Arts Council Korea, Shinchon Arts Space, Korea Creative Content Agency, The Dancers' Career Development Center</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:15px;">Venue: 2023 Live Arts Program, Platform-L Contemporary Art Center, Korea</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><a class="wixui-rich-text__text" href="https://www.youtube.com/@hejinjangdance" rel="noreferrer noopener" target="_blank">​​</a>​​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“즉흥적으로 만들어지는 공간의 리듬은 현장에 참여한 사람들 사이 특별한 연대를 가능케 한다...동시대 무용가에게 부여되는 새로운 사회적 역할 중 하나가 신체를 통한 다중 감각의 경험을 선사하는 것에 있다는 점에서 장혜진의 활동은 일반인은 물론 주변 무용가와 예술가들에게 파장을 일으킨다.”</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-style:italic;">— 유화정 무용평론가</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">〈투명인간이 되든, 춤을 추든〉은 『동의보감』(1610)에 기록된 17세기 한국의 치유법 은형법에 대한 현대적이고 사변적인 사유에서 출발한 다감각 퍼포먼스다. 몸을 사라지게 한다는 이 기술은 단순한 은폐가 아니라, 조용한 저항이자 공동체적 생존의 전략으로 다시 읽힌다. 이곳에서 ‘투명함’은 부재가 아니라, 다공성의 몸으로 귀환하는 선택, 다시 말해 공동의 몸으로 존재하기 위한 시도이다. 느림과 지연, 흐름과 반복으로 구성된 몰입형 지속 퍼포먼스 안에서 퍼포머와 관객의 몸들은 하나의 공동 리듬 안에서 얽히고 풀리며, 시작과 끝이 명확하지 않은 채 함께 흔들린다. 함께 생성되는 집단 자각몽이자 부드러운 저항의 장안에서, 텍스트, 음식, 직물, 사운드, 움직임이 서로를 가로지르며 관객은 씹고, 쉬고, 흘러가고, 듣고, 움직이는 존재로 참여한다. 이 느린 카니발 속에서 우리는 사이로 존재하기, 시간을 경계 없이 흘려보내기, 그리고 물리적 가시성을 넘어서 함께 살아남는 법을 리허설한다. 우리가 보이지 않게 될 때, 어떤 생존의 기술이 우리 안에서 깨어나는가?</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">〈투명인간이 되든, 춤을 추든〉은 두 가지 상호 연결된 구조로 진행된다: 커먼 리츄얼(Common Ritual)이 반복, 정지, 공존의 안무 스코어로 이루어진 집단적 몽상 상태의 퍼포먼스라면,  흐르는 액션(Floating Action)은 공식 공연 사이에 발생하는 비형식적 시간이자 안내자(퍼포머)가 장면을 해체하거나 대화를 이끌며, 관객은 공연과 전시 사이의 흐름을 직접 감각한다. 방문자는 일찍 도착하거나 늦게까지 머물며 쉬고, 대화하고, 관찰할 수 있다. 단순한 공연이 아니라, 더 유연한 존재를 연습하는 열린 사회적 공간이 된다.</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">8/11(금) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">3-4pm 공연 (COMMON RITUAL) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">4-6pm 흐르는 액션 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">6-7pm 공연 (COMMON RITUAL) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">8/12(토) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">12-1pm 공연 (COMMON RITUAL) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">1-3pm 흐르는 액션 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">3-4pm 공연 (COMMON RITUAL) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">4-6pm 흐르는 액션</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">6-7pm 공연 (COMMON RITUAL) </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><a class="wixui-rich-text__text" href="https://drive.google.com/file/d/1HgUU2c3EzzJSKXaDRv1Et4BJenmHrBaJ/view?usp=sharing" rel="noreferrer noopener" target="_blank"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text" style="font-size:15px;">​리서치 맵 링크</span></span></span></a></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">컨셉/연출/대본. 장혜진 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">퍼포먼스/리서치/해석. 고권금, 김현진, 송명규, 이희승, 장혜진, 허성욱  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">창작 과정 어시스턴트. 허성욱 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">미각 디자인. 옥봉  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">사운드 디자인. 김남령  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">공간 컨설팅. 김동희  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">오브제 디자인/설치. 이현화  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">오브제 어시스턴트. 강희송</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">프로듀서. 박은지  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">매니지먼트/리서치. 서예원 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">무대/기술감독. 맹태영 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">무대 크루. 엄경윤 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">음향 오퍼레이터. 정은샘 </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">영상 기록/트레일러. 복코  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">사진 기록. 오재우  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">주최/제작. He Jin Jang Dance </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">후원. 한국문화예술위원회, 신촌문화발전소, 한국콘텐츠진흥원, 전문무용수지원센터, 플랫폼엘 컨템포러리 아트센터  </span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:15px;">베뉴. 플랫폼엘 컨템포러리 아트센터 - PLAP 기획공모 선정작, 플랫폼 라이브, 한국​​​​​​​​​</span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 556/439; max-width: 556px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_261ea56ceb6e44309f169f08a26763be~mv2.jpg/v1/fill/w_556,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%A5%ED%98%9C%EC%A7%84%20%EC%95%88%EB%AC%B4%EA%B0%80_%EC%88%98%EC%A0%95_-8.jpg">
                    <span class="placeholder-label">Image: 장혜진 안무가_수정_-8.jpg (556x439)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 283/439; max-width: 283px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_8d599132147d41179f4bbacdefa80e1d~mv2.jpg/v1/fill/w_283,h_439,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9E%A5%ED%98%9C%EC%A7%84%20%EC%95%88%EB%AC%B4%EA%B0%80_%EC%88%98%EC%A0%95_-3.jpg">
                    <span class="placeholder-label">Image: 장혜진 안무가_수정_-3.jpg (283x439)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/softrehearsalforfugitivegathering': {
    title: 'Soft Rehearsal for Fugitive Gathering | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-mfm5wf00 wixui-rich-text" data-testid="richTextElement" id="comp-mfm5wf00"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold; font-style:italic;">Lecture Performance: Soft Rehearsal for Fugitive Gathering (2025 - on going)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;">렉쳐 퍼포먼스: 은신하는 감각들의 모임을 위한 리허설</span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 351/441; max-width: 351px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_21965012ddd4440782e1211a9775c45a~mv2.jpg/v1/fill/w_351,h_441,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_21965012ddd4440782e1211a9775c45a~mv2.jpg">
                    <span class="placeholder-label">Image: 은신감각렉쳐_사진4 포스터.JPG (351x441)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 313/417; max-width: 313px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_9920f267b649452cb2fd216808fbf66a~mv2.jpg/v1/fill/w_313,h_417,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_9920f267b649452cb2fd216808fbf66a~mv2.jpg">
                    <span class="placeholder-label">Image: 은신감각렉쳐_사진1 스탠딩샷.JPG (313x417)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-mfm5wf292 wixui-rich-text" data-testid="richTextElement" id="comp-mfm5wf292"><p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">What if a body becomes invisible not through erasure—but through softness?<br class="wixui-rich-text__text"/>
What if healing isn’t a return to form, but a rehearsal of dissolution?</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">In this lecture-performance, choreographer and researcher He Jin Jang draws from her practice-based PhD inquiry to weave together choreographic research, speculative medicine, and trans-sensorial memory. Grounded in the Korean indigenous healing method Eunhyeongbeob (은형법)—the “method of becoming invisible”—Jang explores how we might rehearse new bodily futures amid biopolitical crisis, intergenerational trauma, and state violence. Framing rehearsal as a ritual of resilience, she asks: How can choreography hold what history cannot name?</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">The performance blends lecture, improvisational movement, sensorial autoethnographic reading, and guided meditation to invite audiences into forms of embodied refusal and quiet resistance. Personal narrative unfolds alongside theoretical constellations from ritual studies (Victor Turner, Richard Schechner), dance and somatics (Susan Leigh Foster, Randy Martin), and decolonial thought (Kuan-Hsing Chen’s Asia as Method), forming a porous landscape of scholarship, memory, and movement.</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">This is a soft rehearsal space—where invisibility becomes a sensorial strategy for survival, refusal becomes care, and whisper becomes architecture. Both an act of mourning and a proposal for sensuous futures, the work asks us to listen for what lingers before form.</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">Concept/Performance/Text by He Jin Jang</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">Sound Design by Namureyoung</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">Supported by T:Works Artistic Directors Academy</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">Venue: </span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 ADA Research Day, T:Works, Singapore</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Postcritical Spirituality Series, Rasa, Singapore</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Arts &amp; Design Practice Research Exchange, NAFA, Singapore</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Anthologies Assembly, London South Bank University, UK</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.4em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;">​</span></span></span></span><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">만약 몸이 부드러움을 통해 사라질 수 있다면 어떨까?</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">만약 치유가 회복이 아닌, 흩어짐을 리허설하는 과정이라면?</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">이 렉처-퍼포먼스에서 안무가이자 리서처인 장혜진은 박사 리서치를 기반으로 한 작업을 통해 안무적 탐구, 사변적 의학, 그리고 감각을 넘나드는 기억을 엮어 나간다. 한국의 토착 치유법인 은형법—‘사라지는 몸의 기술’을 바탕으로, 생명정치적 위기와 세대 간 트라우마, 국가 폭력의 시대를 살아가는 우리가 어떻게 몸의 미래를 미리 리허설할 수 있을지 질문한다. 장혜진은 리허설을 회복력의 의례로 다시 조명하며, 묻는다: “안무는 어떻게 말해지지 않은 정치적 감각을 불러올 수 있을까“ 이 렉처 퍼포먼스는 강의, 감각적 자서전적 낭독, 움직임 퍼포먼스 그리고 안내된 명상으로 구성되며, 몸을 통한 조용한 저항의 장으로 관객을 이끈다. 리추얼 연구(빅터 터너, 리처드 셰크너), 무용과 소매틱 이론(수전 리 포스터, 랜디 마틴), 탈식민 사유(천관싱의 『방법으로서의 아시아』)들과 나란히 퍼포먼스가 펼쳐진다. 기억, 움직임, 학문이 서로 스며드는 다공성의 풍경이 되는 곳. 보이지 않음이 감각적 생존 전략이 되고, 거절이 돌봄이 되며, 속삭임이 구조가 되는 곳. 형태가 생기기 전, 머물다 간 감각을 듣는다는 건 무엇인가?</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">컨셉/퍼포먼스/글/진행: 장혜진</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">사운드 디자인: 김남령</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">후원: T:Works 예술감독 아카데미</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">베뉴.</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 ADA Research Day, T:Works, 싱가포르</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Postcritical Spirituality Series, Rasa, 싱가포르</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Arts &amp; Design Practice Research Exchange, NAFA, 싱가포르</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:15px;">2025 Anthologies Assembly, London South Bank University, 영국</span></span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 600/400; max-width: 600px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_c1e619c0a55e4bd18d4c8bf1a35f1d9f~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,enc_avif,quality_auto/073f40_c1e619c0a55e4bd18d4c8bf1a35f1d9f~mv2.jpg">
                    <span class="placeholder-label">Image: 은신감각렉쳐_사진3 혜진 솔로샷.jpg (600x400)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 600/400; max-width: 600px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7878775c05504d25bcfbbb1e54cf0c50~mv2.jpg/v1/fill/w_600,h_400,al_c,q_80,enc_avif,quality_auto/073f40_7878775c05504d25bcfbbb1e54cf0c50~mv2.jpg">
                    <span class="placeholder-label">Image: 은신감각렉쳐_ 사진2 관객 눈감샷.jpg (600x400)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/teaching-bio': {
    title: 'Teaching Bio | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqozk40 wixui-rich-text" data-testid="richTextElement" id="comp-lzqozk40"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Teaching Bio</span></h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 801/534; max-width: 801px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_f50b7b1d7a364f588d0e5f0219c20f66~mv2.jpg/v1/fill/w_801,h_534,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/DSC08990_edit.jpg">
                    <span class="placeholder-label">Image: DSC08990_edit.jpg (801x534)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqozk4f1 wixui-rich-text" data-testid="richTextElement" id="comp-lzqozk4f1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">As a teaching artist, He Jin Jang has over 20 years of experience in academic and professional teaching across the world. Jang has worked as a full-time Assistant Professor of Dance/Assistant Director of the MFA program at Hollins University (US) from 2011 to 2014, where she was honored with the Webb Bierley Teaching Award. During her appointment, she taught Contemporary Technique, Improvisation, Composition, Repertory, Critique &amp; Showing, Senior Seminar, and Pedagogy Seminar to both undergraduate and graduate students.Additionally, she served as a mentor/advisor for multiple students’ senior and thesis projects. Jang’s other teaching credits include University of Michigan (US), Anderson University (US), American Dance Festival (US), Movement Research (US), Dance New Amsterdam (US), University of Calgary (Canada), Centro de Produccion de Danza Contemporanea (Mexico), UDLAP (Mexico), Korea National Contemporary Dance Company (Korea), Seoul International Choreography Workshop (Korea), Seoul Tanz Station (Korea), National Museum of Modern and Contemporary Art Changdong Residency (Korea), and numerous universities in Korea, including Seoul Institute of the Arts, Sungkyungwan University, Kookmin University, Kyunghee University, Sungshin Women’s University, Seoul National University of Education, Jeonbok National University, and Keimyung University.<br class="wixui-rich-text__text"/>
Jang has also served as Choreo-lab Mentor at Asian Cultural Center (’19-’21), and Mentor of<br class="wixui-rich-text__text"/>
Choreography at the Immigrant Artist Program at New York Foundation for the Arts (‘14).<br class="wixui-rich-text__text"/>
Currently, She is remotely working as a mentor at the MFA in Dance Program, University of the Arts Philadelphia (US). She is also a certified teacher of the Franklin Method,<br class="wixui-rich-text__text"/>
a somatics method based on Dynamic Neuro-cognitive Imagery™.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">I approach class as an ongoing process, in which one contributes to fine tune and helps bodies open towards ‘the state of readiness’ – being ready &amp; available to move, create, explore, evoke and criticize. I encourage participants to explore different ways to retain knowledge of and relate to the world by an actual sense of feeling or being in our bodies and seeing ourselves moving around in it, which I call ‘body wisdom.’</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">To teach is to help each other learn how to learn one’s own body wisdom. I believe in facilitative methods rather than directive. I advocate for teaching self-authoring &amp; self-transforming minds through embodiment. I believe in co-teaching, where experimental pedagogy, interdisciplinary approaches, and the decentralization of power are possible.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">These are the heartfelt questions on ‘how’:</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How do we activate space – physical, conceptual, meta-cognitive – together in the classroom? </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How can we help each other make deliberate &amp; responsible choices that will empower  ourselves?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How would materials and methods, such as sensory experiences, scientific information, involvement, imagery, and abstraction, work in teaching?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How can we collectively  value the different learning curves of each participating body?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How does the experience of teaching shape the perception of learning? </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- How can we use feedback and feed-forward to care for one another?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">장혜진은 전 세계 여러 대학교와 기관에서 지난 20년간 티칭 아티스트로서 수업과 워크숍을 가르쳐왔다. 2011-14년에는 미국의 실험적 안무 프로그램 홀린즈 대학교 Hollins University의 무용과에서 전임교수, 대학원 프로그램 부감독, 임시 학과장을 역임했다. 컨템포러리 테크닉/즉흥/구성법/레퍼토리/비평세미나 등을 학부생과 대학원생에게 가르치고, 졸업 프로젝트들 감독하며 “웹 비어리 교육자상 Webb Bierley Teaching Award”을 수상하기도 했다. 외에도 독립예술가로 활동하는 동안 미국의 미시간 대학교, 앤더슨 대학교, 아메리칸 댄스 페스티벌, 무브먼트 리서치, 댄스 뉴 암스테르담, 캐나다의 캘거리 대학교, 멕시코의 국립현대무용 제작센터, UDLAP 대학교, 한국에서는 국립현대무용단, 서울국제안무워크숍, 서울탄츠스테이션, 국립현대미술관 창동레지던시, 서울예술대학교, 성균관대학교, 국민대학교, 경희대학교, 성신여자대학교, 서울교육대학교, 전북대학교, 계명대학교, 한국종합예술대학교 - 등에서 가르치며 예술적 실천을 반영하는 수업을 통해 학생들과 깊이 소통해왔다. 국립현대무용단 안애순 안무 퍼포먼스 코치 (‘22-23), 아시아문화전당 안무랩의 멘토(‘19-21), 뉴욕예술재단 이민예술가 프로그램의 안무 멘토(‘14) 등을 맡았으며, 현재는 미국의 유아츠 대학교 University of the Arts의 대학원 안무과정에서 원거리로 졸업작품 멘토링을 하고 있다. 그녀는 역동적 신경인지심상 Dynamic Neurocognitive Imagery (DNI)™ 베이스의 소매틱 방법론인 프랭클린 메소드 Franklin Method® 의 공인 움직임 교육자이기도 하다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span>​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">수업은 지속적인 과정이고, ‘더 준비된 상태'를 미세 조정하는 공간이다. 움직이고, 창조하고, 탐색하고, 감흥을 불러 일으키고, 비판할 수 있는 더 준비된 상태로서의 포털 신체를 만드는 것이다. 참가자들은 ‘몸 안에 있는 실제 느낌'을 통해 우리가 살고 있는 세상에 대한 지식을 습득하고 이와 관계 맺는 다양한 방법을 탐구한다. 이러한 앎의 방식은 '몸의 지혜'라 불릴 수 있다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">가르친다는 것은 참여자 각자가 자신의 몸의 지혜를 터득하는 시간과 공간을 창발하는 것이다. 나는 ‘지시’ 보다는 ‘촉진’의 방법을 믿는다. 체현의 과정을 통해 스스로 생각하고 변화하는 순간에 도달하는 것이다. 실험적인 학습, 다학제적인 접근, 권력의 분권화가 가능하게 하기 위해 함께 가르치기(co-teaching)을 선호하기도 한다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">진심을 다해 던지는 ‘어떻게'에 관한 질문은 다음과 같다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 물리적, 개념적, 메타인지적 공간을 어떻게 함께 활성화할 수 있을까? </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 어떻게 하면 우리는 서로가 힘을 실어줄 선택들, 즉 신중하고 책임감 있는 선택을 할 수 있도록 도울 수 있을까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 감각적 경험, 과학적 정보, 직접적 참여, 심상, 추상화 등과 같은 재료와 방법이 어떻게 활용될 수 있을까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 참여하는 각기 다른 몸은 다양한 학습 곡선에 어떻게 함께 가치를 둘 수 있을까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 가르치는 경험은 어떻게 배움에 대한 인식을 형성하기도 하나? </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">- 우리는 서로를 돌보기 위해 피드백과 피드포워드를 어떻게 활용할 수 있을까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/the-flowing-2021-23': {
    title: 'the flowing. (2021-23) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lympcn4l wixui-rich-text" data-testid="richTextElement" id="comp-lympcn4l"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"> <br class="wixui-rich-text__text"/>
<span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">the flowing. </span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">(2021-23)</span></span></span><br class="wixui-rich-text__text"/>
<span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">흐르는.</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1178; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_b7317bff577543c09724cf84e305c7f6~mv2.jpg/v1/crop/x_0,y_28,w_1060,h_1477/fill/w_845,h_1178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/6_%20%ED%9D%90%EB%A5%B4%EB%8A%94_%EC%9E%91%ED%92%88%EC%82%AC%EC%A7%845_%EC%82%AC%EC%A7%84%EC%A0%9C%EA%B3%B5_%EC%8B%A0%EC%B4%8C%EB%AC%B8%ED%99%94%EB%B0%9C%EC%A0%84%EC%86%8C.jpg">
                    <span class="placeholder-label">Image: 6. 흐르는.작품사진5_사진제공_신촌문화발전소.jpg (845x1178)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1178; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_ace372e1978b4869a3d476629fcac81a~mv2.jpg/v1/crop/x_0,y_53,w_1000,h_1394/fill/w_845,h_1178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%9D%90%EB%A5%B4%EB%8A%94_%EC%9E%91%ED%92%88%EC%82%AC%EC%A7%843_%EC%82%AC%EC%A7%84%EC%A0%9C%EA%B3%B5_SIDance2021%20_%20%E2%93%92Sang%20Hoon%20Ok_JPG.jpg">
                    <span class="placeholder-label">Image: 흐르는.작품사진3_사진제공_SIDance2021 _ ⓒSang Hoon Ok.JPG (845x1178)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1178; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_a573d8a198764e52b06cf4bb751ffac6~mv2.jpg/v1/crop/x_5,y_0,w_989,h_1379/fill/w_845,h_1178,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/%ED%9D%90%EB%A5%B4%EB%8A%94__%EC%82%AC%EC%A7%84%EC%A0%9C%EA%B3%B5_%EC%8B%A0%EC%B4%8C%EB%AC%B8%ED%99%94%EB%B0%9C%EC%A0%84%EC%86%8C.jpg">
                    <span class="placeholder-label">Image: 흐르는._사진제공_신촌문화발전소.jpg (845x1178)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lympcn591 wixui-rich-text" data-testid="richTextElement" id="comp-lympcn591"><p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“Jang opens a space where the audience, standing on the direct tremors of nerves, lights one’s own torch—jointly rupturing, or being ruptured, within the dark resonance... This is a masterpiece that needs to be slowly savored during the contemplative time ahead.”<br class="wixui-rich-text__text"/>
— Dance Magazine MOMM, 2021</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">the flowing. </span>is a corporeal practice for mourning, a precarious song for the precarious, and a requiem for those history has failed to name. Here, the body does not represent loss—it becomes its living terrain. A single body shares the stage with a weighted companion object—part anchor, part echo chamber. Its unstable swaying sets off a cascade of kinetic responses: falling, faltering, leaning, resisting. Rather than following choreography in the traditional sense, the dancer tunes to a form of ghost logic—an attunement to residual forces, ancestral pulses, and sensory disruptions that arrive uninvited. Through slow, spiraling actions and erratic suspensions, the air thickens with gestures that don’t resolve, with shapes drawn but never sealed. Movement emanates from within—through ankles, skin, spine—and radiates outward in quiet insistence. Breath becomes sound, tremor becomes language, and grief becomes collective. </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">the flowing.</span> emerges from within societies where grief is privatized, feminized, or denied. It proposes mourning as a somatic commons—a shared practice of remembering those disappeared by labor, care, exile, medical neglect, and political abandonment. It honors not just who we lost, but what we were not allowed to grieve. You are not asked to understand. You are asked to stay—with the pulse, the descent, the haunted tempo of survival.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“These bodily expressions resemble a form of non-human beings, detached from will... suggesting a state where no body can move forward alone.”<br class="wixui-rich-text__text"/>
— Art Scene, 2021</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“The body, holding breath and life, became audible and visible in its most fragile form—awakening a vivid sense of presence for the audience. Through the dense immediacy of flesh, the performance revealed where the strong mediator, through which breath cannot escape, was located. It was a meticulously crafted work, precise in both concept and sensation.”<br class="wixui-rich-text__text"/>
— Hyungbin Jo (Dance Critic), 2021</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://star-century-379.notion.site/b53aec0282984e2c8499a12b3810545d" rel="noreferrer noopener" target="_blank">Link to Choreographer’s Note</a></span></span>​​​​​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Choreography/Performance/Text by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Sound Design by Jimmy Sert</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Dramaturgy (2021 Premiere) by Bittnarie Shin</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Visual Design (2021 Premier) by Seung Woo Han &amp; He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Visual Management (2023 Touring) by Yewon Seo</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Sinchon Arts Space, Dancers’ Career Development Center Korea</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">Venue:</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">2021 Seoul International Dance Festival, Sinchon Arts Space, Korea<br class="wixui-rich-text__text"/>
2023 ProSeries, University of Calgary, Canada</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;">“장혜진 안무의 이번 공연은 직접적인 신경의 떨림 위에서 관람객들 자신의 존재가 스스로 등불을 켜고 그 어두운 공명 속에서 함께 파열하는/파열시키는 장을 열었다고 할까... 안무는 굉장히 문제적이었고, 전체적으로 지금부터 사유의 묵히는 간 동안에 천천히 음미해 봐야 할 걸작이 아닌가 한다.”</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text" style="font-style:italic;"> —  2021년『월간잡지 몸』</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">&lt;흐르는.&gt;은 애도의 몸짓이자, 불안정한 존재들을 위한 노래이며, 역사의 언어로는 호명되지 못한 존재들을 위한 신체의 진혼곡이다. 이 작품에서 몸은 상실을 재현하지 않는다. 몸 자체가 상실이 머무는 지형이 된다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">공연은 하나의 몸과 하나의 동반 오브제로 구성된다. 그 오브제는 묵직한 중심이자, 메아리의 공간, 그리고 흔들리는 경계이며, 그 불안정한 진동이 무용수의 반응을 유도한다 — 넘어지고, 망설이고, 기대고, 저항하는 움직임들. 이 안무는 전통적인 의미의 움직임 구조를 따르지  않고, 유령적 논리(ghost logic)에 조율된다. 그것은 남겨진 힘, 선조의 리듬, 예고 없는 감각 교란에 대한 신체의 조율이다. 회전하듯 이어지는 느린 동작들과 갑작스러운 중단들 사이, 공기는 끝맺지 못한 제스처로 짙어지고, 완결되지 않은 선이 그려진다.<br class="wixui-rich-text__text"/>
움직임은 발목과 피부, 척추와 같은 내면에서부터 시작되어, 조용하지만 단호하게 외부로 퍼진다. 숨은 소리가 되고, 떨림은 언어가 되며, 애도는 개인을 넘어 공동의 감각이 된다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">&lt;흐르는.&gt;은 애도가 사유화되고, 여성화되고, 혹은 금지되는 사회로부터 태어났다. 이 작품은 애도를 감각의 공유지(somatic commons)로 제안한다. 노동, 돌봄, 망명, 의료 방치, 정치적 배제 속에서 사라진 존재들을 함께 기억하는 실천의 장이자, 우리가 애도조차 허락받지 못한 것을 위해 몸으로 남기는 응답이다. 관객은 이곳에서 맥박과 낙하, 그리고 생존의 유령이 두드리는 리듬 속에 잠긴다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">“장혜진의 움직임은 중심을 신체 전체로 퍼뜨리고 미세하게 옮기며 소위 흐늘거리고 바들거리는 신체 양상을 만든다. 이러한 신체의 움직임은 인간을 벗어난 비인간의 형상에 가깝다... 독단적으로 어떤 신체도 앞으로 나아가지 못하는 상태, 전체의 신체가 하나의 부분 신체를 벗어나지 못하는 어떤 상태를 보여준다.”</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">—  2021년,『아트신』</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">“숨과 생명을 붙잡는 것으로서의 육체와 그것이 뿜어져 나와 청각화/시각화되는 과정은, 퍼포먼스로서 관객에게 그 존재감을 생생히 일깨우는 하나의 과정이 된 것이다... 살덩이의 존재감을 통해 숨이 벗어던질 수 없는 ‘강한' 매개가 어디에 놓여져 있는지를 보여준 치밀한 퍼포먼스가 되었다.”</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">—  2021년 조형빈 평론가</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text">​</span></span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><a class="wixui-rich-text__text" href="https://star-century-379.notion.site/b53aec0282984e2c8499a12b3810545d" rel="noreferrer noopener" target="_blank">안무가의 글 링크</a></span></span>​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span>​​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">컨셉/안무/출연. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">사운드 디자인. 지미 세르</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">드라마투르기(2021). 신빛나리</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">비주얼 디자인(2021). 장혜진, 한승우</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">비주얼 매니저(2023). 서예원</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부, 전문무용수지원센터, 신촌문화발전소</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">베뉴. </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">2021 SIDance 국제무용페스티벌, 신촌문화발전소, 한국 </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">2023 ProSeries 페스티벌, 캘거리대학교, 캐나다​​​​​<a class="wixui-rich-text__text" href="https://mybox.naver.com/share/list/viewer/3472569161967081808?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" rel="noreferrer noopener" target="_blank">​​</a>​</p></div>
      </div>
    `
  },
  '/visceral-body-workshop-for-visual-artist': {
    title: 'Visceral Body Workshop for Visual Artist | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqp4vmv wixui-rich-text" data-testid="richTextElement" id="comp-lzqp4vmv"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Visceral Body Workshop for Visual Artists<br class="wixui-rich-text__text"/>
시각예술가를 위한 워크숍: 비써럴 바디</span></h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 388/383; max-width: 388px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_04a5362b22074f43b064edd4f716f398~mv2.jpg/v1/crop/x_0,y_6,w_1179,h_1163/fill/w_388,h_383,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7188.jpg">
                    <span class="placeholder-label">Image: IMG_7188.jpg (388x383)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 388/383; max-width: 388px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_55d8630810ed4d9492c838bfad581d6f~mv2.jpg/v1/fill/w_388,h_383,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7185.jpg">
                    <span class="placeholder-label">Image: IMG_7185.jpg (388x383)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqp4vn31 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp4vn31"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">This workshop is for visual artists to experiment with movement, welcoming the interference and entanglement between body and affect. It includes practices of thinking through bodies, moving, discussing the viewing materials. We aim to capture what the body and affect can do, without questioning what they are. We will pay attention to the interconnections and gaps between the two, and attempt to orchestrate a 'felt sense' through movement. To understand affect as a biological/physical response, the workshop begins with movement that activates the nervous system, moving into scores and structures to weave time through embodied improvisational practices. How can we, as bodies, attune to the rise of affective tonalities, attractions and transpositions? Visual artists are welcome to participate in this ongoing process of encountering and exceeding the body's visceral response.</span></span><br class="wixui-rich-text__text"/>
 </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">이 워크숍은 시각예술가들을 위한 신체 워크숍으로 몸과 정동(affect) 그 사이의 간섭과 혼선을 환영하며 움직임을 실험한다. 신체를 느끼며 움직이는 것, 그것을 사유하는 것, 그것에 관해 함께 이야기하는 것, 사례를 보는 것 –의 프랙티스를 포함할 것이다. 우리는 신체가 무엇이고 또 감흥이 무엇인지 묻지 않은 채, 이를 기습적으로 포착할 것이다. 둘의 상호 연관성과 틈새에 주의를 기울이고 움직임으로 그 ‘기분’을 조율해 볼 것이다. 생물학적/신체적 반응으로서의 정동을 이해하기 위해 신경계를 활성화하는 움직임으로 워크숍은 시작되며, 스코어와 구조, 체화된 즉흥 프랙티스를 통해 시간을 직조한다. 몸으로서의 우리는 어떻게 정동의 분위기, 끌림, 뒤바뀜을 만나며 친숙해 질 수 있을까? 신체의 본능적 반응을 만나며, 계속되어 초과하는 과정에 참여할 시각예술가들을 환영한다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/we-need-9-dance-songs-seriously-2023': {
    title: 'We Need 9 Dance Songs, Seriously (2023) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lsvf2eh81 wixui-rich-text" data-testid="richTextElement" id="comp-lsvf2eh81"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="font-style:italic;">We need 9 dance songs, Seriously </span></span></span><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-size:25px;">(2023)<br class="wixui-rich-text__text"/>
춤을 위한 노래는 적어도 9개는 필요하지 (2023)</span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:20px;">with Tangerine Collective</span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 364/513; max-width: 364px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_cbffd7a96f7a4be495d6ef38d29396cc~mv2.jpg/v1/crop/x_0,y_2,w_800,h_1126/fill/w_364,h_513,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9B%B9%ED%8F%AC%EC%8A%A4%ED%84%B02_edited.jpg">
                    <span class="placeholder-label">Image: 웹포스터2_edited.jpg (364x513)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lsvf2ehi wixui-rich-text" data-testid="richTextElement" id="comp-lsvf2ehi"><p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text">​​</span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-style:italic;">We need 9 dance songs, Seriously</span> sings the love of dance that is not-yet-performed. We listen to the stories of others and contemplate ways to spend time together around dance, reflecting on symbiosis, solidarity, and care. We welcome unproductive laziness, taboos, and hatred in dance,  along with its dark chronicles. We summon dance that exists but is invisible. The more it gets forbidden, the more it dances with desire. The 9 songs are a practice to subvert the recursive 'Choreophobia' that occurs across borders. It is an act of escape from colonial thinking by using materials with no mass so they don’t occupy space. The AVP lab is a relational room where the dancing dialogue evolves through experiments and practices of being together, exchanging, and sharing differences. In what way can bodies, roles, relationships, and knowledge coexist within the time and space where the dance songs flow?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Curation and Host by Tangerine Collective(He Jin Jang, Jaelee Kim, Jee-ae Lim)</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Music Direction by Noddy Woo</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Graphic Design by Macadamia Oh</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Curatorial Assistant by Yewon Seo</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Organized by AVP Pavillion</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by Korea Arts and Management Service, Ministry of Culture, Sports and Tourism Korea</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">탠저린 콜렉티브의 일원으로 공동기획과 창작. &lt;춤에 관한 노래는 적어도 9개는 필요하지&gt;는 행사되지 않는 춤을 사랑의 마음으로 노래한다. 춤의 이야기를 함께 살피고, 춤의 언저리에서 함께 시간을 보낼 수 있는 방법을 생각한다. 공생과 연대 그리고 돌봄을 이야기한다. 춤의 낭비와 비생산적인 게으름, 춤의 금기와 혐오, 춤에서의 어둠의 연대기를 환대한다. 존재하지만 보이지 않는 또는 금지할수록 더욱더 존재하는 춤을 노래한다. 9개의 노래는 문화, 국경을 넘어 되풀이되는 ‘안무혐오/춤 공포증(choreophobia)’을 전복하는 실천이다. 질량을 갖지 않고 공간을 점유하지 않은 물질을 도구로 식민지적 사고에서 벗어나는 시도이기도 하다. 전시장은 ‘다름’의 접촉, 함께 있기, 교환하기, 공유하기의 실험 및 실천을 통해서 춤에 대한 대화의 진화가 일어나는 공간으로 구성된다. ‘co-care’와 ‘co-curation’의 행위가 일어나는 관계의 집합소로 확장된다. 춤의 노래가 흐르는 시간과 공간 안에서 마주하는 몸, 역할, 관계 그리고 지식은 어떠한 방식으로 서로 이웃할 수 있을까?</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; text-align:justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">​</span></span><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">기획/주최. 탠저린 콜렉티브 (김재리, 임지애, 장혜진)</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">음악감독. 노디 우</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">그래픽 디자인. 마카다미아 오</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">어시스턴트 큐레이터. 서예원</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">주관. 시청각 랩 (AVP Lab) </span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:13px; text-align:justify;"><span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">후원. 예술경영지원센터, 문화체육관광부</span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 844/466; max-width: 844px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_7c641a05e0054b97a4e8b76ad3722af0~mv2.jpg/v1/crop/x_30,y_39,w_667,h_369/fill/w_800,h_442,al_c,lg_1,q_80,enc_avif,quality_auto/5_edited.jpg">
                    <span class="placeholder-label">Image: 5_edited.jpg (844x466)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 844/466; max-width: 844px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_bcefc66b2c104d0b9a0dcd1c531ea7ca~mv2.jpg/v1/crop/x_0,y_65,w_800,h_442/fill/w_844,h_466,al_c,lg_1,q_85,enc_avif,quality_auto/_GIH1663_edited.jpg">
                    <span class="placeholder-label">Image: _GIH1663_edited.jpg (844x466)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/weekly-weakly-2020': {
    title: 'Weekly Weakly: Performance (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lyo35483 wixui-rich-text" data-testid="richTextElement" id="comp-lyo35483"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">Weekly Weakly </span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"> (2020) </span></span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="color:#000000;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">위클리 위-클리</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1153; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_b1b258545e8a4cf1806e83065dbdf052~mv2.jpg/v1/crop/x_14,y_0,w_1172,h_1600/fill/w_845,h_1153,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/20200203_HeJinJang_1055474_IN.jpg">
                    <span class="placeholder-label">Image: 20200203_HeJinJang_1055474_IN.jpg (845x1153)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/1153; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_3e475cd839534e98bd7b60e0fd1307d3~mv2.jpg/v1/crop/x_14,y_0,w_1173,h_1600/fill/w_845,h_1153,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/2%EC%9B%94%EB%AF%B8%EA%B5%AD%EA%B3%B5%EC%97%B0%EC%82%AC%EC%A7%84%ED%81%AC%EB%A0%88%EB%94%A7_Iki%20Nakagawa.jpg">
                    <span class="placeholder-label">Image: 2월미국공연사진크레딧_Iki Nakagawa.jpg (845x1153)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lyo3549c wixui-rich-text" data-testid="richTextElement" id="comp-lyo3549c"><p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">What if weakness were not a limitation, but a choreographic condition? Weekly Weakly is a weekly laboratory for choreography and feminist thinking, where softness, slowness, and hesitation are practiced not as failure, but as form. Over 27 weeks, the lab unfolded as a poetic framework: one where minor sensations, delays, and hesitations became both score and method. This performance, marking the 27th week of the lab, asked: how can a sustained practice of feminist weakness be staged without becoming spectacle? What does it mean to perform slowness, porousness, or pause—without resolving them? Emerging as a practice-as-performance, <span class="wixui-rich-text__text" style="font-style:italic;">Weekly Weakly</span> lingered between workshop and stage, rehearsal and ritual. The result was a quietly potent exploration of choreography not as mastery, but as soft attention.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Concept and Choreography by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Performance by He Jin Jang, Ursula Eagly, Hyeongbin Cho</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Sound by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, ONSU GONG-GAN</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">Venue: Movement Research at Judson Church, U.S​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">연약함을 결핍이 아닌, 안무의 조건으로 상정한다면 어떨까?《위클리 위-클리》는 매주(Weekly), 연약함(Weakly)을 나누는 안무 실험실이자, 여성주의적 실천이 몸을 통과하는 일상의 연구 장이다. 이 프로젝트에서 연약함은 춤을 위한 최소한의 환경, 미소서식지로 작동하며, 지연, 미세한 감각, 머뭇거림 같은 요소들이 점차 하나의 방법론이자 스코어가 되었다. 27주간의 연약함 실험을 기반으로 한 이 퍼포먼스는 ‘실천으로서의 공연(practice-as-performance)’이라는 형식을 통해 무대에 오른다. 여기서 질문은 다음과 같다: 연약함의 수행은 어떻게 공연이 될 수 있는가? 그것은 어떻게 파열이나 해석 없이, 머무는 감각으로 존재할 수 있는가? 워크숍과 공연, 리허설과 의례 사이를 흐르며 나타난 이 퍼포먼스는, 안무를 기술이나 통제의 영역이 아닌 ‘부드러운 주의’의 상태로 다시 사유하게 만든다.</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">​</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">컨셉/안무. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">퍼포먼스. 어술라 이글리, 장혜진, 조형빈</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">사운드. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부, 온수공간</p>
<p class="font_9 wixui-rich-text__text" style="text-align:justify; font-size:15px;">베뉴. Movement Research at Judson Church, 미국<span class="wixui-rich-text__text" style="font-size:13px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span><a class="wixui-rich-text__text" href="https://mybox.naver.com/share/list/viewer/3472569162129446480?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" rel="noreferrer noopener" target="_blank"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-weight:400;"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="color:#00B3FF;"><span class="wixui-rich-text__text" style="text-decoration:underline;">​</span></span></span></span></span></a></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p></div>
      </div>
    `
  },
  '/whirling-skin-2024': {
    title: 'Whirling Skin (2024) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-maqdwsa9 wixui-rich-text" data-testid="richTextElement" id="comp-maqdwsa9"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:rgb(0, 0, 0); font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3, wf_b36572e3503346f5964dd41f1, orig_noto_sans_kr_semibold; font-style:italic;">Whirling Skin (2024)<br class="wixui-rich-text__text"/>
​혼륜 피부</span></span></h6></div>
<div class="N8MGzv _v6ohL PO9MfV comp-maqdwsaf1 wixui-rich-text" data-testid="richTextElement" id="comp-maqdwsaf1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px; line-height:1.6em;; text-align: justify;"><br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Whirling Skin is sound installation work that expands upon the research on the "Eunhyeongbeop" from Dongui Bogam (The Principles and Practice of Eastern Medicine) (1610), which began in 2023. Choreographer He Jin Jang regards the practice of "the method of concealing the body’s form," rehearsed during times of war and epidemic 400 years ago, as a kind of score.<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
During July and August 2024, He Jin Jang worked with performer Sung Uk Hoh to explore the concept of “Taeyeok (what is latent in pre-chaos)” and "Hon-ryun" (the state of being before differentiation into form) from the body concepts that form the basis of Eunhyeongbeop. These concepts refers to the state of existence before a body or matter takes on its form, energy, or texture—before it acquires the qualities of Qi, form, or substance. Through literature research and movement exploration, they began to investigate what it means to exist in these state, and what kind of dance might emerge from them. What if these indigenous bodily perspectives of Korea can be considered somatic materials and resources that have so much uncover here and now via dancing?<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Concept/Direction by He Jin Jang<br class="wixui-rich-text__text"/>
Text &amp; Voice by He Jin Jang, Sung Uk Hoh<br class="wixui-rich-text__text"/>
Recording by Dohyeon Le<br class="wixui-rich-text__text"/>
Sound Mixing by Minwoo Seo<br class="wixui-rich-text__text"/>
<br class="wixui-rich-text__text"/>
Supported by: Art Project Bora<br class="wixui-rich-text__text"/>
Venue: 2025 Chore-graphy, Power Plant at Seoul National University, Korea</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">&lt;혼륜 피부&gt;는 2023년에 시작된 동의보감 ‘은형법’에 대한 연구가 확장된 사운드 설치 작업이다. 400년 전 왜란과 전염병의 시대에 연습되어진 ‘몸의 형체를 숨기는 법’을 일종의 스코어로 인식한 장혜진 안무가는 공동연구자들과 사변적 대화, 문헌연구, 움직인 연구, 스토리텔링, 개인적 깨달음의 시간을 가지며, 작년 2023년 8월 멀티센소리 공연으로 발전시켜 관객을 초대했다.“재난과 질병의 순간 조상들에게 몸, 공동체, 돌봄은 무엇이었을까? 이러한 토착적 지혜가 지금 ‘존재론적 전환(Ontological Turn)’의 시대에 던질 수 있는 이야기는 무엇일까?” 2024년 7-8월, 두 달의 기간 동안 장혜진 안무가는 허성욱 퍼포머와 은형법의 배경이 되는 신체관을 천천히 살펴보았다. 우리 조상들의 토착적 신체관은 어떻게 지금 우리의 존재 방식과 평행하게 어긋나며 만나게 될까?</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"> </p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉, 연출. 장혜진</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">텍스트, 목소리. 장혜진, 허성욱</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">녹음. 이도현</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드 믹싱. 서민우</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">제작지원. 아트프로젝트 보라</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. 2024 코레오-그래피 @ 서울대학교 파워플랜트, 한국</span></span></span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 503/600; max-width: 503px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_9ba5afe03be845a28dcacc07c0a7d523~mv2.jpg/v1/fill/w_503,h_600,al_c,lg_1,q_80,enc_avif,quality_auto/073f40_9ba5afe03be845a28dcacc07c0a7d523~mv2.jpg">
                    <span class="placeholder-label">Image: 혼륜 피부 사진.jpg (503x600)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 600/600; max-width: 600px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_0a19d7e1a40e45f184481e4d59e61bed~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80,enc_avif,quality_auto/073f40_0a19d7e1a40e45f184481e4d59e61bed~mv2.jpg">
                    <span class="placeholder-label">Image: 아트보라 포스터.JPG (600x600)</span>
                  </div>
                </div>
                
      </div>
    `
  },
  '/workshop-making-it-work': {
    title: 'Workshop: Making (it) Work | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqp3u01 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp3u01"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Workshop: Making (it) Work<br class="wixui-rich-text__text"/>
워크숍: 메이크 (잇) 워크</span><br class="wixui-rich-text__text"/>
 </h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 443/336; max-width: 443px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_dabdea10da53431bbaddd636564f2124~mv2.jpg/v1/fill/w_443,h_336,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7184.jpg">
                    <span class="placeholder-label">Image: IMG_7184.jpg (443x336)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 337/336; max-width: 337px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_55d8630810ed4d9492c838bfad581d6f~mv2.jpg/v1/fill/w_337,h_336,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_7185.jpg">
                    <span class="placeholder-label">Image: IMG_7185.jpg (337x336)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqp3u0b1 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp3u0b1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">This workshop focuses on the creative process of making movement-based performance/dance in a contemporary context. It invites an interference of choreographic planes, within the frame of a laboratory, the planes encompassing making, living presences, and thinking philosophy. Through a co-researching setting, we experiment with tapping into each other’s making. Together, we explore the concept of the ‘choreographer as a system designer.’ By interconnecting the acts of creating, performing, viewing (each other’s work), and reading article’s, we find ways to bridge the gap between private imagination and public actualization. Here, we aim to articulate the process both as makers and viewers. We practice group problem-solving based on joint responsibility, simultaneously engaging in sharing, exposing, and being seen. This is an interplay between critical thoughts, contextualization, and embodiment. To gain a better understanding of personal style and preferences through composition and improvisation studies, we question our creative process through the in-depth dialogue about the work of fellow participants. We consider the moment of sharing as a civic moment. What can we allow to appear to let choreography emerge as a ghostly autonomous creature, the hallucinatory, the excess of everyday living? We will recognize tools to capture/locate/situate/instantiate ways to ‘make it work’ for ourselves.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span>​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text"><span class="wixGuard wixui-rich-text__text">​</span></span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text" style="font-size:14px;">이 워크숍은 동시대적 맥락에서 움직임에 기반한 공연과 춤을 만드는 창작 과정에 초점을 맞춘다. 실험실이라는 틀 안에서 ‘안무적임'과 여러 다른 차원들 것들 간의 간섭과 혼선을 환영한다. 그 차원의 층위에는 작업을 만들어 내는 것, 그리고 현존을 살아가는 것, 철학을 사유하는 것이 모두 포함되어 있다. 공동 연구의 환경을 통해 우리가 서로를 어떻게 활용할 수 있는지 실험하며, 시스템의 구조를 만드는 안무의 과정을 탐구한다. ‘만들기’, ‘퍼포밍하기’, ‘서로의 작업을 보기’, ‘글 읽기’ 이 4가지를 상호 연결함으로써 사적인 상상력과 공적인 실현을 연결하는 방법을 찾는다. ‘만드는 자’인 동시에 ‘감상하는 자’로서의 과정을 명확하게 발화하는 것을 시도하며, 때로는 공동의 책임의식과을 통해 집단의 지성을 통한(특정)집단의 문제의 해결을 시도한다. ‘나를 보여주기/나의 것을 나누기’를 연습하며, 비판적 사고, 맥락화, 체화 사이를 횡단한다. 창작과 즉흥의 과정 안에서 개인의 스타일과 선호를 긴밀히 이해하며, 동시에 동료 참가자와의참가자과의 작업에 대한 심도있는 대화를 통해 자신의 창작 과정에 질문을 던지기도 한다. 우리는 집단으로서의 공유의 순간을 시민적 순간으로 간주한다. 안무가 유령 같은 자율적 생명체, 환각적인 것, 일상 생활의 과잉으로 등장할 수 있도록 우리는 무엇을 허락할 수 있을까? 우리는 작업하기 위한 방법을 포착/위치/상황/실증할 수 있는 안무 도구를 알아차리게 될 것이다.</span></span></p></div>
      </div>
    `
  },
  '/workshop-weekly-weakly': {
    title: 'Workshop: Weekly Weakly | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lzqp6kbq wixui-rich-text" data-testid="richTextElement" id="comp-lzqp6kbq"><h1 class="font_6 wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="font-size:28px;"><span class="wixui-rich-text__text" style="color:#000000;">Workshop: Weekly Weakly<br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-style:normal;"><span class="wixui-rich-text__text" style="font-weight:400;">워크숍: 위클리 위-클리 (매주 연약하게)</span></span></span></span></span></h1></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 540/361; max-width: 540px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_c83f116384e74ea2855cc6d31a9e3586~mv2.jpg/v1/fill/w_540,h_361,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/%EC%9B%8C%ED%81%AC%EC%88%8D2_5.jpg">
                    <span class="placeholder-label">Image: 워크숍2_5.jpg (540x361)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 240/361; max-width: 240px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_32376a4bbf6349e7afd8ed1666e516b2~mv2.jpg/v1/fill/w_240,h_361,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/IMG_8642.jpg">
                    <span class="placeholder-label">Image: IMG_8642.jpg (240x361)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lzqp6kbx1 wixui-rich-text" data-testid="richTextElement" id="comp-lzqp6kbx1"><p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Weekly Weakly’ is a weekly laboratory of weakness designed by He Jin Jang Dance. Every week since August 2019, the choreographer He Jin Jang has been running a 'poetic frame of research salon' where she practices and philosophizes through weakness with fellow artists or alone. This laboratory is a space of practice itself, and sometimes becomes a public workshop/exhibition/performance. ‘Weekly Weakly’ was shared publicly as an exhibition at ONSU GONG-GAN (Korea), as a lecture at the Oil Tank Culture Park (Korea), as a workshop at Seoul Dance Center (Korea), Sinchon Arts Space in Korea (Korea), Saison Foundation (Japan), and as a performance at Movement Research at Judson Church in the United States. This workshop realizes weakness as a very special state of energy. In Weekly Weakly, weakness is not the opposite of strength, nor a flaw or a blemish. Rather, it is something that permeates all of us. Weakness becomes a precarious magic carpet, taking us to strange moments of performance. Participants are welcome to come join to move, talk, write, read, and touch the fragile. No previous movement experience is required.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">‘위클리 위-클리 Weekly Weakly (매주 연약하게)’는 He Jin Jang Dance가 설계한 연약함을 위한 주간 실험실이다. 안무가 장혜진은 2019년 8월부터 매주(Weekly) 동료예술인들과 함께 혹은 홀로 연약함을 관통해(Weakly) 안무를 연습하고 철학하는 '시적 프레임의 리서치 살롱 (poetic frame of research salon)'을 운영해왔다. 이 실험실은 그 자체로 연습이 되거나 공개 워크숍/렉처/전시/공연 등이 되어서 한국의 온수공간, 서울무용센터, 문화비축기지, 신촌문화발전소와 미국의 Movement Research, 일본의 Saison Foundation 등에서 공유되었다. 이 워크숍은 연약함을 매우 특수한 힘의 상태라고 인식한다. ‘위클리 위-클리’에서 약함은 강함의 반대말이 아니고, 결점이나 오점이 아니다. 오히려 연약함/나약함/취약함/쇠약함은 우리 모두의 몸을 관통하고 있는 것이며, 위태로운 마법의 양탄자가 되어 우리를 '기이한 공연적 순간'에 데려다주기도 한다. 움직임 전문가뿐만 아니라 비전문가 참여자들에게 모두 열린 워크숍이고, 연약한 모습 그대로 움직이고, 말하고, 쓰고, 읽고, 만질 준비를 해오면 된다.</span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:14px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:14px;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;"><span class="wixGuard wixui-rich-text__text">​</span></span></span></p></div>
      </div>
    `
  },
  '/you-cannot-disinvite-x-being-2021': {
    title: 'You Cannot Disinvite X-being (2021) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-lsmuz57n wixui-rich-text" data-testid="richTextElement" id="comp-lsmuz57n"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-style:italic;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">You Cannot Disinvite X-being</span></span></span><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;"> (2021) </span></span></span><br class="wixui-rich-text__text"/>
<span class="color_37 wixui-rich-text__text"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;"><span class="wixui-rich-text__text" style="letter-spacing:-0.03em;">당신은 x-being을 초대하지 않을 수 없다</span></span></span></span></h6></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/451; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_f4742cecc7e54e27b34dff2a13d800d3~mv2.jpeg/v1/fill/w_845,h_451,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/xbeing%EC%82%AC%EC%A7%841_%ED%98%9C%EC%A7%84%EB%B0%94%EC%A7%80%EB%A7%88%EC%9D%B4%ED%81%AC.jpeg">
                    <span class="placeholder-label">Image: xbeing사진1_혜진바지마이크.jpeg (845x451)</span>
                  </div>
                </div>
                

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/779; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_d31b065d0c0f4328b5c903103ed0e3a4~mv2.jpg/v1/fill/w_845,h_779,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/xbeing%EC%82%AC%EC%A7%84_%EB%AA%85%EC%8B%A0%EA%B8%B0%EC%9D%B4%ED%95%9C%ED%8F%AC%EC%A6%88_edited.jpg">
                    <span class="placeholder-label">Image: xbeing사진_명신기이한포즈_edited.jpg (845x779)</span>
                  </div>
                </div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-lsmuz57s1 wixui-rich-text" data-testid="richTextElement" id="comp-lsmuz57s1"><blockquote class="font_8 wixui-rich-text__text" style="line-height:1.8em; font-size:18px;">
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">“These movements might be a philosophical declaration of becoming-non-body, becoming-object... the programmed mechanical movement... reminiscent of speaking an extraterrestrial language.”<br class="wixui-rich-text__text"/>
— Art Scene, 2022</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">At the heart of Y<span class="wixui-rich-text__text" style="font-style:italic;">ou Cannot Disinvite X-being</span> is a duet between two women. Their shared choreography builds a tense and tender architecture—of mutual listening, sonic interference, and porous alignment—that quietly summons other presences. Through hacked nervous systems, reverberating microphones, a humming engine, and onions flying in circles, they co-create a space where many x-beings might arrive—uninvited, partial, insistent.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">In a world increasingly governed by the categorization of bodies—who counts as living, whose grief is recognized, whose voice is heard—this piece asks: What if we are already cohabiting with the uninvited? What if being-together is always haunted, incomplete, and permeable?</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;">The x-being resists definition. It may be the erased, the excluded, the not-yet-counted. The audience is not simply observing; they arrive as vibrating x-beings themselves, drawn into a shared sensory field where separations blur and subtle transmissions take place.</p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text" style="font-style:italic;">“The most crucial clue to deciphering He Jin Jang's choreography lies in her approach to material in dance... She incorporates the neuroplastic act of ‘being-with’ into a conscious and active choreographic method.”<br class="wixui-rich-text__text"/>
— Bittnarie Shin (Dramaturg), 2021</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text">​</span>​</span></span><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="font-size:15px;; text-align: justify;"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;"><span class="wixui-rich-text__text">​</span></span></span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Concept and Artistic Direction by He Jin Jang</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Co-choreography and Performance by He Jin Jang and Myeungshin Kim</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Sound Design by Jimmy Sert</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Dramaturgy by Bittnarie Shin</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Visual Design by He Jin Jang &amp; ADOH (Seungwoo Han, Jinwoo Oh)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Lighting Design by Minsoo Kim</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Stage Direction by Taeyoung Maeng</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Technical Direction by Youngsoo Choi</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Visual Documentation by Bokco (Jinwon Lee, Booyoun Park, Min Lee)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Teaser Clip Production by Bokco</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Producer by Eunji Park</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Promotion by Bokdongsan (Beomjun Kim, Eunji Park)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Graphic Design by Jjungkimsoree</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Operation/Coordination by Taehwan Park</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Produced and Hosted by He Jin Jang Dance</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Seoul Street Arts Creation Center, Korea Creative Content Agency</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">International Support by The Saison Foundation as a resident artist in 2021-22, with funding from the Agency for Cultural Affairs, Government of Japan in Fiscal Year 2021</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;">Venue: Seogang Marry Hall Main Theater, Korea</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></p>
<blockquote class="font_8 wixui-rich-text__text" style="font-size:18px;">
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">“이러한 움직임은 비체-되기, 오브제-되기, 나아가 공기와 같이 사라지기라는 철학적 언명으로서의 발화이기도 할 것이다... 외계의 언어를 구사하는 듯한 외양은 어느 순간 존재 간의 만남을 향한다.”<br class="wixui-rich-text__text"/>
— 2022년『아트신』</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
</blockquote>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">두 명의 여성 퍼포머, 울리는 마이크, 신경계 해킹, 굉음을 내는 엔진, 원형 운동하는 양파, 그리고 허밍 — 이들은 무대 위에서 서로 얽히며 유령적 존재들의 리듬과 관계성을 생성하는 재료들이 된다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><br class="wixui-rich-text__text"/>
《당신은 x-존재를 초대하지 않을 수 없다》는 40대 여성의 2인무로, 정체를 알 수 없는 다른 존재들(x-being)이 그 사이에 끼어들고, 맴돌며, 함께 진동하게 되는 공동의 장을 도모하는 작업이다. 이들은 공명, 방해, 긴장감, 그리고 친밀성을 기반으로 관계를 구축하며, “‘둘’이 아닌 ‘다수’를 위한 공간”을 무대 위에 출현시킨다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">오늘날 누가 ‘살아 있는 존재’로 여겨지는가, 누구의 죽음은 애도되고 누구의 목소리는 들릴 수 있는가 — 이 작업은 몸의 분류와 위계에 대해 질문한다. 우리는 이미 초대받지 않은 존재들과 함께 살고 있는 것은 아닐까? ‘함께 있음’이란 본래부터 불완전하고, 그 사이를 박동하는 죽음들로 인해 경계 너머로 흔들리는 일이 아닐까?</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">이때 x-being은 단순한 상징이 아닌, 사이에 실재하는 감각의 흐름이다. 지워진 존재, 이름 붙을 수 없는 존재, 아직 도착하지 않은 존재, 그리고 예기치 않게 스며드는 존재들. 관객 역시 단순한 관찰자가 아니다. 그들은 진동하는 x-being으로서 현장에 도착한다. 불분명하게 떨리고, 모호한 경계를 건드리며, 설명할 수 없는 친밀함 속으로 진입한다. 두 여성이 사라짐을 거부하는 존재들을 무대 위로 불러내는 동안, 다중의 몸을 관통하는 떨림은 배제와 삭제의 논리에 저항하는 감각적 행위로 확장된다.</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; font-size:15px;; text-align: justify;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">“가장 중요한 단서는 그가 무용에서의 물질을 다루는 방식, 곧 안무 방법론이다… 장혜진이 ‘함께 있음(being-with)’이라는 신경가소적 행위 자체를 의식적이고 적극적인 안무의 방법으로 사용했다는 것을 보여준다.”<br class="wixui-rich-text__text"/>
— 2021년, 신빛나리 드라마투르그</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><a class="wixui-rich-text__text" href="https://docs.google.com/document/d/1sxKgnZG6KyiHJ-O8xB94q2vLBj-04o_YEzoaNpyEl0E/edit?usp=sharing" rel="noreferrer noopener" target="_blank"><span class="color_38 wixui-rich-text__text"><span class="wixui-rich-text__text" style="text-decoration:underline;">안무가의 글 링크</span></span></a></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">​​<span class="wixui-rich-text__text">​</span>​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">​​​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">컨셉/안무/연출. 장혜진</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">창작/퍼포먼스. 장혜진, 김명신</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">무대감독. 맹태영 </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">기술감독. 최영수</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">조명감독. 김민수</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">사운드 디자인. 지미세르</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">비주얼 디자인. ADOH (한승우,오진우)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">드라마투르기. 신빛나리</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">영상기록. 복코</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">사진기록. 복코</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">티저 제작. 복코</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">그래픽 디자인. 정김소리</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">프로듀서. 박은지</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">홍보/운영. 복동산 (박은지, 김범준)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">코디네이터. 박태환</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">주최/주관. He Jin Jang Dance</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">후원. 한국문화예술위원회, 문화체육관광부, 거리예술창작센터, 콘텐츠문화광장, 신촌문화발전소</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">국제 후원. The Saison Foundation Japan Residency, 일본 문화청 (The Agency for Cultural Affairs, Government of Japan)</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"> </p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;">베뉴. 서강대 메리홀 대극장, 한국​</p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p>
<p class="font_9 wixui-rich-text__text" style="line-height:1.8em; text-align:justify; font-size:15px;"><span class="wixui-rich-text__text">​</span></p></div>

                <div class="about-image-container">
                  <div class="image-placeholder" style="aspect-ratio: 845/779; max-width: 845px; height: auto;" data-original-src="https://static.wixstatic.com/media/073f40_a338769225504fc98bec522c7bbcb1d9~mv2.jpg/v1/crop/x_0,y_229,w_2000,h_1843/fill/w_845,h_779,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/073f40_a338769225504fc98bec522c7bbcb1d9~mv2.jpg">
                    <span class="placeholder-label">Image:  (845x779)</span>
                  </div>
                </div>
                
      </div>
    `
  }
};

// Common generic template for other selected works/archives
function renderGenericWork(path) {
  const cleanTitle = path.substring(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return `
    <div class="content-page">
      <div class="about-section">
        <h2 class="about-title" style="font-size: 20px;">${cleanTitle}</h2>
        <p class="about-text" style="font-style: italic; color: #718096; margin-bottom: 30px;">
          Detailed project archives, performance recordings, and choreographic materials are currently being prepared for this workspace.
        </p>
        <p class="about-text">
          This piece forms part of He Jin Jang Dance's ongoing inquiry into physical vulnerability, spatial somatic research, and temporal relationships. Detailed documentation includes production lists, stage research maps, and media assets.
        </p>
        <a href="/" class="about-cv-link" data-link>Return to Home</a>
      </div>
    </div>
  `;
}

// Router Logic
function route() {
  const path = decodeURIComponent(window.location.pathname);
  const page = routes[path] || {
    title: 'Project | He Jin Jang Dance',
    render: () => renderGenericWork(path)
  };

  // Update Title
  document.title = page.title;

  // Render HTML
  const container = document.getElementById('page-content');
  if (container) {
    container.innerHTML = page.render();
  }

  // Toggle WebGL canvas visibility
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer) {
    if (path === '/') {
      canvasContainer.style.opacity = '1';
      canvasContainer.style.pointerEvents = 'auto';
    } else {
      canvasContainer.style.opacity = '0';
      canvasContainer.style.pointerEvents = 'none';
    }
  }

  // Hide list bar (nav) on all pages except Home
  const nav = document.getElementById('nav');
  const isHome = (path === '/');
  if (nav) {
    if (isHome) {
      nav.style.display = 'block';
    } else {
      nav.style.display = 'none';
    }
  }

  // Adjust padding when nav is hidden
  const contentPages = document.querySelectorAll('.content-page, .upcoming-page, .contact-page, .press-page');
  contentPages.forEach(el => {
    if (isHome) {
      el.classList.remove('nav-hidden');
    } else {
      el.classList.add('nav-hidden');
    }
  });

  // Update active state in navigation
  document.querySelectorAll('.nav-link, .dropdown a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    }
  });

  // Re-bind dynamically rendered data-link clicks (if any)
  bindLinks();

  // Scroll to top
  window.scrollTo(0, 0);
}

// Intercept Link Clicks for SPA Transition
function bindLinks() {
  document.querySelectorAll('a[data-link]').forEach(link => {
    // Prevent multiple event listeners
    if (link.dataset.bound) return;
    link.dataset.bound = 'true';

    link.addEventListener('click', e => {
      e.preventDefault();
      // FIX: use data-link instead of href
      const targetPath = link.getAttribute('data-link');
      if (targetPath && targetPath !== window.location.pathname) {
        window.history.pushState(null, '', targetPath);
        route();
      }
    });
  });
}

// Listen to navigation events
window.addEventListener('popstate', route);

// Initialize Router
document.addEventListener('DOMContentLoaded', () => {
  route();
  bindLinks();
});
