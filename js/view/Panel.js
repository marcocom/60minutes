
SixtyMins.View.Panel = function(name) {
	
	// set name to Panel
	this.setName(name);

	// set the context
	this.domElement = $('#panel');

	// variables	
	var hoverTimeoutId 			= 0,
		$panel					= $('#panel', '#wrapper'),
		$btnClose				= $('.btn-close'),
		$toolbar				= $('#toolbar li'),
		$sections				= $('#panel-content section'),
		$sectionsContent		= $('#panel-watching section, #panel-overtime section, #panel-extras section'),
		$panelOnly              = $('#panel'),	
		defaultToollbar         = '#toolbar-watching',				
		that					= this,
		
		
		BOTTOM_MARGIN           = 80
	;

	this.currentSegment = null;

	/**
	 * Constructor
	 **/
	this.draw = function() {

		
		// assign the watch event	
		$toolbar.click( function() {
			that.togglePanelContent( false, $(this) );
		});
		
		// close buttons
		$btnClose.click(function() {
		    
			var isVideoShown = SixtyMins.Lookup.getController('Video').getIsVideoShown();
			
			//If the video is on 
			if(isVideoShown){
			 //then we minimize the panel
			 that.togglePanelMinimized(); 
			 //and select the first tab
			 that.setActiveTab(defaultToollbar);
			   
			} else {
			    //we close the panel
			    that.closePanel();
			}
			
		});
		
		$(window).bind('resize', this.resize);

	};	

	/**
	 * Set the current segment
	 **/
	this.setCurrentSegment = function(id) {

	 	this.currentSegment = id;

		// hide empty tabs
		this.hideEmptyTabs();

	};

	/**
	 * Get the current segment
	 **/
	this.getCurrentSegment = function() {

	 	return this.currentSegment;

	};

    this.setDefaultToolbar = function(tabId){
        defaultToollbar = tabId;    
    }	

	/**
	 * Resizes the panel so it doesn't overlap the video controllers
	 **/
	this.resizePanel = function(isPlaying) {
        
		
		var newHeight = isPlaying ? ($(window).height() - 122) : '100%';

		$panel.css('height', newHeight);

	};

    this.resize = function(){
        
        if(SixtyMins.Lookup.getController('Video').getIsVideoShown() == true){
            $panelOnly.css('height', $(window).height() - 122);
        }
        
        
        $panelOnly.find('.scrollable').each(function(i, e){                     
            var newScrollableHeight = window.innerHeight - $(this).offset().top - BOTTOM_MARGIN;
            $(this).height(newScrollableHeight);          
        })
    };

	/**
	 * Set the current tab
	 **/
	this.setActiveTab = function(li) {

		// set the panel inactive first
		this.setPanelInactive();
		
		// set to active the li that was clicked
		$(li).addClass('active');

	};

	/**
	 * If the tab has no content in it, it must be hidden
	 **/
	this.hideEmptyTabs = function() {
		
		var segmentId   = this.getCurrentSegment(),
			containers  = $('.panel-content-parent')
		;

		// show all tabs first
		$toolbar.show();

		// go through each panel container
		containers.each(function(index, item) {
			// if it doesn't have any section children, it's empty
			if ($(item).children('section[data-id='+segmentId+']').length === 0) {
				// hide the toolbar related to it
				var tabId = $(item).attr('id').replace(/^[^\-]*\-/, "");				
				$('#toolbar-'+tabId).hide();
			}			
		});

	};

	/**
	 * Remove the active class from the toolbar
	 **/
	this.setPanelInactive = function() {

		$toolbar.closest('.active').removeClass('active');

	};

	/**
	 * Set the content based on what segment this is about
	 **/
	this.showActiveContent = function() {

		var segmentId = this.getCurrentSegment();

		// hide what's not about segmentId
		// TODO how can I cache this in jQuery??
		$('#panel-watching section, #panel-overtime section, #panel-extras section').hide();

		// show what's about segmentId
		$sections.find('[data-id='+segmentId+']').show();

	};

	/**
	 * Show the content of the panel
	 **/
	this.showPanelContent = function($id) {
        
		// get the second part of the string. E.g "extras" from "toolbar-extras"
		var target = $id.attr('id').replace(/^[^\-]*\-/, "");

		// hide everything first
		$sections.hide();

		// show the target content
		$('#panel-'+target).fadeIn();
		
        this.resize();				
		
	};

	/**
	 * Shows only the panel bar
	 **/
	this.togglePanelMinimized = function() {

		// hide the content
		this.setPanelInactive();

		// minimizes the toolbar
		$panel.removeClass('expanded').toggleClass('minimized');

	};

	/**
	 * Closes the panel
	 **/
	this.closePanel = function() {

		// check if video is playing
		// we have a video, minimize it instead of closing it
		$panel.removeClass('expanded minimized');

	};

	/**
	 * Show/Hide the panel-content
	 **/
	this.togglePanelContent = function( hiddenContent, active, prefix ) {
		
		// tell to show the active segment content
		this.showActiveContent();

		// make the clicked tab active
		this.setActiveTab(active);

		// do the actual show/close
		hiddenContent ? $panel.removeClass('expanded') : $panel.removeClass('minimized').addClass('expanded');
		this.showPanelContent(active);

	};

}; // end of class

SixtyMins.View.Panel.prototype = new SixtyMins.View.Base();