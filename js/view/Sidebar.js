
SixtyMins.View.Sidebar = function(name, element, prefix) {

    // set name to Sidebar
    this.setName(name);

	if(!element) {
		throw("Element must be passed to the Sidebar View");
	}

    // set the context
    this.domElement 			= element;

	var $btnOvertime			= this.domElement.find('.btn-overtime'),
        $btnExtras              = this.domElement.find('.btn-extras'),
        $btnFullstory           = this.domElement.find('.btn-fullstory'),
        $btnMoreOvertime		= this.domElement.find('.btn-more-overtime'),
        $btnWatch               = this.domElement.find('.btn-watch'),
		$lis					= this.domElement.find('.segments li'),
		$dividers				= this.domElement.find('.divider'),
		$logo					= $("#top-logo"),
		$logoOt 				= $('#top-ot-logo'),
		$logoOtImg 				= $logoOt.find('img'),
		$logoBackBtn			= $logo.find('.back-button'),
		rootURL                 = '/htdocs/60minutesapp',
        that                    = this,
		current					= 0,
		switchToNextTimeout		= 0,
		TIMEOUT_LENGTH			= 5000,
		TIMEOUT_LENGTH_LEAVE	= TIMEOUT_LENGTH * 3,
		THIS_WEEK_URL			= '/this-week/',
		OVERTIME_URL			= '/60-minutes-overtime/',
		_prefix					= prefix,
		$dom					= $(element),
		backgroundSelector		= prefix == 'tw' ? 'ThisWeek' : 'SixtyMinsOvertime'
	;

	var callbacks = {

		closePanel: function(event) {

			var $this = $(this);

			$logo.removeClass('active');
			$this.unbind('click', callbacks.closePanel);
			$dom.unbind('webkitTransitionEnd', callbacks.onPanelHide);

			$dom.removeClass('hidden');
			setTimeout(function(){
			 	$dom.removeClass('inactive');//.removeClass('hidden');
				SixtyMins.Lookup.getView('SixtyMinsOvertime').hidePreloader();
			}, 200);

		},

		returnToHomePage: function(event) {

			var $this = $(this);
			$this.unbind('click', callbacks.returnToHomePage);

			SixtyMins.Lookup.getController('SixtyMinsOvertime').hideGrid();
			SixtyMins.Lookup.getController('Video').hideVideo();
			SixtyMins.Lookup.getController('VideoSidebar').close();

			// fadeOut the background
			$('.backgrounds-ot').removeClass('hidden');

			SixtyMins.Lookup.getView('SixtyMinsOvertime').hidePreloader();

			// hide the logo
			$logoOt.removeClass('active');
	        $logoOt.removeClass('show-back');

			$dom.removeClass('hidden');
			setTimeout(function(){
			 	$dom.removeClass('inactive');//.removeClass('hidden');

				$('.backgrounds-ot').removeClass('inactive');
			}, 200);
		},

		onPanelHide: function(event) {

			var $this = $(this);
			$this.unbind('webkitTransitionEnd', callbacks.onPanelHide);

			$dom.addClass('hidden');

		},

		onBackgroundHide: function(event) {

			var $this = $(this);
			$this.unbind('webkitTransitionEnd', callbacks.onBackgroundHide);

			$this.addClass('hidden');
		},

		deactivateVideo: function(event) {

			$logoBackBtn.unbind('click', callbacks.deactivateVideo);
			$logo.removeClass('show-back');
			$logo.removeClass('active');

			SixtyMins.Lookup.getController('Video').hideVideo();
			SixtyMins.Lookup.getView('Panel').closePanel();

			// hide side panel
			SixtyMins.Lookup.getController('VideoSidebar').close();

			SixtyMins.RouteManager.pushState(null, null, rootURL + THIS_WEEK_URL);

			setTimeout(function(){
				that.domElement.removeClass('inactive');
			}, 1000);

			callbacks.closePanel();


		},

		deactivateOtVideo: function(event) {

			$logoOt.unbind('click', callbacks.deactivateOtVideo);

			$logoOt.removeClass('active');
			$logoOt.removeClass('show-back');

			SixtyMins.Lookup.getController('Video').hideVideo();
			SixtyMins.Lookup.getView('Panel').closePanel();

			// hide side panel
			SixtyMins.Lookup.getController('VideoSidebar').close();

			SixtyMins.RouteManager.pushState(null, null, rootURL + OVERTIME_URL);

			setTimeout(function(){
				$dom.removeClass('inactive');
			}, 1000);

			callbacks.closePanel();
		},

		switchToNext: function() {

			if(!$dom.hasClass('inactive')) {
				for(var c = 0; c < $lis.length; c++) {
					callbacks.contract(c);
				}
				current++,current%=$lis.length;
				callbacks.expand(current);
			}

			clearTimeout(switchToNextTimeout);
			switchToNextTimeout = setTimeout(callbacks.switchToNext, TIMEOUT_LENGTH);
		},

		mouseenter: function(event) {

			clearTimeout(switchToNextTimeout);

			if(!$dom.hasClass('inactive')) {

				var $this = $(this);
				for(var c = 0; c < $lis.length; c++) {
					callbacks.contract(c);
				}
				callbacks.expand($this.index());
			}
		},

		mouseleave: function(event) {

			clearTimeout(switchToNextTimeout);
			switchToNextTimeout = setTimeout(callbacks.switchToNext, TIMEOUT_LENGTH_LEAVE);

			if(!$dom.hasClass('inactive')) {
				var $this = $(this);
				callbacks.contract($this.index());
				callbacks.expand(current);
			}
		},

		// contracts a nav item
		contract:
			function(id) {
				var $this 			= $($lis[id]),
					$section		= $this.find('section');

				$this.find('h2').removeClass('expanded');
				$dividers.removeClass('expanded');
				$this.css({'height': $this.data('collapsedHeight')});
				$section.css({opacity: 0, height: 0});

			},

		// expands a nav item
		expand:
			function(id) {
				var $this 			= $($lis[id]),
					$section		= $this.find('section'),
					position		= $this.index(),
					filter			= "*",
					imageID			= $this.data('id');

				SixtyMins.Lookup.getView(backgroundSelector).showBackgroundFor(imageID);

				// filter the dividers
				switch(position) {
					case 0: filter = ":eq(0)"; break;
					case 1: filter = ":eq(0),:eq(1)"; break;
					case 2: filter = ":eq(1),:eq(2)"; break;
				}

				var $thisDividers = $dividers.filter(filter);

				$this.find('h2').addClass('expanded');
				$thisDividers.addClass('expanded');

				$this.css({'height': $this.data('expandedHeight')});
				$section.css({opacity: 1, visibility: 'visible', height: $this.data('expandedHeightNoPadding')});
			}
	}

	this.triggerVideo = function(videoID) {

		var $anchor = $dom.find('.btn-watch[data-id="'+videoID+'"]');
		if($anchor.length) {

	    	clearTimeout(switchToNextTimeout);

	        that.callPanel( $anchor, '#toolbar-watching', true, '#toolbar-watching' );

	    	that.showVideo( $anchor );

			$dom.bind('webkitTransitionEnd', callbacks.onPanelHide);
			$dom.addClass('inactive');
		}
	};

	this.triggerOTVideo = function(videoID) {

		var $anchor = $dom.find('.btn-overtime[data-id="'+videoID+'"]');

		if($anchor.length) {

	    	clearTimeout(switchToNextTimeout);

	    	that.showVideo( $anchor );

			$dom.bind('webkitTransitionEnd', callbacks.onPanelHide);
			$dom.addClass('inactive');
		}
	};

	this.doCloseSidebar = function() {
		$btnMoreOvertime.trigger('click');
	};

	// assign the buttons event
    $btnWatch.add($btnOvertime).click( function(event) {

		var $this = $(this);

    	clearTimeout(switchToNextTimeout);

        that.callPanel( $this, '#toolbar-watching', true, '#toolbar-watching' );

    	that.showVideo( $this );

		$dom.bind('webkitTransitionEnd', callbacks.onPanelHide);
		$dom.addClass('inactive');

		if ( $this.hasClass('btn-watch') ) {
			SixtyMins.RouteManager.pushState(null, null, rootURL + THIS_WEEK_URL + "video/" + $this.data('id'));
		} else {
			SixtyMins.RouteManager.pushState(null, null, rootURL + OVERTIME_URL + "video/" + $this.data('id'));
		}

		event.preventDefault();
    });

    $btnMoreOvertime.click( function() {

		$logoOtImg.bind('click', callbacks.returnToHomePage);

    	// hide the sidebar
    	$dom.bind('webkitTransitionEnd', callbacks.onPanelHide).addClass('inactive');

		// hide the background
		$('.backgrounds-ot').bind('webkitTransitionEnd', callbacks.onBackgroundHide).addClass('inactive');

		// show the logo
		$logoOt.addClass('active');

		// fadeIn the filter and grid
		SixtyMins.Lookup.getController('SixtyMinsOvertime').triggerGrid();


    });

    /*$logoOt.click( function() {

    	// show the logo again
    	$logoOt.removeClass('active');

    	// hide the preloader
    	$('.preloader', '#sixty-minutes-overtime').removeClass('active');

		// fadeOut the background
		$('.backgrounds-ot').show().removeClass('transparent').addClass('opaque');

		// fadeIn the filter and grid
		SixtyMins.Lookup.getController('SixtyMinsOvertime').hideGrid();

		SixtyMins.Lookup.getController('SixtyMinsOvertime').showSideBar();

    });

    $logoBackBtn.click(callbacks.deactivateVideo);
    $logoOt.click(callbacks.deactivateOtVideo);*/

	/*$btnOvertime.click( function(event) {

    	clearTimeout(switchToNextTimeout);

        that.callPanel( $(this), '#toolbar-overtime', true, '#toolbar-overtime' );

    	// that.showOTVideo( $(this) );
    	that.showVideo( $(this) );

		$dom.bind('webkitTransitionEnd', callbacks.onPanelHide);
		$dom.addClass('inactive');

		event.preventDefault();
    });*/

    // fullstory content event
    $btnFullstory.click(function(event) {

		clearTimeout(switchToNextTimeout);

        that.callPanel( $(this), '#toolbar-story', false, '#toolbar-watching' );

		// show right panel
		var id = $(this).data('id');
		SixtyMins.Lookup.getController('VideoSidebar').show(id, true, 'story', getNextPrevForID(id));

		$("#video-side-bar .btn-close").click(callbacks.closePanel);

		$dom.bind('webkitTransitionEnd', callbacks.onPanelHide);
		$dom.addClass('inactive');

		event.preventDefault();
    });

    // extra content event
    $btnExtras.click(function(event) {
        clearTimeout(switchToNextTimeout);
        that.callPanel( $(this), '#toolbar-extra', false, '#toolbar-watching' );

        event.preventDefault();
    });

	this.calculateItemHeights = function() {

		for(var l = 0; l < $lis.length; l++) {

			// get the current item
			var $this 			= $($lis[l]),
				$section		= $this.find('section');

			$this.css({height: $this.height()});

			if(!$this.data('expandedHeight')) {
				$section.css({display: 'block'});

				$this.data('expandedHeight', $section.outerHeight());
				$this.data('expandedHeightNoPadding', $section.height());

				$section.css({height: 0});
				$section.addClass('transition');
			}

			if(!$this.data('collapsedHeight')) {
				$this.data('collapsedHeight', $this.height());
			}

			// add the transition class
			$this.addClass('transition');
		}

		// now call the first one
		callbacks.expand(current);

		// set up the switch
		//switchToNextTimeout = setTimeout(callbacks.switchToNext, TIMEOUT_LENGTH);

        this.domElement.addClass('transition');

		// transitions on the sidebar
        this.attachTransitions();
	};

	this.recountList = function() {
		current = 0;
		$lis = this.domElement.find('.segments li');
	}

    /**
     * Constructor
     **/
    this.draw = function() {

    };

	this.startCarousel = function() {
		clearTimeout(switchToNextTimeout);
		switchToNextTimeout = setTimeout(callbacks.switchToNext, TIMEOUT_LENGTH);
	}

	this.stopCarousel = function() {

		clearTimeout(switchToNextTimeout);
	}

    /**
     * Call the panel to display information
     **/
    this.callPanel = function ( el, toolbarId, minimized, defaultToolbarId) {

        // get the data id from this segment
        var segmentId = el.closest('li').data('id'),
            _toolbarId = (toolbarId) ? toolbarId : '#toolbar-watching'
        ;

        if(defaultToolbarId != null && defaultToolbarId != undefined){
            SixtyMins.Lookup.getView('Panel').setDefaultToolbar(defaultToolbarId);
        }

        // tell the Panel what segment $(this) is about
        SixtyMins.Lookup.getView('Panel').setCurrentSegment( segmentId );

        // minimized or toggled ?
        if (minimized) {
            SixtyMins.Lookup.getView('Panel').togglePanelMinimized();
            //Highlight the correct tab
             SixtyMins.Lookup.getView('Panel').setActiveTab($(_toolbarId));
        }
        else {
            SixtyMins.Lookup.getView('Panel').togglePanelContent(false, $(_toolbarId) );
        };

    };

    /**
     * Fades the video on the background
     **/
    this.showVideo = function ($el) {

    	if ( $el.hasClass('btn-watch') ) {

			var id = $el.data('id');

			SixtyMins.Lookup.getController('Video').setData(getVideoDateSetForID(id));
			SixtyMins.Lookup.getController('Video').showVideo();

			// bring in the 60 mins logo and attach the callback
			$logo.addClass('active');
			$logo.addClass('show-back');

			$logoBackBtn.click(callbacks.deactivateVideo);

			section = "watch";

			// show right panel
			SixtyMins.Lookup.getController('VideoSidebar').show(id, false, 'watching', getNextPrevForID(id));

		} else {

			// we want to pass
			var nextPrevData = getNextPrevForID($el.data('id'), true);

			var otDataSet = [{
				id: $el.data('id'),
				title: $el.data('parentid'),
				date: $el.data('date'),
				thumbURL: $el.data('thumbURL'),
			}];

			SixtyMins.Lookup.getController('Video').setData(otDataSet.concat(nextPrevData), getVideoDateSetForIDOT, this);
			SixtyMins.Lookup.getController('Video').showVideo();

			section = 'ot';

			// bring in the 60 mins logo and attach the callback
			$logoOt.addClass('active');
			$logoOt.addClass('show-back');

			$logoOt.click(callbacks.deactivateOtVideo);

			// show right panel
			SixtyMins.Lookup.getController('VideoSidebar').show(otDataSet[0].id, false, 'overtime', nextPrevData);

		}
    };

	// this.showOTVideo = function($el) {

	// 	// we want to pass
	// 	var nextPrevData = getNextPrevForID($el.data('parentid'));

	// 	var otDataSet = [{

	// 		id: $el.data('id'),
	// 		title: $el.data('parentid'),
	// 		date: $el.data('date'),
	// 		thumbURL: $el.data('thumbURL'),
	// 	}];

	// 	SixtyMins.Lookup.getController('Video').setData(otDataSet.concat(nextPrevData), getVideoDateSetForID, this);
	// 	SixtyMins.Lookup.getController('Video').showVideo();

	// 	// bring in the 60 mins logo and attach the callback
	// 	$logo.addClass('active');
	// 	$logo.addClass('show-back');

	// 	$logoBackBtn.click(callbacks.deactivateVideo);

	// 	// show right panel
	// 	SixtyMins.Lookup.getController('VideoSidebar').show(otDataSet[0].id, false, 'overtime', nextPrevData);
	// }

	function getNextPrevForID(id, isOT){

		var data;

		if(isOT)
		{
			//get all three elements
			data = getVideoDateSetForIDOT(id);
		}
		else
		{
			data = getVideoDateSetForID(id);
		}
		//remove first
		data.shift();

		return data;
	}

	function getVideoDateSetForID(id){

		var btns = $('.btn-watch', $dom);
		var dataSet = [];

		for(var i = 0; i<btns.length; i++)
		{
			dataSet.push(createVideoDataObj($(btns[i])));
		}

		//set current as first
		while(dataSet[0].id != id)
		{
			var item = dataSet.shift();
			dataSet.push(item);
		}

		return dataSet;
	}

	function getVideoDateSetForIDOT(id){

		var btns = $('.btn-overtime', $dom);
		var dataSet = [];

		for(var i = 0; i<btns.length; i++)
		{
			dataSet.push(createVideoDataObj($(btns[i])));
		}

		//set current as first
		while(dataSet[0].id != id)
		{
			var item = dataSet.shift();
			dataSet.push(item);
		}

		return dataSet;
	}

	function createVideoDataObj($el){

		var o = {

			id: $el.data('id'),
			thumbURL: $el.data('thumbURL'),
            title: $el.data('title'),
            date: $el.data('date')
		};

		return o;
	}


    /**
     * Calls the Page controller to change the background
     */
    this.callChangeBackground = function( num ) {

        // SixtyMins.Lookup.getController('ThisWeek').changeBackground(num);

    };

    /**
     * Attaches the sidebar transitions
     **/
    this.attachTransitions = function( ) {

		// store the original height of the li
		$lis.hover(
			callbacks.mouseenter,
			callbacks.mouseleave
		);

     }; // end of function

}; // end of class

SixtyMins.View.Sidebar.prototype = new SixtyMins.View.Base();