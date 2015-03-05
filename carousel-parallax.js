/*
	carouselParallax - 2.0
	https://github.com/mr21/carousel-parallax
*/

jQuery.fn.carouselParallax = function(params) {
	var arr = [];
	$.each(this, function() {
		arr.push(new jQuery.fn.carouselParallax.obj(this, params || {}));
	});
	return arr;
};

jQuery.fn.carouselParallax.obj = function(el_ctn, params) {
	var that = this;
	this.dur = params.dur || 1500;
	this.easing = params.easing || "swing";
	this.jq_ctn = jQuery(el_ctn);
	this.jq_slides = this.jq_ctn.find("> .cp-slide");
	this.jq_slides.each(function(i) {
		this.jq_layers = that.jq_slides.eq(i).find("> .cp-layer");
	});
	this.isSliding = false;
	this.slideCurrId = 0;
};

jQuery.fn.carouselParallax.obj.prototype = {
	slide: function(i) {
		i = i % this.jq_slides.length;
		if (i < 0)
			i += this.jq_slides.length;

		if (i !== this.slideCurrId) {
			var	that = this,
				dir = this.slideCurrId < i,
				jq_slideA = this.jq_slides.eq(i),
				jq_slideB = this.jq_slides.eq(this.slideCurrId),
				progress = function(_, p) {
					var pA, pB;
					if (dir) {
						pA = 1 - p;
						pB = -p;
					} else {
						pA = -1 + p;
						pB = p;
					}
					jq_slideA[0].jq_layers.each(function() {
						var layer = $(this);
						layer.css("left", (layer.css("z-index") * pA) + "px");
					});
					jq_slideB[0].jq_layers.each(function() {
						var layer = $(this);
						layer.css("left", (layer.css("z-index") * pB) + "px");
					});
				};
			if (this.isSliding) {
				jq_slideA.finish();
				jq_slideB.finish();
				return;
			}
			this.isSliding = true;
			jq_slideA
				.css("left", dir ? "100%" : "-100%")
				.animate({ left: "0%" }, this.dur, this.easing);
			jq_slideB
				.animate(
					{
						left: dir ? "-100%" : "100%"
					}, {
						duration: this.dur,
						easing: this.easing,
						progress: progress,
						complete: function() {
							progress(undefined, 1);
							that.isSliding = false;
							that.slideCurrId = i;
						}
					}
				);
		}

		return this;
	},
	prev: function() { return this.slide(this.slideCurrId - 1); },
	next: function() { return this.slide(this.slideCurrId + 1); }
};
