
SixtyMins.View.CorrespondentDetails = function(name) {

	//The margins of the view. Header bar and Footer Menu

    var TOP_MARGIN              = 66;
    var BOTTOM_MARGIN           = 81;

	// set name to Grid
	this.setName(name);
	this.domElement 		    = $('.correspondent-details-container');

    this.videoToShowOnInitialize = null;

	// variables
	var $wrapper              = this.domElement,
		$body 	                = $(document.body),
		$listContainer          = this.domElement.find('.corresponder-grid ul'),
		$bigImageContainer      = this.domElement.find('.correspondent-details'),
		$descriptionContainer   = this.domElement.find('.correspondent-details p'),
		$titleContainer         = this.domElement.find('.correspondent-details h1'),
		$preloader              = this.domElement.find('.preloader'),
		$sidebar                = this.domElement.find('.correspondent-left-sidebar'),
		me		                  = this,
		rootURL                 =  '/htdocs/60minutesapp/correspondents/'
		$logo                   = $("#top-logo"),
    $backButton             = $logo.find('.back-button'),
		isHidden                = true;

		this.data               = null;


    var thumbnailTemplate = '<li>'+
                               '<span class="thumb"><img src="{IMAGE}" alt="{IMAGE_TITLE}" /></span>'+
                               '<b>{TITLE}</b>'+
                               '{DATE} <span class="category">{CATEGORY}</span>'+
                            '</li>';

	/**
	 * Sets the data
	 **/
	this.setData = function(dataSet) {

		this.data = dataSet;

	}


	/**
	 *  Draws the view
	 **/
	this.draw = function() {

	    //Set the image, title and description
	    if(this.data != null && this.data!=undefined){
    	    $bigImageContainer.css('background-image','url('+ this.data.bigImageURL + ')');
    	    $titleContainer.html(this.data.title);
    	    $descriptionContainer.html(this.data.description);

    	    //Clearing the grid
            this.clearGrid();
	    }
      
      // Infinte Scroll
      /*
        $listContainer.parents('.corresponder-grid').bind('scroll', function(){
            console.log("pappi");
            // Event Throttling
            eventThrottle.run(function(){
                // Check position of scroll
                if((parseInt($listContainer.height()) - parseInt($listContainer.parents('.corresponder-grid').scrollTop())) <= parseInt($listContainer.parents('.corresponder-grid').height())){
                    SixtyMins.Lookup.getView('CorrespondentDetails').showPreloader();
                    var model = SixtyMins.Lookup.getModel('CorrespondentDetails'),
                        controller = SixtyMins.Lookup.getController('CorrespondentDetails');
                    // Run AJAX Query
                    SixtyMins.Lookup.getModel('CorrespondentsGrid').getCorrespondantGridData(data.url, model.callbacks.populateGrid, this, $listContainer.find('li').length);
                }   
            });

        });
        */
		callbacks.resizeHandler();

	};

    /**
     * Creates the grid
     */
    this.createGrid = function(media) {

      //Getting the media

      var str = thumbnailTemplate;
      var parsedElements = 0;
      //Looping through all the media
      for(d = 0; d < media.length; d++){

          var title     ='',
              image     ='',
              date      ='',
              category  = '',
              dontParse = false;


          try{
              title = media[d]["Title"]["$"];
              if($.isArray(title)){
                  title = title.join("");
              }
          } catch(err){
             dontParse = true;
          }


          try{
        	  if($.isArray(media[d]["Images"]["Image"]))
        	  {
        		  if( media[d].Images.Image.length == 1)
        		  {
        			  image =  media[d].Images.Image[0].ImageURL.$;
        		  }
        		  else
        		  {
                        for(x = 0; x < media[d].Images.Image.length; x++){

                            if(media[d].Images.Image[x]['@aspectRatio'] == '16:9'){
                              image =  media[d].Images.Image[x].ImageURL.$;
                            }
                        }

                        if(image == ''){
                            image = media[d].Images.Image[0].ImageURL.$ ;
                        }

        		  }
        	  }
        	  else
        	  {
        		  image =  media[d].Images.Image.ImageURL.$;
        	  }
          	} catch (err){
			      image = '';
			}


          try {
              date = new Date(media[d]["ProductionDate"]["$"]);
          } catch (err){

          }

          try {
             category = SixtyMins.Lookup.getModel('Base').getCategory(media[d]['Category']['@id']);
          } catch(err){

          }

          var id = media[d]['@id'];

          var viewed = SixtyMins.LocalStorageManager.wasVideoWatched(id);

          //If the title doesn't exist
          if(dontParse == false){

              var str ='<li><figure data-id="{ID}">'+
                            getViewedRelatedMarkup(viewed)+
                            '<span class="thumb"><img src="{IMAGE}" alt="{IMAGE_TITLE}" /></span>'+
                            '<b>{TITLE}</b>'+
                            '<figcaption><span class="date">{DATE}</span> <span class="category">{CATEGORY}</span></figcaption>'+
                        '</figure></li>';


              str = str.replace('{ID}', id);
              str = str.replace('{IMAGE}', image);
              str = str.replace('{TITLE}', title);
              str = str.replace('{IMAGE_TITLE}', title);
              str = str.replace('{DATE}', SixtyMins.Lookup.getController('CorrespondentDetails').getModel().months[ date.getMonth() ] + ' ' + date.getDate() +', ' + date.getFullYear() ) ;
              str = str.replace('{CATEGORY}', category);

              var $str = $(str);

              $str.bind('click', this.showVideo);

              $listContainer.append($str);

              var callback = function(obj,delay){
                  obj.css('-webkit-transition-delay', delay + 's').css('opacity', '1' );
              };

              setTimeout(callback, 200, $str, parsedElements/15);

              parsedElements++;
          }
       }

       if(me.videoToShowOnInitialize){
           $('figure[data-id="' + me.videoToShowOnInitialize + '"]', $listContainer).trigger('click');
           me.videoToShowOnInitialize = null;
       }

    }

    this.updateViewed = function() {

    	$('figure', $listContainer).each(function(i,e){

    		if(SixtyMins.LocalStorageManager.wasVideoWatched($(this).data('id')) && !$(this).find('.overlay-viewed').length)
    		{
    			$(this).find('.overlay').remove();
    			$(this).prepend(getViewedRelatedMarkup(true));
    		}
    	});
	}

    function getViewedRelatedMarkup(isViewed){

        var markup = '';

        if(isViewed)
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

	/**
	 *  Clears the grid
	 **/
	this.clearGrid = function() {
		$listContainer.empty();
	};

    /**
     * Function specific to this view for hiding the details
     * @param animate {bool} - If it is true then we animate the element
     */
    this.hide = function(animate){

        $backButton.unbind('click', callbacks.onBackClick);

        SixtyMins.Lookup.getController('Correspondents').resetScroll();

        $logo.removeClass('show-back');

        isHidden = true;
        var height = this.domElement.height();
        if(animate == false){
           this.domElement.addClass('no-transition')
        } else {
           this.domElement.removeClass('no-transition')
        }
        this.domElement.css('top', "100%");

        // Simulate lighting by sliding out the background gradient

        $bigImageContainer.css({
          "-webkit-transition": "opacity 200ms ease-out 100ms",
          "opacity": "0"
        });

        $sidebar.css({
          "-webkit-transition": "background 300ms ease-in-out",
          "background-position": "0 -410px"
        });
    };

    /**
     * Function specific to this view for showing the details
     * @param animate {bool} - If it is true then we animate the element
     */
    this.show = function(animate) {
        //Shows the back button
        setTimeout(function(){
          $logo.addClass('show-back');
        }, 50);

        $backButton.bind('click', callbacks.onBackClick);

        isHidden = false;
        var height = this.domElement.height();

        if(animate == false){
           this.domElement.addClass('no-transition');
        } else {
           this.domElement.removeClass('no-transition');
        }

        this.domElement.css('top', "0px");

        // Simulate lighting by sliding in the background gradient

        $bigImageContainer.css({
          "-webkit-transition": "opacity 550ms ease-out 200ms",
          "opacity": "1"
        });

        $sidebar.css({
          "-webkit-transition": "background 1250ms cubic-bezier(0.190, 1.000, 0.220, 1.000) 250ms",
          "background-position": "0 0px"
        });

    };

    /**
     * Shows the preloader
     */

    this.showPreloader = function(){
        //$preloader.addClass('active');
      $preloader.fadeTo(250,1);  
    }


    this.hidePreloader = function(){
      // $preloader.removeClass('active')
      $preloader.fadeOut(250);  
    }
    
	/**
	 * Enables the details view
	 **/
	function enable (){
		$(window).bind('resize', callbacks.resizeHandler);
	};

	var callbacks = {

			resizeHandler : function(e){

			    if(isHidden){

			        if(me.domElement != undefined && me.domElement !=null){
				        me.domElement.css('top', '100%');
				    }

				}

				var height = $(window).height();
                me.domElement.height(height - TOP_MARGIN - BOTTOM_MARGIN);
			},
			/**
			 * Event for when clicking the back button
			 */
			onBackClick : function(e){

			    $backButton.unbind('click', callbacks.onBackClick);
          $backButton.bind('click', callbacks.onVideoBackClick);

			    SixtyMins.RouteManager.pushState(null, null, '/htdocs/60minutesapp/correspondents/');

			    SixtyMins.Lookup.getController('Correspondents').hideCorrespondentDetails();

			},
      /**
       * Deactivates and hides the video
       */
      deactivateVideo: function(event) {

          $backButton.bind('click', callbacks.onBackClick);
          $backButton.unbind('click', callbacks.onVideoBackClick);
          //$logo.removeClass('active');
          $logo.find('img').unbind('click', callbacks.deactivateVideo);

          me.updateViewed();

          SixtyMins.Lookup.getController('Video').hideVideo();
          SixtyMins.Lookup.getController('VideoSidebar').close();

          SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getController('CorrespondentDetails').openedCorrespondent);

      },

      onVideoBackClick: function(event){
        callbacks.deactivateVideo();
      }
	};

    /**
     * Fades the video on the background
     **/
    this.showVideo = function (e) {

        $backButton.unbind('click', callbacks.onBackClick);
        $backButton.bind('click', callbacks.onVideoBackClick);

        //Prepare the current object details for the video
        var $thisElement = $(this);

        var data = getDataSetForElement($thisElement);

        SixtyMins.Lookup.getController('Video').setData(data, me.getDataSetForID, me);

        if(SixtyMins.Lookup.getController('Correspondents').data != undefined){
            if(SixtyMins.Lookup.getController('Correspondents').data.firstState == false){
                SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getController('CorrespondentDetails').openedCorrespondent + '/video/' + $thisElement.find('figure').data('id'));
            }
        } else {
            SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getController('CorrespondentDetails').openedCorrespondent + '/video/' + $thisElement.find('figure').data('id'));
        }

        SixtyMins.Lookup.getController('Video').showVideo();
        SixtyMins.Lookup.getController('VideoSidebar').show($thisElement.find('figure').data('id'),false, 'watching', [data[1],data[2]]);

        setTimeout(function(){

        	$thisElement.find('.overlay').remove();
        	$thisElement.find('figure').prepend(getViewedRelatedMarkup(true));

        }, 500);


        // bring in the 60 mins logo and attach the callback

        //$logo.find('img').click(callbacks.deactivateVideo);

    };


     this.getDataSetForID = function(id){

    	var $element = $('figure[data-id="' + id + '"]', $listContainer).parent();

//    	console.log(this,'getDataSetForID', $listContainer, $element);

    	return getDataSetForElement($element);
    }

    function getDataSetForElement($element){

    	var thisVideoObj = videoObjectFromElement($element);

        //Prepare the next object for the video end screen
        var $nextElement = $element.next('li').length > 0 ? $element.next('li') : $('li', $element.parent()).first();
        //
        var nextVideoObj = videoObjectFromElement($nextElement);


        //Prepare the previous object for the video end screen
        var $prevElement = $element.prev('li').length > 0 ? $element.prev('li') : $('li', $element.parent()).last();
        //
        var prevVideoObj = videoObjectFromElement($prevElement);

        return [thisVideoObj, prevVideoObj, nextVideoObj];
	}

    function videoObjectFromElement($element){

		var videoObject = {

            id: $element.find('figure').data('id'),
            thumbURL: $element.find('figure').find('img').attr('src'),
            title: $element.find('figure').find('b').html(),
            tagsLine: '',
            date: $element.find('figure').find('.date').html()
        }

		return videoObject;
    }

	/**
	 * Disable the details view
	 **/
	function disable (){
	    this.hide();
	};

	enable();

}; // end of class

SixtyMins.View.CorrespondentDetails.prototype = new SixtyMins.View.Base();