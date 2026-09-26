/* =============================================================================
   NORTHRIDGE RENDERER — OutRun rules on a photograph.

   THE GROUND IS A PLANE SAMPLED PER SCANLINE. For each band of screen rows below
   the horizon we solve which ground distance it looks at, then blit a slice of the
   map at the right scale and offset. That is the 1986 technique (OutRun's road,
   Mode 7) and it is still the right one: it gives TRUE perspective, a real horizon,
   and therefore a real sky — none of which a flat 2D scroll can do. What changed
   since is the budget: their plane was a handful of dithered tiles, ours is a
   3072x2048 photograph of the actual San Fernando Valley.

   THE MATH, stated once so it can be checked:
     focal F   = (W/2) / tan(HFOV/2)
     height h  = d0 * tan(phi)          d0 = ground distance at screen centre
     row y     -> alpha = phi - atan((y - H/2)/F)      angle below horizontal
                  fwd   = h / tan(alpha)               ground distance for that row
                  scale = F / fwd                      screen px per world unit
     horizon   = H/2 - F*tan(phi)
   Everything else — sprites, pins, the car — goes through project(), which solves
   the SAME plane, so nothing can drift out of register with the ground.

   AIRY IS RENDER-ONLY. Camera lag, yaw overshoot, body slide and the weight shadow
   are springs layered ON TOP of the deterministic sim, which never reads them.
   Same line the SUCK UP saucer and the ONE TIMER knocker use:
       gv += (err*accel - gv*damp)*dt ;  pos += gv*dt
   Press G to A/B glide against snap.

   TILT IS THE SPEEDOMETER. Parked, phi is near-vertical and d0 is long, so it reads
   as a map. On the throttle phi lies down and d0 shortens: the horizon drops in and
   the sky opens up. Speed is the only thing that moves them. SHIFT forces the survey.
   ============================================================================= */
(function(){
'use strict';

var BAND = 3;                      // scanline band height, device px. The only perf knob.
var HFOV = 96*Math.PI/180;    // wide enough that the horizon can actually enter frame
var D0_REST = 300, PHI_REST = 62*Math.PI/180;   // parked: a high 3/4 that still reads as a map
var D0_FAST = 330, PHI_FAST = 19*Math.PI/180;   // flat out: laid down the road, sky open

var cam={x:CAR.x,y:CAR.y,ang:0,vx:0,vy:0,va:0,d0:D0_REST,vd:0,phi:PHI_REST,vphi:0};
var body={yaw:0,vyaw:0,slide:0,vslide:0,lean:0,vlean:0};
var SPR={accel:200,damp:26};       // per ZEBRA GLIDE TEST — critically damped-ish

function spring(pos,vel,target,dt,accel,damp){
  vel += ((target-pos)*accel - vel*damp)*dt;
  return [pos+vel*dt, vel];
}
function angDelta(a,b){ return ((b-a+Math.PI*3)%(Math.PI*2))-Math.PI; }

var src=document.createElement('canvas'), srcReady=false;
function prepSource(){
  if(srcReady || !MAP.ok) return;
  src.width=MAP.w; src.height=MAP.h;
  src.getContext('2d').drawImage(MAP.img,0,0); srcReady=true;
}
function focal(){ return (cv.width/2)/Math.tan(HFOV/2); }
function camH(){ return cam.d0*Math.tan(cam.phi); }
function horizonY(){ return cv.height/2 - focal()*Math.tan(cam.phi); }

function updateCam(dt){
  var sp=Math.min(1,Math.abs(CAR.spd)/TOP);
  var lead=sp*70;                                  // the camera LEADS — that is the weight
  var tx=CAR.x+Math.sin(CAR.ang)*lead, ty=CAR.y-Math.cos(CAR.ang)*lead;
  if(GLIDE){
    var rx=spring(cam.x,cam.vx,tx,dt,SPR.accel,SPR.damp); cam.x=rx[0]; cam.vx=rx[1];
    var ry=spring(cam.y,cam.vy,ty,dt,SPR.accel,SPR.damp); cam.y=ry[0]; cam.vy=ry[1];
  } else { cam.x=tx; cam.y=ty; cam.vx=cam.vy=0; }

  var want = survey?0:CAR.ang, da=angDelta(cam.ang,want);
  if(GLIDE){ var ra=spring(0,cam.va,da,dt,150,22); cam.ang+=ra[0]; cam.va=ra[1]; }
  else cam.ang=want;

  var tphi = survey? PHI_REST : (TILT? PHI_REST+(PHI_FAST-PHI_REST)*sp : PHI_REST);
  var td0  = survey? D0_REST  : D0_REST +(D0_FAST -D0_REST )*sp;
  var rp=spring(cam.phi,cam.vphi,tphi,dt,80,16); cam.phi=rp[0]; cam.vphi=rp[1];
  var rd=spring(cam.d0 ,cam.vd  ,td0 ,dt,80,16); cam.d0 =rd[0]; cam.vd  =rd[1];
  cam.phi=Math.max(0.18,Math.min(1.44,cam.phi)); cam.d0=Math.max(110,cam.d0);

  var steer=(keys['d']||keys['arrowright']?1:0)-(keys['a']||keys['arrowleft']?1:0);
  var r1=spring(body.yaw,body.vyaw, GLIDE? steer*0.20*Math.min(1,Math.abs(CAR.spd)/60):0, dt,220,20);
  body.yaw=r1[0]; body.vyaw=r1[1];
  var r2=spring(body.slide,body.vslide, GLIDE? -steer*3.0*Math.min(1,Math.abs(CAR.spd)/80):0, dt,200,22);
  body.slide=r2[0]; body.vslide=r2[1];
  var th=(keys['w']||keys['arrowup']?1:0)-(keys['s']||keys['arrowdown']?1:0);
  var r3=spring(body.lean,body.vlean, GLIDE? th*2.4:0, dt,180,20);
  body.lean=r3[0]; body.vlean=r3[1];
}

/* world -> screen, solving the SAME plane the ground is drawn with. null = behind. */
function project(wx,wy){
  var dx=wx-cam.x, dy=wy-cam.y;
  var fwd = dx*Math.sin(cam.ang) - dy*Math.cos(cam.ang);
  var lat = dx*Math.cos(cam.ang) + dy*Math.sin(cam.ang);
  if(fwd<8) return null;
  var F=focal(), h=camH();
  var alpha=Math.atan2(h,fwd);
  var sy=cv.height/2 + F*Math.tan(alpha-cam.phi);   // matches drawGround's alpha(y)
  return [cv.width/2 + lat*(F/fwd), sy, F/fwd];
}

function drawSky(){
  /* The sky is the BACKDROP, not a band. Two different things put nothing on screen:
     looking past the horizon, and looking past the EDGE OF THE VALLEY — the map is
     3072x2048 and then it stops. Painting May gray across the whole frame first means
     both read the same way, which is also the truth: the Valley ends in marine layer.  */
  var hz=horizonY();
  var top=Math.max(0,Math.min(cv.height,hz));
  var g=ctx.createLinearGradient(0,0,0,cv.height);
  g.addColorStop(0,'#59708a'); g.addColorStop(0.42,'#93a4b4'); g.addColorStop(1,'#d8d1c2');
  ctx.fillStyle=g; ctx.fillRect(0,0,cv.width,cv.height);
  if(top>2){                                   // a real horizon is in frame — give it a rim
    ctx.fillStyle='rgba(72,84,95,.45)';
    ctx.beginPath(); ctx.moveTo(0,top);
    for(var x=0;x<=cv.width;x+=cv.width/16){
      var n=Math.sin(x*0.0017)*0.5+Math.sin(x*0.0041+1.7)*0.5;
      ctx.lineTo(x, top-9*DPR-n*8*DPR);
    }
    ctx.lineTo(cv.width,top); ctx.closePath(); ctx.fill();
  }
  return top;
}

function drawGround(hz){
  var ch=cv.height, cw=cv.width, start=Math.max(0,Math.floor(hz));
  if(!srcReady){ ctx.fillStyle='#2b3037'; ctx.fillRect(0,start,cw,ch-start); return; }
  var F=focal(), h=camH(), sinA=Math.sin(cam.ang), cosA=Math.cos(cam.ang);
  ctx.imageSmoothingEnabled=true;
  for(var y=start; y<ch; y+=BAND){
    var alpha = cam.phi + Math.atan((y-ch/2)/F);   // +: bottom of screen is NEAR
    // Past vertical the ray would look BEHIND the camera and tan() flips sign — that was a
    // black band across the bottom of the screen at steep pitch. Clamp just under 90deg:
    // those rows all sample ground essentially under the car, which is what they should.
    if(alpha>1.5533) alpha=1.5533;
    if(alpha<=0.004) continue;
    var fwd=h/Math.tan(alpha);
    if(fwd<=4 || fwd>9000) continue;
    var scale=F/fwd;
    if(!isFinite(scale) || scale<=0.0004) continue;
    var px=cam.x+sinA*fwd, py=cam.y-cosA*fwd;         // dead ahead at that range
    var halfW=(cw/2)/scale;
    var ax=px-cosA*halfW, ay=py-sinA*halfW;           // the row's left edge, in world
    ctx.save();
    ctx.beginPath(); ctx.rect(0,y,cw,BAND+1); ctx.clip();
    ctx.translate(0,y); ctx.scale(scale,scale); ctx.rotate(-cam.ang); ctx.translate(-ax,-ay);
    ctx.drawImage(src,0,0);
    ctx.restore();
  }
  // DISTANCE HAZE: the far field dissolves into the same marine layer as the sky, so the
  // edge of the map and the edge of sight are the same edge. Cheap, and it is what the
  // Valley actually looks like at 3pm in May.
  var hazeTop=Math.max(0,start), hazeBot=Math.min(ch, start+ch*0.30);
  if(hazeBot>hazeTop){
    var hg=ctx.createLinearGradient(0,hazeTop,0,hazeBot);
    hg.addColorStop(0,'rgba(216,209,194,.95)'); hg.addColorStop(0.45,'rgba(216,209,194,.42)');
    hg.addColorStop(1,'rgba(216,209,194,0)');
    ctx.fillStyle=hg; ctx.fillRect(0,hazeTop,cw,hazeBot-hazeTop);
  }
}

/* a sprite standing on the plane, with a shadow the whole Valley shares */
function drawOnPlane(key,wx,wy,ang,len,wid,extra){
  var p=project(wx,wy); if(!p) return;
  var sx=p[0], sy=p[1], sc=p[2];
  if(sx<-300||sx>cv.width+300||sy<-300||sy>cv.height+300) return;
  var L=len*sc, Wd=wid*sc;
  if(L<1.0) return;
  ctx.save(); ctx.translate(sx,sy); ctx.rotate(ang-cam.ang);
  var lean=(extra&&extra.lean)||0, slide=(extra&&extra.slide)||0;
  var stretch=1+(1-Math.sin(cam.phi))*1.6;            // the shadow lengthens as the world lays down
  ctx.globalAlpha=0.36; ctx.fillStyle='#000';
  ctx.beginPath();
  ctx.ellipse(Wd*0.18+slide*sc*0.4, L*0.10-lean*sc*0.35, Wd*0.52, L*0.32*stretch, 0,0,7);
  ctx.fill(); ctx.globalAlpha=1;
  var im=IMG[key];
  if(im&&im.ok){ var R=fitRect(key,Wd,L); ctx.drawImage(im,R[0],R[1],R[2],R[3]); }
  else { ctx.fillStyle='#c9ced6'; ctx.fillRect(-Wd/2,-L/2,Wd,L); }
  ctx.restore();
}

var last=0, fps=60, facc=0, fn=0;
function frame(ts){
  var dt=Math.min(0.05,(ts-last)/1000||0.016); last=ts;
  facc+=dt; fn++; if(facc>0.5){ fps=fn/facc; facc=0; fn=0; }
  prepSource(); sim(dt); updateCam(dt);

  ctx.setTransform(1,0,0,1,0,0);
  var hz=drawSky();
  drawGround(hz);

  // far things first so nearer ones overlap correctly
  var order=TRAF.slice().map(function(t){
    var dx=t.x-cam.x, dy=t.y-cam.y;
    return {t:t, f:dx*Math.sin(cam.ang)-dy*Math.cos(cam.ang)};
  }).filter(function(o){return o.f>8;}).sort(function(a,b){return b.f-a.f;});
  for(var i=0;i<order.length;i++){ var t=order[i].t; drawOnPlane(t.k,t.x,t.y,t.ang,t.len,t.wid,null); }

  var d=DROPS[fareIdx], dp=project(d.x,d.y);
  if(dp){
    var pulse=0.6+0.4*Math.sin(ts/220);
    ctx.save(); ctx.translate(dp[0],dp[1]);
    ctx.strokeStyle='rgba(255,70,190,'+(0.45+0.45*pulse)+')';
    ctx.lineWidth=Math.max(1.5,3.2*dp[2]);
    ctx.beginPath(); ctx.ellipse(0,0,46*dp[2],Math.max(2,46*dp[2]*Math.sin(cam.phi)),0,0,7); ctx.stroke();
    ctx.fillStyle='rgba(255,70,190,.15)'; ctx.fill();
    if(dp[2]>0.12){ ctx.font='800 '+Math.max(11,13*Math.min(2,dp[2]*1.7))+'px system-ui';
      ctx.textAlign='center'; ctx.fillStyle='#ffd23f'; ctx.shadowColor='#000'; ctx.shadowBlur=8;
      ctx.fillText((carrying?'DROP · ':'PICK UP · ')+d.n, 0, -50*dp[2]-8); ctx.shadowBlur=0; }
    ctx.restore();
  }

  drawOnPlane('traffic/player_zebra',
    CAR.x+Math.cos(CAR.ang)*body.slide, CAR.y+Math.sin(CAR.ang)*body.slide,
    CAR.ang+body.yaw, CAR.len, CAR.wid, {lean:body.lean, slide:body.slide});

  var spn=Math.abs(CAR.spd)/TOP;
  if(spn>0.55){                                     // the arcade tell, only above cruise
    ctx.save(); ctx.globalAlpha=Math.min(0.6,(spn-0.55)*1.6);
    ctx.strokeStyle='#eaf2ff'; ctx.lineWidth=1.5*DPR;
    var cx=cv.width/2, cy=cv.height*0.66, rr=cv.height*0.40;
    for(var s=0;s<18;s++){ var a=(s/18)*Math.PI*2+ts/1100;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(a)*rr, cy+Math.sin(a)*rr*0.42);
      ctx.lineTo(cx+Math.cos(a)*(rr+70*spn), cy+Math.sin(a)*(rr+70*spn)*0.42); ctx.stroke(); }
    ctx.restore();
  }
  if(heat>62){ ctx.save(); ctx.globalAlpha=(heat-62)/38*0.34;
    var vg=ctx.createRadialGradient(cv.width/2,cv.height/2,cv.height*0.25,cv.width/2,cv.height/2,cv.height*0.72);
    vg.addColorStop(0,'rgba(255,40,60,0)'); vg.addColorStop(1,'rgba(255,40,60,1)');
    ctx.fillStyle=vg; ctx.fillRect(0,0,cv.width,cv.height); ctx.restore(); }

  drawHUD();
  requestAnimationFrame(frame);
}

function drawHUD(){
  ctx.setTransform(1,0,0,1,0,0);
  if(showMini && MAP.mini.complete){
    var mw=178*DPR, mh=mw*MAP.h/MAP.w, mx=cv.width-mw-14*DPR, my=cv.height-mh-14*DPR;
    ctx.globalAlpha=.88; ctx.drawImage(MAP.mini,mx,my,mw,mh); ctx.globalAlpha=1;
    ctx.strokeStyle='#39d98a'; ctx.lineWidth=1*DPR; ctx.strokeRect(mx,my,mw,mh);
    var d=DROPS[fareIdx];
    ctx.fillStyle='#ff46be'; ctx.fillRect(mx+d.x/MAP.w*mw-3,my+d.y/MAP.h*mh-3,6,6);
    ctx.fillStyle='#ffd23f'; ctx.fillRect(mx+CAR.x/MAP.w*mw-3,my+CAR.y/MAP.h*mh-3,6,6);
  }
  if(msgT<=0) document.getElementById('ban').textContent='';
  var road=onRoad(CAR.x,CAR.y);
  document.getElementById('hFare').textContent=(carrying?'DELIVER TO ':'PICK UP ')+DROPS[fareIdx].n;
  document.getElementById('hSub').textContent=(road?road.n:'OFF THE ROAD')+'  ·  '+(CAR.x|0)+', '+(CAR.y|0);
  document.getElementById('hHeat').textContent=heat.toFixed(0);
  document.getElementById('hCash').textContent=cash;
  document.getElementById('hRoad').textContent=fps.toFixed(0)+' fps';
  document.getElementById('hMph').textContent=(Math.abs(CAR.spd)*0.78)|0;
  document.getElementById('hMode').textContent=(GLIDE?'GLIDE':'SNAP')+(survey?' · SURVEY':(TILT?' · TILT':''));
}
window.__nr={cam:cam,body:body,project:project,horizonY:horizonY};
requestAnimationFrame(frame);
})();
