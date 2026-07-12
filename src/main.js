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
      <div class="content-page" style="padding: 40px 0;">
        <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">He Jin Jang Dance</span><br>
            He Jin Jang Dance is a choreographic project group that works across contemporary dance, experimental performance, sound, writing, and installation — often involving fluid constellations of collaborators tailored to each project. Rather than functioning as a fixed ensemble, the group unfolds as a porous structure — a space that holds kinship, critical collaboration, and embodied knowledge production. At the heart of the collective lies an ongoing inquiry into the invisible: invisible bodies, unspoken grief, minor gestures, and non-linear rituals of togetherness. HJJD explores bodily vulnerability through the Eastern concept of mind-body, focusing on the four stages of life — birth, aging, illness, and death. Led by choreographer and researcher He Jin Jang, the group produces performances, writings, discourses, and workshops that blur the boundaries between contemplation and monstrosity, personal memory and collective dreaming. Since its debut in the United States with <i>open skin inscribed</i> (2008), which investigated inherited skin trauma as a threshold between internal and external realities, HJJD has presented works in over 30 cities worldwide — including Seoul International Dance Festival (KR), MODAFE (KR), Platform-L Live Arts Program (KR), Laboratorio Condensación (MX), National Museum of Contemporary Arts (RO), Temps d'Image Festival (RO), Musikfestival Bern (CH), New York Live Arts (US), and The Kitchen (US). Using somatic improvisation, text, imagery, and socio-political commentary — grounded in both Western and non-Western methodologies — HJJD creates spaces for collective lucid dreaming and rehearsals for survival. The group’s work has been supported by Seoul Foundation for Arts and Culture, Arts Council Korea, and Korea Arts Management Service, and has been described by the press as work that “humbles us all” (Indy Week, US).
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">He Jin Jang</span><br>
            Described by Dance Magazine MOMM (KR) as "a daring and candid choreographer," He Jin Jang is a multicity-based choreographer and researcher born and raised in Seoul, Korea. Her practice approaches choreography as a method of sensing, remembering, and unmaking—exploring the nervous systems of vulnerability shaped by grief, memory, and sensory dissonance. Grounded in somatic movement, feminist theory, and indigenous healing practices, her work spans choreography, research, performance coaching, curatorial care, and dramaturgy. She has served as a mentor or performance coach with institutions such as the Asian Cultural Center (KR), University of the Arts (US), New York Foundation for the Arts (US), and the Korea National Contemporary Dance Company. Jang has provided dramaturgical support to artists including Ursula Eagly, James Cousins, Yunkyung Hur, and Ae-Soon Ahn. She has co-curated numerous programs, including Brick-Break Platform at Arts Council Korea Theater, Seoul International Choreography Workshop, and Choreo-Lab at the Korea National Contemporary Dance Company. Her international residencies and fellowships include the Saison Foundation Online Artist-in-Residence (JP), Laboratorio Condensación (MX), DanceWeb Fellowship (AT), Artist-in-Residence at Movement Research (US), and Fresh Tracks at New York Live Arts (US). She is currently based in Singapore, where she is a fellow of T:Works’ Artistic Director Academy, and a core member of the choreographic collective Tangerine.
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">Current Research</span><br>
            Jang is currently pursuing a practice-based PhD in Creativity at Transart Institute, in partnership with Liverpool John Moores University. Her research investigates choreography as a ritualistic methodology of resilience and embodied historiography. She reimagines rehearsal as a speculative, socio-political, and sensory site — one that traverses inherited trauma, collective repair, and invisible embodiment. Through somatic whispering, proprioceptive exploration, and artistic autoethnography, she constructs listening environments that operate with and through the body. She is also a certified Franklin Method® educator, a somatic practice grounded in Dynamic Neurocognitive Imagery™, which informs her movement education and embodied research.
          </p>

          <p style="font-size: 15px; margin-bottom: 40px;"><a href="/blank" data-link style="text-decoration: underline; color: #1a1a1a;">English CV</a></p>

          <div style="margin: 60px 0;">
            <img src="/images/073f40_2297e8f0e68e48f89b1818f21e2028ee_mv2.jpeg" style="width: 100%; height: auto; display: block;" alt="Portrait">
          </div>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">혜진장댄스</span><br>
            He Jin Jang Dance는 생로병사를 겪는 연약한 몸, 그리고 그 몸이 사회적 구조와 관계 맺는 방식을 감각하고 질문하는 프로젝트 그룹이다. 춤 창작과 리서치, 퍼포먼스, 집필, 담론, 워크숍을 오가며, 프로젝트마다 유동적으로 구성되는 협업자들과 함께 작업을 확장해 왔다. 고정된 앙상블이 아니라, 친밀성과 비판적 협업, 신체 기반 지식 생산이 교차하는 다공성 구조(porous constellation)로 작동한다. 관심의 중심에는 늘 보이지 않는 것들이 있다 — 보이지 않는 몸, 말해지지 않은 슬픔, 사소한 몸짓, 비선형적인 공동체적 의례. 동양의 심신 철학을 기반으로, 탄생과 노화, 질병과 죽음이라는 생의 네 단계를 가로지르며 몸의 취약함을 예술 언어로 탐색해왔다. 2008년 미국에서 발표한 첫 작업 <i>open skin inscribed</i>는 유전성 피부병에 관한 가족사를 리서치하여, 몸과 사회를 구성하는 감각의 표면으로서 피부에 주목한 안무였다. 이 작업은 『인디 위크』로부터 “우리 모두를 겸허하게 만드는 작품”이라는 평을 받았다. 이후 서울국제무용제, MODAFE, 플랫폼-엘 PLAP, Laboratorio Condensación(멕시코), 부쿠레슈티 국립현대미술관(루마니아), Temps d'Image Festival (루마니아), Musikfestival Bern(스위스), 뉴욕 라이브 아츠, 더 키친 등 30여 개 도시의 예술기관과 페스티벌에서 작업을 발표하며, 퍼포먼스, 전시, 워크숍, 렉처, 대화 등 다양한 형태로 리서치를 공유해 왔다. 한국문화예술위원회, 서울문화재단, 예술경영지원센터 등의 지원 아래 진행된 작업들은, 소매틱 즉흥, 심상, 언어, 사회적 비평을 연결하며 집단 자각몽의 순간을 불러낸다. 이러한 예술적 사건들은 고통과 유머, 과거와 미래, 외부와 내부, 개인과 공동의 기억을 넘나들며, 공동 생존의 감각을 리허설하는 공간을 구성한다.
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">장혜진</span><br>
            장혜진은 서울에서 태어나 다양한 도시를 기반으로 활동해온 안무가이자 리서처다. 인간이 피할 수 없는 연약함에 대해 몸이 반응하는 방식을 감각하고, 그 신경계의 움직임을 안무로 조직하며, 생존의 리듬을 라이브 아트의 언어로 탐구해왔다. 『월간 몸』은 그녀를 “대담무쌍하고 솔직한 안무가”로 소개한 바 있다. 그녀의 작업은 소매틱 움직임, 페미니즘 이론, 토착 치유 지식을 기반으로 하며, 안무 창작과 연구, 퍼포먼스 코칭, 예술 기획과 드라마투르기를 넘나들며 펼쳐진다. 그간 오스트리아 DanceWeb 펠로우십(2011), 뉴욕 Movement Research 상주예술가(2009-11), 루마니아 무빙 다이얼로그 교환안무가(2011), 뉴욕 라이브 아츠 Fresh Tracks 상주예술가(2014-15), Knowing Dance More 초청 안무가(2017), 멕시코 Laboratorio Condensación 초청 안무가(2018), 일본 Saison Foundation 온라인 상주예술가(2021-22), 캐나다 지브랄타 포인트 상주예술가(2024) 등에 선정되며, 국제적 네트워크 안에서 다층적인 리서치를 이어왔다. 동료 예술가들의 작업을 돌보는 퍼포먼스 코치, 예술 자문, 드라마투르그로서의 활동도 꾸준히 지속해왔으며, 뉴욕예술재단 안무 멘토(2014), 서울무용센터 자문위원(2016-19), 아시아문화전당 안무랩 멘토(2019-21), 미국 유아츠 대학원 안무 멘토(2019-21), 국립현대무용단 퍼포먼스 코치(2022-23)로도 참여해왔다. 어슐리 이글리, 제임스 커즌즈, 안애순, 이윤경, 허윤경 등의 작업에 드라마투르그로 함께했다. 또한 국립현대무용단 Choreo-Lab(2016), 서울문화재단 서울국제안무워크숍(2017), 아르코예술극장 Brick-Break Platform(2021) 등을 공동 기획하며, 안무와 공동체적 실천이 만나는 새로운 예술적 구조를 구상하고 실현해왔다. 서울대학교 체육교육과 무용전공을 졸업하고, 미시간대학교에서 무용 석사과정을 수료했으며, 미국 홀린즈대학교에서 안무 석사를 마쳤다. 현재는 싱가포르에 거주하며, T:Works의 Artistic Director Academy 펠로우로 활동 중, 탠저린 콜렉티브의 공동 멤버이기도 하다.
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">최근 연구</span><br>
            장혜진은 현재 Transart Institute와 Liverpool John Moores University의 공동 프로그램으로 실천 기반 박사과정(Practice-Based PhD)에 재학 중이다. 그녀의 연구는 안무를 회복력과 몸의 역사 쓰기를 위한 의례적 방법론으로 바라보며, 리허설을 상상적이고, 사회정치적이며, 감각적인 실천의 장소로 새롭게 정의한다. 그녀는 유전된 트라우마, 공동 회복, 비가시적 몸의 현존을 다루며, 소매틱 속삭임(somatic whispering), 고유수용감각 탐색(proprioceptive guidance), 예술적 자문화기술지(artistic autoethnography)를 활용해 몸으로 듣는 리서치 환경을 구축한다. 또한, Franklin Method® 공인 교육자로서, Dynamic Neurocognitive Imagery™ 기반의 소매틱 접근법을 자신의 무브먼트 교육 및 연구에 적극적으로 적용하고 있다.
          </p>

          <p style="font-size: 15px; margin-bottom: 40px;"><a href="/blank" data-link style="text-decoration: underline; color: #1a1a1a;">국문 CV</a></p>
        </div>
      </div>
    `
  },
  '/upcoming': {
    title: 'Upcoming | He Jin Jang Dance',
    render: () => `
      <div class="content-page" style="display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 100px;">
        <div style="max-width: 649px; width: 100%;">
          <h1 style="text-align: center; font-size: 24px; font-weight: bold; font-style: italic; margin-bottom: 50px;">Upcoming</h1>
          
          <div style="font-size: 15px; font-weight: bold; font-style: italic; color: #7a1d74; line-height: 1.8;">
            <p style="margin-bottom: 24px;">Sep 18–21, 2025: Unseaming. — SIDance Festival, Korea</p>
            <p style="margin-bottom: 24px;">Sep 22 · Artist’s Talk &amp; Workshop at Korea National University of the Arts</p>
            <p style="margin-bottom: 24px;">Oct 13–24 · Guest Choreographer — LASALLE College of the Arts, Singapore 2025</p>
            <p style="margin-bottom: 24px;">Nov 5 · Lecture Performance — NAFA Research Café, Singapore 2025</p>
            <p style="margin-bottom: 24px;">Nov 15 · QUANDARY Performance — MIAO Dance, Singapore 2025</p>
            <p style="margin-bottom: 24px;">Nov 28 – Dec 7 · Inbetween Space Lab with Marie France Forcier &amp; Heidi Strauss, Singapore 2025</p>
          </div>
        </div>
      </div>
    `
  },
  '/contact': {
    title: 'Contact | He Jin Jang Dance',
    render: () => `
      <div class="content-page" style="padding: 40px 40px; margin-top: 40px;">
        <h2 style="font-size: 20px; font-weight: bold; margin-bottom: 30px;">He Jin Jang Dance</h2>
        <p style="font-size: 15px; margin-bottom: 20px; line-height: 1.8;">
          Email / <a href="mailto:hejinjangdance@gmail.com" style="color: #0080FF; text-decoration: underline;">hejinjangdance@gmail.com</a><br>
          Youtube / <a href="https://www.youtube.com/@hejinjangdance" target="_blank" style="color: #0080FF; text-decoration: underline;">@hejinjangdance</a><br>
          Instagram / <a href="https://www.instagram.com/hejinjangdance/" target="_blank" style="color: #0080FF; text-decoration: underline;">@hejinjangdance</a>
        </p>
      </div>
    `
  },
          '/press-review': {
    title: 'Press | He Jin Jang Dance',
    render: () => `
      <div class="press-page">
        <h1 class="press-title">Press Reviews</h1>
        <div class="press-grid">
          <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
            </div>
          </a>
          <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
            </div>
          </a>
          <a href="/post/복제-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">"I bet you’d put that on is not merely a simple play with blankets; it is simultaneously a play with corpses and a meticulously designed...</p>
            </div>
          </a>
          <a href="/post/2023년-『아트신』-1월호-김민관-평론가-당신이-그런-것을-입게-될-줄-알았어" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">"The audience is held on the mat and experiences the distortion of their body on the fluid ground, not through seeing or hearing. The...</p>
            </div>
          </a>
          <a href="/post/당신은x-being을-초대하지-않을-수-없다" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">Art Scene , January lssue, 2022 / Min Gwan Kim ( Critic) / You cannot disinvite x-being "These movements might be a philosophical...</p>
            </div>
          </a>
          <a href="/post/2021년-신빛나리-드라마터그-당신은-x-being을-초대하지-않을-수-없다" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / <당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">"He Jin Jang's artistic practice, while rejecting the ‘experiment of form’ enclosed within the traditional — dualistic — metaphysical...</p>
            </div>
          </a>
          <a href="/post/2021년-『월간잡지-몸』-11월호-김남수-안무비평-흐르는" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance Magazine MOMM,  November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호, <흐르는. >, 2021년, 김남수 안무비평가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“He Jin Jang’s performance has opened a space where the audience, standing on the direct tremors of nerves, lights one’s own torch,...</p>
            </div>
          </a>
          <a href="/post/2021년-조형빈-평론가-흐르는" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Hyungbin Jo (Critic), 2021, the flowing. / <흐르는. > , 2021년, 조형빈 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“The performance was a declaration of vulnerability and posed questions about the connection and mediation of breath, (voice) sound, and...</p>
            </div>
          </a>
          <a href="/post/2021년-『춤과-사람들』-이봉헌-기자-대체된-침묵" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance and People, 2020, silence replaced: , Bongheon Lee (Journalist) / 『춤과 사람들』, <대체된 침묵: >, 2021년, 이봉헌 기자</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">" silence replaced: is not a work where the concept is prominently displayed. To me, it was perceived as a choreographer’s humble...</p>
            </div>
          </a>
          <a href="/post/2020년-『뉴욕일보』-정은실-기자-위클리-위-클리" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">The New York Ilbo, Weekly Weakly, 2020, Eunsil Jung (Journalist) /『뉴욕일보』, <위클리 위-클리>, 2020년, 정은실 기자</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">"Invited by Movement Research in the United States, He Jin Jang's choreographic work, Weekly Weakly, was performed with great acclaim at...</p>
            </div>
          </a>
          <a href="/post/2018년-현지예-드라마터그-미소서식지-몸" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Microhabitat Body, 2018, Ziyea Hyun (Dramaturgy), / <미소서식지 몸>, 2018년, 현지예 드라마터그</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">" Microhabitat Body was a work in which each participant accumulated, amplified, and shared imagination perceptive cognition through the...</p>
            </div>
          </a>
          <a href="/post/2016년-『춤웹진』-방희망-평론가-이주하는-자아-문의-속도" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance Webzine, migrant-self the speed of a door, 2016, Heemang Bang (Critic) / 2016년『춤웹진』, <이주하는 자아, 문의 속도> , 방희망 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“In this work, which explores the discrepancy between objective and subjective time, it seems appropriate to include even the actions and...</p>
            </div>
          </a>
          <a href="/post/2015년-『춤웹진』-이윤숙-이주하는-자아-문의-속도" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Dance Webzine, migrant-self the speed of a door, 2015, Yoonsook Lee / 2015년 『춤웹진』, <이주하는 자아 문의 속도> , 이윤숙</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">"He Jin Jang's migrant-self the speed of a door Speed of Migrating Self-Inquiry depicts the turmoil of the self within the gap between...</p>
            </div>
          </a>
          <a href="/post/2015년-『new-york-live-arts-context-notes』-제스-발바갈로-평론가-이주하는-자아-문의-속도" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">NEW YORK LIVE ARTS CONTEXT NOTES, migrant-self the speed of a door, 2015, 제스 바바갈로 (Critic) / 2015년 『New York Live Arts Context Notes』, <이주하는 자아 문의 속도>, 제스 발바갈로 평론가</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“I might use the word elemental. He Jin Jang’s floor-centric compositions lead her back to the ground again and again, and through time....</p>
            </div>
          </a>
          <a href="/post/2008년-미국-『indy-week』-바이론-우즈-평론가" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">U.S Indy week, July 2008, Byron Woods (Critic) / 2008년 미국 『Indy Week』, 바이론 우즈 평론가 /</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">“...before HeJin Jang humbled us all at the conclusion of open skin inscribed by kneeling and scrubbing the cement floor with xeroxed...</p>
            </div>
          </a>
          <a href="/post/인터뷰-모음" data-link style="text-decoration: none; color: inherit; display: block;">
            <div class="press-card">
              <h3 class="press-post-title" style="margin-bottom: 24px; font-size: 15px;">Interview / 인터뷰 모음</h3>
              <p class="press-post-excerpt" style="font-size: 15px; margin-bottom: 24px;">2020년 6월 『 춤in 』 코로나와 무용수업: 방법에의 도전 w/김재리, 김옥희, 장혜진, 조주현 http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=IN&zom_idx=548&div=...</p>
            </div>
          </a>
        </div>
      </div>
    `
  },
  '/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든': {
    title: 'Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-e8w3r604"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together by 'those who move,' 'those who observe the movement,' and 'those who are observing those who observe the movement' is nothing other than rhythm itself. The spontaneous rhythm of the space, created with invisibleout a clear cause-and-effect relationship, enables a unique solidarity among the participants on the spot. For her, dance seems to be not about conveying a specific meaning, nor expressing thoughts and emotions. She pays attention to the way dance, like gas, spreads when people gather in one space perceiving a shared coexistence. ... Her works resonate not only with the general public but also with fellow dancers and artists, as they offer a multisensory experience through the body, reflecting a new social role assigned to contemporary dancers. The captivating process of conducting extended research, forming new knowledge and culture, sharing the process and outcomes through movement workshops, and finally bearing fruit in the form of performances adds an additional layer of charm to her works. ... He Jin Jang's work stimulates questions about the roles of choreographers, dancers, staff, audiences, and critics, offering a glimpse into the future of dance by encouraging everyone to question their own roles.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-0ggde1283"><span class="ATqq4"><span style="font-size:14px"><span>Hwahung Yu&nbsp;(Critic), 2023,&nbsp;</span></span><em style="font-style:italic"><span style="font-size:14px"><span>Slow Carnival World</span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-9xec3631"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“장혜진은 꾸준히 춤이 일어나는 공간, 그리고 예술가의 사회적 역할에 대해 관심을 표명해 왔다. ‘움직이는 사람’과 ‘움직임을 보는 사람’, 또 ‘움직임을 보는 사람을 보는 사람들’이 함께 직조해 내는 것은 다름 아닌 리듬이다. 인과 관계를 알 수 없이 즉흥적으로 만들어지는 공간의 리듬은 현장에 참여한 사람들 사이 특별한 연대를 가능케 한다. 장혜진에게 춤이란 특정의 의미를 전달하는 것도, 생각과 감정을 표현하는 것도 아닐 듯하다. 사람들이 한 공간에 모여 공동의 현존(現存)을 체감할 때, 춤은 기체처럼 퍼진다는 점에 주목한다… 동시대 무용가에게 부여되는 새로운 사회적 역할 중 하나가 신체를 통한 다중 감각의 경험을 선사하는 것에 있다는 점에서 장혜진의 활동은 일반인은 물론 주변 무용가와 예술가들에게 파장을 일으킨다. 장기간의 리서치를 진행하여 새로운 지식과 문화를 형성하고 그 과정과 결과물을 움직임 워크숍으로 공유한 뒤 퍼포먼스의 형식으로 열매 맺는 과정이 매력적이다…장혜진의 공연은 안무가, 무용수, 스태프, 관객, 비평가 모두가 스스로의 역할에 대해 질문을 던질 수 있도록 자극했다는 점에서 미래의 무용을 조망하게 했다.</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-qx73r618"><span class="ATqq4"><span style="font-size:14px"><span>2023년, 유화정 평론가, &lt;투명인간이 되든, 춤을 추든&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-kn8do505"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/drive/u/0/folders/1it-eDvJQdueQJG_A6wkRgNv3JocVkLXL" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

              <a href="/post/복제-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">"I bet you’d put that on is not merely a simple play with blankets; it is simultaneously a play with corpses and a meticulously designed...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin': {
    title: 'Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어> | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-t5h961400"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience members to experience a hypnagogic state. The hypnagogic state, where one feels as if they have fallen asleep while they have not, parallels the experience of a rehearsal where one has not performed but feels as if they have. The tactile experience using the mat also serves to enhance the experiential aspect of the rehearsal.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-rfkg956"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance Webzine</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, February lssue, 2023, Sukjin Han (Dance </span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Theorist), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>I bet you’d put that on</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-0flth854"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“작품에서 퍼포머의 이야기는 의미론적 차원뿐 아니라 물질적 차원에서 작동함으로써 몇몇 관객은 가수면 상태에 이르는 경험을 갖는다. 잠이 들지 않았지만 잠이 든 것처럼 느끼는 가수면 상태는, 공연을 하지 않았지만 공연을 한 것처럼 경험하는 리허설과 유사하다. 매트를 사용한 촉각적 경험 역시 리허설의 경험을 도모하는 역할을 수행한다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-ow59r8046"><span class="ATqq4"><span style="font-size:14px"><span>2023년 『춤웹진』 2월호, 한석진 무용학자, &lt;당신이 그런 것을 입게 될 줄 알았어&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-v7fjg70"><span class="ATqq4"><a target="_blank" href="http://koreadance.kr/board/board_view.php?view_id=63&amp;board_name=research&amp;page=2" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">"I bet you’d put that on is not merely a simple play with blankets; it is simultaneously a play with corpses and a meticulously designed...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/복제-투명인간이-되든-춤을-추든': {
    title: 'Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-nlnfc1099"><span class="ATqq4"><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"I bet you’d put that on</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;is not merely a simple play with blankets; it is simultaneously a play with corpses and a meticulously designed device, and in terms of choreography, it is also a precise work designed with a dual structure.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-m0rc93748"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance Magazine MOMM</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, January Issue, 2023, Sunghye Park (</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>I bet you’d put that on</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-2uku3235"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“&lt;당신이 그런 것을 입게 될 줄 알았어&gt;는 단순한 이불 놀이가 아니라 시체 놀이인 동시에 세밀하게 설계된 장치요, 안무에 있어서는 이중 구조로 설계된 정밀한 작업”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-korsa4285"><span class="ATqq4"><span style="font-size:14px"><span>2023년 『월간잡지 몸』 1월호, 박성혜 평론가, &lt;당신이 그런 것을 입게 될 줄 알았어&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-asyjg1828"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/drive/u/0/folders/1Y0P6QHoBZh6B6tAhJ9YKM_Pgqa4BS0Td" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2023년-『아트신』-1월호-김민관-평론가-당신이-그런-것을-입게-될-줄-알았어': {
    title: 'Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-gzlk3295"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"The audience is held on the mat and experiences the distortion of their body on the fluid ground, not through seeing or hearing. The words inserted into these conditions constantly destabilize the fixed positions of 'I' and 'You.' With eyes open, the audience faces the performers for the first time and wears boxing gloves and then the mat lightly and solidly, following the lead of the performers. ... </span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>I bet you’d put that on</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;reflects the audience's position once as an absence and another time as an analyst, monopolizing and revealing (entbergen) the audience's position. The performance title, initially stated in the future tense, reignites the audience's position."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-c3rkq193"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span>Art Scene</span></span></em><span style="font-size:14px"><span>, January lssue, 2023,  Mingwan Kim (Critic), </span></span><em style="font-style:italic"><span style="font-size:14px"><span>I bet you’d put that on</span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-axbnc240"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“매트 위에 관객은 붙잡히며, 유동하는 땅(ground)에서 자신의 몸이 굴절되는 것을 체험한다, 보거나 듣는 것이 아닌. 이러한 조건 속에 삽입되는 말은 ‘나’와 ‘너’의 고정된 위치를 끊임없이 불안정한 것으로 만든다. 눈을 뜬 채 처음 퍼포머와 마주하며 그가 이끄는 대로 권투 장갑을 착용한 이후로, 관객은 헐겁고 묵직하게 매트를 착용한다...〈당신이〉는 관객으로서의 위치를 한 번은 부재로 다른 한 번은 분석자의 입장으로 반영하며, 관객의 위치를 전유하고 탈은폐한다. 전 미래형으로 이야기‘되었던’ 공연명은 관객의 그러한 위치를 재점화한다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-daiby46"><span class="ATqq4"><span style="font-size:14px"><span>2023년 『아트신』 1월호, 김민관 평론가, &lt;당신이 그런 것을 입게 될 줄 알았어&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-1cdsw59"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/당신은x-being을-초대하지-않을-수-없다': {
    title: 'Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-yep6o37"><span class="ATqq4"><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Art Scene</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, January lssue, 2022 / Min Gwan Kim (</span></span><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic) / </span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>You cannot disinvite x-being</span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-u6a5e42"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"These movements might be a philosophical declaration of becoming-non-body, becoming-object, and ultimately disappearing-like-air. This becoming, on one hand, appears to possess a complete performativity, as the choreographer throws herself onto the stage. Even if all of this leads to expressions based on pre-set scores, the movement advances into a realm that generates gaps and errors within the framework of performance. ... The programmed mechanical movement of </span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>You cannot disinvite x-being,</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;its appearance reminiscent of speaking an extraterrestrial language, moves towards the encounter between beings at some point. This transcends the object as a blurred subject, allowing us to faintly sense the intrinsic motivation of a fragile subject."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-zsrnw47"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Art Scene</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, January lssue, 2022, Mingwan Kim (Critic), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);text-decoration:inherit"><span>You cannot disinvite x-being</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-2b57734"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“이러한 움직임은 비체-되기, 오브제-되기, 나아가 공기와 같이 사라지기라는 철학적 언명으로서의 발화이기도 할 것이다. 이러한 되기는 한편으로 안무가 스스로를 무대로 투신하는 차원에서 온전한 수행성을 갖는 것으로도 보이는데, 이것이 모두 사전 스코어에 따른 표현으로 이어지고 있었다고 해도 움직임은 수행의 틀 안에서 시차와 오차를 생산하는 범위로 나아간다... 〈x-being〉의 프로그래밍된 기계적 존재의 움직임, 외계의 언어를 구사하는 듯한 외양은 어느 순간 존재 간의 만남을 향한다. 이는 흐릿한 주체로서의 객체를 넘어서 연약한 주체의 내재적인 동기를 흐릿하게 감지하게 한다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-110wx7590"><span class="ATqq4"><span style="font-size:14px"><span>2022년 『아트신』 1월호, 김민관 평론가, &lt;당신은 x-being을 초대하지 않을 수 없다&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-l3asz48"><span class="ATqq4"><a target="_blank" href="https://www.artscene.co.kr/1808" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="https://www.artscene.co.kr/1808" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2021년-신빛나리-드라마터그-당신은-x-being을-초대하지-않을-수-없다': {
    title: 'You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / <당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;"><당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-euww147"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"He Jin Jang's artistic practice, while rejecting the ‘experiment of form’ enclosed within the traditional — dualistic — metaphysical framework, appears to be an integral part of her tough exploration to the question, 'If material — a dancer's body — and form are the same, how can choreography be approached?' For this reason, the most crucial clue to deciphering He Jin Jang's choreography lies in her approach to material in dance, namely, her choreographic methodology. ... It demonstrates that He Jin Jang incorporates the neuroplastic act of ‘being-with’ into a conscious and active choreographic method."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-ol6dk858"><span class="ATqq4"><span style="font-size:14px"><span>Bittnarie Shin&nbsp;(Dramaturgy), 2021,&nbsp;</span></span><em style="font-style:italic"><span style="font-size:14px"><span>You cannot disinvite x-being</span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-zq2xh40"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“장혜진의 예술 실천은 전통적 —이원론적— 형이상학의 자장에 안에 포섭되는 ‘형식의 실험’을 거부하는 동시에, ‘만약 물질—무용수의 신체—과 형식이 같은 것이라면 어떻게 안무할 수 있는가?’라는 질문에 답하고자 하는 그의 분투의 일환으로 보인다. 이러한 이유로 장혜진의 안무를 읽어내는 데 가장 중요한 단서는 그가 무용에서의 물질을 다루는 방식 곧, 안무 방법론이다…장혜진이 ‘함께-있음being-with’이라는 신경가소적 행위 자체를 의식적이고 적극적인 안무의 방법으로 사용했다는 것을 보여준다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-rxjo543"><span class="ATqq4"><span style="font-size:14px"><span>2021년, 신빛나리 드라마터그, &lt;당신은 x-being을 초대하지 않을 수 없다&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-tv6pk60"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2021년-『월간잡지-몸』-11월호-김남수-안무비평-흐르는': {
    title: 'Dance Magazine MOMM,  November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호, <흐르는. >, 2021년, 김남수 안무비평가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">『월간잡지 몸』11월호, <흐르는. >, 2021년, 김남수 안무비평가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-6zm7x125"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“He Jin Jang’s performance has opened a space where the audience, standing on the direct tremors of nerves, lights one’s own torch, jointly rupturing or being ruptured within the dark resonance. … The choreography, although barely, most intensely threw up the confession of the fluid interior or 'interspace' of the female body while questioning "what is the stage" with the incomprehensible power of the goblin ‘mae.’ It was remarkably problematic, and overall, it seems like a masterpiece that needs to be slowly savored during the contemplative time ahead.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-nk9uv2266"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance Magazine MOMM</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>,&nbsp; November Issue, 2021, Namsoo Kim (</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>the flowing.&nbsp;</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-mhpxt115"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“장혜진 안무의 이번 공연은 직접적인 신경의 떨림 위에서 관람객들 자신의 존재가 스스로 등불을 켜고 그 어두운 공명 속에서 함께 파열하는/파열시키는 장을 열었다고 할까... 도깨비 ’매‘의 불가해한 힘으로 ’무대란 무엇인가‘라는 질문을 스스로 개방하면서 여성적 신체의 유동하는 내부 혹은 ’사잇공간‘의 고백을 겨우 혹은 간신히, 그러나 가장 강렬하게 토해내는 안무는 굉장히 문제적이었고, 전체적으로 지금부터 사유의 묵히는 시간 동안에 천천히 음미해 봐야 할 걸작이 아닌가 한다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-62hyt118"><span class="ATqq4"><span style="font-size:14px"><span>2021년 『월간잡지 몸』 11월호, 김남수 안무비평가, &lt;흐르는. &gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-t2fa5129"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1hxqF3GjCEr9U5vrGNcJIE2R1sV01LaQW/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크</span></u></span></a><span style="color:#7A8286;text-decoration:inherit"><u style="text-decoration:underline"><span> </span></u></span><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to </span></u></span></a><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>article</span></u></span></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2021년-조형빈-평론가-흐르는': {
    title: 'Hyungbin Jo (Critic), 2021, the flowing. / <흐르는. > , 2021년, 조형빈 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;"><흐르는. > , 2021년, 조형빈 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-rkq92191"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“The performance was a declaration of vulnerability and posed questions about the connection and mediation of breath, (voice) sound, and life. The process by which the body, as something that captures the breath and life, comes out and becomes audible and visible, has become a vivid awakening of its presence among the audience as a performance. Gradual weakening practice (of weekly weakly) was to seek a way for life, in its most fragile form, to establish relationships with the body and the world. Through the tangible presence of flesh, this meticulous performance revealed where the ‘strong’ mediator, from which breath cannot escape, was located.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-3n8ss3788"><span class="ATqq4"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Hyungbin Jo (</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic), 2021, </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>the flowing.&nbsp;</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-6hnpe183"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“..퍼포먼스는 연약함의 선언, 숨과 (목)소리 그리고 생명의 연결과 매개에 대한 질문을 던졌다. 숨과 생명을 붙잡는 것으로서의 육체와 그것이 뿜어져 나와 청각화/시각화되는 과정은, 퍼포먼스로서 관객에게 그 존재감을 생생히 일깨우는 하나의 과정이 된 것이다. 점점 연약해지는(weekly weakly) 프랙티스의 과정은 생명과 연결되어 가장 연약한 것으로서의 생명이 몸 그리고 세계와 관계맺는 방식을 찾고자 했고, 살덩이의 존재감을 통해 숨이 벗어던질 수 없는 ‘강한' 매개가 어디에 놓여져 있는지를 보여준 치밀한 퍼포먼스가 되었다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-3hqy3186"><span class="ATqq4"><span style="font-size:14px"><span>2021년, 조형빈 평론가, &lt;흐르는. &gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-7w0xp205"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크</span></u></span></a><a target="_blank" href="https://drive.google.com/file/d/1l4tu4Ab_BEPW4Fx1aXAoPXmXbtoEdO0n/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>&nbsp;Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2021년-『춤과-사람들』-이봉헌-기자-대체된-침묵': {
    title: 'Dance and People, 2020, silence replaced: , Bongheon Lee (Journalist) / 『춤과 사람들』, <대체된 침묵: >, 2021년, 이봉헌 기자 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">『춤과 사람들』, <대체된 침묵: >, 2021년, 이봉헌 기자</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-t0j1u269"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"</span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>silence replaced: </span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>is not a work where the concept is prominently displayed. To me, it was perceived as a choreographer’s humble reflection on questions such as, ‘What are we trying to do with the female body and its position, as seen in the subtle aspects integrated into our daily lives?’ or ‘Why engage in risky performances?’ ... It is believed that such authenticity can eventually create a resonance in the heart."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-qhzvh3902"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance and People</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, 2020, Bongheon Lee (Journalist</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>silence replaced:</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-7m1fn258"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“</span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>silence replaced: </span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>는 개념이 전면에 드러나 있는 작품은 아니다. 우리 생활 저변에 녹여져 있는 모습에서 여성의 몸, 몸의 위치, 무엇을 하려고 하는가? 왜 위험한 수행을 하는가? 를 찾는 안무자의 작은 고찰처럼 기자에게 인식되었다… 그런 진정성이 결국 가슴의 울림을 만들어 낼 수 있다고 믿어진다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-okipz263"><span class="ATqq4"><span style="font-size:14px"><span>2021년 『춤과 사람들』, 이봉헌 기자, &lt;대체된 침묵: &gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-6avx6275"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1CGZu1aCoCoA7iV2xI6dHrr4RtIxTALko/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="https://drive.google.com/file/d/1CGZu1aCoCoA7iV2xI6dHrr4RtIxTALko/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2020년-『뉴욕일보』-정은실-기자-위클리-위-클리': {
    title: 'The New York Ilbo, Weekly Weakly, 2020, Eunsil Jung (Journalist) /『뉴욕일보』, <위클리 위-클리>, 2020년, 정은실 기자 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">『뉴욕일보』, <위클리 위-클리>, 2020년, 정은실 기자</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-gzhqy360"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"Invited by Movement Research in the United States, He Jin Jang's choreographic work, </span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Weekly Weakly,</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;was performed with great acclaim at Judson Church. This performance, centered around the themes of the last wishes and revival of life, was well-received for creating her distinctive 'peculiar atmosphere,' receiving a warm welcome from the experimental dance scene in New York."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-0yz234318"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>The New York Ilbo</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, 2020, Eunsil Jung (Journalist</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>), </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Weekly Weakly</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-hhcho349"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“미국 무브먼트 리서치(Movement Research)의 초청을 받은 장혜진 씨의 안무작 ‘Weekly Weakly 위클리 위-클리’가 저드슨처치(Judson Church)에서 절찬리에 공연됐다. 유언과 되살아나는 생명을 주제로 한 이번 ‘위클리 위-클리’ 공연은 장혜진 안무가 특유의 ‘기이한 공기’를 끌어냈다는 호응을 얻으며, 뉴욕 실험무용계의 환영을 받았다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-c0azm352"><span class="ATqq4"><span style="font-size:14px"><span>2020년 『뉴욕일보』, 정은실 기자, &lt;위클리 위-클리&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-t8wdg382"><span class="ATqq4"><a target="_blank" href="http://www.newyorkilbo.com/40361" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="http://www.newyorkilbo.com/40361" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(122, 130, 134);background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2018년-현지예-드라마터그-미소서식지-몸': {
    title: 'Microhabitat Body, 2018, Ziyea Hyun (Dramaturgy), / <미소서식지 몸>, 2018년, 현지예 드라마터그 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;"><미소서식지 몸>, 2018년, 현지예 드라마터그</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-sb0il442"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"</span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Microhabitat Body</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;was a work in which each participant accumulated, amplified, and shared imagination perceptive cognition through the act of 'seeing,' represented as a perceptive action. It was an exercise in reviving and living through the things perceived, through the re-perception of the micro 'somethings' that are formed in the moment of perception, as well as through the chains and overlaps of perception and their exchange. The choreographer describes this act of surviving and living out as 'inhabiting.'"</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-hv2dm4592"><span class="ATqq4"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Ziyea Hyun&nbsp;(Dramaturgy</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>), 2018, </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Microhabitat Body</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-w6ymx434"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“&lt;미소서식지 몸&gt;은 참여자 각각이 ‘봄 seeing’으로 대표되는 지각 행위를 통해 지각상知覺想을 축적하고 증폭하며 공유하는 작업이었다. 지각하는 순간 구성되는 미소微少한 ‘무언가’를 다시 지각하고 또다시 지각하는, 지각의 연쇄와 중첩, 그리고 교환을 통해 지각한 것들을 살려내고 살아내는 연습이었다. 그 살아남과 살아냄을 안무가는 ‘서식한다’고 표현한다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-m7ui1437"><span class="ATqq4"><span style="font-size:14px"><span>2018년, 현지예 드라마터그, &lt;미소서식지 몸&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-0tbec448"><span class="ATqq4"><a target="_blank" href="https://drive.google.com/file/d/1HAk_ZWEj2hPh0_GvkDgaAoZYsr7D1vLK/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="https://drive.google.com/file/d/1HAk_ZWEj2hPh0_GvkDgaAoZYsr7D1vLK/view" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2016년-『춤웹진』-방희망-평론가-이주하는-자아-문의-속도': {
    title: 'Dance Webzine, migrant-self the speed of a door, 2016, Heemang Bang (Critic) / 2016년『춤웹진』, <이주하는 자아, 문의 속도> , 방희망 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2016년『춤웹진』, <이주하는 자아, 문의 속도> , 방희망 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-1szay528"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“In this work, which explores the discrepancy between objective and subjective time, it seems appropriate to include even the actions and moments before the beginning of the performance as part of the work. Along with the symbolism of a half-open door—entering or leaving, merely an ambiguous choice for those who aren't quite ready yet—an improvisational yet focused performance showcased the psychological distance between the anticipation of change and the desire to remain inert.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-73uig4767"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance Webzine</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, 2016, Heemang Bang (</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic)</span></span></span><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>migrant-self the speed of a door</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-3pbam517"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“객관적 시간과 주관적 시간의 불일치, 그 간극을 탐구하는 이 작품에서는 공연 시작 전의 그 행위와 시간들까지도 작품의 일부로 포함시켜야 맞을 것 같다. 반쯤 열린 문이 갖는 상징성- 들어가거나 혹은 나가거나, 미처 마음의 준비가 되지 않은 사람에게 그것은 애매한 선택지에 불과하다-과 함께 즉흥적 요소가 강하면서도 집중력 있는 퍼포먼스는, 변화에 대한 기다림과 안주하고픈 관성 사이 심리적 거리를 보여주었다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-g7quk520"><span class="ATqq4"><span style="font-size:14px"><span>2016년 『춤웹진』, 방희망 평론가, &lt;이주하는 자아, 문의 속도&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-ku97m540"><span class="ATqq4"><a target="_blank" href="http://www.koreadance.kr/board/board_view.php?view_id=274&amp;board_name=review&amp;page=63" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="http://www.koreadance.kr/board/board_view.php?view_id=274&amp;board_name=review&amp;page=63" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2015년-『춤웹진』-이윤숙-이주하는-자아-문의-속도': {
    title: 'Dance Webzine, migrant-self the speed of a door, 2015, Yoonsook Lee / 2015년 『춤웹진』, <이주하는 자아 문의 속도> , 이윤숙 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2015년 『춤웹진』, <이주하는 자아 문의 속도> , 이윤숙</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-yjqag619"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>"He Jin Jang's migrant-self the speed&nbsp; of a door</span></span><em style="font-style:italic"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Speed of Migrating Self-Inquiry</span></span></em><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;depicts the turmoil of the self within the gap between physical time and cognitive time, showcasing her unique choreographic style with a distinctive mise-en-scène and choreography that blends words and body movements."</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-ershx4968"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Dance Webzine</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, 2015, Yoonsook Lee, </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>migrant-self the speed of a door</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-98zob609"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“장혜진의 &lt;이주하는 자아 문의 속도&gt;는 물리적 시간과 인식의 시간 간극 안의 자아의 혼란을 그린 작품으로 독특한 미장셴, 말과 몸을 섞은 안무 등 장혜진만의 독특한 안무 스타일을 보여주었다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-u1dnw612"><span class="ATqq4"><span style="font-size:14px"><span>2015년 『춤웹진』, 이윤숙 &lt;이주하는 자아 문의 속도&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-yfp7b624"><span class="ATqq4"><a target="_blank" href="http://koreadance.kr/board/board_view.php?view_id=30&amp;board_name=memory&amp;page=7" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크 </span></u></span></a><a target="_blank" href="http://koreadance.kr/board/board_view.php?view_id=30&amp;board_name=memory&amp;page=7" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2015년-『new-york-live-arts-context-notes』-제스-발바갈로-평론가-이주하는-자아-문의-속도': {
    title: 'NEW YORK LIVE ARTS CONTEXT NOTES, migrant-self the speed of a door, 2015, 제스 바바갈로 (Critic) / 2015년 『New York Live Arts Context Notes』, <이주하는 자아 문의 속도>, 제스 발바갈로 평론가 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2015년 『New York Live Arts Context Notes』, <이주하는 자아 문의 속도>, 제스 발바갈로 평론가</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-sp5i3699"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“I might use the word elemental. He Jin Jang’s floor-centric compositions lead her back to the ground again and again, and through time. I watch work from her graduate days at Hollins University. Titles read like gentle philosophical treatises that also read like poems: Of the presence of “us-ness” (nowhere to hide), A practice of being together, Practice of Cost-effectiveness, Ethical Goodbyes (unread) … Fast forward to 2012, back on the blond floor at Judson, Jang shows an excerpt of a then work-in-progress for migrant-self the speed of the door. Fascinated spirals lead her from contemplative knee pose to her back and that return sticks with me. In this first exposure, Jang increases my consciousness regarding the air above my head. I wonder about a process of return, fussily considering the passage of time between Jang’s Judson iteration of migrant-self the speed of a door to her Fresh Tracks premiere of the work, both bearing the same title. I am moved by the model she teaches me, gently reconfiguring my understanding of time. Or the purism of practice-as-performance: “This piece is a “diagnostic piece” of which structure and contents shift as time passes by and I age. The version in 2012 will be different from the version 2015 and will be different when I perform this piece when I am 60-years-old (which I am planning on.)”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-moknk6813"><span class="ATqq4"><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>NEW YORK LIVE ARTS CONTEXT NOTES</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, 2015, 제스 바바갈로 (</span></span></span><span style="font-size:14px"><span style="color:rgb(32, 33, 34);background-color:rgb(255, 255, 255);text-decoration:inherit"><span>Critic)</span></span></span><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>migrant-self the speed of a door</span></span></span></em></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-p4qks685"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“그녀의 춤은 완전히 다르다. 이를 표현하기 위해서는 ‘엘리멘털(4대 원소적인)’이라는 단어를 사용할 수도 있겠다… 그녀 작품의 제목들 시 혹은 온화한 철학적 논문처럼 읽히기도 한다… 매혹적인 나선의 움직임은 무릎 꿇은 자세에서부터 등으로 누운 자세 그리고 다시 일어서는 자세로 그녀를 명상적으로 이끌고, 나는 이에 매료되었다. 이번 공연에서 그녀는 머리 너머 그 위의 세계, 어떤 천상의 세계의 기류에 대한 의식을 높였다. 나는 그녀가 가르쳐 준 작업의 모델에 감동을 받아 시간(노화)에 대해 보다 부드럽게 이해하게 되었다. 그녀는 수행으로서의 실천 순수주의를 추구한다. 그녀에게 이 작품은 시간이 지남에 따라, 노화에 따라 구조와 내용이 변화하는 ‘진단적 작품’이다. 2012년 버전은 2015년 버전과 다르며, 그녀가 60세 때 이 작품을 공연한다면 당연히 또 달라져 있을 것이다.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-lhyep692"><span class="ATqq4"><span style="font-size:14px"><span>2015년 『New York Live Arts Context Notes』, 제스 발바갈로 평론가, &lt;이주하는 자아 문의 속도&gt;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-9h94e702"><span class="ATqq4"><a target="_blank" href="https://newyorklivearts.org/blog/context-notes-fresh-tracks-3/" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크</span></u></span></a><a target="_blank" href="https://newyorklivearts.org/blog/context-notes-fresh-tracks-3/" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>&nbsp;Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/2008년-미국-『indy-week』-바이론-우즈-평론가': {
    title: 'U.S Indy week, July 2008, Byron Woods (Critic) / 2008년 미국 『Indy Week』, 바이론 우즈 평론가 / | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">2008년 미국 『Indy Week』, 바이론 우즈 평론가 /</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-rnoeh775"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“...before HeJin Jang humbled us all at the conclusion of open skin inscribed by kneeling and scrubbing the cement floor with xeroxed photography of the surface of her skin. The moment silenced the crowd before, one by one, they joined in this moving homage to the very hard work of those who have come before. What a way to end a season.”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-x2ckk7075"><span class="ATqq4"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>U.S </span></span></span><em style="font-style:italic"><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Indy week</span></span></span></em><span style="font-size:14px"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>, July 2008, Byron Woods (Critic)</span></span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-jwsvv1584"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>“&lt;열린 피부에 적힌&gt;의 마지막 장면에서, 장혜진은 무릎을 꿇은 채 자기 피부가 찍힌 흑백 사진을 시멘트 바닥에 문질렀고 순간 우리는 모두 겸허해졌다. 고요해진 관객은 앞서간 이들의 노고에 감사를 표하는 이 감동적인 헌사에 하나둘씩 동참했다. 시즌 폐막작으로 이만큼 적합할 수는 없다.</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-mmcou768"><span class="ATqq4"><span style="font-size:14px"><span>2008년 미국 『Indy Week』, 바이론 우즈 평론가</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-crpg8778"><span class="ATqq4"><a target="_blank" href="https://indyweek.com/culture/art/best-worst-american-dance-festival-2008/" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>글 전문 링크</span></u></span></a><a target="_blank" href="https://indyweek.com/culture/art/best-worst-american-dance-festival-2008/" rel="noopener noreferrer" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:#7A8286;background-color:var(--ricos-custom-p-background-color,unset);text-decoration:inherit"><u style="text-decoration:underline"><span>&nbsp;Link to article</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  },
  '/post/인터뷰-모음': {
    title: 'Interview / 인터뷰 모음 | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">인터뷰 모음</h1>
        <div class="about-section">
          <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-moxg6847"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2020년 6월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>춤in</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;코로나와 무용수업: 방법에의 도전 w/김재리, 김옥희, 장혜진, 조주현</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-dbrep853"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;</span></span><a target="_blank" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=IN&amp;zom_idx=548&amp;div=" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=IN&amp;zom_idx=548&amp;div=</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-xh488856"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>English Translation: </span></span><a target="_blank" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=EN&amp;div=&amp;zom_idx=596&amp;page=3&amp;field=&amp;keyword=" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=EN&amp;div=&amp;zom_idx=596&amp;page=3&amp;field=&amp;keyword=</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-924lc860"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2020년 4월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>춤과 사람들</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;장혜진 “연약함에서 발견되는 에너지를 춤으로”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-63148866"><span class="ATqq4"><a target="_blank" href="https://shorturl.at/dlJNX" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>https://shorturl.at/dlJNX</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-3t8mk868"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>(지면 스캔본, 다시 수평맞춰 스캔해서 업로드할 예정)</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-9x4ga871"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2020년 3월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>몿진</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』 </span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>인터뷰: 장혜진 안무가 “우리는 이미 춤의 힘을 알고 있다 – 신체 주권과 신체 공감”</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-3ltzl877"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>&nbsp;</span></span><a target="_blank" href="http://mottzine.com/hejin-jang-interview-mottzine/" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://mottzine.com/hejin-jang-interview-mottzine/</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-yr3sq881"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2017년 12월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>프롬에이</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』 </span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>Interview: 장혜진 안무가</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-t5sxc887"><span class="ATqq4"><a target="_blank" href="https://froma.co/interview-%ec%95%88%eb%ac%b4%ea%b0%80-%ec%9e%a5%ed%98%9c%ec%a7%84/" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>https://froma.co/interview-%ec%95%88%eb%ac%b4%ea%b0%80-%ec%9e%a5%ed%98%9c%ec%a7%84/</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-lq7h7890"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2017년 12월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>춤인</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』 </span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2개의 보기: 어술리 이글리와 장혜진</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-eg2ic896"><span class="ATqq4"><a target="_blank" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=OUT&amp;div=&amp;zom_idx=295&amp;page=26&amp;field=&amp;keyword=" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=OUT&amp;div=&amp;zom_idx=295&amp;page=26&amp;field=&amp;keyword=</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-nudtf899"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2016년 5월 </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>뉴스엔</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』 </span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>‘모다페' 재미안무가 장혜진의 ‘이주하는 삶' (인터뷰)&nbsp;</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-k3h1y905"><span class="ATqq4"><a target="_blank" href="https://www.newsen.com/news_view.php?uid=201605201142030210" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>https://www.newsen.com/news_view.php?uid=201605201142030210</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-65ly7908"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2016년 3월&nbsp; </span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>『</span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>뉴욕일보</span></span><span style="color:rgb(68, 68, 68);background-color:rgb(243, 243, 243);text-decoration:inherit"><span>』 </span></span><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>스승과 제자에서 함께하는 교육자로: 미 무용계 거장 도나페이 버치필드 교수, 장혜진 교수 단독 인터뷰</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-rot6e914"><span class="ATqq4"><a target="_blank" href="http://www.newyorkilbo.com/36151" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://www.newyorkilbo.com/36151</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-n3tr1918"><span class="ATqq4"><strong style="font-weight:700"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>*기획/워크숍 관련 기사</span></span></strong></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-vj6up563"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2021년 7월 브릭 브리크 플랫폼 코큐레이션 관련 리뷰</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-uaict922"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>: 『연극in』 담론을 제기하는 은유의 공간으로서의 신체 읽기</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-hbh0g924"><span class="ATqq4"><a target="_blank" href="https://www.sfac.or.kr/theater/WZ020600/webzine_view.do?wtIdx=12475" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>https://www.sfac.or.kr/theater/WZ020600/webzine_view.do?wtIdx=12475</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-e3qk8505"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2022년 5월 브릭 브리크 플랫폼 코큐레이션 관련 리뷰</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-uhzsg928"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>: 『춤in』 사이 공간을 트기 위한 실험들</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-sb7ga930"><span class="ATqq4"><a target="_blank" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=VW&amp;div=&amp;zom_idx=773&amp;page=3&amp;field=&amp;keyword=" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=VW&amp;div=&amp;zom_idx=773&amp;page=3&amp;field=&amp;keyword=</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-th2lz933"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2021년 9월 브릭 브리크 플랫폼 코큐레이션과 실패하기 워크숍 관련 리뷰</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-0z3zf935"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>: 『춤in』 &lt;언씽킹 씨어터#2: 실패하기 워크숍&gt; 리뷰</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-scrms937"><span class="ATqq4"><a target="_blank" href="http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=VW&amp;div=&amp;zom_idx=710&amp;page=5&amp;field=&amp;keyword=" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>http://choomin.sfac.or.kr/zoom/zoom_view.asp?type=VW&amp;div=&amp;zom_idx=710&amp;page=5&amp;field=&amp;keyword=</span></u></span></a></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-l9ly3940"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>2020년 9월 &lt;저드슨 드라마&gt; 협업 프로젝트 관련 기사</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-7dxtg942"><span class="ATqq4"><span style="color:rgb(0, 0, 0);background-color:transparent;text-decoration:inherit"><span>: 『동아일보』 비대면 시대 新공연문화 탄생… 모바일로 ‘숨은 공연장’ 찾아보세요</span></span></span></p>
                  <p class="-Q4aO hw1z8 DcaPr o-zp-" dir="auto" id="viewer-hgzde944"><span class="ATqq4"><a target="_blank" href="https://www.donga.com/news/Culture/article/all/20200923/103060340/1" rel="noopener" class="dtqu- Cnx4-" data-hook="web-link"><span style="color:rgb(17, 85, 204);background-color:transparent;text-decoration:inherit"><u style="text-decoration:underline"><span>https://www.donga.com/news/Culture/article/all/20200923/103060340/1</span></u></span></a></span></p>
          
          <div class="recent-posts-widget" style="margin-top: 80px; padding-top: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: bold;">최근 게시물</h2>
              <a href="/press-review" data-link style="font-size: 14px; color: #111;">전체 보기</a>
            </div>
            <div style="display: flex; gap: 20px;">

              <a href="/post/2023년-유화정-평론가-투명인간이-되든-춤을-추든" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“He Jin Jang has consistently expressed her interest in spaces where dance occurs and the social role of artists. What is woven together...</p>
                </div>
              </a>

              <a href="/post/복제-2023년-『춤웹진』-2월호-한석진-무용학자-당신이-그런-것을-입게-될-줄-알았어-dance-webzine-february-lssue-2023-sukjin" data-link style="text-decoration: none; color: inherit; flex: 1; display: block;">
                <div style="border: 1px solid #e5c9df; padding: 24px; display: flex; flex-direction: column; background-color: #fff; height: 100%; box-sizing: border-box;">
                  <h3 style="font-size: 15px; font-weight: bold; margin-bottom: 16px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; color: #000;">2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h3>
                  <p style="font-size: 14px; line-height: 1.6; color: #333; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">“In the work, the performer's narrative operates not only on a semantic level but also on a material level, allowing some audience...</p>
                </div>
              </a>

            </div>
          </div>

        </div>
      </div>
    `
  }
,
  '/available-2011': {
    title: 'Available (2011) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
    </div>
    `
  },
  '/book-publication': {
    title: 'Book Publication | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_ec21a97b53644aab993500bc888e461c_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_039b2cb675bd48a6a43dbeff14d99422_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_94e7c700cfe04abe909235c30a2007dc_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="letter-spacing:-0.02em;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Open and Write the Flatten Choreography - I want you to read these last words out loud (2022)</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><br class="wixui-rich-text__text">
        <span style="letter-spacing:-0.02em;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Choreography as performative writing. The book juxtaposes the 'score' of a performance with the 'last words' left behind before disappearing. Readers can access the choreography by reading these words aloud, thereby summoning forgotten voices into the space. Published by invitation as part of the project "Open and Write the Flatten Choreography" by Gidaran Publishing House.<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        Publication: Gidaran</span></span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_39 wixui-rich-text__text"><a href="https://www.aladin.co.kr/m/mproduct.aspx?ItemId=310346612&amp;srsltid=AfmBOoonxAnxO0XptvZHa6e00_l3ci56eHsxkzQgO1QrB-w16FV9ZHas" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">Purchase link</span></span></span></a></span></p>
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;" class="wixui-rich-text__text">『납작한 안무를 열어 쓰기』 - 나는 당신이 이 유언을 소리 내어 읽어주었으면 해요 (2022)</span></span><span class="wixui-rich-text__text">​</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">글과 안무. 공연예술의 ‘스코어’와 소멸되기 전에 남겨지는 ‘유언’을 병치시킨 수행적 글쓰기로서의 안무. 독자는 소리 내어 유언을 읽으며 안</span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">무에 접속하게 되고, 잊혀진 목소리를 공간에 소환한다. 기다란 출판사의 『납작한 안무를 열어 쓰기』라는 기획의 초대로 출판</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">출판: 기다란</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_39 wixui-rich-text__text"><a href="https://www.aladin.co.kr/m/mproduct.aspx?ItemId=310346612&amp;srsltid=AfmBOoonxAnxO0XptvZHa6e00_l3ci56eHsxkzQgO1QrB-w16FV9ZHas" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">구매링크</span></span></span></a></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="color:#0080FF;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="color:#0080FF;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span></span></span></p>
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_d8c70ece8a17426996518bd6d273e8e9_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_b75d8a94f0fd4cd09e36a79128ba28fc_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4fd249395f4c4e40aa20d6f36c89a711_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;" class="wixui-rich-text__text"><span style="letter-spacing:-0.02em;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Microhabitat Body Tool Box</span> (2019)</span></span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">The Microhabitat Body Tool Box is an assemblage of tools for choreography and its survival. One year after the performance of Microhabitat Body, the choreographer re-located tools that had been explored in the creation of the work. It serves as a structure that transcribes the performances of "observing and commenting on each other as choreography." The book is composed of layered annotations upon annotations, allowing readers to add their own comments on pages that resemble a stage. By publishing this book, the choreographer questions whether revisiting the event of choreography could also be the microhabitat (the minimum condition) for choreography. Here, publishing becomes an act of choreography itself. ItAnd it seeks to find ways for collective survival alongside the immaterial tools of choreography.<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        Publication: He Jin Jang Dance</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><br class="wixui-rich-text__text">
        <span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><a href="https://drive.google.com/file/d/0B2QlZx3_OBXpay16dkJsc0Nfb0hCWUlKamxZV1E2U2owMUpN/view?usp=sharing&amp;resourcekey=0-WGZwQ3VJOS7nSa4D6x9PMw" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">Link to English Summary</span></a></span></span></span></p>
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_1f307ac8494347558b0b9bc87c9e05cf,wf_1f307ac8494347558b0b9bc87,orig_noto_sans_kr_medium;" class="wixui-rich-text__text"><span style="letter-spacing:-0.02em;" class="wixui-rich-text__text">『미소서식지 몸 툴 박스』 (2019)</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">책으로 실험한 . 안무와 안무의 생존을 위한 도구들의 집합체이다. 공연이 발생하고 1년 후 작품 제작 과정에서 탐구했던 도구들을 재위치 시킨다. ‘관찰하여 서로에게 각주달기’를 수행한 공연에 대한 기록으로, 겹겹히 쌓인 관찰과 각주를 페이지에 옮겨놓아 독자도 각주를 추가할 수 있는 구조이다. 이때 페이지는 스테이지와도 닮았으며, 안무가는 안무의 사건을 되돌아보는 것 또한 안무의 미소서식지, 즉 최소한의 조건이 될 수 있는지 질문한다. 글쓰기는 안무의 행위가 되며, 안무의 비물질적 도구와 함께 공동 생존을 모색한다.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">출판: He Jin Jang Dance</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><a href="https://docs.google.com/forms/d/1HXmztpq8nxEJun-s7eT6aPERPtFEm3u7Rs2ji-h4o5I/edit" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">구매링크</span></a></span></span></span></p>
        
        
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
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7ce8d0c0acae442ca3d12eecbc4432c2_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:13px;" class="wixui-rich-text__text">​</span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Do not lean on door </span>deals with the phenomenon of 'no place' and ‘no voice’ inside transnational female bodies. In imagining altered ways to exit and speak out in the in-between space, the female performers create a fantasy world through repetitive movements.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Concept/Choreography by He Jin jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Creation/Performance by He Jin Jang, Lyndsey Karr</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2011 Movement Research at the Judson Church, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 DUMBO Dance Festival, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Draftworks, American Dance Festival, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Im_flieger, WUK, Austria</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">장소와 목소리를 잃어버린 초국가적 여성의 몸들은 어디에 기대야 할까? 다른 방식으로 목소리를 내며 ‘사이 공간’에 존재하기 위해 그녀들은 반복적인 움직임을 수행하며 포털을 열어낸다</span>.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">퍼포먼스/창작. 장혜진, 린지 카</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2011 Movement Research at Judson Church, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 DUMBO 댄스 페스티벌, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Draftworks, 아메리칸 댄스 페스티벌, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Im_flieger, WUK, 오스트리아</span></span></p>
        
    </div>
    `
  },
  '/drifting-body-2015-17': {
    title: 'Drifting Body (2015-17) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4bb4c14427ea4b8b8f10ff4afe65cf24_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_fc4599b32d274a31b93f470fe2adcf1c_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4182819c1c0347bc9c751ebc7f1256b8_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">In this lecture performance, three Korean artists share their ruptured and empathetic sense of body-life in the era of the refugee crisis. The discourse among choreographer He Jin Jang, media artist Jiwon Kim, and dramaturg Ziyea Hyun morphs into a lecture performance as they realize this (dis)organizing act of trying-to-have-difficult-conversation resembles a choreographic process. There are three creative methods they integrate to manifest and facilitate this private conversations into the choreographic: 1) Find choreographic devices that can capture the non-linear thinking and feeling process, 2) Finding a structure of writing/archiving that can mirror the complexity of the discourse, 3) Welcoming any spontaneous embodied reactions to each other. They call this act as a choreographic questioning of the refugee body. As they share and articulate kinesthetic thoughts and empathy, they encounter the eventfulness of how they find choreography in social crises. How &nbsp;are the concepts of body without citizenship, body as mass, and missing body felt here?</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Creation/Direction by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Co-creation/Media Art by Jeewon Kim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Dramaturgy by Ziyea Hyun</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Korea Arts and Management Service, University of the Arts, Invited by ARKO Transdisciplinary Ocean Art Lab</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 Arts Council Korea Transdisciplinary Ocean Art Lab @ Artist’s House, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 Dance and Science Conference, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 Museum of Art, Seoul National University, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 World Dance Alliance Asia Pacific, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2017 Knowing Dance More, UArts, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">난민 사태로 발생한 몸-생명 의미의 굴곡, 이에 관한 표류하는 생각과 대화가 렉처 퍼포먼스로 발화된다. 코레오그래피가 어떻게 사회적 사건에서 발견되는 지에서부터 대화가 시작되며, 난민사태라는 재난의 상황이 한국인 안무가 장혜진과 미디어 아티스트 김지원, 그리고 드라마터그 현지예에게 왜 ‘참 하기 어려운 이야기'인지 토로하게 된다. 이 어려운 과정은 안무적 과정과도 유사하게 박동하는 생각들의 발화로 이어지며, 1. 비선형적 사고를 캡처할 안무적 장치의 발견, 2. 담론의 복잡성을 반영할 글쓰기 도구의 출연, 3. 서로의 실천과 연구에 언제든 체화적으로 반응하기 등의 규칙을 통해 신체적 공감에 도래한다. 시민권이 없는 몸, 사라진 몸, 무게로서의 몸 등에 어렵게 공감하는 동안 이들의 몸도 표류하게 될까?</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">창작/연출/글. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">공동창작/미디어아트/글. 장혜진, 김지원</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">드라마투르기. 현지예</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 한국문화예술위원회, 문화체육관광부, 예술경영지원센터, 미국 University of the Arts</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 아르코 융복합 해양예술 랩, 예술가의 집, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 무용과학회, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 서울대학교 미술관, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 세계무용총회, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2017 Knowing Dance More, University of the Arts, 미국</span></span></p>
        
        
        
    </div>
    `
  },
  '/entanglement-residency-2020': {
    title: 'Entanglement Residency (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Entanglement Residency</span></span></span><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text">&nbsp;(2020)<br class="wixui-rich-text__text">
        얽힘 레지던시 (2020)</span><br class="wixui-rich-text__text">
        <span style="font-size:20px;" class="wixui-rich-text__text">with Tangerine Collective</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_f32187e58d7b44d3a7f1bebc6689a851_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">There are forces and connections that operate even within distance. The phenomenon of the force is called “quantum entanglement,” a physics theory that unfolds on the premise that two separate entities were originally one, allowing simultaneous communication even in the absence of direct contact. What does a project that explores the movement of entanglement in and out of distance look like? Can a virtual residency that utilizes telepathic, non-face-to-face sensations create a kind of sense of companionship? This project, exploring these questions, is also an experiment on 'curation,' bringing artists together to generate common social and artistic meaning.<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        Choreographer He Jin Jang, Choreographer Jee-Ae Lim, and Dramaturg Jaelee Kim tried to communicate with domestic and foreign artists through email from June 19 to August 1, 2020 and ‘"lived together in a tangled way.’" They developed a total of 26 scores to connect with 26 artists from all over the world. Artists invited by email were then able to participate in the process of accompaniment in a virtual space, being BCC-ed in emails sent to other artists. It was to create a "snow-ball effect." This page is a space of 'open reference. We’ve created this space to share scores and excerpted letters with a wider audience. You can also use the scores here to entangle someone from a distance.</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text">​​​​​​​​​​​​​​​​​​​​​​</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">Curation and Creation by Collective Tangerine(He Jin Jang, Jaelee Kim, Jee-ae Lim)<br class="wixui-rich-text__text">
        Graphic Design by Dongkyu Kim<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        Supported by Seoul Foundation for Arts and Culture, Seoul Metropolitan City</span></span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><a href="https://www.instagram.com/collective_tangerine" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:13px;" class="wixui-rich-text__text">Link to Score Archive</span></span></span></a></p>
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_32049a24a48743a4b26188b7004ff077_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">거리두기 안에서도 작동하는 힘과 연결성이 있다. </span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">그 힘의 현상은 “양자얽힘” 혹은 “인탱글먼트</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Entanglement”라 불린다. 이는 떨어져 있는 두 개가 본래 하나였다는 전제에서 전개되는 물리학 이론으로 접촉이 없는 상태에서도 동시적인 교감이 가능하다. 거리두기와 잠시멈춤 안팎에서 작용하는 얽힘의 운동성을 예술적 실천으로 실험하는 프로젝트는 어떤 모습일까? 텔레파틱 비대면 기술감각을 활용한 가상의 레지던시는 일종의 동행의 감각을 만들어 낼 수 있을까? 위와 같은 질문들을 탐험하는 이 프로젝트는 예술가들을 한데 모으고 공동의 사회적, 예술적 의미를 발생시키는 큐레이션에 관한 실험이기도 하다. 장혜진 안무가, 임지애 안무가 그리고 김재리 드라마터그 세 명의 작업자들은 6월 19일부터 8월 1일까지 이메일을 통해 국내외 예술가들과 교감을 시도하며 매일을 “얽힘적으로 함께 살았다.” 그들은 26명의 전 세계 각지에 떨어져 있는 예술인들과 연결되기 위해서 총 26개의 스코어를 개발했다. 이메일로 초청된 예술가들은 그다음 예술가들에게 보내는 이메일에 숨은참조(Bcc)가 되면서 가상의 공간에서 동행의 과정에 함께 참여할 수 있었다. 이 페이지는 텍스트, 그림, 영상, 사진 등으로서의 스코어와 발췌된 편지들을 더 많은 사람들과 공유하기 위해 만든 '열린참조'의 공간이다. 당신도 멀리 있는 그 누군가와의 얽힘을 위해 여기의 스코어들을 활용해 볼 수 있을 것이다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><a href="https://www.instagram.com/collective_tangerine" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:13px;" class="wixui-rich-text__text">스코어 아카이브 링크</span></span></span></a></p>
        
        
        
        
    </div>
    `
  },
  '/exhibition-weekly-weakly-2020': {
    title: 'Weekly Weakly: Exhibition (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_2d1d7645b1934ebb8f2540662253c35d_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_efd55d5cca0f4f97a2e0b5c94b9fa126_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_81ffbccc1ddc47418715ab04953e7612_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">What if weakness were not a limitation, but a choreographic condition? Weekly Weakly is a weekly laboratory for choreography and feminist thinking, where precarity, softness, slowness, and hesitation are practiced not as failure, but as form. For its 23rd iteration, this shared practice entered a gallery space—not as documentation, but as practice-as-exhibition.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Over three days, the exhibition unfolded as a porous installation of process and pause. Fragments of choreography, traces of philosophical musing, and quiet scores filled the space — not to be passively viewed, but to be sensed, inhabited, and refigured in relation. Like its performance counterpart, the work invites attention toward the minor, the unfinished, and the relational. How can feminist weakness be curated without being framed? How might an exhibition hold a practice that resists display?</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Curated by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Activated by He Jin Jang, Hyeongbin Cho, Myoung Gyu Song, Yunkyung Hur, Ziyea Hyun</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Graphic Design by Dongkyu Kim</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">​Organized by He Jin Jang Dance</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, ONSU GONG-GAN</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue: ONSU GONG-GAN, Korea​​​​​</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">연약함이 한계가 아니라 안무의 조건이라면 어떨까?《위클리 위-클리》는 매주 진행된 안무 및 여성주의 사고의 실험실로, 불안정함과 부드러움, 느림과 머뭇거림을 실패가 아닌 하나의 ‘형태’로 연습하는 장이다. 그 23번째 실천이 이번에는 전시의 형식—실천으로서의 전시(practice-as-exhibition)로 공간에 들어섰다. 3일간 열린 이번 전시에서는 연약함에 관한 스코어 수행이 공간 곳곳에서 펼쳐졌고, ‘과정’과 ‘멈춤’이 교차하는 다공적 설치로 구성되었다. 안무의 파편, 철학적 사유의 흔적, 그리고 스코어들이 전시장을 채웠고, 이는 수동적으로 감상되는 대상이 아닌, 몸으로 감지하고 머무는 공간이 되었다. 이 작업은 작고 미완성된 것들, 관계 속에서 생겨나는 감각들에 주의를 기울이도록 초대한다. 여성주의적 연약함을 틀에 가두지 않고 어떻게 큐레이팅할 수 있을까? 보여주기를 거부하는 실천을 전시는 어떻게 품을 수 있을까?</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">기획. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">스코어 수행. 장혜진, 조형빈, 송명규, 허윤경, 현지예</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">그래픽 디자인. 김동규</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">주최/주관. He Jin Jang Dance​</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴. 온수공간, 한국​​​</p>
        
    </div>
    `
  },
  '/franklin-method-workshop-session': {
    title: 'Franklin Method Workshop & 1:1 Session | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text">Franklin Method® Workshop &amp; 1:1 Session<br class="wixui-rich-text__text">
        프랭클린 메소드® 워크숍 &amp; 1:1 세션</span><br class="wixui-rich-text__text">
        &nbsp;</p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_550d963d6e634fbdb605d9b0b01a4f57_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_df6c452a19a54a78a329d5301a3985b2_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​He Jin Jang is certified in the Franklin Method®. The Franklin Method® is a somatic method and modern therapy exercise that integrates imagery, experiential anatomy, touch, self-talk, and movement. Developed by Eric Franklin of Switzerland, it was originally designed to help dancers to activate the body and mind function, and later it has evolved to cater to all disciplines of movement. The Franklin Method® teaches how the body is naturally designed to move, enhancing function, releasing tension, improving balance, coordination and strength, and fostering awareness that can be applied to all aspects of our life.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">The Franklin Method® uses Dynamic Neuro-cognitive Imagery™, anatomical embodiment and educational skills, to create lasting positive changes in our body and mind. One of the greatest discoveries of the 21st century is the plasticity of the brain; that the lives we live shape the brain we develop. At the forefront of applied neuro-plasticity, the Franklin Method® is demonstrating how to harness the power of our brain to enhance our body’s function. Our entire body is part of a symphony of coordinated movement. In a sense, our posture is reinvented at every instant.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Franklin Method® workshops and private sessions aim to help you understand and embody your natural anatomical structure and functions to improve&nbsp; functional and performative abilities. Clients and students experience easeful movement of limbs and joints, reduction of pain and discomfort, increased body awareness, better relationship with gravity, and enhanced flexibility, stability, mobility, breathing, and more. In addition to the physical benefits, many report feeling more calm, relaxed, present, and capable of focusing and thinking more clearly. You can experience the power of proprioception and improve range of motion by learning about the body’s way of perceiving its position in space called the ‘proprioceptive nervous system.’ Both professional dancers and individuals with no previous movement experience can benefit from Franklin Method®.​</span></span></p>
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">장혜진은 프랭클린 메소드® 공인 움직임 교육자이다. 프랭클린 메소드®는 심상, 체험적 해부학, 촉각, 자기 대화, 움직임을 통합하는 소매틱 메소드이자 현대적 치료 운동이다. 스위스의 에릭 프랭클린이 개발한 이 메소드는 원래 무용수들의 신체와 정신 기능을 활성화하기 위해 고안되었으며, 이후 모든 운동 분야에 적용될 수 있도록 발전해 왔다. 프랭클린 메소드®를 통해 신체가 어떻게 움직이도록 설계되었는지를 배우며, 긴장 완화와 기능, 균형, 조정력 및 근력 향상에 도움을 받아 삶의 모든 측면에 적용할 수 있는 신체 인식을 깨울 수 있다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">프랭클린 메소드®는 역동적 신경 인지 심상™이라는 해부학적 체화 및 학습 기술을 사용하여 몸과 마음에 지속적이고 긍정적인 변화를 일으킨다. 21세기의 가장 위대한 발견 중 하나인 ‘뇌 가소성’은 우리가 사는 삶의 패턴이 뇌의 발달 변화를 형성한다는 것에 기반한 이론이다. 프랭클린 메소드®는 실용적 신경 가소성의 최전선에 있으며, 몸의 기능을 개선하기 위해 뇌를 사용하는 방법의 예시를 알려준다. 우리 몸 전체는 조화로운 움직임으로 이루어진 교향곡의 일부이며, 어떤 의미에서 우리의 자세는 매 순간 새롭게 재창조되는 것이다.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">프랭클린 메소드® 1:1 세션과 그룹 워크숍은 자연스러운 해부학적 구조와 기능을 이해하고 구현하여 기능과 수행 능력을 향상하는 데 도움이 되도록 설계된다. 수강자들은 팔다리와 관절의 손쉬운 움직임, 통증과 불편함의 감소, 신체 인식의 향상, 중력과의 관계, 유연성, 안정성, 이동성, 호흡 등의 개선을 경험하게 된다. 이러한 신체적 이점 외에도 대부분의 사람들이 더 차분하고, 편안하며, 현재에 집중하고, 명확하게 생각할 수 있게 되었다고 말하기도 한다. 참여자들은 ‘고유 수용성 신경계’라는 우리 몸이 공간에서 자신의 위치를 파악하는 방법에 대해 배우면서, 고유 수용성의 힘을 경험하고 운동 범위를 향상시킬 수 있다. 전문 무용수나 움직임 경험이 없는 사람 모두 프랭클린 메소드®의 혜택을 누릴 수 있다.</span></span></p>
        
        
    </div>
    `
  },
  '/ghost-shower-2020-21': {
    title: 'Ghost Shower (2020-21) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Ghost Shower </span></span></span><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text">(2021)<br class="wixui-rich-text__text">
        유령기류 (2021)</span><br class="wixui-rich-text__text">
        <span style="font-size:20px;" class="wixui-rich-text__text">with Sleungst and Friends</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_681ce271fdf540d69ac54bcf9894d1cc_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Ghost Shower</span> is a co-created transdisciplinary work involving 4 choreographers and 1 film artist. This GPS-based application allows users to record memories of ‘not being able to take care of someone,’ and these voices travel the world as ghosts with algorithmic choreography. Users can place their voices anywhere in the world using this app, and when other users approach the area, they can listen to the voices of the released memories. They can also watch how the voices move and “dance” like weather patterns on the map via the application.<br class="wixui-rich-text__text">
        ​​​​​​​​​​​​​​​​​​​​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Created and Produced by Sleungst and Friends (He Jin Jang, Bittnarie Shin, Min Kyung Lee, Seyoung Jeong, Su-Mi Jang)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">App Advising by Boram Kim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Illustration by Minha Yoo</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Sound Design by Rémi Klemensiewicz</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Project Manager by Nayoung Kim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">App Development by Laidback</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by: Seoul Foundation for Arts and Culture, Seoul Metropolitan City</span></span></p>
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_ffaa9df8d21b4c32b39015d41dbc52c3_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_dd84b7763db246169ad373fef9f8e764_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7302fd679c0644038d479d138cf2ec24_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">슬릉쓰트와 친구들 콜렉티브 공동기획 GPS 기반 앱 창작.‘누군가를 돌보지 못한 기억’을 녹음하고 앱의 지도 위에 놓아주면, 그 목소리는 알고리듬 안무에 의해 세계를 유령처럼 여행한다. 세계 어디에서나 위치 반경 안에 들어가면 그 목소리를 들을 수 있으며, 팬데믹 시대의 돌봄 행위가 안무된다. 팬데믹 시대에 우리는 어떤 방식으로 만날 수 있을까? 둘 이상의 영혼이 만날 때 일어나야 하는 일은 결국 돌봄아닐까? 예술과 테라피, 게임이 만난 어플에서 접속자는 각자 속에 숨어지낸 유령을 만난다.</span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">공동기획 및 제작. 슬릉쓰트와 친구들 (신빛나리, 이민경, 장수미, 장혜진, 정세영)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">앱 연출 자문. 김보람</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">일러스트레이션. 유민하</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">사운드 디자인. 해미 클레멘세비츠</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">프로듀서. 김나영</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">앱 개발. 레이드백</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 서울문화재단, 서울특별시</span></span></p>
        
        
    </div>
    `
  },
  '/i-bet-you-d-put-that-on-2022': {
    title: 'I Bet You’d Put That On (2022) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a20af54c445143adbcfb5c5a16b40dc4_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_cbf308103cb0442cbdd25e5083d647ae_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_fc7733ced44f4321916eb039ab999968_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <div class="video-container" style="margin-top: 40px; margin-bottom: 40px; display: flex; justify-content: center; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; aspect-ratio: 16/9;">
          <iframe src="https://www.youtube.com/embed/BhRuqMtvJf4?rel=0" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://tewonderland.wixsite.com/hejinjang-dance" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">Link to Choreographer’s Note</a></span>&nbsp;</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Concept and Artistic Direction by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Performance and Interpretation by Kwonkeum Ko, Myeungshin Kim, Hyunjin Kim, Sunghee Wee, So Young Lee</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Research Participation by Myoung Gyu Song</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Dramaturgy by Ziyea Hyun</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound Design by Jimmy Sert</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Stage Direction by Doyeop Lee</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Video Documentation by Bokco</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Photo Documentation by Sukhyun Hyun (Filmbausch)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Graphic Design by Kyungsub Lim (Saeseoul Society)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Producer by Hyeyeon Kim (We All Really Matter)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Produced and Hosted by: He Jin Jang Dance</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Korea Creative Content Agency, Dancers Career Development Center</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue: Ob/scene Space, Korea</p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_56cc95be09c946c39dc1ae0e6baa59af_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">“</span></span><span style="font-size:15px;" class="wixui-rich-text__text">〈당신이 그런 것을 입게 될 줄 알았어〉</span><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">는 단순한 이불 놀이가 아니라 시체 놀이인 동시에 세밀하게 설계된 장치요, 안무에 있어서는 이중 구조로 설계된 정밀한 작업”<br class="wixui-rich-text__text">
        —&nbsp; 2023년『월간잡지 몸』</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">〈당신이 그런 것을 입게 될 줄 알았어〉는 권투 매트를 집단적 꿈, 관계의 불확실성, 그리고 조용한 소멸의 현장으로 전환시키는 작업이다. 이 친밀하고 다감각적인 퍼포먼스는 리허설을 미래의 공연을 준비하는 절차가 아니라, 돌봄과 애도, 사라짐을 견디는 몸의 훈련을 위한 부드럽고 의례적인 기술로 다시 상상한다. ‘리허설’(rehearsal)과 ‘영구차’(hearse)라는 단어 사이의 어원적 인접성에서 출발해, 이 작업은 re-hearse-ing—즉, 다시 장례를 치르는 것—을 집단적 애도의 사변적 실천으로 제안한다. 이것은 아직 도래하지 않은 것, 이미 잃었지만 완전히 사라지지 않은 것, 언젠가 돌아올지도 모르는 것들을 위한 공간이다.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">각 회차마다 두 명의 퍼포머는 네 명의 관객을 파란 스포츠 매트 위로 초대한다. 눈을 감은 채, 관객의 몸은 속삭이는 말과 조심스러운 촉각의 신호에 따라 천천히 재배열된다. 이들은 잠과 깨어남의 경계에 놓인 최면 상태에 들어가며, 정체성과 취약함이 조용히 다시 써진다. 대결의 장소였던 권투 매트는 해체와 감각의 장치, 보이지 않게 된 것들을 감지하는 토대로 변모한다. 퍼포먼스에 참여한 관객은 이후 외부에서 이를 관찰할 수 있다. 네 개의 관람용 의자는 거리와 밀착, 낯섦과 친밀함 사이의 안무를 반영한다. 총 42회의 반복을 통해, 이 작업은 의례이자 리허설이자 공동의 꿈이라는 투명하고 사변적인 존재 방식을 구축해 왔다.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">검열과 이념의 분열, 그리고 다르게 존재하려는 몸들이 점점 자취를 감추게 되는 한국 사회에서,〈당신이 그런 것을 입게 될 줄 알았어〉는 경계를 허물고, 애도의 감각을 품으며, 미완의 상태를 수용하는 또 다른 존재 방식을 함께 리허설하는 공간을 만든다. 이 작업은 진심과 연기, 현존과 부재 사이를 진동하며, 지워졌던 몸과 목소리, 기억이 다시 떠오를 수 있는 미래를 상상하는 리허설로 이어진다.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">“몇몇 관객은 가수면 상태에 이르는 경험을 갖는다...공연을 하지 않았지만 공연을 한 것처럼 경험하는 리허설과 유사하다. 매트를 사용한 촉각적 경험 역시 리허설의 경험을 도모하는 역할을 수행한다."<br class="wixui-rich-text__text">
        —&nbsp; 2023년『춤웹진』&nbsp;</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">“매트 위에 관객은 붙잡히며, 유동하는 땅(ground)에서 자신의 몸이 굴절되는 것을 체험한다... ‘나’와 ‘너’의 고정된 위치를 끊임없이 불안정한 것으로 만든다.”<br class="wixui-rich-text__text">
        —&nbsp; 2023년『아트신』</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">• 42회 공연<br class="wixui-rich-text__text">
        • 회차당 관객 8명 참여<br class="wixui-rich-text__text">
        • 단 하나의 공유된 꿈</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://tewonderland.wixsite.com/hejinjang-dance" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">안무가의 글 링크</a></span>&nbsp;</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">컨셉/안무/연출. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">공동창작/출연. 고권금, 김명신, 김현진, 위성희, 이소영</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">리서치참여. 송명규</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">드라마투르기. 현지예</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사운드. 지미 세르</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">기술감독. 이도엽 (걸작)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">그래픽디자인. 임경섭 (새서울소사이어티)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">영상기록. 이진원 (복코)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사진기록. 현석현 (필름바우쉬)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">프로듀서. 김혜연 (위올리얼리매터)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">주최/주관. He Jin Jang Dance</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부, 한국콘텐츠진흥원, 전문무용수지원센터</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴. 옵/신 스페이스, 한국​​</p>
        </div>
    `
  },
  '/judson-drama-2020': {
    title: 'Judson Drama (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Judson Drama </span></span></span><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text">(2020)<br class="wixui-rich-text__text">
        저드슨 드라마 (2020)</span><br class="wixui-rich-text__text">
        <span style="font-size:20px;" class="wixui-rich-text__text">with Judson Drama</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_6bfb60ea16f24e61aa9e0e9913175c21_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​​​</span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Judson Drama</span> is a transdisciplinary work co-created by 11 Korean transdisciplinary artists. The Collective was founded to initiate the “New Judson Church Movement” in Korea, inspired by the groundbreaking, adventurous collective that pioneered the post-modern dance era back in the 1970s. To re-create Judson Drama here in Seoul in 2020, the collective placed performative objects hidden around the city during September and October 2020 and invited audience/users to find these objects using the GPS-based application, providing directions and information. In this participatory treasure-hunting performance, the city of Seoul becomes the site for drama and performance, reminiscent of the Judson Church Movement back in the days.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><a href="https://apptopia.com/ios/app/1531085405/about" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;" class="wixui-rich-text__text">​Link to App</span></span></span></span></span></span></a></span></span></span></span><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><a href="https://apptopia.com/ios/app/1531085405/about" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;" class="wixui-rich-text__text">&nbsp;(IOS)</span></span></span></span></span></span></a></span></span></span></span></p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7b21a2cb943045659cacf4c35b600329_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_451a4a8ff1be4878818ef75fbdad06c0_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_8d53f19a9740466a81eae1d4e4c9db02_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">저드슨 드라마 콜렉티브 공동창작 GPS 앱 기반 능동형 보물찾기 공연. "저드슨 처치를 세워라"라는 이름의 퍼즐을 제작하여 서울 전역에 숨겨두었다. 앱 지도를 통해 보물을 찾으면 “퍼즐 만드는 손을 위한 음악”을 청취하며 저드슨 처치 모양의 퍼즐을 맞출 수 있다. 퍼즐을 다 맞추면 또 하나의 큐알코드가 발견되고, 가상의 세계에 입장하며 공공의 장소와 공동체를 돌보는 행위에 대해 사유하게 된다.</span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">창작/협업. 권병준, 김성출, 뭎, 서영란, 신빛나리, 아비잔 토토, 이민경, 장수미, 장혜진, 정세영, 헤미 클레벤세비츠</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">포스터 디자인. 김유나</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">앱개발. 유진필</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">촬영. 이선영</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">크리에이티브 프로듀서. 신재민</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">제작. 이민경, 정세영</span>​​​</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">후원. 서울문화재단, 금천예술공장, 서울특별시</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><a href="https://apptopia.com/ios/app/1531085405/about" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="color_39 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;" class="wixui-rich-text__text">​</span><span style="background-color:transparent; font-family:arial,sans-serif; font-style:normal; font-weight:400;" class="wixui-rich-text__text">앱 링크 (IOS)</span></span></span></span></span></span></a></span></span></span></span></p>
        
        
        
    </div>
    `
  },
  '/latent-in-pre-chaos-2024': {
    title: 'Latent in Pre-Chaos (2024) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-maqdv91u wixui-rich-text" data-testid="richTextElement" id="comp-maqdv91u"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;">Latent in Pre-chaos (2024)</span></span><br class="wixui-rich-text__text"/>
<span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:#000000;">태역에 속도가 묻어있어서</span></span></h6></div>
                
<div class="N8MGzv _v6ohL PO9MfV comp-maqdv93f1 wixui-rich-text" data-testid="richTextElement" id="comp-maqdv93f1"><p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Latent in Pre-chaos is video installation works that expands upon the research on the "Eunhyeongbeop" from Dongui Bogam (The Principles and Practice of Eastern Medicine) (1610), which began in 2023. Choreographer He Jin Jang regards the practice of "the method of concealing the body’s form," rehearsed during times of war and epidemic 400 years ago, as a kind of score. Together with her collaborators, she engaged in speculative dialogue, literature research, movement studies, storytelling, and personal insights, culminating in a multisensory performance in August 2023 that invited the audience into this process. The remaining questions from this project were: "What were the notions of body, community, and care to our ancestors during moments of disaster and disease? What might this indigenous wisdom have to say in the current era of the 'Ontological Turn'?"</span></span></span></p>

<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">During July and August 2024, He Jin Jang worked with performer Sung Uk Hoh to explore the concept of “Taeyeok (what is latent in pre-chaos)” and "Hon-ryun" (the state of being before differentiation into form) from the body concepts that form the basis of Eunhyeongbeop. These concepts refers to the state of existence before a body or matter takes on its form, energy, or texture—before it acquires the qualities of Qi, form, or substance. Through literature research and movement exploration, they began to investigate what it means to exist in these state, and what kind of dance might emerge from them. This film integrates these concepts, movements, and the text-making practices they engaged in, offering the audience the possibility of experiencing the state of Taeyeok and Honryun through viewing and listening. What if these indigenous bodily perspectives of Korea can be considered somatic materials and resources that have so much uncover here and now via dancing?</span></span></span></p>


<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Concept, Artistic Direction &amp; Script by He Jin Jang</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Film Co-direction by He Jin Jang, Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Cast by He Jin Jang, Sung Uk Hoh</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Cinematography / Edit / Color by Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Recording by Dohyeon Lee</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Music by Namreyoung Kim</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Sound Mixing by Minwoo Seo</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Thanks to Yewon Seo</span></span></span></p>

<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Supported by: Art Project Bora</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">Venue: 2025 Chore-graphy, Power Plant at Seoul National University, Korea</span></span></span></p>


















<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">&lt;태역에 속도가 묻어있어서&gt;는 2023년에 시작된 동의보감 ‘은형법’에 대한 연구가 확장된 영상 설치 작업이다. 400년 전 왜란과 전염병의 시대에 연습되어진 ‘몸의 형체를 숨기는 법’을 일종의 스코어로 인식한 장혜진 안무가는 공동연구자들과 사변적 대화, 문헌연구, 움직인 연구, 스토리텔링, 개인적 깨달음의 시간을 가지며, 작년 2023년 8월 멀티센소리 공연으로 발전시켜 관객을 초대했다. 이를 통해 남겨진 질문은 다음과 같았다. “재난과 질병의 순간 조상들에게 몸, 공동체, 돌봄은 무엇이었을까? 이러한 토착적 지혜가 지금 ‘존재론적 전환(Ontological Turn)’의 시대에 던질 수 있는 이야기는 무엇일까?” 2024년 7-8월, 두 달의 기간 동안 장혜진 안무가는 허성욱 퍼포머와 은형법의 배경이 되는 신체관을 천천히 살펴보았다. 우리 조상들의 토착적 신체관은 어떻게 지금 우리의 존재 방식과 평행하게 어긋나며 만나게 될까?</span></span></span></p>


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
                
      </div>
    `
  },
  '/living-without-2017': {
    title: 'living without (      ) (2017) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_fe6910cafea14583bc5c57e22bd5b189_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_fa30c2d235f6422b9adc7a2ddd654285_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">living without ( ) </span>shares a practice of living days “without” something that was always ever-present. To perform this “without-ness,” the choreographer experiments with ways to live without a space while performing in the very space/venue. In the 2017 version, the artist returned to the movement research at the Judson Church community, the center of experimental dance that had previously served as her own base. In this grieving performance, the act of dissolving is danced through the practice of living without the space while performing in it.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text">​​</span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Concept/Choreography/Performance by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Music by Silver Bell Sisters</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, University of the Arts</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue. Movement Research at Judson Church, U.S</span></span><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><a href="https://www.youtube.com/watch?v=Q030plCTc7M" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="color:rgb(0, 179, 255); font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular; font-size:15px; font-style:italic;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span></a><span class="wixui-rich-text__text">​</span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">&lt;괄호 없이 살기&gt;에서는 항상 있었던 무언가 ‘없이' 사는 매일의 수행이 공연이 된다. 이 ‘없음'을 수행하기 위해, 안무가는 공간 없이 잘 살기를 그 공간에서 공연하는 동안 실천한다. 2017년 버전에서는 작가 자신의 베이스였던 뉴욕 실험무용의 중심 메카 미국의 저드슨 처치 커뮤니티로 돌아가, 저드슨 처치 없이 잘 사는 법을 공연한다. 이 애도의 공연에서, 사라짐이 춤추어진다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무/출연. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">음악. 은방울자매</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 한국문화예술위원회, 문화체육관광부, 미국 University of the Arts</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴. Movement Research at Judson Church, 미국&nbsp;</span></span></p>
        
        
        
    </div>
    `
  },
  '/microhabitat-body-2018': {
    title: 'Microhabitat Body (2018) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4feeb573a14a49f188116fdc652c2107_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_f4d1e18337254f158a24f7f7f6279812_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_0364cbef036f4a23b89a85292cfa0c3d_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_9600d228b59b44208f48f151ec8e0ef7_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Microhabitat Body </span>is a project that explores the minimum conditions for choreography to emerge. The choreographer creates a situation where the audience and performers can see ‘missing/not-yet-manifested bodies’ and their bodies that are seeing what is missing are once again seen. In this one-on-one performance, the concept of 'taa or atta', a Korean phrase meaning ‘you are me and I am you,’ is embodied through the kinetics of viewing nothing from each other. The moment is being seen and commented on by primate scientists and cultural scholars again. The sense of symbiosis is explored in multiple layers with a sense of play.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Direction by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Creation/Performance by He Jin Jang, Myoung Gyu Song, Yunkyung Hur</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Dramaturgy by Ziyea Hyun</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Music by Tim Motzer</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Observation and Commentary by Sanha Kim Hyeongbin Cho</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Graphic Design by Donkyu Kim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Producer by Hyojin Kwon</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea,&nbsp;</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue. Oil Tank Cultural Park as part of 2017 Arts Council Korea Experiment Showcase</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">&lt;미소서식지 몸&gt;은 안무를 위한 최소한의 조건을 탐색하는 작업이다. 안무가는 퍼포머와 관객이 ‘없는 몸/아직 나타나지 않은 몸'을 볼 수 있는 환경을 조성한다. 없는 것을 보는 몸은 타자에게 보여지게 되며 안무가 발생한다. 1인의 퍼포머와 1인의 관객이 페어링 되어 서로 없는 것을 관찰하고, 이 순간을 다시 야생영장류 학자와 문화연구자가 관찰한다. 서로는 서로를 보고 (없는 것에 대한) 살아있는 각주를 첨가하면서 공생의 의미를 되찾는다.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">공동구성/퍼포먼스. 송명규, 장혜진, 허윤경</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">드라마투르기. 현지예</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">사운드. 팀 모처</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">관찰. 김산하 (야생영장류 학자), 조형빈</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">그래픽 디자인. 김동규</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">프로듀서. 권효진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">영상기록. 복코</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 한국문화예술위원회, 문화체육관광부</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴. 문화비축기지, 한국</span></span></p>
        
    </div>
    `
  },
  '/microhabitat-body-last-words-2020': {
    title: 'Microhabitat Body: Last Words (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_144fe7f548924126a0470e4408988ac3_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_bba2993de89746f3b6cc4b0e8349487e_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <div class="video-container" style="margin-top: 40px; margin-bottom: 40px; display: flex; justify-content: center; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; aspect-ratio: 16/9;">
          <iframe src="https://www.youtube.com/embed/3t-qSTpvxZI?rel=0" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Choreographed and Conceived by He Jin Jang in collaboration with the performers</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Performed by He Jin Jang, Myoung Gyu Song, Yunkyung Hur</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Dramaturgy by Ziyea Hyun</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound Design by Jimmy Sert&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Project Management by Hyojin Kwon</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Graphic Design by Dongkyu Kim</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Video Documentation by Bokco</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Photo Documentation by Pop Con</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Sinchon Arts Space, Space Bon Courage</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue:</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2020 Seoul International Dance Festival, Korea</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2020 Arts Council Korea Experimental Arts Showcase @ Oil Tank Cultural Park, Korea​​​</p>
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4acdb35352fe429b8c363a89b05181de_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">엄브렐라 프로젝트 ‘미소서식지 몸’ 연작의 일환인 이 공연은, 춤이 출현하기 위한 최소한의 조건을 탐색한다. 아직 살아지지 않은 생의 흔적이 움직임으로 번역되는 감각의 문턱에서, ‘유언’은 끝맺는 언어가 아니라 머무르고, 말해지지 않았으며, 여전히 소환되는 무언가를 담는 미세한 서식지가 된다.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">관객은 무선 헤드폰을 착용한 채, 자신의 이름이 불리는 mp3 사운드트랙을 듣는다. “mp3의 사용에 감탄했습니다. 작품이 끝난 후에도 그 울림이 오래 남아 있었습니다.”는 관객의 피드백처럼, 이 오디오는 각자의 이름과 감각 지시를 통해 오직 한 사람만을 위한 안내서를 조용히 펼쳐낸다. 점차 세 명의 퍼포머는 어둡고 낮은 움직임으로 관객 사이를 흐르며, 검은 오브제를 어루만지고 몸을 조율하는 익명의 제스처들을 펼쳐낸다. 공연 전반에는 세 개의 ‘유언’ 스코어가 활성화된다: 몸에서 감각이 이탈하는 순간, 공연 도중 죽음이 고개를 기울이는 장면, 개인적 작별 인사의 나눔. 이 스코어들은 연극적으로 제시되지 않고, 읽기와 듣기, 감각과 움직임, 멈춤과 떨림 사이에서 신체적으로 흡수된다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">공연 후반, 관객은 자리에 누워 눈을 감고 각자의 내밀한 문턱 공간에 진입하게 된다. 공연장을 나설 때는 ‘내일 아침 7시에 열어보세요’라는 문구가 적힌 봉인된 미니북을 받는다. 이 지시는 작품의 감각을 다음 날까지 연장시키는 장치가 된다. 이 작업은 마지막이라는 것을 끝이 아닌, 아직 도착하지 않은 무언가의 시작으로 다시 묻는다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">“‘관객’이라는 집합에서 빠져나온 ‘나’들은, 눈을 감고 누워 있는 자신의 몸을 발견하게 된다.”<br class="wixui-rich-text__text">
        “이미지의 잔상은 메아리쳤고, 그 메아리들은 서로 간섭하며 나를 어지럽게 했다. 그 여운은 12시간 동안 지속되었다.”<br class="wixui-rich-text__text">
        “관객으로서의 집단적 경험과, 개인으로서 호명되는 개별적 경험이 병치되었습니다. 작위적인 공간 개입이나 관객 참여가 아닌, 감각을 열어주는 공감각적 경험이었습니다.”<br class="wixui-rich-text__text">
        – 2020년 관객</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://prezi.com/6fujbqmvel-a/1/" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">드라마터그 리서치 맵 링크</a></span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">컨셉/안무. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">출연/공동리서치. 송명규, 장혜진, 허윤경</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">드라마터그. 현지예</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">에디토리얼 드라마터그. 조형빈</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사운드디자인. 지미 세르</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">프로듀서. 권효진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">그래픽디자인. 김동규</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">영상. 복코</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사진기록. 팝콘</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부, 신촌문화발전소, 봉쿠라지</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴.&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2020 SIDance 국제 페스티벌, 한국</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2020 한국문화예술위원 창작의 과정, 문화비축기지, 한국​​</p>
        </div>
    `
  },
  '/migrant-self-the-speed-of-a-door-2012-16': {
    title: 'migrant-self the speed of a door (2012) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_6d155c3abcb345dca707e124499b2ec7_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_301d991a3d2e4816a8bf6bce3e8252a9_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">migrant-self the speed of a door </span>explores perceptible and imperceptible timing and aging in relation to migrating. In the act of traveling home and abroad for 5 years, time becomes hybrid, fictional and bendable. Bruised by time, one faces fragile becoming in the waiting room. By reflecting the sense of paradoxical time into the choreographic process, the choreographer asks the following questions: How do certain body parts reflect this ruptured sense of time and duration? What if coming and going happen in the same doorway metaphysically and corporeally? This solo work migrated and toured more than 15 times over 5 years. It is a practice-as-performance as well as a ‘diagnostic artistic work’ of which structure and contents shift as time passes by. Each version is unique as the body ages.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Concept/Choreography/Performance. He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Sound by He Jin Jang, Sigur Ros</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Movement Research, Jerome Foundation, New York Live Arts, Suitcase Fund</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Selected Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 MODAFE Festival, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 World Dance Alliance Asia-Pacific Showcase, Korea</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 New York Live Arts, U.S&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2013 American Dance Festival. U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2013 Eleanor D. Wilson Museum, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2012 Spring Movement Festival, Center for Performance Research, U.S</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">이주하는 신체가 가지는 ‘시간/시제’에 대한 행위적 개념을 탐구하는 작업이다. 5년간의 이주 행위와 함께, 시간은 기이하고, 허구적이고, 변형 가능한 것이 된다. 시간에 의해 타격을 입으며, 기다림 안에서 조각난 존재가 되어간다. 이러한 모순된 시간이 안무적 과정에 반영되며, 다음과 같은 질문을 던진다. 이주하는 신체는 어떻게 이러한 시간성을 반영하는가? 떠나감과 돌아옴이 몸이라는 같은 문지방에서 일어난다면 어떨까? 이 공연은 5년의 시간 동안 15회 이상 공연되며, ‘수행으로서의 공연 practice-as-performance’이자 ‘진단적 예술 작업 diagnostic artistic work’으로 자리했다. 각 버전의 구조와 내용은 시간의 흐름 그리고 노화에 따라 함께 변해가고 있다.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무/퍼포먼스. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">사운드. 장혜진, 시규어 로스</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 미국 Movement Research, New York Live Arts, Jerome Foundation</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 MODAFE 국제 페스티벌, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2016 세계무용연맹 아시아-퍼시픽 쇼케이스, 한국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2015 New York Live Arts, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2013 American Dance Festival, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2013 Eleanor D. Museum, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2012 Center for Performance Research, 미국 외 다수</span></span></p>
        
        
        
    </div>
    `
  },
  '/mirror-neuron-salon-2017': {
    title: 'Mirror Neuron Salon (2017) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Mirror Neuron Salon</span></span></span><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"> (2017)<br class="wixui-rich-text__text">
        거울 뉴런 살롱 (2017)</span><br class="wixui-rich-text__text">
        <span style="font-size:20px;" class="wixui-rich-text__text">with Ursula Eagly</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_5e4d35ee0a514e62b5aeb88db881e52f_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_b033ce27628843a5bfc4c47b1af21ae4_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text">Two dance artists from the East and West dig into the concept of mirror neurons. Using score activate them, they share thoughts and questions with the audience. What is the link between mirror neurons and empathy? Between empathy and morality? How can mirror neurons be agents of dance? How would interpersonal neurological responses operate across the roles of performer and audience? This is a salon-type performance.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><br class="wixui-rich-text__text">
        <span style="font-size:13px;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">Concept/Co-creation/Performance by Ursula Eagly and He Jin Jang<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        Supported by Seoul Dance Center<br class="wixui-rich-text__text">
        Venue. Seoul Dance Center, Korea</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text">거울 뉴런 반응을 파헤치는 동서양의 두 안무가. 이 뉴런 반응을 자극하는 스코어를 통해, 거울 뉴런과 공감, 도덕성, 춤, 관객과의 관계를 탐험하는 살롱형 퍼포먼스이다.</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="text-decoration:none;" class="wixui-rich-text__text">컨셉/공동창작/출연. 어술라 이글리, 장혜진<br class="wixui-rich-text__text">
        <br class="wixui-rich-text__text">
        후원. 서울무용센터<br class="wixui-rich-text__text">
        베뉴. 서울무용센터</span></span></p>
        
    </div>
    `
  },
  '/movement-class-dance-with-fascia-biom': {
    title: 'Movement Class: Dance with Fascia & Biom | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text">Movement Class: Dance with Fascia &amp; Biomechanics<br class="wixui-rich-text__text">
        움직임 수업: 근막 그리고 생체역학과 함께 춤추기</span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_61391cae730545e083986203e3b6fcfc_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_9116f8b5c0494b6fb543761e11d386e7_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Wise body is strong and political. Body wisdom awakens our bodily voices and artistic citizenship. Incorporating some of the concepts in fascial anatomy and biomechanics of our bodies (potential/kinetic energy, inertia, centripetal force, wavelength, elasticity of fascia,etc.), we move to free and empower the individuals in us in this workshop. This class explores the pathway of a released and off-balanced dancing body while finding stillness and surprise in it.<br class="wixui-rich-text__text">
        Why fascia and biomechanics? Fascia is a soft membrane that surrounds and supports organs, blood vessels, bones, nerve fibers, and muscles, and is a dense connective tissue that runs in three dimensions from head to toe, providing structural support and stability. Physics, as the study of matter, energy, and the interaction between them, is applied in movement to better organize our moving bodies in relation to energy. Once we yield our bodies to the energy source and anatomical design to understand the fundamental nature of being, we are able to reach a sense of the metaphysical body. What if the pathway of fascia in our body helps us process elastic movement that resonates with the outer world? Class activities include hands-on-body work, improvisation, floor work, and locomotion to create a collective of wise and political bodies.</span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">현명한 몸은 강하고 정치적이다. 몸의 지혜는 우리 몸의 소리와 예술적 시민성을 일깨운다. 이 움직임 수업은 근막과 생체 역학 개념(위치/운동 에너지, 관성, 구심력, 파장, 근막의 탄성 등)에 접근하며 개개인을 안쪽 깊은 곳에서부터 자유롭게 하고 힘을 실어주는 움직임을 탐구한다. 몸의 고요함과 놀라움을 찾으면서 이완되고 역동적인 춤의 경로를 탐색한다.왜 근막과 생체역학일까? 근막은 장기, 혈관, 뼈, 신경섬유, 근육을 둘러싸고 지지하는 부드러운 막으로, 머리부터 발끝까지를 3차원으로 연결하여 구조적 지지와 안정성을 제공하는 치밀한 결합조직이다. 이때 물질과 에너지 그리고 이들 사이의 상호작용을 연구하는 학문인 물리학은, 움직이는 몸과 에너지와의 긴밀한 조우를위해 탐구될 수 있다. 몸을 에너지원과 해부학적 설계에 내맡기고 존재의 근본적인 본질을 이해하게 되면, 우리는 형이상학적 몸의 느낌에 도달할 수도 있다. 반동을 수반한 탄성적인 움직임을 지닌 우리 몸의 근막이, 세상과의 공명을 이끌 수 있지 않을까? 이 수업은 핸즈온 작업, 즉흥, 플로어 워크, 중심이동 등의 프랙티스로 구성되어 있으며, 이를 통해 현명하고 정치적인 몸의 공동체에 접근한다.</span></span></p>
        
        
        
    </div>
    `
  },
  '/navigating-uncertain-terrain-with-generosity-2023': {
    title: 'Navigating Uncertain.. (2023-ongoing) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Navigating Uncertain Terrain with Generosity </span>(2023 - )</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">불특정한 지형을 관대하게 탐색하기 (2023 - )</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:20px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">with in-between space lab</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_4583c9366a7c40ca9af45616bed6c585_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">2023 in-between space lab</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">Navigating Uncertain Terrain with Generosity</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">in-between space lab is a triangular cultural exchange research project among three choreographers from Korea and Canada: He Jin Jang, Heidi Strauss and Marie France Forcier. Their research on the ‘audience as neuro-divergent community’ was conducted in the year of 2023, spanning one week in July in Liverpool, UK, another week in September in Calgary, Canada, and the final week in November in Seoul, Korea. During this time, they shared a profound sense of companionship by moving/talking/eating/laughing-crying/critiquing/reading /writing/and sharing space.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Workshop</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">The workshop titled <span style="font-style:italic;" class="wixui-rich-text__text">Navigating Uncertain Terrain with Generosity</span> happened in and around Seoul Dance Center in November 2023. Here, the artists and participants together attempted to connect with space, time, history, memories, and encounters, embracing a sense of uncertainty via the felt-body. This workshop explored developing practices that the artists have been researching, aimed at stimulating the senses and expanding awareness. By sharing these simple acts, they learned how audience-attentive experiments can act as amplifiers for co-presence. Playing with notions of accompaniment both by human and more-than-human, participants were guided to the experience developed through exchange and generosity. The artists’ intention to share their practice with the participants further extended this exchange, offering opportunities for brief individual and group reflections. They together questioned and altered habitual tendencies with generosity with the hope to become more open to uncertainty.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Online sharing&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">Participants from any parts of the world were invited to an online sharing hosted by in-between space lab in December 2023. Over this&nbsp; two-hour session, choreographers/researchers Marie France Forcier, He Jin Jang, and Heidi Strauss reflected on the initial development phase and workshop towards a collaborative practice of “navigating uncertainty with generosity.” They walked through where the process had taken them, sharing perspectives they had gained, workshop images, personal revelations, and their hopes for the project’s future. By attempting to connect with space, time, and encounters with a sense of uncertainty via the felt-body, they questioned in what (neurodivergent) ways audience-attentive experiments could act as amplifiers for co-presence. A Canada/Korea exchange, the event was conducted in both English and Korean. This project was made possible with support from Arts Council Korea's International Partnership in Support of Arts Creation, Canada Council for the Arts, University of Calgary, Seoul Dance Center, and adelheid dance projects.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">1) Research Map - <a href="https://www.hejinjang.com/_files/ugd/073f40_7599d2cf5a7b4e7f93d7eb4a508b15be.pdf?index=true" target="_blank" class="wixui-rich-text__text"><span style="color:#00B3FF;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">Download</span></span></a></span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Project Initiation, Research and Workshop. He Jin Jang, Marie France Forcier, Heidi Strauss</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Interpretation and Translation. Adela Shin</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Management and Archive. Yewon Seo</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">English Archive. Hyeonhwa Lee<br class="wixui-rich-text__text">
        Photography Documentation. Sukkuhn Oh<br class="wixui-rich-text__text">
        Video Documentation. Jinwon Lee</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Research Map Design. Kyujin Shim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Producer. Eunji Park</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Arts Council Korea's International Partnership in Support of Arts Creation, Canada Council for the Arts, University of Calgary, Seoul Dance Center, adelheid dance projects<br class="wixui-rich-text__text">
        Organized and Hosted by He Jin Jang Dance</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 Liverpool John Moore University, UK (Residency #1)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 University of Calgary, Canada (Residency #2)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 Seoul Dance Center, Korea (Residency #3&nbsp; &amp; Workshop)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 On-line via Zoom (Online Research &amp; Sharing)</span></span></p>
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_31329f1cece54e858fa3ed7a38211860_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a502673f31214784bee172cfc413b88c_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-style:normal;" class="wixui-rich-text__text"><span style="color:#000000;" class="wixui-rich-text__text">2023 한국-캐나다 협력 리서치 프로그램:인-비트윈 스페이스 랩</span></span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">2023 in-between space lab</span></span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">인-비트윈 스페이스 랩 in-between space lab은 한국인 안무가 장혜진과 2명의 캐나다 안무가 마리 프랑스 포시에르 Marie France Forcier &amp; 하이디 스트라우스 Heidi Strauss 사이의 트라이앵글 문화교류 리서치이다. 이들은 ‘신경다양적인 개인이자 공동체로서의 관객 Audience as neurodivergent individual and collective’을 탐구하기 위해 2023년 여름부터 리서치를 시작했고, 7월에는 영국 리버풀에서 일주일, 9월 캐나다 캘거리에서 일주일, 그리고 11월 5-11일에는 서울에 모여 일주일을 함께 한다. 이 시간 동안 이들은 움직이기/이야기하기/먹기/웃고 울기/비판하기/읽기/쓰기 등의 과정을 통해 자신의 공간을 나누고, 동행하고 있다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">워크숍 &lt;불확실한 지형을 관대하게 탐색하기&gt;​</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">서울무용센터 안팎에서 진행될 [워크숍: 불확실한 지형을 관대하게 탐색하기]에서는 ‘느끼고 있는 몸 felt-body’를 통해 시간과 공간, 역사와 기억 그리고 만남에 보다 불확실하게 접속하기를 시도한다. 이들은 그간 감각을 자극하고, 인식을 확장할 수 있는 단순한 프랙티스를 수행해왔고, 이를 당신과 나누며 ‘관객에게 주의를 기울이는 공연 실험 Audience-attentive performance experiment'이 공동 실존의 감각을 증폭시킬 수 있는 방법들에 대해 고민을 털어놓고자 한다. 우리는 ‘동반(인간이든 비인간이든)’의 느낌을 통해 서로를 안내하고 나눔과 관대함에 다가갈 것이다. 그 나눔의 연장선에서, 이 워크숍을 통해 당신과 함께 개인과 공동체에 대해 성찰하고 싶은 마음이다. 우리의 습관과 경향에 대해 질문을 던지는 동시에 ‘관대하게’ 더 불확실해질 것을 기대한다.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">프로젝트 &lt;불확실한 지형을 관대하게 탐색하기&gt; 온라인 과정 공유회</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">2023 인-비트윈 스페이스 랩의 온라인 공유에 초대합니다. 안무가이자 연구자인 마리 프랑스 포르시에(Marie France Forcier), 장혜진(He Jin Jang), 하이디 스트라우스(Heidi Strauss)가 2023년 하반기에 진행된 한국-캐나다 협력 프로젝트 &lt;불확실한 지형을 관대하게 탐색하기&gt;의 초기 개발 단계와 워크숍 과정을 공유한다. 과정을 통해 도달하게 된 관점, 개인적인 질문, 이미지와 영상, 그리고 프로젝트의 미래에 대해 영어와 한국어로 나눌 예정이다. 시간과 공간, 감각과 만남에 보다 불확실하게 접속하기 위한 신체 실천을 탐색하며, ‘관객에게 주의를 기울이는 공연 실험(Audience-attentive performance experiment)'이 공동 실존의 감각을 증폭시킬 수 있는 신경 다양적인 방법들에 대해 고민해왔다. 개인과 공동체에 대한 사유는 우리의 습관, 배경, 기억, 역사에 대해 질문을 던지게 했고, 이를 초대된 사람들과 편안하게 공유하는 시간이 될 것이다.</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">1) 리서치 맵 - <a href="https://www.hejinjang.com/_files/ugd/073f40_7599d2cf5a7b4e7f93d7eb4a508b15be.pdf" target="_blank" class="wixui-rich-text__text"><span style="color:#00B3FF;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">PDF 파일 다운로드</span></span></a></span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">프로젝트/리서치/워크숍 진행. 장혜진, Marie France Forcier, Heidi Strauss</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">통역/번역. 신재윤&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">매니지먼트/기록. 서예원&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">영문기록. 이현화</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">사진기록. 오석근</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">영상기록. 이진원</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">리서치맵 디자인. 심규진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">프로듀서. 박은지</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 한국문화예술위원회 한국-캐나다 교류 국제예술공동기금, 문화체육관광부, 서울무용센터, Canada Council for the Arts, University of Calgary, adelheid dance projects</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">제작. He Jin Jang Dance</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 리버풀 존무어 대학교 아트 &amp; 디자인 센터, 영국 (레지던시 #1)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 캘거리 대학교 무용센터, 캐나다 (레지던시 #2)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 서울무용센터, 한국 (레지던시 #3 &amp; 워크숍)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2023 온라인 줌 (온라인 리서치 &amp; 과정 공유회)</span></span></p>
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_83a928ccfa9c43e4aff2e9b58acabd1c_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_bddbd9d0c9734d2a9a786a031190518a_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
    </div>
    `
  },
  '/open-skin-inscribed-2008': {
    title: 'Open Skin Inscribed (2008) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_09e1cf8f62be4ec39a084865d9143270_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">open skin inscribed </span>is a performance that explores the skin as &nbsp;a surface that constitutes a thin line between the body and society. The choreographer delves into the open wounds within her family’s medical history, discovering accumulated narratives inscribed on the skin. Through tactile choreography, the story unfolds.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Concept/Choreography by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Performance by He Jin Jang, Chang Doo Jang, Yeonhee Cho</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">VIsual Collaboration by Kate Abarbanell</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 American Dance Festival, USA</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Congress on Research in Dance, USA</span></span><span class="wixui-rich-text__text">​</span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span class="wixui-rich-text__text">​</span><span class="wixui-rich-text__text">​</span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">몸과 사회 사이 가느다란 표면으로서의 피부와 피부병(가족병력)에 대한 리서치를 안무화한 공연이다. 안무가는 피부의 열린 상처에 주목하며 거기에 무엇이 적혀있는지 발견해 간다. 생로병사를 겪는 몸으로서 사회에 존재하는 의미에 대해 촉각적 안무와 함께 사유하는 작업.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">퍼포먼스. 장혜진, 장창두, 조연희</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">비주얼 협력. 케이트 아바바나</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 아메리칸 댄스 페스티벌, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2008 Congress on Research in Dance, 미국</span></span></p>
        
    </div>
    `
  },
  '/porous-research-2023': {
    title: 'Porous Research (2023) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a65bd9f5faee4572a9dde6b26cb9ae8b_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">As part of the development of Slow Carnival World, this seven-week residency at Sinchon Arts Space became a site for what we called “porous research”—a choreographic investigation that questioned closed systems of rehearsal and production. Rather than generating knowledge through finalized performance, the research emphasized the minor, the disrupted, and the relational as sites of knowledge production. Through talks and movement-based sessions, the process unfolded ‘transparently, by making holes’—releasing what had been obscured or held in. The sessions invited participants not as passive observers, but as transparent presences: sensing, reflecting, and embodying the porous rhythms of the research itself. This residency did not conceal trial and friction, but honored them as generative. Mistakes, interruptions, and care became methodologies. What emerged was not a polished product, but an opening: a perforated field of slow-thinking, bodily intuition, and shared inquiry.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">* Public Sessions:</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">1. Talk – July 4<br class="wixui-rich-text__text">
        An introduction to the research, including sensory exploration, walking-talking, and open discussion.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2. Movement Workshop – July 6<br class="wixui-rich-text__text">
        A shared experiment in embodied methodology, followed by collective reflection</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Research Concept and Direction by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Movement Research by Kwonkeum Ko, Hyunjin Kim, Myoung Gyu Song, HeeSeung Lee, Sung Uk Hoh</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Livelihood Research by Eunji Park</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Archival Research by Yewon Seo</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Palate Research by Ocbong</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound Research by Namreyoung Kim</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Visual Research by Bokco</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Presented &amp; Hosted by<br class="wixui-rich-text__text">
        He Jin Jang Dance, in partnership with Sinchon Arts Space</p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_f195fa811dd24f63a4273e38a07a25f5_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7b9d211ddd8e46b2844af0ec297ef4c3_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">《투명인간이 되든, 춤을 추든》의 창작 과정 중 일부로 진행된 7주간의 신촌문화발전소 레지던시는 ‘뚫린 연구(porous research)’라 명명한 안무적 탐구의 현장이다. 이 리서치는 리허설과 제작 방식의 폐쇄적 시스템에 의문을 던지며, 공연이라는 완성물을 통해 지식을 산출하기보다는, 작고 불완전하며 관계적인 지점들을 지식 생성의 기반으로 삼는다. 감각적이고 느린 경로를 통해 지식이 발생할 수 있다는 믿음 아래, 이 레지던시는 시행착오와 마찰을 감추지 않고 오히려 생성적인 요소로 존중한다. 실수와 중단, 돌봄은 하나의 방법론이 되며, 작고 불완전한 틈들은 기념된다. 토크와 움직임 기반 세션을 통해 이 과정은 ‘투명하게, 구멍을 뚫어서’ 펼쳐진다—그간 가려져 있거나 억눌려온 것들을 해방시키며. 이 공유 세션에서 참여자들은 수동적 관객이 아닌 ‘투명한 존재’로 초대된다. 감각하고, 반추하며, 리서치의 다공적 리듬을 신체로 체화하는 존재들이다. 매끄럽게 마감된 결과물이 아니라, 신체로 직관하고 함께 탐색할 수 있는 하나의 장—‘구멍 난 장(field of perforation)’을 공연에 앞서 감각적으로 드러난다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">*공개 세션</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">1. 토크 – 7월 4일(화)<br class="wixui-rich-text__text">
        연구와 그 과정을 소개하며, 미각 탐험, 산책, 감각 기반의 토론이 이어진다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2. 움직임 워크숍 – 7월 6일(목)<br class="wixui-rich-text__text">
        움직임 방법론 일부를 참여자들과 함께 실험하고 이에 관해 나눈다.</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">개념 및 안무 디렉션. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">움직임 연구. 고권금, 김현진, 송명규, 이희승, 허성욱</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">살림 연구. 박은지</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">기록 연구. 서예원</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">미각 연구. 옥봉</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">청각 연구. 김남령</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">시각 연구. 복코</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">주최 및 주관. He Jin Jang Dance, 신촌문화발전소​</p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_57b5c90fef664cfa99d3815bc9930812_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_52d74d0e88884ea0b96ce6f9e7dcb4e2_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
    </div>
    `
  },
  '/silence-replaced-2009-12': {
    title: 'Silence Replaced: (2009-12) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_d7684d96713e407ba45a4e24fd7a3f87_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">A performative act to problematize the expectation of silence imposed on Asian women. A woman and her bizarre preparations for going-out create a space of slow voicing. With a lit candle placed on her hair spread across the floor, she becomes the voice of feminist speculative fabulation. The synesthesia of the voice flips the space and time upside down.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text">​​​</span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Concept/Choreography/Performance by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Sound by He Jin Jang</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Movement Research, Jerome Foundation, National Dance Center in Bucharest, Romania</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Venue.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2012 Pop-up Performance at One Arm Red, U.S</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2011 Moving Dialogue Residency @ Atelierul de Productie, Romania</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2009 The 41st Conference of Congress on Research in Dance: Dance Studies and Global Feminisms, U.S</span><a href="https://mybox.naver.com/share/list/viewer/3472569162229199696?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="color:rgb(0, 179, 255); font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular; font-style:italic;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">​</span></span></a>​</span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">침묵이 요구되어 온 아시아 여성의 몸은 기이한 외출 준비를 통해 목소리를 찾는다. 불이 붙은 초를 바닥에 펼쳐진 머리카락 위에 올려놓고 온몸을 쓸어 이를 운반하며 외출을 준비하는 그녀는 여성주의 사변적 우화의 주인공이 된다. 목소리의 공감각적 발생은 시간과 공간을 뒤집는다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">컨셉/안무/퍼포먼스. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">사운드. 장혜진</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 미국 Movement Research, Jerome Foundation, 루마니아 국립무용센터</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">베뉴.&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2012 팝업 퍼포먼스, One Arm Red, 미국</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2011 무빙 다이알로그 레지던시, Atelierul de Productie, 루마니아&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">2009 제 41회 Congress on Research in Dance 학회: 예술 연구와 글로벌 페미니즘, 미국&nbsp;</span></span></p>
        
    </div>
    `
  },
  '/slow-carnival-world-2023': {
    title: 'Slow Carnival World (2023-ongoing) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_df8de628b39f4398a75f3382ae4f4ee1_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_82a46ee449aa4acabfee8f54d10fbabb_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">“Jang’s works offer a multisensory experience through the body, reflecting a new social role assigned to contemporary dancers. The spontaneous rhythm of the space enables a unique solidarity among participants on the spot.” </span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">— Hwajung Yu (Dance Critic)</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Slow Carnival World</span> is a multi-sensory performance rooted in the speculative reading of Eun-Hyung-beop—a 17th-century Korean healing method of hiding the body, found in the <span style="font-style:italic;" class="wixui-rich-text__text">Donguibogam</span> (1610). Here, invisibility is not disappearance, but a quiet return to the porous, collective body. What if becoming unseen was a technology of endurance—an ancestral gesture of resistance and survival passed down through generations? The work unfolds as an immersive, durational experience shaped by slowness, delay, and porous rhythms. Bodies move with temporal dissonance, entangling without clear beginnings or ends. Dance becomes a soft protest and a shared lucid dream—a slow carnival where mantra-like texts, food, fabric, sound, and gesture form a space for collective unmaking. Visitors are invited to chew, rest, drift, and listen. Together, we resist the grammar of legibility, embracing relational opacity and unbordered time. Slow Carnival World is a quiet rehearsal for surviving together—through the invisible.​&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Slow Carnival World </span>is structured with two main events: Common Ritual and Floating Action; If Common Ritual is a choreographed score of repetition, stillness, and shared presence,&nbsp; Floating Action is a liminal zone of drifting attention: ambient gestures, quiet conversations, subtle shifts between performance and exhibition. &nbsp;Visitors may arrive early or linger late, choosing how to participate.</span></p>
        
        <div class="video-container" style="margin-top: 40px; margin-bottom: 40px; display: flex; justify-content: center; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; aspect-ratio: 16/9;">
          <iframe src="https://www.youtube.com/embed/_vyyTk5vK4o?rel=0" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">August 11 (Fri)<br class="wixui-rich-text__text">
        3–4pm: COMMON RITUAL<br class="wixui-rich-text__text">
        4–6pm: floating action<br class="wixui-rich-text__text">
        6–7pm: COMMON RITUAL</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">August 12 (Sat)<br class="wixui-rich-text__text">
        12–1pm: COMMON RITUAL<br class="wixui-rich-text__text">
        1–3pm: floating action<br class="wixui-rich-text__text">
        3–4pm: COMMON RITUAL<br class="wixui-rich-text__text">
        4–6pm: floating action<br class="wixui-rich-text__text">
        6–7pm: COMMON RITUAL</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1HgUU2c3EzzJSKXaDRv1Et4BJenmHrBaJ/view?usp=sharing" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">Link to Research Map</span></span></span></a></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">​Concept/Direction/Script by He Jin Jang<br class="wixui-rich-text__text">
        Performance/Research/Interpretation by Kwonkeum Ko, Hyun Jin Kim, Myounggyu Song, HeeSeung Lee, He Jin Jang, Sung Uk Hoh<br class="wixui-rich-text__text">
        Creative Process Assistant by Sung Uk Hoh<br class="wixui-rich-text__text">
        Edible Design by Ocbong<br class="wixui-rich-text__text">
        Sound Design by Namreyoung Kim<br class="wixui-rich-text__text">
        Visual Consultant by Donghee Kim<br class="wixui-rich-text__text">
        Props Design by Hyuna Yi<br class="wixui-rich-text__text">
        Props Assistant by Heesong Kang</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">Producer by Eunji Park</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">Management/Research by Yewon Seo<br class="wixui-rich-text__text">
        Technical/Stage Director by Tae Young Maeng<br class="wixui-rich-text__text">
        Stage Crew by Kyeong Yun Eom<br class="wixui-rich-text__text">
        Sound Operator by Eunsaem Jeong<br class="wixui-rich-text__text">
        Video Recording/Teaser by Bokco<br class="wixui-rich-text__text">
        Photography by Jaewoo Oh</span><span style="font-size:15px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">Produced &amp; Hosted by: He Jin Jang Dance<br class="wixui-rich-text__text">
        Sponsored by: Platform-L Contemporary Art Center, Arts Council Korea, Shinchon Arts Space, Korea Creative Content Agency, The Dancers' Career Development Center</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><br class="wixui-rich-text__text">
        <span style="font-size:15px;" class="wixui-rich-text__text">Venue: 2023 Live Arts Program, Platform-L Contemporary Art Center, Korea</span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">​</span><br class="wixui-rich-text__text">
        &nbsp;</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">“즉흥적으로 만들어지는 공간의 리듬은 현장에 참여한 사람들 사이 특별한 연대를 가능케 한다...동시대 무용가에게 부여되는 새로운 사회적 역할 중 하나가 신체를 통한 다중 감각의 경험을 선사하는 것에 있다는 점에서 장혜진의 활동은 일반인은 물론 주변 무용가와 예술가들에게 파장을 일으킨다.”</span><br class="wixui-rich-text__text">
        <span style="font-style:italic;" class="wixui-rich-text__text">— 유화정 무용평론가</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">〈투명인간이 되든, 춤을 추든〉은 『동의보감』(1610)에 기록된 17세기 한국의 치유법 은형법에 대한 현대적이고 사변적인 사유에서 출발한 다감각 퍼포먼스다. 몸을 사라지게 한다는 이 기술은 단순한 은폐가 아니라, 조용한 저항이자 공동체적 생존의 전략으로 다시 읽힌다. 이곳에서 ‘투명함’은 부재가 아니라, 다공성의 몸으로 귀환하는 선택, 다시 말해 공동의 몸으로 존재하기 위한 시도이다. 느림과 지연, 흐름과 반복으로 구성된 몰입형 지속 퍼포먼스 안에서 퍼포머와 관객의 몸들은 하나의 공동 리듬 안에서 얽히고 풀리며, 시작과 끝이 명확하지 않은 채 함께 흔들린다. 함께 생성되는 집단 자각몽이자 부드러운 저항의 장안에서, 텍스트, 음식, 직물, 사운드, 움직임이 서로를 가로지르며 관객은 씹고, 쉬고, 흘러가고, 듣고, 움직이는 존재로 참여한다. 이 느린 카니발 속에서 우리는 사이로 존재하기, 시간을 경계 없이 흘려보내기, 그리고 물리적 가시성을 넘어서 함께 살아남는 법을 리허설한다. 우리가 보이지 않게 될 때, 어떤 생존의 기술이 우리 안에서 깨어나는가?</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">〈투명인간이 되든, 춤을 추든〉은 두 가지 상호 연결된 구조로 진행된다: 커먼 리츄얼(Common Ritual)이 반복, 정지, 공존의 안무 스코어로 이루어진 집단적 몽상 상태의 퍼포먼스라면,&nbsp; 흐르는 액션(Floating Action)은 공식 공연 사이에 발생하는 비형식적 시간이자 안내자(퍼포머)가 장면을 해체하거나 대화를 이끌며, 관객은 공연과 전시 사이의 흐름을 직접 감각한다. 방문자는 일찍 도착하거나 늦게까지 머물며 쉬고, 대화하고, 관찰할 수 있다. 단순한 공연이 아니라, 더 유연한 존재를 연습하는 열린 사회적 공간이 된다.</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">8/11(금) </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">3-4pm 공연 (COMMON RITUAL) </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">4-6pm 흐르는 액션 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">6-7pm 공연 (COMMON RITUAL) </span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">8/12(토) </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">12-1pm 공연 (COMMON RITUAL) </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">1-3pm 흐르는 액션 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">3-4pm 공연 (COMMON RITUAL) </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">4-6pm 흐르는 액션</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">6-7pm 공연 (COMMON RITUAL) </span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><a href="https://drive.google.com/file/d/1HgUU2c3EzzJSKXaDRv1Et4BJenmHrBaJ/view?usp=sharing" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">​리서치 맵 링크</span></span></span></a></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">컨셉/연출/대본. 장혜진 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">퍼포먼스/리서치/해석. 고권금, 김현진, 송명규, 이희승, 장혜진, 허성욱&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">창작 과정 어시스턴트. 허성욱 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">미각 디자인. 옥봉&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">사운드 디자인. 김남령&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">공간 컨설팅. 김동희&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">오브제 디자인/설치. 이현화&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">오브제 어시스턴트. 강희송</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">프로듀서. 박은지&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">매니지먼트/리서치. 서예원&nbsp;</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">무대/기술감독. 맹태영 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">무대 크루. 엄경윤 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">음향 오퍼레이터. 정은샘 </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">영상 기록/트레일러. 복코&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">사진 기록. 오재우&nbsp; </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">주최/제작. He Jin Jang Dance </span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">후원. 한국문화예술위원회, 신촌문화발전소, 한국콘텐츠진흥원, 전문무용수지원센터, 플랫폼엘 컨템포러리 아트센터&nbsp; </span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:15px;" class="wixui-rich-text__text">베뉴. 플랫폼엘 컨템포러리 아트센터 - PLAP 기획공모 선정작, 플랫폼 라이브, 한국​​​​​​​​​</span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_261ea56ceb6e44309f169f08a26763be_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_8d599132147d41179f4bbacdefa80e1d_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        </div>
    `
  },
  '/softrehearsalforfugitivegathering': {
    title: 'Soft Rehearsal for Fugitive Gathering | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_21965012ddd4440782e1211a9775c45a_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_9920f267b649452cb2fd216808fbf66a_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">What if a body becomes invisible not through erasure—but through softness?<br class="wixui-rich-text__text">
        What if healing isn’t a return to form, but a rehearsal of dissolution?</span></span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">In this lecture-performance, choreographer and researcher He Jin Jang draws from her practice-based PhD inquiry to weave together choreographic research, speculative medicine, and trans-sensorial memory. Grounded in the Korean indigenous healing method Eunhyeongbeob (은형법)—the “method of becoming invisible”—Jang explores how we might rehearse new bodily futures amid biopolitical crisis, intergenerational trauma, and state violence. Framing rehearsal as a ritual of resilience, she asks: How can choreography hold what history cannot name?</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">The performance blends lecture, improvisational movement, sensorial autoethnographic reading, and guided meditation to invite audiences into forms of embodied refusal and quiet resistance. Personal narrative unfolds alongside theoretical constellations from ritual studies (Victor Turner, Richard Schechner), dance and somatics (Susan Leigh Foster, Randy Martin), and decolonial thought (Kuan-Hsing Chen’s Asia as Method), forming a porous landscape of scholarship, memory, and movement.</span></span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">This is a soft rehearsal space—where invisibility becomes a sensorial strategy for survival, refusal becomes care, and whisper becomes architecture. Both an act of mourning and a proposal for sensuous futures, the work asks us to listen for what lingers before form.</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">Concept/Performance/Text by He Jin Jang</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">Sound Design by Namureyoung</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">Supported by T:Works Artistic Directors Academy</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">Venue:&nbsp;</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 ADA Research Day, T:Works, Singapore</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Postcritical Spirituality Series, Rasa, Singapore</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Arts &amp; Design Practice Research Exchange, NAFA, Singapore</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Anthologies Assembly, London South Bank University, UK</span></span></span></p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_c1e619c0a55e4bd18d4c8bf1a35f1d9f_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7878775c05504d25bcfbbb1e54cf0c50_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">만약 몸이 부드러움을 통해 사라질 수 있다면 어떨까?</span></span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">만약 치유가 회복이 아닌, 흩어짐을 리허설하는 과정이라면?</span></span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">이 렉처-퍼포먼스에서 안무가이자 리서처인 장혜진은 박사 리서치를 기반으로 한 작업을 통해 안무적 탐구, 사변적 의학, 그리고 감각을 넘나드는 기억을 엮어 나간다. 한국의 토착 치유법인 은형법—‘사라지는 몸의 기술’을 바탕으로, 생명정치적 위기와 세대 간 트라우마, 국가 폭력의 시대를 살아가는 우리가 어떻게 몸의 미래를 미리 리허설할 수 있을지 질문한다. 장혜진은 리허설을 회복력의 의례로 다시 조명하며, 묻는다: “안무는 어떻게 말해지지 않은 정치적 감각을 불러올 수 있을까“ 이 렉처 퍼포먼스는 강의, 감각적 자서전적 낭독, 움직임 퍼포먼스 그리고 안내된 명상으로 구성되며, 몸을 통한 조용한 저항의 장으로 관객을 이끈다. 리추얼 연구(빅터 터너, 리처드 셰크너), 무용과 소매틱 이론(수전 리 포스터, 랜디 마틴), 탈식민 사유(천관싱의 『방법으로서의 아시아』)들과 나란히 퍼포먼스가 펼쳐진다. 기억, 움직임, 학문이 서로 스며드는 다공성의 풍경이 되는 곳. 보이지 않음이 감각적 생존 전략이 되고, 거절이 돌봄이 되며, 속삭임이 구조가 되는 곳. 형태가 생기기 전, 머물다 간 감각을 듣는다는 건 무엇인가?</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">컨셉/퍼포먼스/글/진행: 장혜진</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">사운드 디자인: 김남령</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">후원: T:Works 예술감독 아카데미</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">베뉴.</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 ADA Research Day, T:Works, 싱가포르</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Postcritical Spirituality Series, Rasa, 싱가포르</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Arts &amp; Design Practice Research Exchange, NAFA, 싱가포르</span></span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-weight:normal;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text">2025 Anthologies Assembly, London South Bank University, 영국</span></span></span></p>
        
    </div>
    `
  },
  '/teaching-bio': {
    title: 'Teaching Bio | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text">Teaching Bio</span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_f50b7b1d7a364f588d0e5f0219c20f66_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">As a teaching artist, He Jin Jang has over 20 years of experience in academic and professional teaching across the world. Jang has worked as a full-time Assistant Professor of Dance/Assistant Director of the MFA program at Hollins University (US) from 2011 to 2014, where she was honored with the Webb Bierley Teaching Award. During her appointment, she taught Contemporary Technique, Improvisation, Composition, Repertory, Critique &amp; Showing, Senior Seminar, and Pedagogy Seminar to both undergraduate and graduate students.Additionally, she served as a mentor/advisor for multiple students’ senior and thesis projects. Jang’s other teaching credits include University of Michigan (US), Anderson University (US), American Dance Festival (US), Movement Research (US), Dance New Amsterdam (US), University of Calgary (Canada), Centro de Produccion de Danza Contemporanea (Mexico), UDLAP (Mexico), Korea National Contemporary Dance Company (Korea), Seoul International Choreography Workshop (Korea), Seoul Tanz Station (Korea), National Museum of Modern and Contemporary Art Changdong Residency (Korea), and numerous universities in Korea, including Seoul Institute of the Arts, Sungkyungwan University, Kookmin University, Kyunghee University, Sungshin Women’s University, Seoul National University of Education, Jeonbok National University, and Keimyung University.<br class="wixui-rich-text__text">
        Jang has also served as Choreo-lab Mentor at Asian Cultural Center (’19-’21), and Mentor of<br class="wixui-rich-text__text">
        Choreography at the Immigrant Artist Program at New York Foundation for the Arts (‘14).<br class="wixui-rich-text__text">
        Currently, She is remotely working as a mentor at the MFA in Dance Program, University of the Arts Philadelphia (US). She is also a certified teacher of the Franklin Method,<br class="wixui-rich-text__text">
        a somatics method based on Dynamic Neuro-cognitive Imagery™.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">I approach class as an ongoing process, in which one contributes to fine tune and helps bodies open towards ‘the state of readiness’ – being ready &amp; available to move, create, explore, evoke and criticize. I encourage participants to explore different ways to retain knowledge of and relate to the world by an actual sense of feeling or being in our bodies and seeing ourselves moving around in it, which I call ‘body wisdom.’</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">To teach is to help each other learn how to learn one’s own body wisdom. I believe in facilitative methods rather than directive. I advocate for teaching self-authoring &amp; self-transforming minds through embodiment. I believe in co-teaching, where experimental pedagogy, interdisciplinary approaches, and the decentralization of power are possible.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">These are the heartfelt questions on ‘how’:</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How do we activate space – physical, conceptual, meta-cognitive – together in the classroom?&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How can we help each other make deliberate &amp; responsible choices that will empower&nbsp; ourselves?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How would materials and methods, such as sensory experiences, scientific information, involvement, imagery, and abstraction, work in teaching?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How can we collectively&nbsp; value the different learning curves of each participating body?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How does the experience of teaching shape the perception of learning?&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- How can we use feedback and feed-forward to care for one another?</span></span></p>
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">장혜진은 전 세계 여러 대학교와 기관에서 지난 20년간 티칭 아티스트로서 수업과 워크숍을 가르쳐왔다. 2011-14년에는 미국의 실험적 안무 프로그램 홀린즈 대학교 Hollins University의 무용과에서 전임교수, 대학원 프로그램 부감독, 임시 학과장을 역임했다. 컨템포러리 테크닉/즉흥/구성법/레퍼토리/비평세미나 등을 학부생과 대학원생에게 가르치고, 졸업 프로젝트들 감독하며 “웹 비어리 교육자상 Webb Bierley Teaching Award”을 수상하기도 했다. 외에도 독립예술가로 활동하는 동안 미국의 미시간 대학교, 앤더슨 대학교, 아메리칸 댄스 페스티벌, 무브먼트 리서치, 댄스 뉴 암스테르담, 캐나다의 캘거리 대학교, 멕시코의 국립현대무용 제작센터, UDLAP 대학교, 한국에서는 국립현대무용단, 서울국제안무워크숍, 서울탄츠스테이션, 국립현대미술관 창동레지던시, 서울예술대학교, 성균관대학교, 국민대학교, 경희대학교, 성신여자대학교, 서울교육대학교, 전북대학교, 계명대학교, 한국종합예술대학교 - 등에서 가르치며 예술적 실천을 반영하는 수업을 통해 학생들과 깊이 소통해왔다. 국립현대무용단 안애순 안무 퍼포먼스 코치 (‘22-23), 아시아문화전당 안무랩의 멘토(‘19-21), 뉴욕예술재단 이민예술가 프로그램의 안무 멘토(‘14) 등을 맡았으며, 현재는 미국의 유아츠 대학교 University of the Arts의 대학원 안무과정에서 원거리로 졸업작품 멘토링을 하고 있다. 그녀는 역동적 신경인지심상 Dynamic Neurocognitive Imagery (DNI)™ 베이스의 소매틱 방법론인 프랭클린 메소드 Franklin Method® 의 공인 움직임 교육자이기도 하다.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">수업은 지속적인 과정이고, ‘더 준비된 상태'를 미세 조정하는 공간이다. 움직이고, 창조하고, 탐색하고, 감흥을 불러 일으키고, 비판할 수 있는 더 준비된 상태로서의 포털 신체를 만드는 것이다. 참가자들은 ‘몸 안에 있는 실제 느낌'을 통해 우리가 살고 있는 세상에 대한 지식을 습득하고 이와 관계 맺는 다양한 방법을 탐구한다. 이러한 앎의 방식은 '몸의 지혜'라 불릴 수 있다.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">가르친다는 것은 참여자 각자가 자신의 몸의 지혜를 터득하는 시간과 공간을 창발하는 것이다. 나는 ‘지시’ 보다는 ‘촉진’의 방법을 믿는다. 체현의 과정을 통해 스스로 생각하고 변화하는 순간에 도달하는 것이다. 실험적인 학습, 다학제적인 접근, 권력의 분권화가 가능하게 하기 위해 함께 가르치기(co-teaching)을 선호하기도 한다.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">진심을 다해 던지는 ‘어떻게'에 관한 질문은 다음과 같다.</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 물리적, 개념적, 메타인지적 공간을 어떻게 함께 활성화할 수 있을까?&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 어떻게 하면 우리는 서로가 힘을 실어줄 선택들, 즉 신중하고 책임감 있는 선택을 할 수 있도록 도울 수 있을까?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 감각적 경험, 과학적 정보, 직접적 참여, 심상, 추상화 등과 같은 재료와 방법이 어떻게 활용될 수 있을까?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 참여하는 각기 다른 몸은 다양한 학습 곡선에 어떻게 함께 가치를 둘 수 있을까?</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 가르치는 경험은 어떻게 배움에 대한 인식을 형성하기도 하나?&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">- 우리는 서로를 돌보기 위해 피드백과 피드포워드를 어떻게 활용할 수 있을까?</span></span></p>
        
        
    </div>
    `
  },
  '/the-flowing-2021-23': {
    title: 'the flowing. (2021-23) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_b7317bff577543c09724cf84e305c7f6_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_ace372e1978b4869a3d476629fcac81a_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a573d8a198764e52b06cf4bb751ffac6_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“Jang opens a space where the audience, standing on the direct tremors of nerves, lights one’s own torch—jointly rupturing, or being ruptured, within the dark resonance... This is a masterpiece that needs to be slowly savored during the contemplative time ahead.”<br class="wixui-rich-text__text">
        — Dance Magazine MOMM, 2021</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">the flowing. </span>is a corporeal practice for mourning, a precarious song for the precarious, and a requiem for those history has failed to name. Here, the body does not represent loss—it becomes its living terrain. A single body shares the stage with a weighted companion object—part anchor, part echo chamber. Its unstable swaying sets off a cascade of kinetic responses: falling, faltering, leaning, resisting. Rather than following choreography in the traditional sense, the dancer tunes to a form of ghost logic—an attunement to residual forces, ancestral pulses, and sensory disruptions that arrive uninvited. Through slow, spiraling actions and erratic suspensions, the air thickens with gestures that don’t resolve, with shapes drawn but never sealed. Movement emanates from within—through ankles, skin, spine—and radiates outward in quiet insistence. Breath becomes sound, tremor becomes language, and grief becomes collective.&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">the flowing.</span> emerges from within societies where grief is privatized, feminized, or denied. It proposes mourning as a somatic commons—a shared practice of remembering those disappeared by labor, care, exile, medical neglect, and political abandonment. It honors not just who we lost, but what we were not allowed to grieve. You are not asked to understand. You are asked to stay—with the pulse, the descent, the haunted tempo of survival.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“These bodily expressions resemble a form of non-human beings, detached from will... suggesting a state where no body can move forward alone.”<br class="wixui-rich-text__text">
        — Art Scene, 2021</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“The body, holding breath and life, became audible and visible in its most fragile form—awakening a vivid sense of presence for the audience. Through the dense immediacy of flesh, the performance revealed where the strong mediator, through which breath cannot escape, was located. It was a meticulously crafted work, precise in both concept and sensation.”<br class="wixui-rich-text__text">
        — Hyungbin Jo (Dance Critic), 2021</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://star-century-379.notion.site/b53aec0282984e2c8499a12b3810545d" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">Link to Choreographer’s Note</a></span></span>​​​​​</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Choreography/Performance/Text by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound Design by Jimmy Sert</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Dramaturgy (2021 Premiere) by Bittnarie Shin</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Visual Design (2021 Premier) by Seung Woo Han &amp; He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Visual Management (2023 Touring) by Yewon Seo</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by: Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Sinchon Arts Space, Dancers’ Career Development Center Korea</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue:</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2021 Seoul International Dance Festival, Sinchon Arts Space, Korea<br class="wixui-rich-text__text">
        2023 ProSeries, University of Calgary, Canada</p>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“장혜진 안무의 이번 공연은 직접적인 신경의 떨림 위에서 관람객들 자신의 존재가 스스로 등불을 켜고 그 어두운 공명 속에서 함께 파열하는/파열시키는 장을 열었다고 할까... 안무는 굉장히 문제적이었고, 전체적으로 지금부터 사유의 묵히는 간 동안에 천천히 음미해 봐야 할 걸작이 아닌가 한다.”</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">&nbsp;—&nbsp; 2021년『월간잡지 몸』</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">&lt;흐르는.&gt;은 애도의 몸짓이자, 불안정한 존재들을 위한 노래이며, 역사의 언어로는 호명되지 못한 존재들을 위한 신체의 진혼곡이다. 이 작품에서 몸은 상실을 재현하지 않는다. 몸 자체가 상실이 머무는 지형이 된다.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">공연은 하나의 몸과 하나의 동반 오브제로 구성된다. 그 오브제는 묵직한 중심이자, 메아리의 공간, 그리고 흔들리는 경계이며, 그 불안정한 진동이 무용수의 반응을 유도한다 — 넘어지고, 망설이고, 기대고, 저항하는 움직임들. 이 안무는 전통적인 의미의 움직임 구조를 따르지 &nbsp;않고, 유령적 논리(ghost logic)에 조율된다. 그것은 남겨진 힘, 선조의 리듬, 예고 없는 감각 교란에 대한 신체의 조율이다. 회전하듯 이어지는 느린 동작들과 갑작스러운 중단들 사이, 공기는 끝맺지 못한 제스처로 짙어지고, 완결되지 않은 선이 그려진다.<br class="wixui-rich-text__text">
        움직임은 발목과 피부, 척추와 같은 내면에서부터 시작되어, 조용하지만 단호하게 외부로 퍼진다. 숨은 소리가 되고, 떨림은 언어가 되며, 애도는 개인을 넘어 공동의 감각이 된다.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">&lt;흐르는.&gt;은 애도가 사유화되고, 여성화되고, 혹은 금지되는 사회로부터 태어났다. 이 작품은 애도를 감각의 공유지(somatic commons)로 제안한다. 노동, 돌봄, 망명, 의료 방치, 정치적 배제 속에서 사라진 존재들을 함께 기억하는 실천의 장이자, 우리가 애도조차 허락받지 못한 것을 위해 몸으로 남기는 응답이다. 관객은 이곳에서 맥박과 낙하, 그리고 생존의 유령이 두드리는 리듬 속에 잠긴다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“장혜진의 움직임은 중심을 신체 전체로 퍼뜨리고 미세하게 옮기며 소위 흐늘거리고 바들거리는 신체 양상을 만든다. 이러한 신체의 움직임은 인간을 벗어난 비인간의 형상에 가깝다... 독단적으로 어떤 신체도 앞으로 나아가지 못하는 상태, 전체의 신체가 하나의 부분 신체를 벗어나지 못하는 어떤 상태를 보여준다.”</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">—&nbsp; 2021년,『아트신』</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“숨과 생명을 붙잡는 것으로서의 육체와 그것이 뿜어져 나와 청각화/시각화되는 과정은, 퍼포먼스로서 관객에게 그 존재감을 생생히 일깨우는 하나의 과정이 된 것이다... 살덩이의 존재감을 통해 숨이 벗어던질 수 없는 ‘강한' 매개가 어디에 놓여져 있는지를 보여준 치밀한 퍼포먼스가 되었다.”</span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">—&nbsp; 2021년 조형빈 평론가</span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://star-century-379.notion.site/b53aec0282984e2c8499a12b3810545d" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">안무가의 글 링크</a></span></span>​</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">컨셉/안무/출연. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사운드 디자인. 지미 세르</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">드라마투르기(2021). 신빛나리</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">비주얼 디자인(2021). 장혜진, 한승우</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">비주얼 매니저(2023). 서예원</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부, 전문무용수지원센터, 신촌문화발전소</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴.&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2021 SIDance 국제무용페스티벌, 신촌문화발전소, 한국&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">2023 ProSeries 페스티벌, 캘거리대학교, 캐나다​​​​​<a href="https://mybox.naver.com/share/list/viewer/3472569161967081808?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">​​</a>​</p>
        </div>
    `
  },
  '/visceral-body-workshop-for-visual-artist': {
    title: 'Visceral Body Workshop for Visual Artist | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text">Visceral Body Workshop for Visual Artists<br class="wixui-rich-text__text">
        시각예술가를 위한 워크숍: 비써럴 바디</span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_04a5362b22074f43b064edd4f716f398_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_55d8630810ed4d9492c838bfad581d6f_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">This workshop is for visual artists to experiment with movement, welcoming the interference and entanglement between body and affect. It includes practices of thinking through bodies, moving, discussing the viewing materials. We aim to capture what the body and affect can do, without questioning what they are. We will pay attention to the interconnections and gaps between the two, and attempt to orchestrate a 'felt sense' through movement. To understand affect as a biological/physical response, the workshop begins with movement that activates the nervous system, moving into scores and structures to weave time through embodied improvisational practices. How can we, as bodies, attune to the rise of affective tonalities, attractions and transpositions? Visual artists are welcome to participate in this ongoing process of encountering and exceeding the body's visceral response.</span></span><br class="wixui-rich-text__text">
        &nbsp;</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">이 워크숍은 시각예술가들을 위한 신체 워크숍으로 몸과 정동(affect) 그 사이의 간섭과 혼선을 환영하며 움직임을 실험한다. 신체를 느끼며 움직이는 것, 그것을 사유하는 것, 그것에 관해 함께 이야기하는 것, 사례를 보는 것 –의 프랙티스를 포함할 것이다. 우리는 신체가 무엇이고 또 감흥이 무엇인지 묻지 않은 채, 이를 기습적으로 포착할 것이다. 둘의 상호 연관성과 틈새에 주의를 기울이고 움직임으로 그 ‘기분’을 조율해 볼 것이다. 생물학적/신체적 반응으로서의 정동을 이해하기 위해 신경계를 활성화하는 움직임으로 워크숍은 시작되며, 스코어와 구조, 체화된 즉흥 프랙티스를 통해 시간을 직조한다. 몸으로서의 우리는 어떻게 정동의 분위기, 끌림, 뒤바뀜을 만나며 친숙해 질 수 있을까? 신체의 본능적 반응을 만나며, 계속되어 초과하는 과정에 참여할 시각예술가들을 환영한다.</span></span></p>
        
        
    </div>
    `
  },
  '/we-need-9-dance-songs-seriously-2023': {
    title: 'We Need 9 Dance Songs, Seriously (2023) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">We need 9 dance songs, Seriously&nbsp;</span></span></span><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text">(2023)<br class="wixui-rich-text__text">
        춤을 위한 노래는 적어도 9개는 필요하지 (2023)</span><br class="wixui-rich-text__text">
        <span style="font-size:20px;" class="wixui-rich-text__text">with Tangerine Collective</span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_cbffd7a96f7a4be495d6ef38d29396cc_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="wixui-rich-text__text">​​</span><span class="wixui-rich-text__text">​</span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">We need 9 dance songs, Seriously</span> sings the love of dance that is not-yet-performed. We listen to the stories of others and contemplate ways to spend time together around dance, reflecting on symbiosis, solidarity, and care. We welcome unproductive laziness, taboos, and hatred in dance,&nbsp; along with its dark chronicles. We summon dance that exists but is invisible. The more it gets forbidden, the more it dances with desire. The 9 songs are a practice to subvert the recursive 'Choreophobia' that occurs across borders. It is an act of escape from colonial thinking by using materials with no mass so they don’t occupy space. The AVP lab is a relational room where the dancing dialogue evolves through experiments and practices of being together, exchanging, and sharing differences. In what way can bodies, roles, relationships, and knowledge coexist within the time and space where the dance songs flow?</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Curation and Host by Tangerine Collective(He Jin Jang, Jaelee Kim, Jee-ae Lim)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Music Direction by Noddy Woo</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Graphic Design by Macadamia Oh</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Curatorial Assistant by Yewon Seo</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Organized by AVP Pavillion</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Supported by Korea Arts and Management Service, Ministry of Culture, Sports and Tourism Korea</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span></p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_bcefc66b2c104d0b9a0dcd1c531ea7ca_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_7c641a05e0054b97a4e8b76ad3722af0_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">탠저린 콜렉티브의 일원으로 공동기획과 창작. &lt;춤에 관한 노래는 적어도 9개는 필요하지&gt;는 행사되지 않는 춤을 사랑의 마음으로 노래한다. 춤의 이야기를 함께 살피고, 춤의 언저리에서 함께 시간을 보낼 수 있는 방법을 생각한다. 공생과 연대 그리고 돌봄을 이야기한다. 춤의 낭비와 비생산적인 게으름, 춤의 금기와 혐오, 춤에서의 어둠의 연대기를 환대한다. 존재하지만 보이지 않는 또는 금지할수록 더욱더 존재하는 춤을 노래한다. 9개의 노래는 문화, 국경을 넘어 되풀이되는 ‘안무혐오/춤 공포증(choreophobia)’을 전복하는 실천이다. 질량을 갖지 않고 공간을 점유하지 않은 물질을 도구로 식민지적 사고에서 벗어나는 시도이기도 하다. 전시장은 ‘다름’의 접촉, 함께 있기, 교환하기, 공유하기의 실험 및 실천을 통해서 춤에 대한 대화의 진화가 일어나는 공간으로 구성된다. ‘co-care’와 ‘co-curation’의 행위가 일어나는 관계의 집합소로 확장된다. 춤의 노래가 흐르는 시간과 공간 안에서 마주하는 몸, 역할, 관계 그리고 지식은 어떠한 방식으로 서로 이웃할 수 있을까?</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">​</span></span><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">기획/주최. 탠저린 콜렉티브 (김재리, 임지애, 장혜진)</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">음악감독. 노디 우</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">그래픽 디자인. 마카다미아 오</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">어시스턴트 큐레이터. 서예원</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">주관. 시청각 랩 (AVP Lab)&nbsp;</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">후원. 예술경영지원센터, 문화체육관광부</span></span></p>
        
    </div>
    `
  },
  '/weekly-weakly-2020': {
    title: 'Weekly Weakly: Performance (2020) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_b1b258545e8a4cf1806e83065dbdf052_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_3e475cd839534e98bd7b60e0fd1307d3_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <div class="video-container" style="margin-top: 40px; margin-bottom: 40px; display: flex; justify-content: center; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; aspect-ratio: 16/9;">
          <iframe src="https://www.youtube.com/embed/txeRO7ZwbYU?rel=0" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">What if weakness were not a limitation, but a choreographic condition? Weekly Weakly is a weekly laboratory for choreography and feminist thinking, where softness, slowness, and hesitation are practiced not as failure, but as form. Over 27 weeks, the lab unfolded as a poetic framework: one where minor sensations, delays, and hesitations became both score and method. This performance, marking the 27th week of the lab, asked: how can a sustained practice of feminist weakness be staged without becoming spectacle? What does it mean to perform slowness, porousness, or pause—without resolving them? Emerging as a practice-as-performance, <span style="font-style:italic;" class="wixui-rich-text__text">Weekly Weakly</span> lingered between workshop and stage, rehearsal and ritual. The result was a quietly potent exploration of choreography not as mastery, but as soft attention.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Concept and Choreography by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Performance by He Jin Jang, Ursula Eagly, Hyeongbin Cho</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound by He Jin Jang</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, ONSU GONG-GAN</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue: Movement Research at Judson Church, U.S​</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">연약함을 결핍이 아닌, 안무의 조건으로 상정한다면 어떨까?《위클리 위-클리》는 매주(Weekly), 연약함(Weakly)을 나누는 안무 실험실이자, 여성주의적 실천이 몸을 통과하는 일상의 연구 장이다. 이 프로젝트에서 연약함은 춤을 위한 최소한의 환경, 미소서식지로 작동하며, 지연, 미세한 감각, 머뭇거림 같은 요소들이 점차 하나의 방법론이자 스코어가 되었다. 27주간의 연약함 실험을 기반으로 한 이 퍼포먼스는 ‘실천으로서의 공연(practice-as-performance)’이라는 형식을 통해 무대에 오른다. 여기서 질문은 다음과 같다: 연약함의 수행은 어떻게 공연이 될 수 있는가? 그것은 어떻게 파열이나 해석 없이, 머무는 감각으로 존재할 수 있는가? 워크숍과 공연, 리허설과 의례 사이를 흐르며 나타난 이 퍼포먼스는, 안무를 기술이나 통제의 영역이 아닌 ‘부드러운 주의’의 상태로 다시 사유하게 만든다.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">컨셉/안무. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">퍼포먼스. 어술라 이글리, 장혜진, 조형빈</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사운드. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부, 온수공간</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴. Movement Research at Judson Church, 미국<span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span></span><span class="wixui-rich-text__text">​</span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">​</span><a href="https://mybox.naver.com/share/list/viewer/3472569162129446480?shareKey=_Ptwu1g-7gl6OfeCMT8ZAUmZ23OkMG6WR1fnzMSrsSKgizhhh6dm7GAMwif7I7S-Dg%3D%3D" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-weight:400;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="color:#00B3FF;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">​</span></span></span></span></span></a></span><span style="font-size:14px;" class="wixui-rich-text__text"><span class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span>​</span>​</span></p>
        </div>
    `
  },
  '/whirling-skin-2024': {
    title: 'Whirling Skin (2024) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <div class="N8MGzv _v6ohL PO9MfV comp-maqdwsa9 wixui-rich-text" data-testid="richTextElement" id="comp-maqdwsa9"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="wixui-rich-text__text" style="font-size:25px;"><span class="wixui-rich-text__text" style="color:rgb(0, 0, 0); font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3, wf_b36572e3503346f5964dd41f1, orig_noto_sans_kr_semibold; font-style:italic;">Whirling Skin (2024)<br class="wixui-rich-text__text"/>
​혼륜 피부</span></span></h6></div>
<div class="N8MGzv _v6ohL PO9MfV comp-maqdwsaf1 wixui-rich-text" data-testid="richTextElement" id="comp-maqdwsaf1">


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





























<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">&lt;혼륜 피부&gt;는 2023년에 시작된 동의보감 ‘은형법’에 대한 연구가 확장된 사운드 설치 작업이다. 400년 전 왜란과 전염병의 시대에 연습되어진 ‘몸의 형체를 숨기는 법’을 일종의 스코어로 인식한 장혜진 안무가는 공동연구자들과 사변적 대화, 문헌연구, 움직인 연구, 스토리텔링, 개인적 깨달음의 시간을 가지며, 작년 2023년 8월 멀티센소리 공연으로 발전시켜 관객을 초대했다.“재난과 질병의 순간 조상들에게 몸, 공동체, 돌봄은 무엇이었을까? 이러한 토착적 지혜가 지금 ‘존재론적 전환(Ontological Turn)’의 시대에 던질 수 있는 이야기는 무엇일까?” 2024년 7-8월, 두 달의 기간 동안 장혜진 안무가는 허성욱 퍼포머와 은형법의 배경이 되는 신체관을 천천히 살펴보았다. 우리 조상들의 토착적 신체관은 어떻게 지금 우리의 존재 방식과 평행하게 어긋나며 만나게 될까?</span></span></span></p>

<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">컨셉, 연출. 장혜진</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">텍스트, 목소리. 장혜진, 허성욱</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">녹음. 이도현</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">사운드 믹싱. 서민우</span></span></span></p>

<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">제작지원. 아트프로젝트 보라</span></span></span></p>
<p class="font_8 wixui-rich-text__text" style="font-size:15px; line-height:1.6em;; text-align: justify;"><span class="wixui-rich-text__text" style="font-size:15px;"><span class="wixui-rich-text__text" style="font-weight:normal;"><span class="wixui-rich-text__text" style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;">베뉴. 2024 코레오-그래피 @ 서울대학교 파워플랜트, 한국</span></span></span></p></div>
                
      </div>
    `
  },
  '/workshop-making-it-work': {
    title: 'Workshop: Making (it) Work | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="color:#000000;" class="wixui-rich-text__text">Workshop: Making (it) Work<br class="wixui-rich-text__text">
        워크숍: 메이크 (잇) 워크</span><br class="wixui-rich-text__text">
        &nbsp;</p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_dabdea10da53431bbaddd636564f2124_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_55d8630810ed4d9492c838bfad581d6f_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">This workshop focuses on the creative process of making movement-based performance/dance in a contemporary context. It invites an interference of choreographic planes, within the frame of a laboratory, the planes encompassing making, living presences, and thinking philosophy. Through a co-researching setting, we experiment with tapping into each other’s making. Together, we explore the concept of the ‘choreographer as a system designer.’ By interconnecting the acts of creating, performing, viewing (each other’s work), and reading article’s, we find ways to bridge the gap between private imagination and public actualization. Here, we aim to articulate the process both as makers and viewers. We practice group problem-solving based on joint responsibility, simultaneously engaging in sharing, exposing, and being seen. This is an interplay between critical thoughts, contextualization, and embodiment. To gain a better understanding of personal style and preferences through composition and improvisation studies, we question our creative process through the in-depth dialogue about the work of fellow participants. We consider the moment of sharing as a civic moment. What can we allow to appear to let choreography emerge as a ghostly autonomous creature, the hallucinatory, the excess of everyday living? We will recognize tools to capture/locate/situate/instantiate ways to ‘make it work’ for ourselves.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span style="font-size:14px;" class="wixui-rich-text__text">이 워크숍은 동시대적 맥락에서 움직임에 기반한 공연과 춤을 만드는 창작 과정에 초점을 맞춘다. 실험실이라는 틀 안에서 ‘안무적임'과 여러 다른 차원들 것들 간의 간섭과 혼선을 환영한다. 그 차원의 층위에는 작업을 만들어 내는 것, 그리고 현존을 살아가는 것, 철학을 사유하는 것이 모두 포함되어 있다. 공동 연구의 환경을 통해 우리가 서로를 어떻게 활용할 수 있는지 실험하며, 시스템의 구조를 만드는 안무의 과정을 탐구한다. ‘만들기’, ‘퍼포밍하기’, ‘서로의 작업을 보기’, ‘글 읽기’ 이 4가지를 상호 연결함으로써 사적인 상상력과 공적인 실현을 연결하는 방법을 찾는다. ‘만드는 자’인 동시에 ‘감상하는 자’로서의 과정을 명확하게 발화하는 것을 시도하며, 때로는 공동의 책임의식과을 통해 집단의 지성을 통한(특정)집단의 문제의 해결을 시도한다. ‘나를 보여주기/나의 것을 나누기’를 연습하며, 비판적 사고, 맥락화, 체화 사이를 횡단한다. 창작과 즉흥의 과정 안에서 개인의 스타일과 선호를 긴밀히 이해하며, 동시에 동료 참가자와의참가자과의 작업에 대한 심도있는 대화를 통해 자신의 창작 과정에 질문을 던지기도 한다. 우리는 집단으로서의 공유의 순간을 시민적 순간으로 간주한다. 안무가 유령 같은 자율적 생명체, 환각적인 것, 일상 생활의 과잉으로 등장할 수 있도록 우리는 무엇을 허락할 수 있을까? 우리는 작업하기 위한 방법을 포착/위치/상황/실증할 수 있는 안무 도구를 알아차리게 될 것이다.</span></span></p>
        
    </div>
    `
  },
  '/workshop-weekly-weakly': {
    title: 'Workshop: Weekly Weakly | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-size:28px;" class="wixui-rich-text__text"><span style="color:#000000;" class="wixui-rich-text__text">Workshop: Weekly Weakly<br class="wixui-rich-text__text">
        <span style="font-style:normal;" class="wixui-rich-text__text"><span style="font-weight:400;" class="wixui-rich-text__text">워크숍: 위클리 위-클리 (매주 연약하게)</span></span></span></span></span></p>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_c83f116384e74ea2855cc6d31a9e3586_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_32376a4bbf6349e7afd8ed1666e516b2_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">Weekly Weakly’ is a weekly laboratory of weakness designed by He Jin Jang Dance. Every week since August 2019, the choreographer He Jin Jang has been running a 'poetic frame of research salon' where she practices and philosophizes through weakness with fellow artists or alone. This laboratory is a space of practice itself, and sometimes becomes a public workshop/exhibition/performance. ‘Weekly Weakly’ was shared publicly as an exhibition at ONSU GONG-GAN (Korea), as a lecture at the Oil Tank Culture Park (Korea), as a workshop at Seoul Dance Center (Korea), Sinchon Arts Space in Korea (Korea), Saison Foundation (Japan), and as a performance at Movement Research at Judson Church in the United States. This workshop realizes weakness as a very special state of energy. In Weekly Weakly, weakness is not the opposite of strength, nor a flaw or a blemish. Rather, it is something that permeates all of us. Weakness becomes a precarious magic carpet, taking us to strange moments of performance. Participants are welcome to come join to move, talk, write, read, and touch the fragile. No previous movement experience is required.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_bcf5fbef13f34cda81de73a4ee8873cc,wf_bcf5fbef13f34cda81de73a4e,orig_noto_sans_kr_regular;" class="wixui-rich-text__text">‘위클리 위-클리 Weekly Weakly (매주 연약하게)’는 He Jin Jang Dance가 설계한 연약함을 위한 주간 실험실이다. 안무가 장혜진은 2019년 8월부터 매주(Weekly) 동료예술인들과 함께 혹은 홀로 연약함을 관통해(Weakly) 안무를 연습하고 철학하는 '시적 프레임의 리서치 살롱 (poetic frame of research salon)'을 운영해왔다. 이 실험실은 그 자체로 연습이 되거나 공개 워크숍/렉처/전시/공연 등이 되어서 한국의 온수공간, 서울무용센터, 문화비축기지, 신촌문화발전소와 미국의 Movement Research, 일본의 Saison Foundation 등에서 공유되었다. 이 워크숍은 연약함을 매우 특수한 힘의 상태라고 인식한다. ‘위클리 위-클리’에서 약함은 강함의 반대말이 아니고, 결점이나 오점이 아니다. 오히려 연약함/나약함/취약함/쇠약함은 우리 모두의 몸을 관통하고 있는 것이며, 위태로운 마법의 양탄자가 되어 우리를 '기이한 공연적 순간'에 데려다주기도 한다. 움직임 전문가뿐만 아니라 비전문가 참여자들에게 모두 열린 워크숍이고, 연약한 모습 그대로 움직이고, 말하고, 쓰고, 읽고, 만질 준비를 해오면 된다.</span></span></p>
        
        
    </div>
    `
  },
  '/you-cannot-disinvite-x-being-2021': {
    title: 'You Cannot Disinvite X-being (2021) | He Jin Jang Dance',
    render: () => `
      <div class="content-page">
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_f4742cecc7e54e27b34dff2a13d800d3_mv2.jpeg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_d31b065d0c0f4328b5c903103ed0e3a4_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <div class="video-container" style="margin-top: 40px; margin-bottom: 40px; display: flex; justify-content: center; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; aspect-ratio: 16/9;">
          <iframe src="https://www.youtube.com/embed/9iheH5OntoA?rel=0" style="width: 100%; height: 100%;" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">At the heart of Y<span style="font-style:italic;" class="wixui-rich-text__text">ou Cannot Disinvite X-being</span> is a duet between two women. Their shared choreography builds a tense and tender architecture—of mutual listening, sonic interference, and porous alignment—that quietly summons other presences. Through hacked nervous systems, reverberating microphones, a humming engine, and onions flying in circles, they co-create a space where many x-beings might arrive—uninvited, partial, insistent.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">In a world increasingly governed by the categorization of bodies—who counts as living, whose grief is recognized, whose voice is heard—this piece asks: What if we are already cohabiting with the uninvited? What if being-together is always haunted, incomplete, and permeable?</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">The x-being resists definition. It may be the erased, the excluded, the not-yet-counted. The audience is not simply observing; they arrive as vibrating x-beings themselves, drawn into a shared sensory field where separations blur and subtle transmissions take place.</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-style:italic;" class="wixui-rich-text__text">“The most crucial clue to deciphering He Jin Jang's choreography lies in her approach to material in dance... She incorporates the neuroplastic act of ‘being-with’ into a conscious and active choreographic method.”<br class="wixui-rich-text__text">
        — Bittnarie Shin (Dramaturg), 2021</span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Concept and Artistic Direction by He Jin Jang</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Co-choreography and Performance by He Jin Jang and Myeungshin Kim</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Sound Design by Jimmy Sert</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Dramaturgy by Bittnarie Shin</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Visual Design by He Jin Jang &amp; ADOH (Seungwoo Han, Jinwoo Oh)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Lighting Design by Minsoo Kim</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Stage Direction by Taeyoung Maeng</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Technical Direction by Youngsoo Choi</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Visual Documentation by Bokco (Jinwon Lee, Booyoun Park, Min Lee)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Teaser Clip Production by Bokco</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Producer by Eunji Park</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Promotion by Bokdongsan (Beomjun Kim, Eunji Park)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Graphic Design by Jjungkimsoree</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Operation/Coordination by Taehwan Park</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Produced and Hosted by He Jin Jang Dance</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea, Seoul Street Arts Creation Center, Korea Creative Content Agency</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">International Support by The Saison Foundation as a resident artist in 2021-22, with funding from the Agency for Cultural Affairs, Government of Japan in Fiscal Year 2021</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">Venue: Seogang Marry Hall Main Theater, Korea</p>
        
        
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a338769225504fc98bec522c7bbcb1d9_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">두 명의 여성 퍼포머, 울리는 마이크, 신경계 해킹, 굉음을 내는 엔진, 원형 운동하는 양파, 그리고 허밍 — 이들은 무대 위에서 서로 얽히며 유령적 존재들의 리듬과 관계성을 생성하는 재료들이 된다.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><br class="wixui-rich-text__text">
        《당신은 x-존재를 초대하지 않을 수 없다》는 40대 여성의 2인무로, 정체를 알 수 없는 다른 존재들(x-being)이 그 사이에 끼어들고, 맴돌며, 함께 진동하게 되는 공동의 장을 도모하는 작업이다. 이들은 공명, 방해, 긴장감, 그리고 친밀성을 기반으로 관계를 구축하며, “‘둘’이 아닌 ‘다수’를 위한 공간”을 무대 위에 출현시킨다.</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">오늘날 누가 ‘살아 있는 존재’로 여겨지는가, 누구의 죽음은 애도되고 누구의 목소리는 들릴 수 있는가 — 이 작업은 몸의 분류와 위계에 대해 질문한다. 우리는 이미 초대받지 않은 존재들과 함께 살고 있는 것은 아닐까? ‘함께 있음’이란 본래부터 불완전하고, 그 사이를 박동하는 죽음들로 인해 경계 너머로 흔들리는 일이 아닐까?</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">이때 x-being은 단순한 상징이 아닌, 사이에 실재하는 감각의 흐름이다. 지워진 존재, 이름 붙을 수 없는 존재, 아직 도착하지 않은 존재, 그리고 예기치 않게 스며드는 존재들. 관객 역시 단순한 관찰자가 아니다. 그들은 진동하는 x-being으로서 현장에 도착한다. 불분명하게 떨리고, 모호한 경계를 건드리며, 설명할 수 없는 친밀함 속으로 진입한다. 두 여성이 사라짐을 거부하는 존재들을 무대 위로 불러내는 동안, 다중의 몸을 관통하는 떨림은 배제와 삭제의 논리에 저항하는 감각적 행위로 확장된다.</p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">“가장 중요한 단서는 그가 무용에서의 물질을 다루는 방식, 곧 안무 방법론이다… 장혜진이 ‘함께 있음(being-with)’이라는 신경가소적 행위 자체를 의식적이고 적극적인 안무의 방법으로 사용했다는 것을 보여준다.”<br class="wixui-rich-text__text">
        — 2021년, 신빛나리 드라마투르그</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><a href="https://docs.google.com/document/d/1sxKgnZG6KyiHJ-O8xB94q2vLBj-04o_YEzoaNpyEl0E/edit?usp=sharing" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text"><span class="color_38 wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text">안무가의 글 링크</span></span></a></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">컨셉/안무/연출. 장혜진</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">창작/퍼포먼스. 장혜진, 김명신</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">무대감독. 맹태영&nbsp;</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">기술감독. 최영수</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">조명감독. 김민수</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사운드 디자인. 지미세르</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">비주얼 디자인. ADOH (한승우,오진우)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">드라마투르기. 신빛나리</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">영상기록. 복코</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">사진기록. 복코</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">티저 제작. 복코</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">그래픽 디자인. 정김소리</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">프로듀서. 박은지</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">홍보/운영. 복동산 (박은지, 김범준)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">코디네이터. 박태환</p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">주최/주관. He Jin Jang Dance</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">후원. 한국문화예술위원회, 문화체육관광부, 거리예술창작센터, 콘텐츠문화광장, 신촌문화발전소</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">국제 후원. The Saison Foundation Japan Residency, 일본 문화청 (The Agency for Cultural Affairs, Government of Japan)</p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;">베뉴. 서강대 메리홀 대극장, 한국​</p>
        
        
        </div>
    `
  },
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

function route() {
  let path = window.location.pathname;
  try {
    path = decodeURIComponent(path);
  } catch (e) {
    // ignore
  }
  path = path.replace(/\/+/g, '/');
  
  let page = routes[path];
  if (!page) {
    // Try to match by ignoring encoding differences
    const matchedKey = Object.keys(routes).find(key => {
      try {
        return decodeURIComponent(key) === path || key === window.location.pathname;
      } catch (e) {
        return key === path;
      }
    });
    if (matchedKey) page = routes[matchedKey];
  }

  if (!page) {
    page = {
      title: 'Project | He Jin Jang Dance',
      render: () => renderGenericWork(path)
    };
  }

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

  // Initialize scroll animations for the new content
  initScrollAnimations();

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
      const targetPath = link.getAttribute('href');
      if (targetPath && targetPath !== window.location.pathname) {
        window.history.pushState(null, '', targetPath);
        route();
      }
    });
  });
}

// Listen to navigation events
window.addEventListener('popstate', route);

function setupMobileNav() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const body = document.body;

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      body.classList.toggle('mobile-nav-open');
    });
  }

  // Handle Accordion for Dropdowns on mobile
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach(parent => {
    const link = parent.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          parent.classList.toggle('accordion-open');
        }
      });
    }
  });

  // Close mobile menu when a dropdown link is clicked
  const dropdownLinks = document.querySelectorAll('.dropdown li a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        body.classList.remove('mobile-nav-open');
      }
    });
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll('.content-page p, .content-page img, .about-section p, .about-section img');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => {
    el.classList.add('fade-in-up');
    observer.observe(el);
  });
}

// Initialize Router
document.addEventListener('DOMContentLoaded', () => {
  route();
  bindLinks();
  setupMobileNav();
});
