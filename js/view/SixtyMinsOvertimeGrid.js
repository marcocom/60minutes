
SixtyMins.View.SixtyMinsOvertimeGrid = function(name) {

	// set name to Grid

	this.setName(name);
	this.domElement		= $('<div class="grid-wrapper"><ul class="clearfix"></ul></div>');

	// variables
	var $wrapper	= this.domElement,
		$list		= $('ul' , this.domElement),
		$body		= $(document.body),
		$logo		= $("#top-ot-logo"),
		thumbSize	= {width:302, height:166},
		$backButton = $logo.find('.back-button'),
		me			= this,
		rootURL     =  '/htdocs/60minutesapp/60-minutes-overtime/',
		data		= null,
		dataDrawn	= null
	;

	/**
	 * Adds the listeners to the logo
	 **/
	this.addLogoListeners = function(){
		$logo.bind('click', callbacks.onLogoClick);
	};

	/**
	 * Removes the listeners to the logo
	 **/
	this.removeLogoListeners = function(){
		$logo.unbind('click', callbacks.onLogoClick);
	};

	/**
	 *
	 **/
	this.setData = function(dataSet) {

		data = dataSet;
	};

	/**
	 * Draws the grid
	 **/
	this.draw = function() {

		dataDrawn = data;

		if(data && data.length)
		{
			var dataItem;

			for(var i = 0; i < data.length; i++)
			{
				dataItem = data[i];
				var subTitle = dataItem.subTitle ? '<span>'+dataItem.subTitle+'</span>' : '';
				var elemStr  =	'<li><figure data-id="'+dataItem.id+'">'+
									getViewedRelatedMarkup(dataItem.viewed)+
									'<span class="thumb"><span><img src="'+dataItem.thumbURL+'" alt="'+dataItem.title+'" /></span></span>'+
									'<figcaption><b>'+dataItem.title+'</b><p>'+dataItem.date+'</p></figcaption>'+
								'</figure></li>';


				var $elem = $(elemStr);
				$list.append($elem);

				//Function for animating the li elements
                var callback = function(obj, delay){
                    obj.css('-webkit-transition-delay', delay + 's').css('opacity', '1' );
                };

                setTimeout(callback, 200, $elem, i/10);

			}

			// add listeners
			($list).find('li').bind('click', this.showVideo);
			$('figure', $list).bind('selectstart',  function(){ return false; });

			callbacks.resizeHandler();

		}

		// Infinte Scroll
		/*
		$wrapper.bind('scroll', function(){
			// Event Throttling
			eventThrottle.run(function(){
				// Check position of scroll
				if((parseInt($list.height()) - parseInt($wrapper.scrollTop())) <= parseInt($wrapper.height())){
					SixtyMins.Lookup.getView('SixtyMinsOvertime').showPreloader();
					var model = SixtyMins.Lookup.getModel('SixtyMinsOvertimeGrid'),
						controller = SixtyMins.Lookup.getController('SixtyMinsOvertimeGrid');
					// Run AJAX Query
					model.getData(controller.callbacks.repopulate, controller, $list.find('li').length);
				}	
			});

		});	
		*/
	};

	this.updateViewed = function() {

		$('figure', $list).each(function(i,e){

			// if video was watched but item has no proper markup
			if(SixtyMins.LocalStorageManager.wasVideoWatched($(this).data('id')) && !$(this).find('.overlay-viewed').length)
			{
				$(this).find('.overlay').remove();
				$(this).prepend(getViewedRelatedMarkup(true));
			}
		});
	};

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

	/**
	 *
	 **/
	this.clearGrid = function() {

		$list.empty();
	};

    /**
     * Simulates click on an object
     */

    this.triggerClickForElementWithId = function(id){
        this.domElement.find('[data-id='+id+']').trigger('click');
    };

	/**
	 * Enables
	 **/
	function enable (){

		$(window).bind('resize', callbacks.resizeHandler);
	}

	var callbacks = {

			resizeHandler : function(e){

				var margin = 30;
				var contW = $wrapper.width() - margin;
				var itemW = parseInt($($list.children()[0]).css('width'), 0);

				var itemFullW = itemW + margin;
				var rowCount = Math.floor(contW / itemFullW);
				var rowW = rowCount * itemFullW;

				$list.width(rowW);

				var bottomBarH = 81;
				var navigationBarH = 66;

				var listHeight = $(window).height() - bottomBarH - navigationBarH;

				$list.parent().height(listHeight);

			},

            onBackClick : function(e) {

				e.stopImmediatePropagation();

				me.deactivateVideo();

				$backButton.unbind('click', callbacks.onBackClick);

                me.updateViewed();

                $logo.removeClass('show-back');

				SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getView('SixtyMinsOvertime').openedTab);

            },

            onLogoClick : function(e) {

				SixtyMins.RouteManager.pushState(null,null, rootURL);

				$backButton.unbind('click', callbacks.onBackClick);
				$logo.removeClass('show-back');

				//me.deactivateVideo();
				me.updateViewed();

            }

	};

	this.doResize = function() {
		callbacks.resizeHandler();
	};

	this.deactivateVideo = function(){

		SixtyMins.Lookup.getController('Video').hideVideo();
		SixtyMins.Lookup.getController('VideoSidebar').close();

		$backButton.unbind('click', callbacks.onBackClick);
		$backButton.removeClass('active');
		$logo.removeClass('show-back');

	};

	/**
     * Fades the video on the background
     **/
    this.showVideo = function (e) {

        //Prepare the current object details for the video
        var $thisElement = $(this);

        var data = getDataSetForElement($thisElement);

        SixtyMins.Lookup.getController('Video').setData(data, me.getDataSetForID, me);

        SixtyMins.Lookup.getController('Video').showVideo();
        SixtyMins.Lookup.getController('VideoSidebar').show($thisElement.find('figure').data('id'), false, 'overtime', [data[1],data[2]]);

        if(SixtyMins.Lookup.getController('SixtyMinsOvertime').data !== undefined){
            if(SixtyMins.Lookup.getController('SixtyMinsOvertime').data.firstState === false){
                SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getView('SixtyMinsOvertime').openedTab + '/video/' + $thisElement.find('figure').data('id'));
            }
        } else {
            SixtyMins.RouteManager.pushState(null,null, rootURL + SixtyMins.Lookup.getView('SixtyMinsOvertime').openedTab + '/video/' + $thisElement.find('figure').data('id'));
        }

        setTimeout(function(){

			$thisElement.find('.overlay').remove();
			$thisElement.find('figure').prepend(getViewedRelatedMarkup(true));

        }, 500);

        // bring in the 60 mins OT logo and attach the callback
        $logo.click(callbacks.deactivateVideo);

        //Shows the back button
        $logo.addClass('show-back');
        $backButton.bind('click', callbacks.onBackClick);

    };

    this.getDataSetForID = function(id){

		var $element = $('figure[data-id="' + id + '"]', $list).parent();

		return getDataSetForElement($element);
	};

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
            date: $element.find('figure').find('p').html()
        };

		return videoObject;
    }

	/**
	 * Disabled the player
	 **/
	function disable (){
		$(window).unbind('resize', callbacks.resizeHandler);

	}

	enable();

	this.addLogoListeners();

}; // end of class

SixtyMins.View.SixtyMinsOvertimeGrid.prototype = new SixtyMins.View.Base();