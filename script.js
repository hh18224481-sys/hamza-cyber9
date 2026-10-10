(() => {
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 let lang='ar',toastTimer;
 const toast=$('#toast');
 function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2800)}
 function setLang(next){lang=next;document.documentElement.lang=next;document.documentElement.dir=next==='ar'?'rtl':'ltr';document.body.classList.toggle('en',next==='en');$('#lang').textContent=next==='ar'?'EN':'ع';$$('[data-ar][data-en]').forEach(el=>{el.innerHTML=el.dataset[next]});document.title=next==='ar'?'HAMZA.com — عالمي الخاص':'HAMZA.com — My Personal Space';$('#menu').classList.remove('open')}
 $('#lang').addEventListener('click',()=>setLang(lang==='ar'?'en':'ar'));
 $('#menuBtn').addEventListener('click',()=>$('#menu').classList.toggle('open'));
 $$('#menu a').forEach(a=>a.addEventListener('click',()=>$('#menu').classList.remove('open')));
 // Live local clock
 const clock=()=>{const d=new Date();$('#clock').textContent=d.toLocaleTimeString(lang==='ar'?'ar-EG':'en-GB',{hour12:false});$('#date').textContent=d.toLocaleDateString(lang==='ar'?'ar-EG':'en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})};
 clock();setInterval(clock,1000);
 // Gallery lightbox
 const lb=$('#lightbox'), lbImg=$('#lightboxImg');
 $$('.gallery-card[data-src]').forEach(btn=>btn.addEventListener('click',()=>{lbImg.src=btn.dataset.src;$('#lightboxTitle').textContent=btn.querySelector('.image-title').textContent;lb.classList.add('open')}));
 function closeLb(){lb.classList.remove('open');lbImg.src=''}
 $('#closeLightbox').addEventListener('click',closeLb);lb.addEventListener('click',e=>{if(e.target===lb)closeLb()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLb()});
 // Random notes
 const notes={ar:['خد نفس عميق. مش لازم كل حاجة تبقى كاملة عشان تبقى جميلة.','افتكر إنك قطعت طريق طويل، حتى لو لسه قدامك كتير.','خلي لنفسك نصيب من الهدوء وسط دوشة الدنيا.','مش كل يوم لازم يكون عظيم؛ كفاية إنك تكمّل.','احتفظ باللحظات اللي بتخليك تبتسم من قلبك.','بكرة فرصة جديدة تبدأ بشكل مختلف.'],en:['Take a deep breath. Not everything has to be perfect to be beautiful.','Remember how far you have come, even if there is more ahead.','Save a little quiet for yourself in the noise of life.','Not every day has to be amazing; sometimes showing up is enough.','Keep the moments that make you smile from the heart.','Tomorrow is another chance to begin differently.']};
 let last=-1;$('#newMessage').addEventListener('click',()=>{let i;do{i=Math.floor(Math.random()*notes[lang].length)}while(i===last&&notes[lang].length>1);last=i;const p=$('#messageText');p.style.opacity=0;setTimeout(()=>{p.textContent=notes[lang][i];p.style.opacity=1},180)});
 // Social URLs: replace the empty strings with your real profile URLs.
 const socialUrls={instagram:'https://www.instagram.com/hmhamza16?srtk=MWN5Mzl3amV5aXFucA==',facebook:'https://www.facebook.com/share/14v1zEeVQYg/',tiktok:'https://www.tiktok.com/@hamza362009?_r=1&_t=ZS-9ARQzy7rsds',whatsapp:'https://wa.me/201080504473',telegram:'https://t.me/Hamza0s'};
 $$('[data-social]').forEach(a=>a.addEventListener('click',e=>{const key=a.dataset.social,url=socialUrls[key];if(!url){e.preventDefault();showToast(lang==='ar'?'افتح script.js وحط رابط حسابك في socialUrls.':'Edit socialUrls in script.js and add your profile URL.')}else{a.href=url;a.target='_blank';a.rel='noopener noreferrer'}}));
 $('#email').addEventListener('click',e=>{if($('#email').getAttribute('href')==='mailto:hello@example.com'){e.preventDefault();showToast(lang==='ar'?'غيّر hello@example.com لبريدك في index.html.':'Replace hello@example.com in index.html with your email.')}});
 // Audio player
 const audio=$('#audio'), play=$('#playAudio'), progress=$('#progress'), record=$('#record');
 const fmt=n=>Number.isFinite(n)?`${Math.floor(n/60)}:${Math.floor(n%60).toString().padStart(2,'0')}`:'0:00';
 audio.addEventListener('loadedmetadata',()=>$('#total').textContent=fmt(audio.duration));
 audio.addEventListener('timeupdate',()=>{$('#elapsed').textContent=fmt(audio.currentTime);progress.value=audio.duration?audio.currentTime/audio.duration*100:0});
 audio.addEventListener('play',()=>{play.textContent='Ⅱ';record.classList.add('playing');$('#audioHint').textContent=lang==='ar'?'الموسيقى شغّالة الآن.':'Music is playing.'});
 audio.addEventListener('pause',()=>{play.textContent='▶';record.classList.remove('playing')});
 audio.addEventListener('error',()=>{$('#audioHint').textContent=lang==='ar'?'أضف ملف assets/music.mp3 لتشغيل الموسيقى.':'Add assets/music.mp3 to play music.'});
 play.addEventListener('click',async()=>{if(audio.paused){try{await audio.play()}catch(e){showToast(lang==='ar'?'أضف ملف music.mp3 داخل assets أولًا.':'Add assets/music.mp3 inside assets first.')}}else audio.pause()});
 progress.addEventListener('input',()=>{if(audio.duration)audio.currentTime=audio.duration*Number(progress.value)/100});
 $('#volume').addEventListener('click',()=>{audio.muted=!audio.muted;$('#volume').textContent=audio.muted?'×':'♫'});
 const trackSelect=$('#trackSelect');
 if(trackSelect)trackSelect.addEventListener('change',()=>{const wasPlaying=!audio.paused;audio.pause();audio.src=trackSelect.value;audio.load();$('#elapsed').textContent='0:00';$('#total').textContent='0:00';progress.value=0;if(wasPlaying)audio.play().catch(()=>{});$('#audioHint').textContent=lang==='ar'?'تم اختيار الأغنية. اضغط تشغيل للاستماع.':'Track selected. Press play to listen.';});

 // Local video preview; uploading does not publish the file.
 let currentVideoUrl='';$('#videoFile').addEventListener('change',e=>{const file=e.target.files&&e.target.files[0];if(!file)return;if(currentVideoUrl)URL.revokeObjectURL(currentVideoUrl);currentVideoUrl=URL.createObjectURL(file);const v=$('#videoPreview');v.src=currentVideoUrl;$('.video-feature').classList.add('has-video');v.load();showToast(lang==='ar'?'الفيديو جاهز للمعاينة على جهازك.':'Video ready for local preview.')});

 // Cinematic entry. The visitor taps to enter; this gesture may enable browser audio.
 const intro=$('#intro'), enterSite=$('#enterSite'), soundToggle=$('#soundToggle');
 let ambienceContext=null, ambienceNodes=[], ambienceOn=false, ambienceMaster=null;
 function startAmbience(){
   try{
     const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
     if(!ambienceContext)ambienceContext=new AC();
     if(ambienceContext.state==='suspended')ambienceContext.resume();
     if(ambienceOn)return;
     ambienceMaster=ambienceContext.createGain();ambienceMaster.gain.value=.018;ambienceMaster.connect(ambienceContext.destination);
     [110,164.81].forEach((freq,i)=>{const osc=ambienceContext.createOscillator(),gain=ambienceContext.createGain();osc.type=i===0?'sine':'triangle';osc.frequency.value=freq;gain.gain.value=i===0?.65:.22;osc.connect(gain);gain.connect(ambienceMaster);osc.start();ambienceNodes.push(osc,gain)});
     ambienceOn=true;soundToggle.classList.add('active');soundToggle.setAttribute('aria-pressed','true');
   }catch(e){showToast(lang==='ar'?'الصوت غير متاح في المتصفح ده.':'Sound is unavailable in this browser.')}
 }
 function stopAmbience(){
   if(!ambienceContext||!ambienceOn)return;
   try{ambienceMaster.gain.setTargetAtTime(0,ambienceContext.currentTime,.08);setTimeout(()=>{ambienceNodes.forEach(n=>{try{if(n.stop)n.stop()}catch(e){}});ambienceNodes=[];ambienceOn=false;ambienceMaster=null},450)}catch(e){ambienceOn=false}
   soundToggle.classList.remove('active');soundToggle.setAttribute('aria-pressed','false');
 }
 enterSite.addEventListener('click',async()=>{
   intro.classList.add('leaving');
   // Start the first uploaded song from the visitor's entry click. Browsers require this gesture for audible autoplay.
   try{
     if(ambienceOn)stopAmbience();
     audio.muted=false;
     audio.src='assets/music.mp3';
     if(trackSelect)trackSelect.value='assets/music.mp3';
     audio.load();
     await audio.play();
     $('#audioHint').textContent=lang==='ar'?'الأغنية بدأت تلقائيًا 🎵 تقدر توقفها أو تغيّرها من مشغل الموسيقى.':'Music started automatically 🎵 You can pause it or change tracks in the music player.';
   }catch(e){
     $('#audioHint').textContent=lang==='ar'?'اضغط تشغيل في مشغل الموسيقى لو المتصفح منع التشغيل التلقائي.':'Press play in the music player if your browser blocked autoplay.';
   }
   setTimeout(()=>{if(intro&&intro.parentNode)intro.parentNode.removeChild(intro)},1000)
 });
 soundToggle.addEventListener('click',()=>ambienceOn?stopAmbience():startAmbience());
 // Soft floating light particles; reduce motion when requested by the visitor's device.
 const canvas=$('#particles'),ctx=canvas&&canvas.getContext('2d');
 if(canvas&&ctx){
   let dots=[];
   const resizeCanvas=()=>{const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(dpr,0,0,dpr,0,0);dots=Array.from({length:Math.min(48,Math.floor(innerWidth/24))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.35,v:Math.random()*.22+.06,a:Math.random()*.45+.12,phase:Math.random()*6}))};
   const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;resizeCanvas();window.addEventListener('resize',resizeCanvas);
   function drawParticles(){ctx.clearRect(0,0,innerWidth,innerHeight);dots.forEach(p=>{p.y-=p.v;p.phase+=.012;if(p.y< -4){p.y=innerHeight+4;p.x=Math.random()*innerWidth}ctx.beginPath();ctx.arc(p.x+Math.sin(p.phase)*5,p.y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(95,228,255,${p.a})`;ctx.fill()});if(!reduced)requestAnimationFrame(drawParticles)}
   drawParticles();
 }
 $('#copySite').addEventListener('click',async()=>{const url=location.href.split('#')[0];try{await navigator.clipboard.writeText(url);showToast(lang==='ar'?'تم نسخ رابط الموقع.':'Site link copied.')}catch(e){const ta=document.createElement('textarea');ta.value=url;document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();showToast(ok?(lang==='ar'?'تم نسخ رابط الموقع.':'Site link copied.'):(lang==='ar'?'انسخ الرابط من شريط العنوان.':'Copy the URL from the address bar.'))}});
 // Client-side demo only. Do not use this for sensitive information.
 const secretPassword='hamza2026';
 $('#secretForm').addEventListener('submit',e=>{e.preventDefault();if($('#secretPassword').value===secretPassword){$('#secretMessage').hidden=false;$('#secretFeedback').textContent=lang==='ar'?'تم فتح الرسالة ✦':'Note unlocked ✦';$('#secretIcon').textContent='✦'}else{$('#secretFeedback').textContent=lang==='ar'?'كلمة المرور مش صحيحة، جرّب تاني.':'Incorrect password. Try again.';$('#secretMessage').hidden=true;$('#secretIcon').textContent='⌑'}});

 // Premium motion: reveal sections gently as they enter the viewport.
 document.body.classList.add('reveal-ready');
 const revealTargets=$$('.section-head, .about-panel, .gallery-card, .music-card, .profile-card, .secret-card, .memory-timeline');
 if('IntersectionObserver' in window){const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12});revealTargets.forEach(el=>revealObserver.observe(el));}else revealTargets.forEach(el=>el.classList.add('is-visible'));
 // Subtle golden pointer glow on desktop.
 const goldGlow=document.createElement('div');goldGlow.className='gold-cursor-glow';document.body.appendChild(goldGlow);
 if(matchMedia('(pointer:fine)').matches){let raf=0;document.addEventListener('pointermove',e=>{if(raf)return;raf=requestAnimationFrame(()=>{goldGlow.style.left=e.clientX+'px';goldGlow.style.top=e.clientY+'px';raf=0})},{passive:true});}
 // Make the record respond to pointer movement without affecting touch users.
 const musicCard=$('.music-card');if(musicCard&&matchMedia('(pointer:fine)').matches){musicCard.addEventListener('pointermove',e=>{const r=musicCard.getBoundingClientRect();musicCard.style.setProperty('--pointer-x',((e.clientX-r.left)/r.width*100)+'%');musicCard.style.setProperty('--pointer-y',((e.clientY-r.top)/r.height*100)+'%')});}


 // Cyberpunk 3D tilt: restrained, disabled for touch/reduced-motion users.
 const reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(!reduceMotion&&matchMedia('(pointer:fine)').matches){$$('.gallery-card,.profile-card,.music-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.style.transform=`perspective(900px) rotateX(${(0.5-y)*4}deg) rotateY(${(x-0.5)*5}deg) translateY(-2px)`;card.style.setProperty('--pointer-x',`${x*100}%`);card.style.setProperty('--pointer-y',`${y*100}%`)});card.addEventListener('pointerleave',()=>{card.style.transform=''})})}
 // Interactive local chat terminal. This is a canned-response demo, not a live AI backend.
 const chatToggle=$('#chatToggle'),chatPanel=$('#chatPanel'),chatClose=$('#chatClose'),chatLog=$('#chatLog'),chatForm=$('#chatForm'),chatInput=$('#chatInput');
 const openChat=()=>{chatPanel.hidden=false;chatToggle.setAttribute('aria-expanded','true');chatInput.focus()};
 const closeChat=()=>{chatPanel.hidden=true;chatToggle.setAttribute('aria-expanded','false');chatToggle.focus()};
 chatToggle.addEventListener('click',()=>chatPanel.hidden?openChat():closeChat());chatClose.addEventListener('click',closeChat);
 function addChat(text,type){const b=document.createElement('div');b.className='chat-bubble '+type;b.textContent=text;chatLog.appendChild(b);chatLog.scrollTop=chatLog.scrollHeight}
 function answerChat(text){const q=text.toLowerCase();if(/music|أغني|موسيقى|شغل|song/.test(q)){document.querySelector('#music').scrollIntoView({behavior:reduceMotion?'auto':'smooth'});return lang==='ar'?'وصلتك لقسم الموسيقى 🎵 اضغط تشغيل لاختيار الأغنية.':'Taking you to the music player 🎵 Press play to listen.'}if(/social|حساب|تواصل|instagram|انستا|واتس|whatsapp|telegram|تيلي/.test(q)){document.querySelector('#contact').scrollIntoView({behavior:reduceMotion?'auto':'smooth'});return lang==='ar'?'دي روابط حسابات حمزة الرسمية الموجودة في الموقع. اختار الحساب اللي يناسبك.':'Here are Hamza’s social links. Choose the platform you prefer.'}if(/secret|سر|كلمة|password|رمز/.test(q)){document.querySelector('#secret').scrollIntoView({behavior:reduceMotion?'auto':'smooth'});return lang==='ar'?'قسم الرسالة السرية موجود تحت. ملحوظة: كلمة السر الحالية للعرض التجريبي ومش حماية حقيقية.':'The secret-note section is below. Note: its password is only a demo, not real security.'}if(/photo|صور|معرض|gallery|picture/.test(q)){document.querySelector('#gallery').scrollIntoView({behavior:reduceMotion?'auto':'smooth'});return lang==='ar'?'فتحتلك طريق معرض الصور ✦ اضغط على أي صورة علشان تكبر.':'Taking you to the photo archive ✦ Tap any image to enlarge it.'}if(/who|مين|حمزة|hamza|about/.test(q))return lang==='ar'?'أنا محطة HAMZA التفاعلية ✦ الموقع بيجمع صور حمزة وموسيقاه وذكرياته وروابط التواصل.':'This is the HAMZA interactive terminal ✦ The site brings together Hamza’s photos, music, memories, and social links.';return lang==='ar'?'وصلت رسالتك للتجربة التفاعلية ✦ جرّب تسأل عن الصور أو الموسيقى أو حسابات التواصل.':'Message received by the demo terminal ✦ Try asking about photos, music, or social links.'}
 function sendChat(text){const clean=text.trim();if(!clean)return;addChat(clean,'user');chatInput.value='';window.setTimeout(()=>addChat(answerChat(clean),'bot'),220)}
 chatForm.addEventListener('submit',e=>{e.preventDefault();sendChat(chatInput.value)});$$('[data-chat]').forEach(btn=>btn.addEventListener('click',()=>{const key=btn.dataset.chat,queries={about:lang==='ar'?'مين حمزة؟':'Who is Hamza?',music:lang==='ar'?'شغّل الموسيقى':'Play music',social:lang==='ar'?'حساباته':'Social links'};sendChat(queries[key]||key)}));

 // V11 extra systems: local-only counters, memories, guest notes, and a demo control panel.
 const safeRead=(key,fallback)=>{try{const v=localStorage.getItem(key);return v===null?fallback:JSON.parse(v)}catch(e){return fallback}};
 const safeWrite=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true}catch(e){return false}};
 // Device-local counter (not a global server counter).
 const visitKey='hamza_v11_device_visits';let visitCount=Number(safeRead(visitKey,0))+1;if(!Number.isFinite(visitCount)||visitCount<1)visitCount=1;safeWrite(visitKey,visitCount);$('#visitCount').textContent=String(visitCount);fetch('./api.php?action=visit',{credentials:'same-origin'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(d.ok&&Number.isFinite(Number(d.count))){$('#visitCount').textContent=String(d.count);$('.local-visits small').textContent=lang==='ar'?'زيارة إجمالية':'total visits'}}).catch(()=>{});
 // Animated background mode switch.
 const themes=['cyber','pink','green'];let theme=safeRead('hamza_v11_theme','cyber');if(!themes.includes(theme))theme='cyber';document.body.classList.add('theme-'+theme);
 $('#neonToggle').addEventListener('click',()=>{theme=themes[(themes.indexOf(theme)+1)%themes.length];document.body.classList.remove(...themes.map(t=>'theme-'+t));document.body.classList.add('theme-'+theme);safeWrite('hamza_v11_theme',theme);showToast(lang==='ar'?'تم تغيير ألوان النيون ✦':'Neon colors changed ✦')});
 // Reaction game.
 const game=$('#reactionGame'),gText=$('#reactionText'),gSub=$('#reactionSub'),gIcon=$('#reactionIcon'),gResult=$('#reactionResult'),gRecord=$('#reactionRecord'),gBest=$('#bestReaction');let gameState='idle',readyTimer=0,startAt=0;let best=Number(safeRead('hamza_v11_reaction_best',0))||0;function showBest(){const val=best?best+' ms':'— ms';gRecord.textContent=val;gBest.textContent='BEST: '+(best?best+' ms':'--')}showBest();
 game.addEventListener('click',()=>{if(gameState==='idle'||gameState==='result'){clearTimeout(readyTimer);gameState='waiting';game.dataset.state='waiting';gIcon.textContent='⌛';gText.textContent=lang==='ar'?'استنى الإشارة...':'Wait for the signal...';gSub.textContent=lang==='ar'?'ماتضغطش دلوقتي!':'Do not tap yet!';readyTimer=setTimeout(()=>{if(gameState!=='waiting')return;gameState='ready';game.dataset.state='ready';startAt=performance.now();gIcon.textContent='⚡';gText.textContent=lang==='ar'?'اضغط دلوقتي!':'TAP NOW!';gSub.textContent=lang==='ar'?'يلا بسرعة':'Go, go, go!'},1000+Math.random()*2600);return}if(gameState==='waiting'){clearTimeout(readyTimer);gameState='result';game.dataset.state='idle';gIcon.textContent='✕';gText.textContent=lang==='ar'?'بدري أوي! جرّب تاني':'Too early! Try again';gSub.textContent=lang==='ar'?'استنى اللون السماوي':'Wait for cyan';gResult.textContent='EARLY';return}if(gameState==='ready'){const ms=Math.round(performance.now()-startAt);gameState='result';game.dataset.state='idle';gIcon.textContent='✦';gText.textContent=ms<220?(lang==='ar'?'رد فعل سريع جدًا!':'Lightning fast!'):(lang==='ar'?'حلو! جرّب تكسر رقمك':'Nice! Beat your record');gSub.textContent=lang==='ar'?'اضغط تاني عشان تعيد اللعب':'Tap to play again';gResult.textContent=ms+' ms';if(!best||ms<best){best=ms;safeWrite('hamza_v11_reaction_best',best);showBest();showToast(lang==='ar'?'رقم قياسي جديد! ⚡':'New personal best! ⚡')}}});
 // Memory archive, stored only in this browser.
 const memoryKey='hamza_v11_memories';function renderMemories(){const list=safeRead(memoryKey,[]),root=$('#extraMemories');root.replaceChildren();list.slice().reverse().forEach(m=>{const card=document.createElement('article');card.className='extra-memory';const d=document.createElement('small');d.textContent=m.date||'HAMZA MEMORY';const h=document.createElement('h4');h.textContent=m.title;const p=document.createElement('p');p.textContent=m.body;card.append(d,h,p);root.appendChild(card)})}
 renderMemories();$('#memoryForm').addEventListener('submit',e=>{e.preventDefault();const list=safeRead(memoryKey,[]);list.push({title:$('#memoryTitle').value.trim(),date:$('#memoryDate').value.trim(),body:$('#memoryBody').value.trim()});if(!safeWrite(memoryKey,list)){showToast(lang==='ar'?'المتصفح لم يسمح بالحفظ المحلي.':'Local storage is unavailable.');return}$('#memoryForm').reset();renderMemories();showToast(lang==='ar'?'الذكرى اتحفظت على جهازك ✦':'Memory saved on this device ✦')});
 // Guestbook: locally saved, with explicit WhatsApp send handoff.
 const guestKey='hamza_v11_guest_notes';function renderGuests(){const list=safeRead(guestKey,[]),root=$('#guestEntries');root.replaceChildren();$('#guestCount').textContent=String(list.length);list.slice(-12).reverse().forEach(m=>{const card=document.createElement('article');card.className='guest-entry';const b=document.createElement('b');b.textContent=m.name;const p=document.createElement('p');p.textContent=m.message;const sm=document.createElement('small');sm.textContent=m.date;card.append(b,p,sm);root.appendChild(card)})}renderGuests();fetch('./api.php?action=messages',{credentials:'same-origin'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(d.ok&&Array.isArray(d.messages)){const local=safeRead(guestKey,[]);const combined=[...d.messages,...local].slice(-30);const root=$('#guestEntries');root.replaceChildren();$('#guestCount').textContent=String(combined.length);combined.slice().reverse().forEach(m=>{const card=document.createElement('article');card.className='guest-entry';const b=document.createElement('b');b.textContent=m.name;const p=document.createElement('p');p.textContent=m.message;const sm=document.createElement('small');sm.textContent=m.date;card.append(b,p,sm);root.appendChild(card)})}}).catch(()=>{});
 $('#guestForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#guestName').value.trim(),message=$('#guestMessage').value.trim();if(!name||!message)return;const list=safeRead(guestKey,[]);list.push({name,message,date:new Date().toLocaleString(lang==='ar'?'ar-EG':'en-GB')});if(!safeWrite(guestKey,list)){showToast(lang==='ar'?'تعذر حفظ الرسالة محليًا.':'Could not save the note locally.');return}renderGuests();$('#guestMessage').value='';$('#guestFeedback').textContent=lang==='ar'?'اتحفظت الرسالة محليًا. لو الاستضافة تدعم PHP، هتتحفظ كمان للزوار كلهم؛ وواتساب هيفتح لتأكيد الإرسال.':'Saved locally. On PHP hosting it is also shared with visitors; WhatsApp opens for sending.';fetch('./api.php?action=message',{method:'POST',headers:{'Content-Type':'application/json'},credentials:'same-origin',body:JSON.stringify({name,message})}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(d.ok)$('#guestFeedback').textContent=lang==='ar'?'اتحفظت الرسالة على الموقع كمان ✦':'The message is saved to the site too ✦'}).catch(()=>{});const msg=(lang==='ar'?'رسالة من زائر موقع HAMZA.com\nالاسم: ':'Message from HAMZA.com visitor\nName: ')+name+'\n'+(lang==='ar'?'الرسالة: ':'Message: ')+message;window.open('https://wa.me/201080504473?text='+encodeURIComponent(msg),'_blank','noopener,noreferrer')});
 // Demo admin panel: client-side only. Change PIN in this script before publishing if desired.
 const adminModal=$('#adminModal'),adminPin='2468';function openAdmin(){adminModal.hidden=false;$('#adminFeedback').textContent='';$('#adminTools').hidden=true;$('#adminLogin').hidden=false;$('#adminPin').value=''}$('#openAdmin').addEventListener('click',openAdmin);$('#closeAdmin').addEventListener('click',()=>adminModal.hidden=true);adminModal.addEventListener('click',e=>{if(e.target===adminModal)adminModal.hidden=true});
 $('#adminLogin').addEventListener('submit',e=>{e.preventDefault();if($('#adminPin').value===adminPin){$('#adminFeedback').textContent=lang==='ar'?'تم فتح لوحة الإدارة التجريبية.':'Demo admin unlocked.';$('#adminTools').hidden=false;$('#adminTitle').value=safeRead('hamza_v11_title','');$('#adminTheme').value=theme}else{$('#adminFeedback').textContent=lang==='ar'?'رمز غير صحيح.':'Incorrect PIN.';$('#adminTools').hidden=true}});
 $('#saveAdmin').addEventListener('click',()=>{const title=$('#adminTitle').value.trim();safeWrite('hamza_v11_title',title);theme=$('#adminTheme').value;document.body.classList.remove(...themes.map(t=>'theme-'+t));document.body.classList.add('theme-'+theme);safeWrite('hamza_v11_theme',theme);if(title){const tag=$('.hero-tagline');tag.textContent=title;tag.removeAttribute('data-ar');tag.removeAttribute('data-en')}showToast(lang==='ar'?'اتحفظت الإعدادات على جهازك.':'Settings saved on this device.');adminModal.hidden=true});
 $('#clearGuestbook').addEventListener('click',()=>{if(confirm(lang==='ar'?'تمسح كل الرسائل المحفوظة على الجهاز ده؟':'Delete all notes saved on this device?')){safeWrite(guestKey,[]);renderGuests();showToast(lang==='ar'?'تم مسح الرسائل المحلية.':'Local notes cleared.')}});
 // Hidden interaction: tap the logo five times for a cyber surprise.
 let logoHits=0,logoReset=0;$$('.logo').forEach(el=>el.addEventListener('click',e=>{logoHits++;clearTimeout(logoReset);logoReset=setTimeout(()=>logoHits=0,1800);if(logoHits>=5){logoHits=0;document.body.classList.toggle('secret-mode');showToast(lang==='ar'?'اكتشفت وضع الشبح 👾':'Ghost mode unlocked 👾');document.body.style.setProperty('--neon-a',document.body.classList.contains('secret-mode')?'#ff4bd8':'#b66cff')}}));
 // Persist the saved admin title when reopening the site.
 const savedTitle=safeRead('hamza_v11_title','');if(savedTitle){const tag=$('.hero-tagline');tag.textContent=savedTitle;tag.removeAttribute('data-ar');tag.removeAttribute('data-en')}

 // Basic service worker
 if('serviceWorker' in navigator && location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
 setLang('ar');
})();