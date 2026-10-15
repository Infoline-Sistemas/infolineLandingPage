/**
 * assets/js/interactions.js
 * Microinterações com propósito: entrada sutil ao rolar, demonstrações de
 * produto e o Saturno do ecossistema. A animação orbital pausa fora da tela
 * e respeita a preferência do usuário por movimento reduzido.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- revelação sutil ao entrar na viewport -----------------------------
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  // ---- "Veja o Infoline em ação": tabs + destaque progressivo -----------
  document.querySelectorAll('[data-demo]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('.demo-tab'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('.demo-panel'));
    if (!tabs.length) return;

    var timer = null;

    function activatePanel(key) {
      panels.forEach(function (p) { p.toggleAttribute('data-active', p.dataset.panel === key); });
      tabs.forEach(function (t) { t.setAttribute('aria-selected', t.dataset.demoTab === key ? 'true' : 'false'); });
      var panel = panels.find(function (p) { return p.dataset.panel === key; });
      if (panel) startCycle(panel);
    }

    function setStep(panel, index) {
      var steps = panel.querySelectorAll('.demo-step');
      var blocks = panel.querySelectorAll('[data-for]');
      steps.forEach(function (s, i) { s.toggleAttribute('aria-current', i === index ? 'step' : false); if (i === index) s.setAttribute('aria-current', 'step'); });
      blocks.forEach(function (b) { b.toggleAttribute('data-active', Number(b.dataset.for) === index); });
    }

    function startCycle(panel) {
      clearInterval(timer);
      var steps = panel.querySelectorAll('.demo-step');
      if (!steps.length) return;
      var i = 0;
      setStep(panel, i);
      if (reduceMotion) return;
      timer = setInterval(function () {
        i = (i + 1) % steps.length;
        setStep(panel, i);
      }, 2800);
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () { activatePanel(tab.dataset.demoTab); });
    });

    panels.forEach(function (panel) {
      panel.querySelectorAll('.demo-step').forEach(function (step, i) {
        step.addEventListener('click', function () { clearInterval(timer); setStep(panel, i); });
        step.addEventListener('mouseenter', function () { clearInterval(timer); setStep(panel, i); });
      });
      panel.addEventListener('mouseleave', function () { if (panel.hasAttribute('data-active')) startCycle(panel); });
    });

    if (tabs[0]) activatePanel(tabs[0].dataset.demoTab);
  });

  // ---- Saturno Infoline: áreas, acontecimentos e profundidade ----------
  document.querySelectorAll('[data-saturn-scene]').forEach(function (root) {
    var stage = root.querySelector('.eco-stage');
    var canvas = root.querySelector('.eco-canvas');
    var solutions = Array.prototype.slice.call(root.querySelectorAll('.eco-solution'));
    var eventTitle = root.querySelector('[data-eco-event] [data-eco-title]');
    var eventFlow = root.querySelector('[data-eco-event] [data-eco-flow]');
    if (!stage || !canvas || !solutions.length || !eventTitle || !eventFlow) return;

    var context = canvas.getContext('2d', { alpha:true });
    if (!context) return;
    var defaultEvent = { title:eventTitle.textContent, flow:eventFlow.textContent };
    var tau = Math.PI * 2;
    var width = 0;
    var height = 0;
    var pixelRatio = 1;
    var frame = 0;
    var inViewport = true;
    var pointerX = 0;
    var pointerY = 0;
    var targetX = 0;
    var targetY = 0;

    function randomFactory(seed) {
      return function () {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        var value = Math.imul(seed ^ seed >>> 15, 1 | seed);
        value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      };
    }

    var random = randomFactory(8421);
    var stars = [];
    var particles = [];
    var i;
    for (i = 0; i < 82; i += 1) {
      stars.push({ x:random(), y:random(), size:.3 + random(), alpha:.1 + random() * .4, tone:random(), phase:random() * tau });
    }
    for (i = 0; i < 1120; i += 1) {
      var band = random();
      var ringRadius;
      if (band < .22) ringRadius = 1.39 + random() * .14;
      else if (band < .58) ringRadius = 1.58 + random() * .25;
      else if (band < .82) ringRadius = 1.94 + random() * .18;
      else ringRadius = 2.17 + random() * .18;
      particles.push({
        angle:random() * tau, radius:ringRadius, size:.32 + random(), alpha:.24 + random() * .72,
        speed:.72 + random() * .45, phase:random() * tau, warm:random(), bright:i % 61 === 0
      });
    }

    var satellites = [
      { orbit:3.42, tilt:.34, rotation:-.11, speed:.000022, phase:.2, size:.07, colors:['#d9f7ff','#22c9f3','#0875b7'], halo:'#22c9f3' },
      { orbit:2.48, tilt:.27, rotation:-.18, speed:.000054, phase:1.25, size:.052, colors:['#eaf4ff','#6ca8ff','#174ba8'], halo:'#6ca8ff' },
      { orbit:2.78, tilt:.3, rotation:-.15, speed:.000041, phase:2.08, size:.057, colors:['#e8fbff','#5ad9f7','#137ba8'], halo:'#5ad9f7' },
      { orbit:3.08, tilt:.25, rotation:-.2, speed:.000031, phase:2.92, size:.062, colors:['#e9f2ff','#3d85ef','#0b3d91'], halo:'#3d85ef' },
      { orbit:2.6, tilt:.33, rotation:-.1, speed:.000047, phase:3.72, size:.05, colors:['#f1f7ff','#88b9ff','#2558aa'], halo:'#88b9ff' },
      { orbit:3.32, tilt:.29, rotation:-.16, speed:.000026, phase:4.48, size:.068, colors:['#e4f9ff','#19bde9','#075f9b'], halo:'#19bde9' },
      { orbit:2.89, tilt:.23, rotation:-.22, speed:.000036, phase:5.18, size:.054, colors:['#edf5ff','#568fe8','#153f8a'], halo:'#568fe8' },
      { orbit:3.18, tilt:.36, rotation:-.08, speed:.000029, phase:5.82, size:.06, colors:['#e8fbff','#53cce8','#126887'], halo:'#53cce8' }
    ];

    function resizeSaturn() {
      var rect = stage.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      drawSaturn(reduceMotion ? 1800 : performance.now());
    }

    function drawStars(time) {
      stars.forEach(function (star) {
        var pulse = .72 + Math.sin(time * .00055 + star.phase) * .28;
        var color = star.tone > .78 ? '27,118,210' : '65,111,172';
        context.beginPath();
        context.fillStyle = 'rgba(' + color + ',' + (star.alpha * pulse) + ')';
        context.arc(star.x * width + pointerX * (star.x - .5) * 4, star.y * height + pointerY * (star.y - .5) * 3, star.size, 0, tau);
        context.fill();
      });
    }

    function projectParticle(particle, time, cx, cy, radius) {
      var angle = particle.angle + time * .000052 * particle.speed;
      var distance = radius * particle.radius;
      var x = Math.cos(angle) * distance;
      var z = Math.sin(angle) * distance;
      var tilt = .255 + pointerY * .01;
      var planeY = z * Math.sin(tilt);
      var depth = z * Math.cos(tilt);
      var rotation = -.16 + Math.sin(time * .00009) * .018 + pointerX * .012;
      return {
        x:cx + x * Math.cos(rotation) - planeY * Math.sin(rotation),
        y:cy + x * Math.sin(rotation) + planeY * Math.cos(rotation),
        depth:depth,
        shimmer:.78 + Math.sin(time * .001 + particle.phase) * .22
      };
    }

    function drawRingGuides(time, cx, cy, radius) {
      context.save();
      context.translate(cx, cy);
      context.rotate(-.16 + Math.sin(time * .00009) * .018 + pointerX * .012);
      var gradient = context.createLinearGradient(-radius * 2.5, 0, radius * 2.5, 0);
      gradient.addColorStop(0, 'rgba(24,104,222,0)');
      gradient.addColorStop(.18, 'rgba(45,129,235,.2)');
      gradient.addColorStop(.48, 'rgba(202,233,255,.72)');
      gradient.addColorStop(.78, 'rgba(39,112,222,.18)');
      gradient.addColorStop(1, 'rgba(24,104,222,0)');
      context.strokeStyle = gradient;
      [1.43,1.51,1.61,1.79,1.82,1.95,2.08,2.2,2.33].forEach(function (scale, index) {
        context.globalAlpha = index === 4 || index === 5 ? .78 : .5;
        context.lineWidth = index === 4 ? 1.5 : .75;
        context.beginPath();
        context.ellipse(0, 0, radius * scale, radius * scale * .255, 0, 0, tau);
        context.stroke();
      });
      context.restore();
    }

    function ringColor(particle, alpha) {
      if (particle.radius < 1.55) return 'rgba(46,115,211,' + (alpha * .68) + ')';
      if (particle.radius < 1.84) return particle.warm > .5 ? 'rgba(214,239,255,' + alpha + ')' : 'rgba(135,191,255,' + (alpha * .92) + ')';
      if (particle.radius < 1.94) return 'rgba(20,70,153,' + (alpha * .42) + ')';
      if (particle.radius < 2.14) return 'rgba(232,247,255,' + alpha + ')';
      return 'rgba(94,158,239,' + (alpha * .64) + ')';
    }

    function drawRingParticles(time, cx, cy, radius, front) {
      var projected = [];
      particles.forEach(function (particle) {
        var point = projectParticle(particle, time, cx, cy, radius);
        if ((point.depth >= 0) === front) projected.push({ particle:particle, point:point });
      });
      projected.sort(function (a, b) { return a.point.depth - b.point.depth; });
      projected.forEach(function (item) {
        var particle = item.particle;
        var point = item.point;
        var depth = Math.max(-1, Math.min(1, point.depth / (radius * 2.3)));
        var visibility = front ? .88 + depth * .3 : .42 + (depth + 1) * .2;
        var alpha = particle.alpha * point.shimmer * visibility;
        context.beginPath();
        context.fillStyle = particle.bright ? 'rgba(240,252,255,' + Math.min(1, alpha + .28) + ')' : ringColor(particle, alpha);
        context.arc(point.x, point.y, particle.size * (front ? 1.06 : .84), 0, tau);
        context.fill();
        if (particle.bright) {
          context.beginPath();
          context.fillStyle = 'rgba(48,157,255,' + (alpha * .11) + ')';
          context.arc(point.x, point.y, particle.size * 5, 0, tau);
          context.fill();
        }
      });
    }

    function drawPlanet(time, cx, cy, radius) {
      context.save();
      context.beginPath();
      context.arc(cx, cy, radius, 0, tau);
      context.clip();
      var base = context.createLinearGradient(cx - radius, cy - radius, cx + radius, cy + radius);
      ['#baf4ff','#62d5f7','#247ee8','#0b4dbb','#052258'].forEach(function (color, index) { base.addColorStop(index / 4, color); });
      context.fillStyle = base;
      context.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

      context.save();
      context.translate(cx, cy);
      context.rotate(-.07 + pointerX * .004);
      var bandColors = [[216,245,255],[62,151,237],[152,218,255],[31,104,207],[201,238,255],[83,167,240],[232,249,255],[47,121,217]];
      for (var bandIndex = 0; bandIndex < 31; bandIndex += 1) {
        var normalizedY = -1 + bandIndex / 30 * 2;
        var y = normalizedY * radius;
        var halfWidth = Math.sqrt(Math.max(0, radius * radius - y * y));
        var rgb = bandColors[bandIndex % bandColors.length];
        var wave = Math.sin(time * .00022 + bandIndex * .67) * radius * .012;
        context.beginPath();
        for (var pointIndex = 0; pointIndex <= 28; pointIndex += 1) {
          var localX = -halfWidth + pointIndex / 28 * halfWidth * 2;
          var localY = y + Math.sin(localX * .022 + time * .00042 + bandIndex * .49) * (1.25 + Math.abs(normalizedY) * 1.35) + wave;
          if (pointIndex === 0) context.moveTo(localX, localY); else context.lineTo(localX, localY);
        }
        context.strokeStyle = 'rgba(' + rgb.join(',') + ',' + (.08 + (1 - Math.abs(normalizedY)) * .08) + ')';
        context.lineWidth = bandIndex % 4 === 0 ? radius * .035 : radius * .016;
        context.stroke();
      }
      var stormPhase = time * .00016;
      var stormX = Math.sin(stormPhase) * radius * .56;
      var stormY = radius * .2 + Math.sin(stormPhase * .6) * radius * .025;
      var storm = context.createRadialGradient(stormX, stormY, 0, stormX, stormY, radius * .12);
      storm.addColorStop(0, 'rgba(8,58,145,.25)'); storm.addColorStop(.5, 'rgba(58,151,232,.14)'); storm.addColorStop(1, 'rgba(58,151,232,0)');
      context.fillStyle = storm; context.beginPath(); context.ellipse(stormX, stormY, radius * .14, radius * .045, -.05, 0, tau); context.fill();
      context.restore();

      var light = context.createRadialGradient(cx-radius*.34,cy-radius*.38,0,cx-radius*.34,cy-radius*.38,radius*.95);
      light.addColorStop(0,'rgba(255,255,255,.72)'); light.addColorStop(.16,'rgba(193,243,255,.26)'); light.addColorStop(.62,'rgba(56,168,255,.04)'); light.addColorStop(1,'rgba(20,94,210,0)');
      context.fillStyle = light; context.fillRect(cx-radius,cy-radius,radius*2,radius*2);
      var shadow = context.createLinearGradient(cx-radius*.7,cy-radius*.7,cx+radius,cy+radius);
      shadow.addColorStop(0,'rgba(0,0,0,0)'); shadow.addColorStop(.52,'rgba(0,30,90,.03)'); shadow.addColorStop(.82,'rgba(2,35,96,.34)'); shadow.addColorStop(1,'rgba(1,18,57,.76)');
      context.fillStyle = shadow; context.fillRect(cx-radius,cy-radius,radius*2,radius*2);
      context.restore();

      context.save();
      var rim = context.createLinearGradient(cx-radius,cy-radius,cx+radius,cy+radius);
      rim.addColorStop(0,'rgba(231,252,255,.96)'); rim.addColorStop(.45,'rgba(90,200,255,.62)'); rim.addColorStop(1,'rgba(15,76,181,.1)');
      context.strokeStyle = rim; context.lineWidth = 1.1; context.beginPath(); context.arc(cx,cy,radius+.5,0,tau); context.stroke(); context.restore();
    }

    function satellitePositions(time, cx, cy, radius) {
      return satellites.map(function (satellite) {
        var angle = satellite.phase + (reduceMotion ? 0 : time * satellite.speed * 1.85);
        var orbit = radius * satellite.orbit;
        var x = Math.cos(angle) * orbit;
        var z = Math.sin(angle) * orbit;
        var planeY = z * Math.sin(satellite.tilt);
        var depth = z * Math.cos(satellite.tilt);
        return {
          satellite:satellite,
          x:cx + x * Math.cos(satellite.rotation) - planeY * Math.sin(satellite.rotation),
          y:cy + x * Math.sin(satellite.rotation) + planeY * Math.cos(satellite.rotation),
          depth:depth,
          radius:Math.max(2.6, radius * satellite.size * (.92 + depth / orbit * .1))
        };
      });
    }

    function drawSatelliteOrbits(cx, cy, radius) {
      satellites.forEach(function (satellite, index) {
        context.save(); context.translate(cx,cy); context.rotate(satellite.rotation);
        context.strokeStyle = 'rgba(30,101,196,' + (index === 0 ? .09 : .052) + ')';
        context.lineWidth = .55; context.setLineDash(index % 2 ? [2,8] : []);
        context.beginPath(); context.ellipse(0,0,radius*satellite.orbit,radius*satellite.orbit*Math.sin(satellite.tilt),0,0,tau); context.stroke(); context.restore();
      });
      context.setLineDash([]);
    }

    function drawSatellite(item) {
      var satellite = item.satellite;
      context.save();
      var halo = context.createRadialGradient(item.x,item.y,item.radius*.2,item.x,item.y,item.radius*2.8);
      halo.addColorStop(0,satellite.halo+'42'); halo.addColorStop(1,satellite.halo+'00');
      context.fillStyle=halo; context.beginPath(); context.arc(item.x,item.y,item.radius*2.8,0,tau); context.fill();
      var surface=context.createRadialGradient(item.x-item.radius*.34,item.y-item.radius*.38,item.radius*.05,item.x+item.radius*.12,item.y+item.radius*.15,item.radius*1.1);
      surface.addColorStop(0,satellite.colors[0]); surface.addColorStop(.52,satellite.colors[1]); surface.addColorStop(1,satellite.colors[2]);
      context.fillStyle=surface; context.beginPath(); context.arc(item.x,item.y,item.radius,0,tau); context.fill();
      context.strokeStyle='rgba(235,251,255,.7)'; context.lineWidth=.55; context.stroke(); context.restore();
    }

    function drawSatellites(positions, front) {
      positions.filter(function (item) { return (item.depth >= 0) === front; }).sort(function (a,b) { return a.depth-b.depth; }).forEach(drawSatellite);
    }

    function positionSolutions(positions, radius) {
      var frontIndex = 0;
      positions.forEach(function (item, index) { if (item.depth > positions[frontIndex].depth) frontIndex = index; });
      var compactLimit = width < 430 ? 2 : (width < 560 ? 3 : positions.length);
      var visibleOnCompact = positions
        .map(function (item, index) { return { index:index, depth:item.depth }; })
        .sort(function (a, b) { return b.depth-a.depth; })
        .slice(0, compactLimit)
        .map(function (item) { return item.index; });
      solutions.forEach(function (solution) {
        var index = Number(solution.dataset.ecoIndex);
        var item = positions[index];
        if (!item) return;
        var depthRatio = Math.max(-1, Math.min(1, item.depth / (radius * item.satellite.orbit)));
        var keepVisible = width >= 560 || visibleOnCompact.indexOf(index) !== -1 || solution.matches(':hover,:focus-visible');
        var labelWidth = solution.offsetWidth || 72;
        var labelLeft = item.x + item.radius + 12;
        if (labelLeft + labelWidth > width - 10) labelLeft = item.x - item.radius - labelWidth - 12;
        labelLeft = Math.max(10, Math.min(width - labelWidth - 10, labelLeft));
        var scale = .9 + (depthRatio + 1) * .08 + (index === frontIndex ? .08 : 0);
        solution.style.left = labelLeft + 'px';
        solution.style.top = item.y + 'px';
        solution.style.opacity = keepVisible ? (.48 + (depthRatio + 1) * .25).toFixed(3) : '0';
        solution.style.pointerEvents = keepVisible ? 'auto' : 'none';
        solution.style.transform = 'translateY(-50%) scale(' + scale.toFixed(3) + ')';
        solution.style.zIndex = depthRatio > 0 ? '13' : '3';
        solution.classList.toggle('is-front', index === frontIndex);
      });
    }

    function drawSaturn(time) {
      context.setTransform(pixelRatio,0,0,pixelRatio,0,0);
      context.clearRect(0,0,width,height);
      pointerX += (targetX-pointerX)*.032;
      pointerY += (targetY-pointerY)*.032;
      var cx = width*.505 + pointerX*7;
      var cy = height*.48 + pointerY*4 + (reduceMotion ? 0 : Math.sin(time*.00042)*2.2);
      var radius = Math.min(width,height)*(width<560?.16:.175);
      var positions = satellitePositions(time,cx,cy,radius);
      drawStars(time); drawSatelliteOrbits(cx,cy,radius); drawSatellites(positions,false);
      drawRingGuides(time,cx,cy,radius); drawRingParticles(time,cx,cy,radius,false); drawPlanet(time,cx,cy,radius);
      drawRingParticles(time,cx,cy,radius,true); drawSatellites(positions,true); positionSolutions(positions,radius);
    }

    function animateSaturn(time) {
      drawSaturn(time);
      if (inViewport && !document.hidden && !reduceMotion) frame = requestAnimationFrame(animateSaturn);
    }

    function startSaturn() {
      if (reduceMotion || !inViewport || document.hidden) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(animateSaturn);
    }

    stage.addEventListener('pointermove', function (event) {
      var rect = stage.getBoundingClientRect();
      targetX = ((event.clientX-rect.left)/rect.width-.5)*2;
      targetY = ((event.clientY-rect.top)/rect.height-.5)*2;
    });
    stage.addEventListener('pointerleave', function () { targetX=0; targetY=0; });
    solutions.forEach(function (solution) {
      function showEvent() { eventTitle.textContent=solution.dataset.ecoTitle||''; eventFlow.textContent=solution.dataset.ecoFlow||''; }
      function resetEvent() { eventTitle.textContent=defaultEvent.title; eventFlow.textContent=defaultEvent.flow; }
      solution.addEventListener('mouseenter',showEvent); solution.addEventListener('focus',showEvent);
      solution.addEventListener('mouseleave',resetEvent); solution.addEventListener('blur',resetEvent);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inViewport = !!entries[0].isIntersecting;
        if (inViewport) startSaturn(); else cancelAnimationFrame(frame);
      }, { rootMargin:'120px' }).observe(stage);
    }
    document.addEventListener('visibilitychange', startSaturn);
    if ('ResizeObserver' in window) new ResizeObserver(resizeSaturn).observe(stage);
    else window.addEventListener('resize', resizeSaturn);
    resizeSaturn();
    startSaturn();
  });

  // ---- Fluxos dos módulos-piloto: um único controlador compartilhado ----
  document.querySelectorAll('[data-module-flow]').forEach(function (root) {
    var steps = Array.prototype.slice.call(root.querySelectorAll('.module-system-flow-step'));
    var input = root.querySelector('[data-flow-detail="input"]');
    var control = root.querySelector('[data-flow-detail="control"]');
    var output = root.querySelector('[data-flow-detail="output"]');
    if (!steps.length || !input || !control || !output) return;

    function activate(step) {
      steps.forEach(function (item) {
        var active = item === step;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      input.textContent = step.dataset.flowInput || '';
      control.textContent = step.dataset.flowControl || '';
      output.textContent = step.dataset.flowOutput || '';
    }

    steps.forEach(function (step) {
      step.addEventListener('mouseenter', function () { activate(step); });
      step.addEventListener('focus', function () { activate(step); });
      step.addEventListener('click', function () { activate(step); });
    });
  });
})();
