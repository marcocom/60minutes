
SixtyMins.View.Video = function(name) {

	this.setName(name);

	this.draw = function() {

	};

	// NEEDED MARKUP
	var markup = 	'<div id="video-component">' +
						'<div class="video-wrapper">' +
							'<div class="video-container"><video ></video></div>' +
							'<div class="preloader"><div class="preloader-dial"></div></div>' +
							'<div class="video-end-screen">' +
								'<div class="video-end-again"><span class="icon"></span><span class="label">Watch Again?</span></div>' +
								'<div class="video-end-related"><h2 class="label">RECOMMENDED VIDEOS:</h2><ul></ul></div>' +
							'</div>' +
							'<div class="video-controls">' +
								'<div class="video-controls-graphics">' +
									'<div class="video-play video-button"><span></span></div>' +
											/* '<div class="video-fs video-button"><span></span></div>'+ */
									/*'<div class="video-share">'+
										'<div class="video-share-button video-button"><span></span></div>'+
										'<div class="video-share-panel">'+
											'<div class="video-share-panel-inner">'+
												'<span>SHARE</span>'+
												'<ul><li class="facebook"><span></span></li><li class="twitter"><span></span></li><li class="buzz"><span></span></li><li class="link"><span></span></li></ul>'+
											'</div>'+
										'</div>'+
									'</div>'+*/
									'<div class="video-sound">'+
										'<div class="video-sound-button video-button"><span></span></div>'+
										'<div class="video-sound-panel">'+
											'<div class="video-sound-panel-inner">'+
												'<span class="bar-back"></span><span class="bar-progress"></span><span class="bar-knob"><span class="knob-graphic"></span><span class="knob-glow"></span></span>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="video-time"><span class="time-current">00:00</span><span class="time-total"> / 00:00</span></div>'+
									'<div class="video-pbar">'+
										'<div class="video-pbar-inner">'+
											'<span class="bar-back"></span><span class="bar-progress"></span><span class="bar-knob"><span class="knob-graphic"></span><span class="knob-glow"></span>'+
										'</div>'+
									'</div>' +
									'<div class="uilock"></div>'+
								'</div>'+
							'</div>' +
						'</div>' +
					'</div>',

	$markup 		= $(markup),

	// reference to the controller
	controller = SixtyMins.Lookup.getController('Video'),

	// private variables
	progressBar,
	volumeBar,
	//thumbSize = {width:302, height:166},
	thumbSize = {width:302, height: 190},

	// jQuery elements
	$pageContainer 		= $("#page-container"),
	$videoContainer 	= $("#global-video-container"),
	$logo 				= $("#top-logo"),
	$wrapper 			= $markup,
	$player 			= $('.video-container', $markup),

	$body 				= $(document.body),
	$video 				= $("video", $markup),

	$controls 			= $(".video-controls", $markup),
	$controlsGraphic 	= $(".video-controls-graphics", $markup),
	$uilock 			= $(".uilock", $controls),
	$playBtn 			= $(".video-play", $controls),

	$soundWrapper 		= $(".video-sound", $controls),
	$soundBtn 			= $(".video-sound-button", $controls),
	$soundPanel			= $(".video-sound-panel", $controls),

	$shareWrapper 		= $(".video-share", $controls),
	$shareBtn 			= $(".video-share-button", $controls),
	$sharePanel 		= $(".video-share-panel", $controls),

	$fullscreenBtn 		= $(".video-fs", $controls),
	$timeDisplay 		= $(".video-time", $controls),
	$pBar 				= $(".video-pbar-inner", $controls),
	$pBarBack 			= $(".bar-back", $pBar),
	$pBarProgress 		= $(".bar-progress", $pBar),
	$pBarKnob 			= $(".bar-knob", $pBar),

	$globalVideoControlls 	= $("#global-video-controls"),
	$preloader				= $(".preloader", $markup),

	/* END SCREEN */

	$endScreen 				= $(".video-end-screen", $markup),
	$endScreenAgainBtn 		= $(".video-end-again", $endScreen),
	$endScreenRelated 		= $(".video-end-related", $endScreen),
	$endScreenRelatedList 	= $("ul", $endScreenRelated)
	;

	this.domElement = $markup;

	$globalVideoControlls.append($controls)

	/* lock default select behavior */
	$controls.bind('selectstart', function() { return false;});
	$endScreen.bind('selectstart', function() { return false;});

	// video element reference for easier access to its API
	var videoObj = $video[0],

	// control helpers
	soundVolume = 1,
	soundMuted = false,
	fullScreen = false,
	soundHidden = true,

	// progress bar pattern
	animateBarPattern = false,
	patternTimeoutID,
	patternShift = 0
	;

	//$video.remove();

	function toggleAnimateBarPattern(animate) {

		animateBarPattern = animate;

		if (animate) {}
	}

	var me = this;

	this.getVideo = function() {
		return $video;
	}

	this.enableUI = function(){

		$uilock.hide();

		$controlsGraphic.removeClass('video-controls-disabled');
	}

	this.disableUI = function(){

		$uilock.show();

		$controlsGraphic.addClass('video-controls-disabled');
	}

	this.showPreloader = function(){

		// $preloader.addClass('active');
		$preloader.fadeTo(250,1);	
	}

	this.hidePreloader = function(){

		//$preloader.removeClass('active');
		$preloader.fadeOut(250);
	}

	// ACTIVATE & DEACTIVATE
	function unbindListeners() {

		$videoContainer.unbind('webkitTransitionEnd', callbacks.videoContainerReady);
		$videoContainer.unbind('webkitTransitionEnd', callbacks.videoPlayerDeactivated);
	}

	var callbacks = {

		videoPlayerDeactivated : function() {

//			console.log('videoPlayerDeactivated');

			$(this).unbind('webkitTransitionEnd', callbacks.videoPlayerDeactivated);

			$videoContainer.removeClass('active');


			setTimeout(10, new function (){

				$videoContainer.addClass('hidden');
				$globalVideoControlls.addClass('hidden');
			});


		},

		videoContainerReady : function() {

//			console.log('videoContainerReady');

			$(this).unbind('webkitTransitionEnd', callbacks.videoContainerReady);

			$markup.css({display : 'block'});
			$markup.fadeIn('slow');

			$controls.css({display : 'block'});
			$controls.fadeIn('slow');

			// $logo.addClass('active');

			// notify the controller that we are ready to play
			controller.notify('READY');
		}
	};

	var videoActivated = false;

	this.deactivateVideo = function() {

			//console.log('deactivateVideo:',$videoContainer.hasClass('active'),$videoContainer.hasClass('showing'));

			videoActivated = false;

			unbindListeners();

			videoObj.pause();
			$markup.fadeOut(200, function() {

				//console.log("bind deactivate");

				$videoContainer.bind('webkitTransitionEnd', callbacks.videoPlayerDeactivated);
				$videoContainer.removeClass('showing');

				//$video.hide();
				//$videoContainer.removeClass('active');
			});

			$globalVideoControlls.removeClass('showing');
			$globalVideoControlls.removeClass('active');
	};

	this.activateVideo = function() {


			//console.log('activateVideo',$videoContainer.hasClass('active'),$videoContainer.hasClass('showing'));

			videoActivated = true;

			this.reset();

			unbindListeners();

			if ($videoContainer.hasClass('active')) {

				controller.notify('READY');
			} else {

				$videoContainer.removeClass('hidden');
				$videoContainer.addClass('active');
				$videoContainer.append($markup);

				$globalVideoControlls.removeClass('hidden');
				$globalVideoControlls.addClass('active');

				setTimeout(function() {
					$videoContainer.bind('webkitTransitionEnd', callbacks.videoContainerReady);
					$videoContainer.addClass('showing');
					$globalVideoControlls.addClass('showing');
				}, 50);
			}


	};

	var showVideoObj = function(){

//		console.log('showVideoObj');

		if($video.css('display') == 'none')
		{
			$video.show();
		}
	}

	var hideVideoObj = function(){

//		console.log('hideVideoObj');

		if($video.css('display') != 'none')
		{
			$video.hide();
		}
	}

	// Events

	var playToggle = function() {

		if (videoObj.paused == false) {

			videoObj.pause();
		} else {

			videoObj.play();
		}
	};

	var muteToggle = function() {

		if (videoObj.muted == false) {

			me.mute();
		} else {

			me.unmute();
		}
	};

	this.reset = function() {

		// move progres bar to 0
		progressBar.tryToUpdateKnobPosition(0);

		// clear markup of end screen
		$endScreenRelatedList.empty();

		hideVideoObj();

		this.hideEndScreen(false);
	}

	this.mute = function() {

		soundMuted = true;
		videoObj.muted = true;
		$soundBtn.addClass('sound-off');

		soundVolume = videoObj.volume;
		volumeBar.tryToUpdateKnobPosition(1);
	};

	this.unmute = function() {

		soundMuted = false;
		videoObj.muted = false;
		videoObj.volume = soundVolume;

		volumeBar.tryToUpdateKnobPosition(1 - soundVolume);
		$soundBtn.removeClass('sound-off');
	};

	this.showEndScreen = function(data) {

		// clear markup of end screen
		$endScreenRelatedList.empty();

		if(data.length)
		{
			$('h2.label' ,$endScreenRelated).css('display', 'inline');

			for ( var i = 0; i < data.length; i++) {

				var dataItem = data[i];

				var viewed = SixtyMins.LocalStorageManager.wasVideoWatched(data[i].id);

				var lisStr = 	'<li><figure data-id="'+data[i].id+'">'+
				 						getViewedRelatedMarkup(viewed)+
										/*'<div class="overlay">'+
											'<div class="icon"></div>'+
											'<span class="text-bottom">Watch Now</span>'+
										'</div>'+*/
										'<img width="'+thumbSize.width+'" height="'+thumbSize.height+'" src="'+dataItem.thumbURL+'" alt="'+dataItem.title+'" />'+
										'<figcaption><b>'+dataItem.title+'</b><p>'+dataItem.date+'</p></figcaption>'+
								'</figure></li>';

				$endScreenRelatedList.append(lisStr);
			}

			$('li', $endScreenRelatedList).bind('click', videoThumbClickHandler);
		}
		else
		{
			$('h2.label' ,$endScreenRelated).css('display', 'none');
		}

		$endScreen.css('display', 'block').stop().animate({
			opacity : 1,
		}, 500, 'linear');
	}

	function getViewedRelatedMarkup(viewed){

		var markup = '';

		if(viewed)
		{
			markup = '<div class="overlay"><div class="icon replay"></div><span class="text-top">Previously Viewed</span><span class="text-bottom">Watch Again?</span></div>'+
					 '<!--<div class="ribbon"></div>-->'+
					 '<div class="overlay-viewed"></div>';
		}
		else
		{
			markup = '<div class="overlay"><div class="icon"></div><span class="text-top"></span><span class="text-bottom">Watch Now</span></div>';
		}

		return markup;
	}

	function videoThumbClickHandler(e){

		controller.notify('VIDEO_REQUEST',$('figure', this).data('id'));
	}

	this.hideEndScreen = function(animate) {

		if(animate)
		{
			$endScreen.stop().animate({
				opacity : 0,
			}, 500, 'linear', function() {
				$(this).css('display', 'none');
			});
		}
		else
		{
			$endScreen.stop().css({display: 'none', opacity : 0});
		}
	}

	var fullscreenToggle = function() {

		controller.notify('FULLSCREEN_TOGGLE');
	};

	var setSize = function(sizeWH) {

		$wrapper.width(sizeWH.width).height(sizeWH.height);

		me.adjustVideo();
	};

	this.adjustVideo = function() {

		var vidW = videoObj.videoWidth;
		var vidH = videoObj.videoHeight;

		var wrapperW = $wrapper.width();
		var wrapperH = $wrapper.height();

		// adjust video ratio
		var ratio = Math.min(wrapperW / vidW, wrapperH / vidH);

		var newVidW = vidW * ratio;
		var newVidH = vidH * ratio;

		var shiftLeft = Math.floor((wrapperW - newVidW) / 2);
		var shiftTop = Math.floor((wrapperH - newVidH) / 2);

		// $video.css({width:Math.ceil(newVidW), height:Math.ceil(newVidH),
		// marginLeft:shiftLeft, marginTop:shiftTop});

		// progressBar.tryToUpdateKnobPosition(videoObj.currentTime /
		// videoObj.duration);
	};

	$endScreenAgainBtn.click(playToggle);
	$playBtn.click(playToggle);
	$soundBtn.click(muteToggle);

	// TODO: this functionality should be disabled because there is no html5
	// fullscreen video so far
	$fullscreenBtn.click(fullscreenToggle);

	// VIDEO RELATED EVENTS
	$video.bind('loadedmetadata', function(e) {

		updateSound();

		controller.notify("VIDEO_METADATA");
	});

	$video.bind('waiting', function(e) {

		updateSound();

		controller.notify("VIDEO_WAITING");
	});

	$video.bind('canplay', function(e) {

		updateSound();

		controller.notify("VIDEO_CANPLAY");
	});

	// SOUND PANEL SHOW/HIDE
	$soundWrapper.bind('mouseenter', function(e) {
		$soundPanel.css('display', 'block').stop().animate({
			opacity : 1,
			marginTop : -151
		}, 150);
	});

	$soundWrapper.bind('mouseleave', function(e) {
		$soundPanel.stop().animate({
			opacity : 0,
			marginTop : -146
		}, 150, 'linear', function() {
			$(this).css('display', 'none');
		});
	});

	// SHARE PANEL SHOW/HIDE
	$shareWrapper.bind('mouseenter', function(e) {

		$sharePanel.css('display', 'block').stop().animate({
			opacity : 1,
			marginTop : -151
		}, 150);
	});

	$shareWrapper.bind('mouseleave', function(e) {

		$sharePanel.stop().animate({
			opacity : 0,
			marginTop : -146
		}, 150, 'linear', function() {
			$(this).css('display', 'none');
		});
	});

	$video.bind('timeupdate', function(e) {

		updateTimeDisplay(videoObj.currentTime | 0, videoObj.duration | 0);
		progressBar.tryToUpdateKnobPosition(videoObj.currentTime
				/ videoObj.duration);

	});

	$video.bind('play', function(e) {

		updateSound();

		showVideoObj();

		$playBtn.addClass('video-pause');
		toggleAnimateBarPattern(true);
		controller.notify("VIDEO_PLAY");
	});

	$video.bind('pause', function(e) {

		$playBtn.removeClass('video-pause');
		toggleAnimateBarPattern(false);
		controller.notify("VIDEO_PAUSE");
	});

	$video.bind('ended', function(e) {

		$playBtn.removeClass('video-pause');
		videoObj.pause();

		controller.notify("VIDEO_END");
	});

	var videoScrollChangeHandler = function(position) {

		if (!progressBar.dragging) {
			videoObj.currentTime = videoObj.duration * position;
		}
	};

	var soundScrollChangeHandler = function(position) {

		var vol = 1 - position;

		videoObj.volume = vol;
		soundVolume = vol;

		if (videoObj.volume == 0 && !videoObj.muted) {

			me.mute();
			volumeBar.tryToUpdateKnobPosition(0);

		} else if (videoObj.volume > 0 && videoObj.muted) {

			me.unmute();
			volumeBar.tryToUpdateKnobPosition(soundVolume);
		}
	};

	var updateSound = function(){

		// this is a little hack, muted didn't want to work if you haven't set it to false first
		videoObj.muted = false;

		videoObj.volume = soundVolume;
		videoObj.muted = soundMuted;
	}

	var updateTimeDisplay = function(current, total) {

		$current = $(".time-current", $timeDisplay);
		$total = $(".time-total", $timeDisplay);

		$current.text(timeFormat(current));
		$total.text(" / " + timeFormat(total));
	};

	var timeFormat = function(seconds) {

		var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60)
				: Math.floor(seconds / 60);
		var s = Math.floor(seconds - (m * 60)) < 10 ? "0"
				+ Math.floor(seconds - (m * 60)) : Math.floor(seconds
				- (m * 60));
		return m + ":" + s;
	};

	var delegate = function(scope, method) {

		var fn = function() {
			var target = arguments.callee.target;
			var func = arguments.callee.func;
			return func.apply(target, arguments);
		};
		fn.target = scope;
		fn.func = method;

		return fn;
	};

	var Scroll = function($scrollContainer, isVolumeSlider) {

		this.$container = $scrollContainer;

		this.isVolumeSlider = isVolumeSlider;
		this.knobPosition = 0;

		this.$body = $(document.body);

		this.$barBack = $(".bar-back", $scrollContainer);
		this.$barProgress = $(".bar-progress", $scrollContainer);
		this.$barKnob = $(".bar-knob", $scrollContainer);
		this.$barKnobGlow = $(".knob-glow", this.$barKnob);

		this.dragging = false;

		// crate delegates used later
		this._barClickHandler = delegate(this, this.barClickHandler);
		this._mouseUpHandler = delegate(this, this.mouseUpHandler);
		this._mouseMoveHandler = delegate(this, this.mouseMoveHandler);

		this._knobMouseDownHandler = delegate(this, this.knobMouseDownHandler);
		this._knobMouseOutHandler = delegate(this, this.knobMouseOutHandler);
	};

	Scroll.prototype = {

		setChangeCallback : function(callback) {

			this.changeCallback = callback;

		},

		enable : function() {

			// Adding listeners
			this.$barBack.bind('click', this._barClickHandler);
			this.$barProgress.bind('click', this._barClickHandler);

			this.$barKnob.bind('mousedown', this._knobMouseDownHandler);
			this.$barKnob.bind('mouseleave', this._knobMouseOutHandler);
		},

		disable : function() {

			// Remove listeners
			this.$barBack.unbind('click', this._barClickHandler);

			this.$barProgress.unbind('click', this._barClickHandler);

			this.$barKnob.unbind('mousedown', this._knobMouseDownHandler);
			this.$barKnob.unbind('mouseup', this._mouseUpHandler);

			this.$body.unbind("mouseup", this._mouseUpHandler);
			this.$body.unbind("mousemove", this._mouseMoveHandler);

			// Reset flags
			this.dragging = false;
		},

		knobMouseDownHandler : function(e) {

			this.dragging = true;

			this.$barKnob.bind('mouseup', this._mouseUpHandler);
			this.$body.bind('mouseup', this._mouseUpHandler);
			this.$body.bind('mousemove', this._mouseMoveHandler);

			this.$barKnobGlow.addClass('down');

			e.preventDefault();
		},

		knobMouseOutHandler : function(e) {

			if (!this.dragging) {
				this.$barKnobGlow.removeClass('over down');
			}
			e.preventDefault();
		},

		barClickHandler : function(e) {

			if (this.isVolumeSlider) {

				var yposs = e.pageY - this.$barBack.offset().top;
				var fullHeight = this.$barBack.height();

				this.updateKnobPosition(yposs / fullHeight);

			} else {

				var xposs = e.pageX - this.$barBack.offset().left;
				var fullWidth = this.$barBack.width();

				this.updateKnobPosition(xposs / fullWidth);
			}

			if (this.changeCallback) {
				this.changeCallback(this.knobPosition);
			}
		},

		mouseUpHandler : function(e) {

			e.preventDefault();

			this.dragging = false;

			this.$barKnob.unbind('mouseup', this._mouseUpHandler);
			this.$body.unbind('mouseup', this._mouseUpHandler);
			this.$body.unbind('mousemove', this._mouseMoveHandler);

			this.$barKnobGlow.removeClass('over down');

			if (this.changeCallback) {
				this.changeCallback(this.knobPosition);
			}
		},

		mouseMoveHandler : function(e) {

			if (this.isVolumeSlider) {
				var yposs = e.pageY - this.$barBack.offset().top;
				var fullHeight = this.$barBack.height();

				this.updateKnobPosition(yposs / fullHeight);
			} else {
				var xposs = e.pageX - this.$barBack.offset().left;
				var fullWidth = this.$barBack.width();

				this.updateKnobPosition(xposs / fullWidth);
			}

			if (this.changeCallback) {
				this.changeCallback(this.knobPosition);
			}
		},

		tryToUpdateKnobPosition : function(position) {

			if (!this.dragging) {

				this.updateKnobPosition(position);
			}
		},

		updateKnobPosition : function(position) {

			this.knobPosition = Math.max(Math.min(position, 1), 0);

			if (this.isVolumeSlider) {

				var bottomMargin = 2;
				var fullHeight = this.$barBack.height();
				var marginTop = parseInt(this.$barBack.css('marginTop'));
				var cssPosition = (Math.round(this.knobPosition * (fullHeight) | 0));

				this.$barProgress.css('height', fullHeight - cssPosition);
				this.$barProgress.css('marginTop', cssPosition + marginTop);
				this.$barKnob.css('marginTop', cssPosition + bottomMargin);

			} else {

				this.$barProgress.css('width', (this.knobPosition * 100) + "%");
				this.$barKnob.css('marginLeft', (this.knobPosition * 100) + "%");
			}
		}
	};

	this.init = function() {

		progressBar = new Scroll($pBar, false);
		progressBar.setChangeCallback(delegate(this, videoScrollChangeHandler));
		progressBar.enable();

		volumeBar = new Scroll($soundPanel, true);
		volumeBar.setChangeCallback(delegate(this, soundScrollChangeHandler));
		volumeBar.enable();

		//this.hideVideo();

		hideVideoObj();
	};

	this.setSize = function(sizeWH) {
		var newSize = sizeWH;

		// if passed object is a jQuery one
		if (sizeWH.jquery) {
			newSize = {width : sizeWH.width(), height : sizeWH.height()};
		}

		setSize(newSize);
	};

	this.setSource = function(url) {

		videoObj.src = url;
	}

	this.pauseVideo = function(gotoStart) {

		videoObj.pause();

		if (gotoStart === true) {
			videoObj.currentTime = 0;
		}
	};

	this.resumeVideo = function() {

		videoObj.play();
	}

	this.getVideo = function() {

		return $video;
	};

	this.clearVideo = function(){

		hideVideoObj();
		updateTimeDisplay(0,0);
	}

	this.init();
};

SixtyMins.View.Video.prototype = new SixtyMins.View.Base();
