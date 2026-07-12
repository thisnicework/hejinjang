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

// Initialize Router
document.addEventListener('DOMContentLoaded', () => {
  route();
  bindLinks();
});
