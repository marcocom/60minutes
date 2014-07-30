
SixtyMins.View.VideoSidebar = function(name) {
    
    //The dom element for the video side bar
    this.domElement = $('#video-side-bar');
    
    this.data                       = null;
    
    var me                          = this,
    
                
        //jQuery elements
        $content                    = $('.content', this.domElement),
        $nav                        = $('nav', this.domElement),
        $watchingNowIcon            = $('#toolbar-watching', this.domElement),
        $overtimeIcon               = $('#toolbar-overtime', this.domElement),
        $extrasIcon                 = $('#toolbar-extras', this.domElement),
        $storyIcon                  = $('#toolbar-story', this.domElement),
        $btnClose                   = $('.btn-close', this.domElement),
        $btnModeToggle              = $('.btn-reading-full-toggle', this.domElement),
        $preloader                  = $('.preloader', this.domElement),
        
        $dateYear					= $('.date-year', this.domElement),
        $dateDay					= $('.date-day', this.domElement),
        
        //Now Watching
        $watchingNowTitle           = $('.watching-content header h1' , this.domElement),
        $watchingNowDate            = $('.watching-content header time' , this.domElement),
        $watchingNowBGContainer     = $('.watching-content header' , this.domElement),
        $watchingNowDesc            = $('.watching-content header p.description .text' , this.domElement),
        $watchingNowCorrespondent   = $('.watching-content header p.description .correspondent b' , this.domElement),
        $watchingNowVideoThumbnail  = $('.watching-content .thumbnails-container figure:first-child' , this.domElement),
                
        //Story
        $storyContent               = $('.story-content', this.domElement),
        $storyTitle					= $('.story-content header h1', this.domElement),
        $storyDate					= $('.story-content header time', this.domElement),
        $storyDesc					= $('.story-content .thumbnails-container', this.domElement),
        
        //Overtime
        $allOvertimeContent         = $('.global-overtime-content', this.domElement),      
        $overtimeContent            = $('.overtime-content', this.domElement),
        $overtimeDate				= $('.overtime-content header time', this.domElement),
        $overtimeTitle				= $('.overtime-content .thumbnails-container h2', this.domElement),
        $overtimeVideoThumbnail		= $('.overtime-content .overtime-thumbnail figure:first-child', this.domElement),
        $overtimeThumbHiddenTitle   = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .title', this.domElement),
        $overtimeThumbHiddenDesc    = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .description', this.domElement),
        $overtimeThumbHiddenDate    = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .date', this.domElement),
        $overtimeVideoTitle			= $('.overtime-content .overtime-thumbnail figure:first-child figcaption span', this.domElement),
        $overtimeDescContainer		= $('.overtime-content .thumbnails-container', this.domElement),
        
        //Extras
        $extrasContent              = $('.extra-content', this.domElement),
        $extrasTitle				= $('.extra-content header h1', this.domElement),
        $extrasThumbnailsContainer	= $('.extra-content .thumbnails-container', this.domElement),
        
        //Variables
        watchingNowData             = {},
        activeContent               ='',
        videoIsOpen                 = false,
        defaultOpenTab				= '',
        extra                       = null,
        thumbnailMarkup				= '<figure data-id="">'+                                                                                                        
                            		  '<span class="thumb"><span><img src="" title="" /></span></span>'+
                            		  '<figcaption><span></span><time></time></figcaption>'+ 
                            		  '<span class="hidden">'+  
                                      '<span class="title"></span>'+
                                      '<span class="date"></span>'+
                                      '<span class="description"></span>'+
                                      '<span class="cast"></span>'+      
                                      '</span>'+                      		                                   
                        			  '</figure>',
                        			  
        overtimeMarkup              = '<section class="overtime-content global-overtime-content content">'+
                                        '<header>'+
                                            '<span class="overtime-logo"><img src="/htdocs/60minutesapp/images/logo-ot-cropped-wide.gif" /></span>'+
                                            '<time>March 20, 2011</time>'+
                                            '<p class="description">'+
                                                'Overtime Original'+                            
                                            '</p>'+
                                        '</header>'+
                                        '<section class="overtime-thumbnail">'+
                                            '<figure>'+  
                                                '<div class="overlay"><div class="icon"></div><span class="text-top"></span><span class="text-bottom">Watch Now</span></div>'+                                                                                                               
                                                '<span class="thumb"><span><img src="http://i.i.com.com/cnwk.1d/i/tim/2011/05/06/60_bodyguard_0506_320x240.jpg" title="" /></span></span>'+
                                                '<figcaption><span></span><time></time></figcaption>'+
                                                '<span class="hidden">'+
                                                    '<span class="title"></span>'+
                                                    '<span class="date"></span>'+
                                                    '<span class="description"></span>'+
                                                    '<span class="cast"></span>'+
                                                '</span>'+                                                                
                                            '</figure>'+    
                                        '</section>'+                                                                                
                                        '<section class="thumbnails-container">'+
                                            '<h2><!--TITLE GOES HERE --></h2>'+                     
                                        '</section>'+
                                    '</section>',
         overtimeIconMarkup         = '<li id="toolbar-overtime" data-target="overtime-content">'+
                                        '<span class="icon-overtime">Overtime</span>'+
                                      '</li>',                        			  
                                                      
        //Constants
        BOTTOM_MARGIN               = 80,
        EXTRA_BOTTOM_MARGIN         = 40
        ;
    
    
            
	this.setName(name);
    
    /**
     * Initializes the video sidebar
     */
	this.draw = function() { 
       
	};
	
	/**
	 * Sets the data
	 * @param {object} data
	 */
	this.setData = function(data){
	   this.data = data;	   
	};
	

    /**
     * Updates the view
     */
    this.updateView = function(){  
    	this.populateDate();      
    	
    	//Only for watching now we save the data on an object
    	watchingNowData.Title          = me.data.Title;
    	watchingNowData.Desc           = me.data.Description;
    	watchingNowData.Cast           = me.data.Cast;
    	watchingNowData.ProductionDate = me.data.ProductionDate;
    	watchingNowData.Images         = me.data.Images;
    	
        this.updateWatchingNowTab(); 
        this.updateOvertimeTab(); 
        this.updateExtrasTab(); 
        this.updateStoryTab(); 
        
        //Update the style on the last navigation icon
        $nav
        .find('.toolbar li:visible:last')
        .addClass('rounded-corner')
        .siblings('li')
        .removeClass('rounded-corner');
        
        //Initializing all the event listeners
        callbacks.addEventListeners();        
        callbacks.resize();
    };

	/**
	 * Updates the date in the top of the toolbar
	 */	
	this.populateDate = function(){
	    
		var date = new Date(me.data.ProductionDate);
		$dateYear.html(date.getFullYear());
		$dateDay.html(SixtyMins.Lookup.getModel('Base').getShortMonth(date.getMonth()) + "<br/>" + date.getDate() );	
		
	}
	
    /**
     * Updates the watching now tab
     */
    this.updateWatchingNowTab = function(){        
        
        var date = new Date(watchingNowData.ProductionDate);
        
        var bgImage = watchingNowData.Cast.replace(" ","_") + "-small.png";
        $watchingNowBGContainer.css('background-image','url(/htdocs/60minutesapp/media/photos/correspondents/'+bgImage+')')
        if(watchingNowData.Cast != ""){
            $watchingNowCorrespondent.parent().css('display','block')    
        } else {
            $watchingNowCorrespondent.parent().css('display','none')
        }
        
        $watchingNowTitle.html( $.isArray(watchingNowData.Title)? watchingNowData.Title.join("") : watchingNowData.Title );
        $watchingNowDesc.html( $.isArray(watchingNowData.Desc)? watchingNowData.Desc.join("") : watchingNowData.Desc );        
        $watchingNowCorrespondent.html( $.isArray(watchingNowData.Cast)? watchingNowData.Cast.join("") : watchingNowData.Cast );
        $watchingNowDate.html(SixtyMins.Lookup.getModel('Base').getMonth(date.getMonth()) +" " +date.getDate() + ", " + date.getFullYear());                
        
        var image = '';
        var hideThumbnail = false;
        
        //Check if image exists
        if($.isArray(watchingNowData.Images)){
            if(watchingNowData.Images.length > 0){
                image = watchingNowData.Images[0]["ImageURL"];
            } else {
                hideThumbnail = true;
            } 
        } else {
                hideThumbnail = true;
        }
        
        //If the image exists then update the src of the image
        if(!hideThumbnail){
            $watchingNowVideoThumbnail.find('img').attr('src', image);    
            $watchingNowVideoThumbnail.attr('data-id', me.data.Id);
            //Add the toolbar name inside of which the element exists
            $watchingNowVideoThumbnail.attr('data-toolbar-category', 'watching');               
        } else {
        	//If an image doesn't exist then hide the image container
            $watchingNowVideoThumbnail.css('display','none');
        }
        
        
    }
    
    /**
     * Updates the overtime tab
     */
    this.updateOvertimeTab = function(){
    	
        me.domElement.find('.global-overtime-content').remove();
        me.domElement.find('.toolbar-overtime').remove();    	
    	
    	if(me.data.OvertimeVideos.length > 0){    		
    		
    		
    		
    		$overtimeIcon.css('display','block');	
    		
    		
    		//Check if there are more overtime videos
    		//if(me.data.OvertimeVideos.length > 1){
    		    //for(d = 1; me.data.OvertimeVideos.length; d++) {
    		    for(d = 0; d < me.data.OvertimeVideos.length; d++) {    		      
    		       
    		       
                //Overtime
                /*$allOvertimeContent         = $('.global-overtime-content', this.domElement),      
                $overtimeContent            = $('.overtime-content', this.domElement),
                $overtimeDate               = $('.overtime-content header time', this.domElement),
                $overtimeTitle              = $('.overtime-content .thumbnails-container h2', this.domElement),
                $overtimeVideoThumbnail     = $('.overtime-content .overtime-thumbnail figure:first-child', this.domElement),
                $overtimeThumbHiddenTitle   = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .title', this.domElement),
                $overtimeThumbHiddenDesc    = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .description', this.domElement),
                $overtimeThumbHiddenDate    = $('.overtime-content .overtime-thumbnail figure:first-child .hidden .date', this.domElement),
                $overtimeVideoTitle         = $('.overtime-content .overtime-thumbnail figure:first-child figcaption span', this.domElement),
                $overtimeDescContainer      = $('.overtime-content .thumbnails-container', this.domElement),*/    		       
            		       
    		       
    		      //Clone the icon
    		      var $newOvertimeIcon = $(overtimeIconMarkup);
    		      $newOvertimeIcon.attr('id', 'toolbar-overtime' + d);
    		      $newOvertimeIcon.attr('data-target','overtime-content' + d);
    		      $newOvertimeIcon.addClass('toolbar-overtime')
    		      //Add the icon
    		      $nav.find('.toolbar').find('#toolbar-extras').before($newOvertimeIcon);
    		      
    		      //Bind listeners to the icon    		      
    		      $newOvertimeIcon.bind('click', callbacks.toolbarButtonClicked)
    		      
    		      //Clone the content
    		      var $newOvertime = $(overtimeMarkup);
    		      $newOvertime.addClass('overtime-content' + d); 
    		      $newOvertime.find('.overtime-thumbnail figure:first-child').bind('click', callbacks.videoThumbnailClicked);
    		      $extrasContent.before($newOvertime);     		      
    		      
                    var date = new Date(me.data.OvertimeVideos[d].ProductionDate);
                    
                    $newOvertime.find('header date time').html(SixtyMins.Lookup.getModel('Base').getMonth(date.getMonth()) + " " +date.getDate() + ", " + date.getFullYear())            
                    $newOvertime.find('.thumbnails-container h2').html(me.data.OvertimeVideos[d].Title);
                    $newOvertime.find('.thumbnails-container').html(me.data.OvertimeVideos[d].Description);
                    console.log("check",me.data.OvertimeVideos[d]);
                    
                    //Check if image exist
                    var image = '';
                    var hideThumbnail = false;
                    if($.isArray(me.data.OvertimeVideos[d].Images)){
                        if(me.data.OvertimeVideos[d].Images.length > 0){
                            image = me.data.OvertimeVideos[d].Images[0]["ImageURL"];
                        } else {
                            hideThumbnail = true;
                        } 
                    } else {
                            hideThumbnail = true;
                    }           
                    
                    //If the image exists then update the src of the image
                    if(!hideThumbnail){
                        $overtimeVideoThumbnail = $newOvertime.find('.overtime-thumbnail figure:first-child');
                        $overtimeVideoThumbnail.find('img').attr('src', image);
                        $overtimeVideoThumbnail.attr('data-id',me.data.OvertimeVideos[d].Id);
                        $overtimeVideoTitle.find('figcaption span span').html(me.data.OvertimeVideos[d].Title);
                        $overtimeVideoThumbnail.find('.hidden .title').html(me.data.OvertimeVideos[d].Title);
                        $overtimeVideoThumbnail.find('.hidden .description').html(me.data.OvertimeVideos[d].Description);
                        $overtimeVideoThumbnail.find('.hidden .date').html($overtimeDate.html());   
                                    
                        //Set the toolbar name inside of which the element exists
                        $overtimeVideoThumbnail.attr('data-toolbar-category', 'overtime' + d);                          
                                    
                    } else {
                        //If an image doesn't exist then hide the image container
                        $overtimeVideoThumbnail.parent().css('display','none');
                    }    		          		     
	      
    		    }
    		//}
    		
    	} else {
    		$overtimeIcon.css('display','none');
    	}
    }

	/**
	 * Updates the extras tab
	 * 
	 * Template: 
	 *<figure data-id="">
	 *	<span class="thumb"><span><img src="" title="" /></span></span>
	 *	<figcaption><time></time></figcaption>
	 *  <span class="hidden">
	 *    <span class="title"></span>
	 *    <span class="date"></span>
	 *    <span class="description"></span>
	 *    <span class="cast"></span>
	 *  </span>
	 *</figure>
	 */
	this.updateExtrasTab = function(){
		
		var $element = null;				

		$extrasThumbnailsContainer.empty();

		if(me.data.ExtraVideos.length > 0){  
			
			$extrasIcon.css('display','block'); 
			
			for(d = 0; d < me.data.ExtraVideos.length; d++){
			
			    
								
				$element = $(thumbnailMarkup);
				$element.attr('data-id', me.data.ExtraVideos[d].Id);
				
				var title = $.isArray(me.data.ExtraVideos[d].Title) ? me.data.ExtraVideos[d].Title.join("") : me.data.ExtraVideos[d].Title;
				
				//Check if image exist
	    		var image = '';
	    		var hideThumbnail = false;
				
				if($.isArray(me.data.ExtraVideos[d].Images)){
		            if(me.data.ExtraVideos[d].Images.length > 0){
		                image = me.data.ExtraVideos[d].Images[0]["ImageURL"];
		            } else {
		                hideThumbnail = true;
		            } 
		        } else {
		                hideThumbnail = true;
		        }    		
	    		
	    		//If the image exists then update the src of the image
	    		if(!hideThumbnail){
	    			$element.find('img').attr('src',image).attr('title', title);		    			    		
	    		} else {
	    			//If an image doesn't exist then hide the image container
	    			$element.css('display','none');
	    		}								
				
				$element.find('figcaption span').html(title);
				//$element.find('figcaption time').html()
				
				//Populating the hidden elements
				$element.find('.hidden .title').html(title);
				$element.find('.hidden .description').html(me.data.ExtraVideos[d].Description);
                
                //Add the toolbar name inside of which the element exists
                $element.attr('data-toolbar-category', 'extra');
                
                var date = new Date(me.data.ExtraVideos[d].ProductionDate);            
                $element.find('.hidden .date').html(SixtyMins.Lookup.getModel('Base').getMonth(date.getMonth()) + " " +date.getDate() + ", " + date.getFullYear()); 								
				
				$element.prepend(callbacks.getViewedRelatedMarkup(SixtyMins.LocalStorageManager.wasVideoWatched(me.data.ExtraVideos[d].Id)));
				
				//Set the listeners for this thumbnail
				$element.bind('click', callbacks.videoThumbnailClicked);
				
				
				$extrasThumbnailsContainer.append($element);
			}	
					
			$extrasTitle.html( $.isArray(me.data.Title)? me.data.Title.join("") : me.data.Title );
			 		
    	} else {
    		defaultOpenTab = 'watching';
    		$extrasIcon.css('display','none');
    		
    	}	
    					
	}

	/**
	 * Updates the story tab
	 */
	this.updateStoryTab = function(){
	   
        var container = $storyDate.parents('.content-container'),
            content = $storyDate.parents('.content');

        if(me.data.Story != null && me.data.Story != undefined ){
            
            var date = new Date(me.data.Story.PublishDate);
        
            $storyTitle.html(me.data.Story.Title);
            $storyDate.html(SixtyMins.Lookup.getModel('Base').getMonth(date.getMonth()) + " " +date.getDate() + ", " + date.getFullYear());
            $storyDesc.html(me.data.Story.Body);
            $storyDesc.find('a').attr('target','_blank');
        	
            console.log(container);
            content.css('display','block');
        	$storyIcon.css('display','block'); 

        } else {
            
            $storyIcon.css('display','none');   
             
        }
	}
	
	this.updateViewedThumbnails = function() {
		
		$('.global-overtime-content figure, .extra-content figure', me.domElement).each(function(i,e){
    		if(!$(this).hasClass('watching-now-clicked-thumbnail')){
    			// if video was watched but item has no proper markup
        		if(SixtyMins.LocalStorageManager.wasVideoWatched($(this).data('id')) && !$(this).find('.overlay-viewed').length)
        		{
        			$(this).find('.overlay').remove();
        			$(this).prepend(callbacks.getViewedRelatedMarkup(true));
        		}
    		}
    	});
	}	
	
	/**
	 * Sets the default tab
	 */
	this.setDefaultTab = function(defaultTab){
		defaultOpenTab = defaultTab;		
		
		//If the default tab isn't watching or overtime then the reset the video thumbnail of the first tab
		$watchingNowVideoThumbnail.find('.overlay').remove();
		$watchingNowVideoThumbnail.find('.overlay-viewed').remove();
		if(defaultOpenTab == 'extra' || defaultOpenTab == "story"){		  
		  $watchingNowVideoThumbnail.prepend(callbacks.getViewedRelatedMarkup(SixtyMins.LocalStorageManager.wasVideoWatched(me.data.Id)));
		} else {
		  $watchingNowVideoThumbnail.prepend(callbacks.getNowPlayingMarkup());  
		}
				
		callbacks.makeTabActive();
	}
    /**
     * Maximizes the video bar
     */
    this.maximize = function(){
    	callbacks.resize();
        me.domElement.addClass('maximize').removeClass('minimize');              
    };
    
    /**
     * Minimizes the video side bar
     */
    this.minimize = function(){
        me.domElement.addClass('minimize').removeClass('maximize');
    };

    /**
     * Closes the video side bar
     */
    this.close = function(){
    	if(SixtyMins.Lookup.getController('Video').getIsVideoShown()){
    		me.minimize();
    	} else {
       		me.domElement.removeClass('minimize').removeClass('maximize');
       }
       
       callbacks.makeTabActive();
       
    };

    /*
     * Toggle Reading Mode
     */
    this.toggleMode = function(e){
        e.preventDefault();
        var sidebar = me.domElement,
            container = $(".content-container", sidebar),
            content = $(".content", sidebar);

        if(sidebar.hasClass('reading-mode')){
            
            sidebar.removeClass('reading-mode').animate({width:"415px",height:parseInt(sidebar.height()) - 39},500);
            container.animate({width:"360px"},500);
            content.animate({width:"100%"},500);
        
        } else {
            
            sidebar.addClass('reading-mode').animate({width:parseInt($(window).width()) + 55,height:parseInt(sidebar.height()) + 39},500);
            container.animate({width:parseInt($(window).width())},500);
            content.css({margin:"0 auto"}).animate({width:"60%"},500);
        
        }
    
    };

	/**
	 * Forces a recalculation of the size
	 */
	this.doResize = function() {
    	callbacks.resize();
	};
    
    /**
     * Shows the preloader
     */
    this.showPreloader = function(){
        $content.css('-webkit-transition','opacity 0s ease-in-out').css('opacity',0);
        $nav.css('-webkit-transition','opacity 0s ease-in-out').css('opacity',0);
        //$preloader.css('display','block').addClass('active');
        $preloader.fadeTo(250,1);
    }
    
    /**
     * Hides the preloader
     */    
    this.hidePreloader = function() {
        $content.css('-webkit-transition','opacity 0.4s ease-in-out').css('opacity',1);
        $nav.css('-webkit-transition','opacity 0.4s ease-in-out').css('opacity',1);
        //$preloader.removeClass('active').css('display','none');        
        $preloader.fadeOut(250);
    }
    
    
    /**
     * Get some extra arguments that will forward to the video player
     * when the video player will be triggered
     */
    this.setExtra = function(extraArgs) {
        extra = extraArgs;        
    }
    
    /**
     * Check if minimized
     */    
    this.isMinimized = function(){
        if(this.domElement.hasClass('minimize')){
            return true;
        } else {
            return false;
        }
    }
    
    /**
     * Check if maximized
     */    
    this.isMaximized = function(){
        if(this.domElement.hasClass('maximize')){
            return true;
        } else {
            return false;
        }
    }    

    /**
     * Check if closed
     */    
    this.isClosed = function(){
        if(!this.domElement.hasClass('maximize') && !this.domElement.hasClass('minimize')){
            return true;
        } else {
            return false;
        }
    }  
    
    /**
     * Callbacks for this class
     */
	var callbacks = { 
	    
	    /**
	     * Registering event listeners
	     */
	    addEventListeners : function(){
	       
           $watchingNowIcon
           .add($overtimeIcon)
           .add($extrasIcon)
           .add($storyIcon)
           .bind('click', callbacks.toolbarButtonClicked);
                      
           //Overtime video click listener
           //$overtimeVideoThumbnail.bind('click', callbacks.videoThumbnailClicked);
           $watchingNowVideoThumbnail.bind('click', callbacks.videoThumbnailClicked)
           
           $btnClose.bind('click', me.close);

           $btnModeToggle.bind('click', me.toggleMode);
           
           $(window).bind('resize', callbacks.resize);

	    },
	    
	    /**
	     * Triggered when a toolbar button is clicked 
	     */
	    toolbarButtonClicked : function(e){
	    	
	    	//Update the viewed items
	    	// me.updateViewedThumbnails();
	    	
	        $(this).addClass('active').siblings().removeClass('active');
	        activeContent = $(this).data('target');

	        $('.' + activeContent, me.domElement)
                .siblings('.content')
                .animate({opacity:0},200)
                .css({display:'none'})
                .end()
                .fadeTo(200,1);
	        
	        me.maximize();
	    },
	    
		videoThumbnailClicked : function(e){
			
			//Reset the state of the now watching button
			var $whatIsNowWatched = me.domElement.find('.watching-now-clicked-thumbnail');
			$whatIsNowWatched.removeClass('watching-now-clicked-thumbnail');
            $whatIsNowWatched.find('.overlay').remove();
            $whatIsNowWatched.find('.overlay-viewed').remove();               
            $whatIsNowWatched.prepend(callbacks.getViewedRelatedMarkup(true));            
            defaultOpenTab = $(this).data('toolbar-category');

			$(this).addClass('watching-now-clicked-thumbnail');
			$(this).find('.overlay').remove();
			$(this).find('.overlay-viewed').remove();			
			
			//Make it active
			$(this).prepend(callbacks.getNowPlayingMarkup());
			
			//Minimize the bar
			me.minimize();					

			//Get the video id
			var videoId = $(this).data('id');		
				
			//Set the video data object			
	        SixtyMins.Lookup.getController('Video').setData([{
	            id: videoId,
	            thumbURL: $(this).find('img').attr('src'),
	            title: $(this).find('figcaption span').html(),
	            tagsLine: '',
	            date: $(this).find('figcaption time').html()                
        	},
        	extra[0],
        	extra[1]
        	], null, me);										
					
						
			//Show the video
	        SixtyMins.Lookup.getController('Video').showVideo();				
		},    
	    /**
	     * Highlights a tab
	     */
	    makeTabActive : function(){
	        if(defaultOpenTab == 'overtime') { defaultOpenTab = 'overtime0'; }
	        $('#toolbar-' + defaultOpenTab).addClass('active').siblings().removeClass('active');
	    	$('.' + defaultOpenTab + "-content", me.domElement).addClass('active').siblings('.content').removeClass('active');			    	
	    },
	    
	    /**
	     * Resets the tabs by highliting the first tab 
	     */
	    resetTabs : function(){
			$('.watching-content', me.domElement).addClass('active').siblings('.content').removeClass('active');		
	    	$('#toolbar-watching').addClass('active').siblings().removeClass('active');	    		
	    },
	    
	    /**
	     * Triggered when the window is resized
	     */
	    resize: function(){	        
	    	//We resize each thumbnails container	    	
	    	
            //If the video is open then we make it even more smaller because of the video controls
            if(SixtyMins.Lookup.getController('Video').getIsVideoShown()){
                me.domElement.height(window.innerHeight - BOTTOM_MARGIN - EXTRA_BOTTOM_MARGIN );                   
            } else {
                me.domElement.height(window.innerHeight - BOTTOM_MARGIN );
            }	    	

	        me.domElement.find('.thumbnails-container').each(function(i,e){
		        
		        var newHeight = window.innerHeight - $(this).offset().top - BOTTOM_MARGIN - parseInt($(this).css('margin-bottom'));	
		    	
		    	if(SixtyMins.Lookup.getController('Video').getIsVideoShown()){
					newHeight -= EXTRA_BOTTOM_MARGIN;	
				}
				
                // Check to see if thumbnails container is in story content 
                // ~ needs extra room taken out, for Reading Mode
                if($(this).parents(".story-content").length >= 1){
                    newHeight = newHeight - 50;
                }
                
            	$(this).height(newHeight);
            	    
	        });

            if(me.domElement.hasClass('reading-mode')){
                var sidebar = me.domElement,
                container = $(".content-container", sidebar);
                sidebar.css({width:parseInt($(window).width()) + 55,height:parseInt(sidebar.height()) + 39});
                container.css({width:parseInt($(window).width())});
            }
	        
	    },
	    
	    /**
	     * Creates markup based on if the video is viewed or not
	     */
	    getViewedRelatedMarkup: function (viewed){
		
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
		},
		
		/**
		 * Create markup for now playing element
		 */
		
		getNowPlayingMarkup: function(){
		    return '<div class="overlay active"><div class="icon watching"></div><span class="text-top"></span><span class="text-bottom">Now Playing</span></div>';
		}
	    
	};
	
	callbacks.resize();
	
};

SixtyMins.View.VideoSidebar.prototype = new SixtyMins.View.Base();