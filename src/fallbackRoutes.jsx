// ============================================
// 기존 바닐라 JS HTML 콘텐츠 백업 (Vite -> React 전환용 Fallback)
// Sanity CMS에 데이터가 등록되지 않았을 때 기존 사이트 콘텐츠를 100% 원본 그대로 표시합니다.
// ============================================
import React from 'react';

export const fallbackRoutesHtml = {
  '/': {
    title: 'Home | He Jin Jang Dance',
    render: () => ''
  },
  '/about-bio': {
    title: 'About | He Jin Jang Dance',
    html: `
      <div class="content-page" style="padding: 40px 0;">
        <div style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            <span style="color: #FF00CB;">HE JIN JANG</span><br>
            Choreographer · Researcher · Educator<br>
            2026 ImPulsTanz Faculty<br>
            Assistant Professor of Dance, Seoul Institute of the Arts<br>
            Unseaming. — Best Work of 2025, Korean Dance Critics Association
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            He Jin Jang is an award-winning choreographer, researcher, and educator whose work approaches choreography as a method of sensing, remembering, and transforming embodied experience. Based in Seoul and working internationally, her practice moves across contemporary dance, experimental performance, writing, installation, and somatic research. Her works engage vulnerability, invisibility, grief, and embodied memory, treating the body as a site where personal, social, and historical forces converge. MOMM, a Korean dance magazine, has described her as “a daring and candid choreographer.”
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            She is the Artistic Director of He Jin Jang Dance, a project-based choreographic platform formed through fluid constellations of collaborators rather than a fixed ensemble. HJJD creates performances, workshops, and discursive formats that blur boundaries between choreography, ritual, and collective sensing. Since its U.S. debut in 2008, Jang’s work has been presented across more than thirty cities at festivals and institutions including the Seoul International Dance Festival, MODAFE, Platform-L Contemporary Art Center, the National Museum of Contemporary Art in Bucharest, Musikfestival Bern, New York Live Arts, and The Kitchen.
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            Her 2025 work Unseaming. was named a Best Work of 2025 by the Korean Dance Critics Association. Her projects have been supported by the Seoul Foundation for Arts and Culture, Arts Council Korea, and the Korea Arts Management Service. She has been invited as an artist, fellow, and resident by institutions including danceWEB, Movement Research, New York Live Arts, the Saison Foundation, and T:Works. Alongside her choreographic practice, she has contributed as a curator, mentor, performance coach, dramaturg, and artistic advisor in Korea and internationally.
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 24px; line-height: 1.6;">
            Her teaching and research draw on improvisation, text, imagery, somatic movement practices, feminist theory, Korean ritual traditions, and socio-political inquiry. In 2026, she joined the faculty of ImPulsTanz – Vienna International Dance Festival, leading three workshops that explore dissolving bodies, weakness as choreographic intelligence, and porous modes of improvisation. Her workshops cultivate internal listening and relational attunement, creating environments in which movement emerges through subtle bodily shifts and changing states of permeability. She describes these spaces as forms of “collective lucid dreaming” and “social rehearsal for co-survival.”
          </p>

          <p style="font-size: 15px; text-align: justify; margin-bottom: 40px; line-height: 1.6;">
            Jang is a practice-based PhD researcher with Transart Institute and Liverpool John Moores University. Her doctoral project, Rehearsing Invisibility, engages eunhyeongbeop—methods of invisibility described in the Korean medical text Donguibogam (1613)—as a choreographic and somatic methodology. The research considers how invisibility might operate not simply as disappearance, but as healing, care, resistance, and altered presence. It reimagines ancestral rehearsal as a sensory and speculative space in which inherited memory, mourning, and transformation can be sensed and renegotiated.
          </p>

          <p style="font-size: 15px; margin-bottom: 40px;">
            <a href="https://drive.google.com/file/d/1Z-zkCvTBgRxb4K85vKhzxQBh64yCPXsT/view?usp=sharing" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; color: #1a1a1a;">DOWNLOAD CV — KOREAN PDF</a>
          </p>

          <div style="margin: 60px 0;">
            <img src="/images/073f40_2297e8f0e68e48f89b1818f21e2028ee_mv2.jpeg" style="width: 100%; height: auto; display: block;" alt="Portrait">
          </div>
        </div>
      </div>
    `
  },
  '/unseaming-2021-2025': {
    title: 'Unseaming. | He Jin Jang Dance',
    html: `
      <div class="content-page works-detail-page" style="padding: 40px 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Unseaming. (2021-2025)<br>흐르는. (Ver. 2025)</h1>
        
        <p style="font-style: italic; font-size: 15px; margin-bottom: 24px;">
          “...a contemporary requiem that invites anonymous spirits into He Jin Jang’s body in order to remember them. It reminds us that everything—from a speck of dust to the workings of nature—exists in mutual dependence and companionship. Responding to an era of intense political conflict and division, Jang creates her own contemporary ritual performance, resonating with what lies beyond the visible world.”<br>
          — Dance Webzine, 2025
        </p>

        <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
          What if what we believed to be lost is still pulsing, vibrating, passing through our bodies? Unseaming. is a precarious song for the precarious, a requiem for bodies history never called by name. The 2025 iteration more sharply summons a politics of mourning, recalling presences erased within silence and wound, from the concave interior of the body. In the emptied space: an object that trembles as if breathing, a lone body, and a microphone tracing its pendular swing. The arcs of joints and the curves of organs weave an audiovisual rhythm, tracing the marks left by shock, reviving time and sensation once effaced. This body does not reenact loss. Instead, it lends itself, so that returning memories and tremors might lean upon it, leaving a response both discreet and steadfast. Like love seeping into erased places, body and soul are released into space together—shaken, faltering, lingering.
        </p>

        <p style="font-style: italic; font-size: 15px; margin-bottom: 24px;">
          “Grounded in multilayered research, the choreography is a sincere attempt to weave together sensation and thought.”<br>
          — Dance Forum, 2025
        </p>

        <p style="font-size: 15px; margin-bottom: 40px; line-height: 1.6;">
          Concept/Choreography/Performance, Text by He Jin Jang<br>
          Choreographic Correspondence by André Lepecki<br>
          Lighting Design by Youn Hwa Kong<br>
          Sound Design by Jimmy Sert<br>
          Space Design by Seung Jun Jung<br>
          Costume Design by Eun Kyung Kim<br>
          Stage Manager by Eun Jin Cho<br>
          Sound Operator by Tae Joon Park<br>
          Creative Process Assistant by Sung Uk Hoh<br>
          Photography by Pop_Con<br>
          Dialogue Book Editing by Hyeong Bin Cho<br>
          Touch Tour/Audio Description by Su Jeong Hwang, Il Ha Jo<br>
          Voice Trainer by Dokyung Park<br>
          Producer by Adela Shin<br><br>
          Production by: He Jin Jang Dance<br>
          Sponsored by: Seoul Foundation for Arts and Culture, Seoul Metropolitan Government, Dancers’ Career Development Center<br><br>
          Venue: Grey Hall at Seoul Artists’ Platform New & Young, Korea
        </p>
        
        <div class="video-container" style="margin-bottom: 40px; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;">
          <iframe src="https://www.youtube.com/embed/3Fj2tQEFNJw" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        </div>

        <div style="margin-bottom: 40px; display: flex; flex-direction: column; gap: 24px;">
          <img src="/images/unseaming_1.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Unseaming Photo 1" loading="lazy">
          <img src="/images/unseaming_2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Unseaming Photo 2" loading="lazy">
          <img src="/images/unseaming_3.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Unseaming Photo 3" loading="lazy">
          <img src="/images/unseaming_4.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Unseaming Photo 4" loading="lazy">
        </div>

        <button class="accordion-toggle" style="background: none; border: none; cursor: pointer; font-size: 16px; font-weight: bold; color: #1a1a1a; padding: 10px 0; border-bottom: 1px solid #1a1a1a; width: 100%; text-align: left; margin-bottom: 20px;">
          한국어 보기 +
        </button>
        <div class="accordion-content" style="display: none; padding: 20px 0;">
          <p style="font-style: italic; font-size: 15px; margin-bottom: 24px;">
            “이 작품은 익명의 영혼들을 장혜진의 몸으로 초대해 기억하려는 현대식 진혼제로 읽힌다. 세상에 존재하는 먼지 한 톨부터 자연의 섭리까지, 모든 존재가 서로에게 기대어 동행하는 동반자임을 환기한다. 장혜진은 극단적인 정치적 충돌과 반목의 시대를 통찰하며, 가시적 세계 너머와 공명하는 자신만의 현대판 굿 퍼포먼스를 완성했다.”<br>
            — 2025년 『춤웹진』
          </p>

          <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
            잃어버렸다고 믿었던 것들이, 실은 언제나 우리 몸 안팎을 고동치고 진동하며 드나들고 있다면 어떨까. &lt;흐르는.&gt;은 불안정한 이들을 위한 불안정한노래이자, 역사가 끝내 부르지 못한 몸들을 위한 진혼무다. 2021년 초연이 애도를 감각의 공유지(somatic commons)로 제안했다면, 2025년의 &lt;흐르는.&gt;은 ‘애도의 정치’를 한층 또렷하게 호출한다. 무용학자 안드레 레페키와의 비평적 대화를 바탕으로, 국가폭력과 사회적 침묵 속에서 지워진 존재들을 몸의 ‘오목한 내부(concavity)’에서 다시 불러낸다. 부름은 사회적 충격이 신체에 남긴 미세한 흔적들을 더듬으며, 지워진 시간과 감각을 되살린다. 
          </p>
          <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
            무대 위에는 한 명의 무용수와 불안정하게 흔들리는 오브제가 있다. 마이크의 진자 운동과 함께, 관절과 장기의 곡률이 시청각적 리듬을 이루며, 퍼포머의 몸을 상실과 회복이 공존하는 지형으로 환기한다. 이 몸은 상실을 재현하지 않는다. 대신, 자신의 몸을 내어주어 끊임없이 흐르고 되돌아오는 것들이 그 안에 기댈 수 있도록, 은밀하지만 단단한 응답을 남긴다. 지워진 자리마다 스며드는 사랑처럼, 몸과 영혼은 함께 공간에 던져지고, 흔들리고, 포기하고, 주저한다. 퍼포먼스와 리추얼, 목소리와 침묵 사이를 유영하는 이 순간, 함께할 당신을 천천히 환영한다. 
          </p>

          <p style="font-style: italic; font-size: 15px; margin-bottom: 24px;">
            “다층적 리서치에 기반한 안무는 감각과 사유를 엮어낸 진정성 있는 시도로 평가된다.”<br>
            — 2025년 『댄스포럼』
          </p>

          <p style="font-size: 15px; margin-bottom: 40px; line-height: 1.6;">
            컨셉/안무/출연/텍스트. 장혜진<br>
            안무적 서신 교환. 안드레 레페키<br>
            조명 디자인. 공연화<br>
            사운드 디자인. 지미 세르<br>
            공간 디자인. 정승준<br>
            의상 디자인. 김은경<br>
            무대 감독. 조은진<br>
            오퍼레이터. 박태준<br>
            과정 어시스턴트. 허성욱<br>
            보이스 트레이너. 박도경 (PnM 알렉산더테크닉)<br>
            사진. 팝콘<br>
            대화록 편집. 조형빈<br>
            터치투어/음성해설. 조일하/황수정<br>
            프로듀서. 신재윤<br><br>
            제작. 혜진장댄스<br>
            후원. 서울문화재단, 서울특별시, 전문무용수지원센터<br><br>
            베뉴. 청년예술청 그레이홀
          </p>
        </div>
      </div>
    `
  },
  '/alchemic-empathy-2026': {
    title: 'Alchemic Empathy | He Jin Jang Dance',
    html: `
      <div class="content-page works-detail-page" style="padding: 40px 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">Alchemic Empathy (2026)<br>연금술적 공감</h1>
        
        <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
          Alchemic Empathy explores empathy as a ritual condition. The work begins with questions of mimesis, contact, and sympathetic magic discussed in Michael Taussig’s Mimesis and Alterity, while taking the Korean ritual practice of gime as a sensory and choreographic point of reference. In gime, a paper body is placed upon a living person’s body as a temporary surrogate, bearing or transferring illness, misfortune, and the weight of imperceptible sensations. As imitative and contagious forms of magic intersect, the body appears not as a fixed and bounded individual entity, but as a mediating site through which pain and sensation may seep, pass, and exist in plural forms.
        </p>

        <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
          The choreography unfolds through structured improvisation, with voice and movement collectively composed among twenty performers. This process creates a flexible structure shared across multiple bodies, allowing presence to move, linger, or be temporarily carried by another body. Here, empathy emerges not as identification, but as an embodied and relational process: one body temporarily holds, bears, and eventually releases the pain, sensation, or weight belonging to another.
        </p>

        <p style="font-size: 15px; margin-bottom: 40px; line-height: 1.6;">
          Choreography by He Jin Jang<br>
          Music by Noddy Woo, Jimmy Sert<br>
          Performers by<br>
          Akshaya Srinivasan, Chong Jing Wei Ally, Kit Teoh, Lee Aulia Rora, Lily Mae Derkenne, Lim Qiu Na, Natalie Loy Li Jiaxin, Rachel Rui En Chng, Rain, Angel Thien Vi, Bernadette Aileen Hartono, Celeste Eu, Chloe Peh, He Lizhi, Melinda Wang, Andre Razali, Niki Dameasih, Nur Adrianz Bin Kamaruddin, Park Chaewon, Wu Huizhen<br><br>
          Commissioned and Produced by LASALLE College of the Arts<br><br>
          Venue: Singapore Airlines Theatre, LASALLE College of the Arts, Singapore
        </p>

        <button class="accordion-toggle" style="background: none; border: none; cursor: pointer; font-size: 16px; font-weight: bold; color: #1a1a1a; padding: 10px 0; border-bottom: 1px solid #1a1a1a; width: 100%; text-align: left; margin-bottom: 20px;">
          한국어 보기 +
        </button>
        <div class="accordion-content" style="display: none; padding: 20px 0;">
          <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
            〈연금술적 공감〉은 공감을 하나의 의례적 조건으로 탐구하는 작업이다. 이 작품은 마이클 타우시그의 『미메시스와 타자성』에서 논의되는 미메시스, 접촉, 감응주술의 문제에서 출발하며, 한국의 의례적 실천인 ‘기메’를 감각적·안무적 참조점으로 삼는다. 기메는 종이로 만든 몸을 살아 있는 사람의 몸 위에 올려 임시적인 대리체로 삼는 행위이다. 병과 액, 보이지 않는 감각의 무게를 다른 몸으로 옮기거나 대신 지니게 한다는 점에서 모방주술과 접촉주술이 교차하는 실천이라 할 수 있다. 이때 몸은 고정되고 독립된 개별체가 아니라, 고통과 감각이 스며들고 옮겨지며 복수적으로 존재할 수 있는 매개적 장소가 된다.
          </p>

          <p style="font-size: 15px; margin-bottom: 24px; line-height: 1.6;">
            안무는 구조화된 즉흥을 통해 전개되며, 목소리와 움직임은 스무 명의 출연 무용수들 사이에서 함께 구성된다. 이 과정은 여러 몸이 공유하는 유연한 구조를 만들어내며, 현존이 이동하거나 머물고, 때로는 다른 몸에 의해 잠시 운반될 수 있는 상태를 형성한다. 여기서 공감은 동일시가 아니라 신체적이고 관계적인 과정으로 나타난다. 하나의 몸이 잠시 다른 몸에 속한 고통과 감각, 무게를 품고 대신 지닌 뒤 다시 흘려보내는 상태로서 말이다.
          </p>

          <p style="font-size: 15px; margin-bottom: 40px; line-height: 1.6;">
            안무/텍스트. 장혜진<br>
            음악. 노디 우, 지미 세르<br>
            출연.<br>
            Akshaya Srinivasan, Chong Jing Wei Ally, Kit Teoh, Lee Aulia Rora, Lily Mae Derkenne, Lim Qiu Na, Natalie Loy Li Jiaxin, Rachel Rui En Chng, Rain, Angel Thien Vi, Bernadette Aileen Hartono, Celeste Eu, Chloe Peh, He Lizhi, Melinda Wang, Andre Razali, Niki Dameasih, Nur Adrianz Bin Kamaruddin, Park Chaewon, Wu Huizhen<br><br>
            위촉 및 제작.<br>
            LASALLE College of the Arts<br><br>
            베뉴.<br>
            Singapore Airlines Theatre, LASALLE College of the Arts, Singapore
          </p>
        </div>
      </div>
    `
  },

  '/contact': {
    title: 'Contact | He Jin Jang Dance',
    html: `
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
    html: `
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Slow Carnival World, 2023, Hwahung Yu (Critic) / 2023년, <투명인간이 되든, 춤을 추든>, 유화정 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance Webzine, February lssue, 2023, Sukjin Han (Dance Theorist), I bet you’d put that on / 2023년 『춤웹진』 2월호, 한석진 무용학자, <당신이 그런 것을 입게 될 줄 알았어></h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance Magazine MOMM, January Issue, 2023, I bet you’d put that on, Sunghye Park (Critic) / 2023년『월간잡지 몸』1월호, <당신이 그런 것을 입게 될 줄 알았어> ,박성혜 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Art Scene, January lssue, I bet you’d put that on, 2023, Mingwan Kim (Critic) /『아트신』 1월호, <당신이 그런 것을 입게 될 줄 알았어>, 2023년, 김민관 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Art Scene, January lssue, You cannot disinvite x-being, 2022, Mingwan Kim (Critic) /『아트신』 1월호, <당신은 x-being을 초대하지 않을 수 없다> 2022년, 김민관 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">You cannot disinvite x-being, 2021, Bittnarie Shin (Dramaturgy) / <당신은 x-being을 초대하지 않을 수 없다>, 2021년, 신빛나리 드라마터그</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance Magazine MOMM,  November Issue, the flowing. , 2021, Namsoo Kim (Critic) /『월간잡지 몸』11월호, <흐르는. >, 2021년, 김남수 안무비평가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Hyungbin Jo (Critic), 2021, the flowing. / <흐르는. > , 2021년, 조형빈 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance and People, 2020, silence replaced: , Bongheon Lee (Journalist) / 『춤과 사람들』, <대체된 침묵: >, 2021년, 이봉헌 기자</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">The New York Ilbo, Weekly Weakly, 2020, Eunsil Jung (Journalist) /『뉴욕일보』, <위클리 위-클리>, 2020년, 정은실 기자</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Microhabitat Body, 2018, Ziyea Hyun (Dramaturgy), / <미소서식지 몸>, 2018년, 현지예 드라마터그</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance Webzine, migrant-self the speed of a door, 2016, Heemang Bang (Critic) / 2016년『춤웹진』, <이주하는 자아, 문의 속도> , 방희망 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Dance Webzine, migrant-self the speed of a door, 2015, Yoonsook Lee / 2015년 『춤웹진』, <이주하는 자아 문의 속도> , 이윤숙</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">NEW YORK LIVE ARTS CONTEXT NOTES, migrant-self the speed of a door, 2015, 제스 바바갈로 (Critic) / 2015년 『New York Live Arts Context Notes』, <이주하는 자아 문의 속도>, 제스 발바갈로 평론가</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">U.S Indy week, July 2008, Byron Woods (Critic) / 2008년 미국 『Indy Week』, 바이론 우즈 평론가 /</h1>
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
    html: `
      <div class="content-page">
        <h1 class="press-title" style="font-size: 20px; font-weight: bold; margin-bottom: 40px;">Interview / 인터뷰 모음</h1>
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
  '/archive': {
    title: 'Archive | He Jin Jang Dance',
    html: `
      <div class="content-page works-detail-page" style="padding: 40px 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 50px; text-align: center;">Archive (2008 - 2026)</h1>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 20px;"><a href="/alchemic-empathy-2026" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Alchemic Empathy (2026)</a></li>
          <li style="margin-bottom: 20px;"><a href="/softrehearsalforfugitivegathering" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Soft Rehearsal for Fugitive Gathering</a></li>
          <li style="margin-bottom: 20px;"><a href="/latent-in-pre-chaos-2024" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Latent in Pre-Chaos (2024)</a></li>
          <li style="margin-bottom: 20px;"><a href="/whirling-skin-2024" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Whirling Skin (2024)</a></li>
          <li style="margin-bottom: 20px;"><a href="/porous-research-2023" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Porous Research (2023)</a></li>
          <li style="margin-bottom: 20px;"><a href="/weekly-weakly-2020" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Weekly Weakly: Performance (2020)</a></li>
          <li style="margin-bottom: 20px;"><a href="/exhibition-weekly-weakly-2020" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Weekly Weakly: Exhibition (2020)</a></li>
          <li style="margin-bottom: 20px;"><a href="/microhabitat-body-2018" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Microhabitat Body (2018)</a></li>
          <li style="margin-bottom: 20px;"><a href="/living-without-2017" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">living without (      ) (2017)</a></li>
          <li style="margin-bottom: 20px;"><a href="/drifting-body-2015-17" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Drifting Body (2015-17)</a></li>
          <li style="margin-bottom: 20px;"><a href="/migrant-self-the-speed-of-a-door-2012-16" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">migrant-self the speed of a door (2012)</a></li>
          <li style="margin-bottom: 20px;"><a href="/silence-replaced-2009-12" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Silence Replaced: (2009-12)</a></li>
          <li style="margin-bottom: 20px;"><a href="/do-not-lean-on-door-2008-09" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Do Not Lean On Door (2008-09)</a></li>
          <li style="margin-bottom: 20px;"><a href="/open-skin-inscribed-2008" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Open Skin Inscribed (2008)</a></li>
        </ul>
      </div>
`
  },
  '/workshops': {
    title: 'Workshops | He Jin Jang Dance',
    html: `
      <div class="content-page works-detail-page" style="padding: 40px 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: bold; margin-bottom: 50px; text-align: center;">Workshops</h1>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 20px;"><a href="/franklin-method-workshop-session" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Franklin Method Workshop & 1:1 Session</a></li>
          <li style="margin-bottom: 20px;"><a href="/movement-class-dance-with-fascia-biom" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Movement Class: Dance with Fascia & Biom</a></li>
          <li style="margin-bottom: 20px;"><a href="/workshop-making-it-work" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Workshop: Making (it) Work</a></li>
          <li style="margin-bottom: 20px;"><a href="/visceral-body-workshop-for-visual-artist" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Visceral Body Workshop for Visual Artist</a></li>
          <li style="margin-bottom: 20px;"><a href="/workshop-weekly-weakly" data-link style="font-size: 16px; font-weight: bold; text-decoration: underline;">Workshop: Weekly Weakly</a></li>
        </ul>
      </div>
`
  },
  '/slow-carnival-world-2023': {
    title: 'Slow Carnival World (2023-ongoing) | He Jin Jang Dance',
    html: `
      <div class="content-page">
        <div class="original-title-block" style="margin-bottom: 40px;"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span class="color_37 wixui-rich-text__text"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Slow Carnival World&nbsp;</span>(2023 - ongoing)</span><br class="wixui-rich-text__text">
<span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">투명인간이 되든, 춤을 추든</span></span></span></h6></div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_df8de628b39f4398a75f3382ae4f4ee1_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_82a46ee449aa4acabfee8f54d10fbabb_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
        
        
        
        
        
        
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
  '/the-flowing-2021-23': {
    title: 'the flowing. (2021-23) | He Jin Jang Dance',
    html: `
      <div class="content-page">
        <div class="original-title-block" style="margin-bottom: 40px;">
  <h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;">
    <span style="font-size:25px;" class="wixui-rich-text__text">
      <span style="color:#000000;" class="wixui-rich-text__text">
        <span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">
          <span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">
            <span style="font-style:italic;" class="wixui-rich-text__text">the flowing. </span>
          </span>
        </span>
      </span>
    </span>
    <span style="font-size:25px;" class="wixui-rich-text__text">
      <span style="color:#000000;" class="wixui-rich-text__text">
        <span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text">
          <span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">(2021-23)<br>흐르는. (2021-23)</span>
        </span>
      </span>
    </span>
  </h6>
</div>
        
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
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        <iframe src="https://www.youtube.com/embed/98_ENPuQF3w?autoplay=0&mute=0&controls=1&loop=0&origin=https%3A%2F%2Fwww.hejinjang.com&playsinline=1&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Fwww.hejinjang.com%2Fthe-flowing-2021-23&aoriginsup=1&vf=1" frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" title="YouTube video player" width="100%" height="100%" style="width: 100%; aspect-ratio: 16/9; display: block; margin: 24px 0;"></iframe>
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
  '/microhabitat-body-2018': {
    title: 'Microhabitat Body (2018) | He Jin Jang Dance',
    html: `
      <div class="content-page">
        <div class="original-title-block" style="margin-bottom: 40px;"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span style="font-size:25px;" class="wixui-rich-text__text"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="letter-spacing:-0.03em;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Microhabitat Body&nbsp;</span></span></span></span></span><span style="font-size:25px;" class="wixui-rich-text__text"><span style="color:#000000;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">(2018)<br class="wixui-rich-text__text">
미소서식지 몸 (2018)&nbsp;</span></span></span></span></h6></div>
        
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
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text"><span class="wixui-rich-text__text">​</span></span></span><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text">Microhabitat Body </span>is a project that explores the minimum conditions for choreography to emerge. The choreographer creates a situation where the audience and performers can see ‘missing/not-yet-manifested bodies’ and their bodies that are seeing what is missing are once again seen. In this one-on-one performance, the concept of 'taa or atta', a Korean phrase meaning ‘you are me and I am you,’ is embodied through the kinetics of viewing nothing from each other. The moment is being seen and commented on by primate scientists and cultural scholars again. The sense of symbiosis is explored in multiple layers with a sense of play.</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Direction by He Jin Jang</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Creation/Performance by He Jin Jang, Myoung Gyu Song, Yunkyung Hur</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Dramaturgy by Ziyea Hyun</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Music by Tim Motzer</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Observation and Commentary by Sanha Kim Hyeongbin Cho</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Graphic Design by Donkyu Kim</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Producer by Hyojin Kwon</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Supported by Arts Council Korea, Ministry of Culture, Sports and Tourism Korea,&nbsp;</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">Venue. Oil Tank Cultural Park as part of 2017 Arts Council Korea Experiment Showcase</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:14px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">&lt;미소서식지 몸&gt;은 안무를 위한 최소한의 조건을 탐색하는 작업이다. 안무가는 퍼포머와 관객이 ‘없는 몸/아직 나타나지 않은 몸'을 볼 수 있는 환경을 조성한다. 없는 것을 보는 몸은 타자에게 보여지게 되며 안무가 발생한다. 1인의 퍼포머와 1인의 관객이 페어링 되어 서로 없는 것을 관찰하고, 이 순간을 다시 야생영장류 학자와 문화연구자가 관찰한다. 서로는 서로를 보고 (없는 것에 대한) 살아있는 각주를 첨가하면서 공생의 의미를 되찾는다.</span></span></p>
        
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">컨셉/안무. 장혜진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">공동구성/퍼포먼스. 송명규, 장혜진, 허윤경</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">드라마투르기. 현지예</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">사운드. 팀 모처</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">관찰. 김산하 (야생영장류 학자), 조형빈</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">그래픽 디자인. 김동규</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">프로듀서. 권효진</span></span></p>
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">영상기록. 복코</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">후원. 한국문화예술위원회, 문화체육관광부</span></span></p>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span style="font-size:13px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text">베뉴. 문화비축기지, 한국</span></span></p>
        
    </div>
    `
  },
  '/i-bet-you-d-put-that-on-2022': {
    title: 'I Bet You’d Put That On (2022) | He Jin Jang Dance',
    html: `
      <div class="content-page">
        <div class="original-title-block" style="margin-bottom: 40px;"><h6 class="font_6 wixui-rich-text__text" style="font-size:25px; text-align:center;"><span style="font-size:25px;" class="wixui-rich-text__text"><span class="color_37 wixui-rich-text__text"><span style="font-style:italic;" class="wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">I Bet You’d Put That On </span></span></span></span></span><span style="font-size:25px;" class="wixui-rich-text__text"><span class="color_37 wixui-rich-text__text"><span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">(2022)&nbsp;</span></span><br class="wixui-rich-text__text">
<span style="font-family:wfont_fa2639_b36572e3503346f5964dd41f14a281d3,wf_b36572e3503346f5964dd41f1,orig_noto_sans_kr_semibold;" class="wixui-rich-text__text"><span style="letter-spacing:-0.03em;" class="wixui-rich-text__text">당신이 그런 것을 입게 될 줄 알았어&nbsp;</span></span></span></span></h6></div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_a20af54c445143adbcfb5c5a16b40dc4_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_cbf308103cb0442cbdd25e5083d647ae_mv2.jpg" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        
                    <div class="about-image-container" style="margin-bottom: 24px;">
                      <img src="/images/073f40_fc7733ced44f4321916eb039ab999968_mv2.png" style="width: 100%; max-width: 100%; height: auto; display: block;" alt="Image" loading="lazy">
                    </div>
        <iframe src="https://www.youtube.com/embed/BhRuqMtvJf4?autoplay=0&mute=0&controls=1&loop=0&origin=https%3A%2F%2Fwww.hejinjang.com&playsinline=1&enablejsapi=1&widgetid=1&forigin=https%3A%2F%2Fwww.hejinjang.com%2Fi-bet-you-d-put-that-on-2022&aoriginsup=1&vf=4" frameborder="0" allowfullscreen="" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" title="YouTube video player" width="100%" height="100%" style="width: 100%; aspect-ratio: 16/9; display: block; margin: 24px 0;"></iframe>
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://tewonderland.wixsite.com/hejinjang-dance" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">Link to Choreographer’s Note</a></span>&nbsp;</span></span></span></p>
        
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
        
        <p class="font_8 wixui-rich-text__text" style="font-size:15px; text-align:justify; margin-bottom: 24px;"><span class="color_38 wixui-rich-text__text"><span style="font-size:15px;" class="wixui-rich-text__text"><span style="font-family: 'Gothic A1', sans-serif;" class="wixui-rich-text__text"><span style="text-decoration:underline;" class="wixui-rich-text__text"><a href="https://tewonderland.wixsite.com/hejinjang-dance" target="_blank" rel="noreferrer noopener" class="wixui-rich-text__text">안무가의 글 링크</a></span>&nbsp;</span></span></span></p>
        
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
  '/dreams-dreamt-place-2019': {
    title: '2019 꿈꾼꿈-곳 | He Jin Jang Dance',
    isGeneric: true, path: "/dreams-dreamt-place-2019"
  },
  '/exhibition-catching-a-cold-2017': {
    title: '2017 전시: 감기긁기걷기 | He Jin Jang Dance',
    isGeneric: true, path: "/exhibition-catching-a-cold-2017"
  },
  '/the-artist-is-absent-2015': {
    title: '2015 The artist is absent | He Jin Jang Dance',
    isGeneric: true, path: "/the-artist-is-absent-2015"
  },
  '/dangin-ri-dance-for-1-2015': {
    title: '2015 당인리-Dance for 1 | He Jin Jang Dance',
    isGeneric: true, path: "/dangin-ri-dance-for-1-2015"
  },
  '/dangin-ri-bodyland-2015': {
    title: '2015 당인리-BODYLAND | He Jin Jang Dance',
    isGeneric: true, path: "/dangin-ri-bodyland-2015"
  },
  '/ethical-goodbyes-2014': {
    title: '2014 Ethical goodbyes | He Jin Jang Dance',
    isGeneric: true, path: "/ethical-goodbyes-2014"
  },
  '/tantalizingly-empathetic-2013-2014': {
    title: '2013-14 Tantalizingly Empathetic | He Jin Jang Dance',
    isGeneric: true, path: "/tantalizingly-empathetic-2013-2014"
  },
  '/uncanny-of-the-uncanny-2014': {
    title: '2014 Uncanny of the Uncanny | He Jin Jang Dance',
    isGeneric: true, path: "/uncanny-of-the-uncanny-2014"
  },
  '/practice-of-being-together-2013': {
    title: '2013 Practice of Being Together | He Jin Jang Dance',
    isGeneric: true, path: "/practice-of-being-together-2013"
  },
  '/we-will-all-be-dreaming-2013': {
    title: '2013 We will all be dreaming | He Jin Jang Dance',
    isGeneric: true, path: "/we-will-all-be-dreaming-2013"
  },
  '/of-the-presence-of-us-ness-2013': {
    title: '2013 Of the presence of “us-ness” | He Jin Jang Dance',
    isGeneric: true, path: "/of-the-presence-of-us-ness-2013"
  },
  '/practice-of-cost-effectiveness-2012': {
    title: '2012 Practice of Cost-effectiveness | He Jin Jang Dance',
    isGeneric: true, path: "/practice-of-cost-effectiveness-2012"
  },
  '/movement-study-on-no-to-self-editing-2011': {
    title: '2011 Movement Study on No to self-editing | He Jin Jang Dance',
    isGeneric: true, path: "/movement-study-on-no-to-self-editing-2011"
  },
  '/de-re-pair-2011': {
    title: '2011 De-re-pair | He Jin Jang Dance',
    isGeneric: true, path: "/de-re-pair-2011"
  },
  '/dear-silence-2010': {
    title: '2010 Dear Silence | He Jin Jang Dance',
    isGeneric: true, path: "/dear-silence-2010"
  },
  '/piece-with-gaps-2018': {
    title: '2018 협업 Piece with gaps | He Jin Jang Dance',
    isGeneric: true, path: "/piece-with-gaps-2018"
  },
};



// Common generic template for other selected works/archives
export function renderGenericWork(pathStr) {
  const cleanTitle = pathStr.substring(1).replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

export function renderFallbackRoute(path) {
  let route = fallbackRoutesHtml[path];
  
  if (!route) {
    // Try encoding/decoding match fallback
    const matchedKey = Object.keys(fallbackRoutesHtml).find(key => {
      try {
        return decodeURIComponent(key) === path || key === window.location.pathname;
      } catch (e) {
        return key === path;
      }
    });
    if (matchedKey) route = fallbackRoutesHtml[matchedKey];
  }

  if (!route) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: renderGenericWork(path) }} 
      />
    );
  }

  // Set page title
  document.title = route.title || 'He Jin Jang Dance';

  if (route.isGeneric) {
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: renderGenericWork(route.path) }} 
      />
    );
  }

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: route.html }} 
    />
  );
}
