function CarouselParallax(elem, duration) {
	this.dom_container = elem;
	this.duration = duration || 1500;
	this.movement = 'easeInOut';
	// initialisation
	this.parseSlides();
	this.createMenu();
	this.nodelist_links = this.dom_menu.getElementsByTagName('a');
	this.slide(0);
	this.play(3 * 1000 + this.duration);
	// events
	var self = this;
	this.dom_container.onmouseover = function() { self.stop() };
	this.dom_container.onmouseout  = function() { self.play() };
}

CarouselParallax.prototype = {
	calcParallax: function(slide, progress, dir, side) {
		if (dir === true)
			progress = side ? -progress : 1 - progress;
		else if (side === 0)
			progress = -1 + progress;
		for (var i = 0, e; e = slide.dom_parallaxElems[i]; ++i)
			e._css('margin-left', (e._css('z-index') * progress) + 'px');
	},
	mouseParallax: function(slide, event) {
		return; // on verra plus tard
		var attenuation = 64;
		var x = (event.layerX / slide.offsetWidth  * 2 - 1) / attenuation,
			y = (event.layerY / slide.offsetHeight * 2 - 1) / attenuation;
		for (var i = 0, e; e = slide.dom_parallaxElems[i]; ++i) {
			var zInd = e._css('z-index');
			e._css('margin-left', zInd * x + 'px');
			e._css('margin-top',  zInd * y + 'px');
		}
	},
	slide: function(nb, duration) {
		document._cssAnimEnd(this.cssAnimId);
		if (this.slideNumCurr !== nb) {
			var slide = this.dom_slides[nb], slideCurr;
			if (this.slideNumCurr !== undefined) {
				this.nodelist_links[this.slideNumCurr].className = '';
				slideCurr = this.dom_slides[this.slideNumCurr];
				if (!duration)
					slideCurr.style.display = 'none';
			}
			this.nodelist_links[nb].className = 'selected';
			if (duration) {
				var self = this;
				var dir = this.slideNumCurr < nb;
				this.cssAnimId = document._cssAnim(
					{elm:slide,     css:'left', val:dir ? '+100%' : '-100%'},
					{elm:slideCurr, css:'left', val:dir ? '-100%' : '+100%', clf:function(e, p){self.calcParallax(e, p, dir, 1)}, dur:duration, mov:this.movement},
					{elm:slide,     css:'left', val:'0%',                    clf:function(e, p){self.calcParallax(e, p, dir, 0)}}
				);
			}
			slide.style.display = 'block';
			this.slideNumCurr = nb;
		}
	},
	play: function(timer) {
		if (this.intervalId)
			this.stop();
		if (timer)
			this.timer = timer;
		var self = this;
		this.intervalId = window.setInterval(function() { self.next() }, this.timer);
	},
	stop: function() { window.clearInterval(this.intervalId); this.intervalId = null; },
	prev: function() { this.slide(this.slideNumCurr > 0                          ? this.slideNumCurr - 1 : this.dom_slides.length - 1, this.duration) },
	next: function() { this.slide(this.slideNumCurr < this.dom_slides.length - 1 ? this.slideNumCurr + 1 : 0,                          this.duration) },
	parseSlides: function() {
		var self = this;
		this.dom_slides = this.dom_container._domSelector('.CarouselParallax-slide');
		for (var i = 0, d; d = this.dom_slides[i]; ++i) {
			d.className += ' CarouselParallax-slide';
			d.dom_parallaxElems = d._domSelector('.CarouselParallax-layer');
			d.onmousemove = function(ev) {
				self.mouseParallax(this, ev);
			};
		}
	},
	createMenu: function() {
		this.dom_menu = document.createElement('div');
		this.dom_menu.className = 'CarouselParallax-menu';
		this.dom_container.appendChild(this.dom_menu);
		var self = this;
		var a = document.createElement('a'); a.className = 'CarouselParallax-arrow'; a.href = '#'; this.dom_container.appendChild(a); a.onclick = function() { return self.prev(), false };
			a = document.createElement('a'); a.className = 'CarouselParallax-arrow'; a.href = '#'; this.dom_container.appendChild(a); a.onclick = function() { return self.next(), false };
		this.createMenuLinks();
	},
	createMenuLinks: function() {
		var self = this;
		for (var i = 0, d; d = this.dom_slides[i]; ++i) {
			var a = document.createElement('a');
			a.href = '#';
			a.onclick = (function(i) { return function() { return self.slide(i, self.duration), false }})(i);
			var span = document.createElement('span');
			a.appendChild(span);
			var word = document.createElement('span');
			span.appendChild(word);
			word.innerHTML = d.title;
			d.title = '';
			this.dom_menu.appendChild(a);
		}
	}
};
