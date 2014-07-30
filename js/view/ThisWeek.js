
SixtyMins.View.ThisWeek = function(name) {

    this.setName(name);
    this.domElement = $("#this-week");

	this.videoToShowOnInitialize = null;
	this.hasInitialized = false;

    var that 					= this,
		$sideBar				= this.domElement.find('.sidebar'),
		$sideBarBtnOvertime		= $sideBar.find('.btn-overtime'),
        $sideBarBtnExtras		= $sideBar.find('.btn-extras'),
        $sideBarBtnWatch		= $sideBar.find('.btn-watch'),
		$sideBarBtnFullStory	= $sideBar.find('.btn-fullstory'),
		$logo					= $("#top-logo"),
		$panel					= $("#panel"),
        $panelBtnClose			= $panel.find('.btn-close'),
		sideBarView				= new SixtyMins.View.Sidebar('ThisWeekSidebar', $sideBar, 'tw');

	var callbacks = {
		onSideBarBtnClick: function(event) {
			$logo.addClass('active');
			that.hideSideBar();
		},

		onPanelCloseClick: function(event) {
			that.showSideBar();
		}
	};

	$sideBarBtnFullStory.click(callbacks.onSideBarBtnClick);
	$sideBarBtnOvertime.click(callbacks.onSideBarBtnClick);
	$sideBarBtnExtras.click(callbacks.onSideBarBtnClick);
	$sideBarBtnWatch.click(callbacks.onSideBarBtnClick);
	$panelBtnClose.click(callbacks.onPanelCloseClick);

    this.draw = function() {

    };

	this.showBackgroundFor = function(id) {

		if(id) {
			this.domElement.find('.segment-background').removeClass('active');
			this.domElement.find('.segment-background[data-segment-id="'+id+'"]').addClass('active');
		}
	}

    /**
     * Render the main segments data
     **/
    this.renderMainSegments = function(data) {

        var obj     = data["recentSegments"]["recentSegment"],
            date    = obj[0]["video"]["Videos"]["Video"]["ProductionDate"]["$"]
        ;

        obj = obj.reverse();

        // loop through each object data
        for (var i = 0, len = obj.length; i < len; i++) {

            var title               = obj[i]["video"]["Videos"]["Video"]["Title"]["$"],
                description         = obj[i]["video"]["Videos"]["Video"]["Description"]["$"],
                id                  = obj[i]["@loopValue"],
				videoContentUrl		= obj[i]["video"]["Videos"]["Video"]["VideoMedias"]["VideoMedia"];

			if($.isArray(videoContentUrl)) {
				videoContentUrl = videoContentUrl[0];
			}

			var currentVideoUrl     = videoContentUrl["DeliveryUrl"]["$"],
				extrasCount         = obj[i]["extras"]["Videos"]["@numReturned"],
                overtimeCount       = 0,//obj[i]["ot"]["Videos"]["@numReturned"],
                overtimeId          = '',
                overtimeVideoUrl    = '',
				largeImage			= {ImageUrl:{$:''}},
                $segment            = $("#segment-"+i, this.domElement),
                figureStr           = thumbnail = extraVideoUrl = figcaption = duration = ""
            ;

			var imageCollection		= obj[i]["video"]["Videos"]["Video"]["Images"]["Image"];
			for(var ic = 0; ic < imageCollection.length; ic++) {
				if(imageCollection[ic]["@width"] == 1280) {
					largeImage = imageCollection[ic];
					break;
				}
			}

			// we need to add in the background images
			var itemBackground 		= $('<figure class="segment-background" data-segment-id="'+id+'" />').appendTo(this.domElement.find('.backgrounds'));
			var itemBackgroundImage	= $('<div class="segment-background-image" />').appendTo(itemBackground);
			itemBackground.append('<div class="preloader active" data-segment-id="'+id+'"><div class="preloader-dial"></div></div>');

			var tempImage = $('<img/>');
			tempImage.data('target-segment-id', id);
			tempImage.bind('load', function(){

				var $this 		= $(this);
				var segmentID	= $this.data('target-segment-id');
				var item		= that.domElement.find('figure[data-segment-id="'+segmentID+'"]')
				var preloader	= item.find('.preloader');
				var target 		= item.find('.segment-background-image');

				// remove the active class from the preloader
				//preloader.removeClass('active');
                preloader.fadeTo(250,1);

				setTimeout(function(segmentID){

					that.domElement.find('.preloader[data-segment-id="'+segmentID+'"]').remove();

				}, 400, segmentID);

				target.css({
					background: 'url("'+$this.attr('src')+'")',
					opacity: 1
				});
			});
			tempImage.attr('src', largeImage.ImageURL.$ || "");

		    // mount the title of the video
            // ---------------------------
            if ($.isArray(title)) {
			    title = title.join("");
			}

            // mount the description of the video
            // ---------------------------
            if ($.isArray(description)) {
                description = description.join("");
            }

            //Get the video id and url of the overtime
            if (overtimeCount > 0){

                //Trying to get the id
                try{
                    overtimeId          = obj[i]["ot"]["Videos"]["Video"]["VideoMedias"]["VideoMedia"][0]["@id"];

                } catch(err){}

                //Trying to get the url
                try {
                    overtimeVideoUrl    = obj[i]["ot"]["Videos"]["Video"]["VideoMedias"]["VideoMedia"][0]["DeliveryUrl"]["$"];
                } catch(err){}

            }

			// truncate as needed
			var shortDescription = description.length > 105 ? description.substring(0,105) + "..." : description;

            // assign the string values we discovered
            // ---------------------------
            $segment.find("h2, h3").text(title);
            $segment.find("blockquote").text(shortDescription);
            $segment.addClass('segment');

            // add ids to the list
            $segment.attr("data-id", id);

            // hide buttons with empty content
            if (extrasCount == 0) $segment.find(".btn-extras").hide();
            if (overtimeCount == 0) $segment.find(".btn-overtime").hide();

            $segment.find(".btn-overtime").attr("data-videourl", overtimeVideoUrl).attr('data-id', overtimeId);

            // add data to buttons
			$btnWatch = $segment.find(".btn-watch");
			$btnWatch.attr('data-id', id);
            $btnWatch.attr("data-thumbURL", getThumbURL(obj[i]["video"]["Videos"]["Video"]));
			$btnWatch.attr('data-title', title);
			$btnWatch.attr('data-date', getVideoDateText(date));

			//
			$btnReadFull = $segment.find(".btn-fullstory");
			if($btnReadFull)
			{
				$btnReadFull.attr('data-id', id);
			}

            // populate the current video panel
            // ---------------------------
            // this.populateCurrentWatching(obj[i]["video"]["Videos"]["Video"], title, description, i , id);

            // populate overtime panel
            // ---------------------------
            // if we have overtime content for this segment
            if (overtimeCount > 0) {

				var otData = obj[i]["ot"]["Videos"]["Video"];

                // this.populateOvertime(otData, id);

				$btnOvertime = $segment.find(".btn-overtime");
				$btnOvertime.attr('data-parentid',id);
				$btnOvertime.attr('data-id', otData["@id"]);
				$btnOvertime.attr('data-thumbURL', getThumbURL(otData));
				$btnOvertime.attr('data-title', otData["Title"]["$"]);
				$btnOvertime.attr('data-date', getVideoDateText(otData["ProductionDate"]["$"]));

            }

            // populate extras panel
            // ---------------------------
            // if (extrasCount > 0) {
            //     this.populateExtraContent(obj[i]["extras"], title, id);
            // }

        }; // end of loop for each segment

        // fix the dates
        myDate = new Date(date);
        this.populateDate(myDate);

        // done with data, display the sidebar
       	sideBarView.calculateItemHeights();
		this.showSideBar();

        // parse the playable items
        this.parsePlayables();

        // for debugging and study the data:
        // $.each(obj, function(key, value) {
        //     console.log("recentSegments",value);
        // });

		this.hasInitialized = true;

    };

	this.triggerVideo = function(id) {
		sideBarView.triggerVideo(id);
	}

	function getThumbURL(obj){

		var imageObj = obj.Images.Image;

		try {

			if($.isArray(imageObj))
			{
				for(var i = 0; i<imageObj.length; i++)
				{
					if(imageObj[i]['@aspectRatio'] == '16:9')
					{
						return imageObj[i].ImageURL.$;
					}
				}
				return imageObj[0].ImageURL.$;
			}
			else
			{
				imageObj.ImageURL.$;
			}

		} catch (e) {
			return '';
		}
	};

	function getVideoDateText(date){

		var date 				= new Date(date);

		var day                 = date.getDate(),
            month               = that.getMonthName( date.getMonth() ),
            year                = date.getFullYear()
		;

		return month+' '+day+', '+year;
	};

	this.startCarousel = function() {
		sideBarView.startCarousel();
	};

	this.stopCarousel = function() {
		sideBarView.stopCarousel();
	}

    /**
     * Parses the playable figures
     **/
    this.parsePlayables = function() {

        var $videos = $('.playable');

        // playable videos
        $videos.click(function() {
            // SixtyMins.Lookup.getView('Panel').showVideo( $(this) );
        });

    };

    /**
     * Render the Current Watching section for the segment
     **/
    this.populateCurrentWatching = function(data, title, description, i, id) {

        // check if it's defined
        if (typeof data === 'object' &&
            data.length !== 'undefined') {



            var castMember    = data["Cast"]["CastMember"]["$"],
                thumbnail     = '',
                parentSection = $('<section data-id="'+id+'"/>'),
                articleStr    = ''
            ;

            if($.isArray(data["Images"]["Image"])){
                thumnail = data["Images"]["Image"][0]["ImageURL"]["$"];
            } else {
               thumnail = data["Images"]["Image"]["ImageURL"]["$"];
            }

            /*articleStr = '<header><h2 data-id='+id+'>'+title+'</h2><span class="date-line"></span><hr class="divider" /></header>'+
                         '<article><p>'+description+'</p><cite>Reported by: <strong>'+castMember+'</strong></cite></article>'+
                         '<figure><div class="overlay"><span class="icon ico-watching"></span><span class="text-bottom">Now Playing</span></div>'+thumbnail+'</figure>';*/

            articleStr = '<header><h2 data-id='+id+'>'+title+'</h2><span class="date-line"></span><hr class="divider" /></header>'+
                         '<article><p>'+description+'</p><cite>Reported by: <strong>'+castMember+'</strong></cite></article>'+
                         '<figure data-id="'+id+'" data-videourl="'+extraVideoUrl+'">'+
                                    getViewedRelatedMarkup(SixtyMins.LocalStorageManager.wasVideoWatched(id))+
                                    '<img src="'+thumbnail+'" title="'+title+'" />'+
                                '</figure>';
                         //'<figure><div class="overlay"><span class="icon ico-watching"></span><span class="text-bottom">Now Playing</span></div>'+thumbnail+'</figure>';

            // append to the related panel content
            $('#panel-watching').append( parentSection.append(articleStr) );

        } // end of if data

    };

    /**
     * Render the extras in the panel
     **/
    this.populateExtraContent = function(data, title, id) {
            var sectionH2     = $('<h2 data-id='+id+'>'+title+'</h2><span class="title">Extra Clips</span>'),
                parentSection = $('<section data-id="'+id+'"/>').append(sectionH2),
                figcaption    = '',
                videoId       = '',
                extraContent  = $('<div class="scrollable"/>')
            ;

            for (var j = 0; j < data["Videos"]["@numReturned"]; j++) {

                // could be an array or object
                if ($.isArray(data["Videos"]["Video"])) {
                    // check if it's defined
                    if (data["Videos"]["Video"][j] &&
                        typeof data["Videos"]["Video"][j] === 'object' &&
                        data["Videos"]["Video"][j].length !== 'undefined') {

                        //Get the video Id
                        videoId = data["Videos"]["Video"][j]["@id"];

                        // get the title
                        figcaption = data["Videos"]["Video"][j]["Title"]["$"];

                        // get the thumbnail
                        if($.isArray(data["Videos"]["Video"][j]["Images"]["Image"])){
                            thumnail = data["Videos"]["Video"][j]["Images"]["Image"][0]["ImageURL"]["$"];
                        } else {
                           thumnail = data["Videos"]["Video"][j]["Images"]["Image"]["ImageURL"]["$"];
                        }

                        // video url
                        extraVideoUrl = data["Videos"]["Video"][j]["VideoMedias"]["VideoMedia"][0]["DeliveryUrl"]["$"];

                    }
                } else {
                    // check if it's defined
                    if (data["Videos"]["Video"] &&
                        typeof data["Videos"]["Video"] === 'object' &&
                        data["Videos"]["Video"].length !== 'undefined') {

                        //Get the video Id
                        videoId = data["Videos"]["Video"]["@id"];

                        // get the title
                        figcaption = data["Videos"]["Video"]["Title"]["$"];

                        // get the thumbnail
                        if($.isArray(data["Videos"]["Video"]["Images"]["Image"])){
                           thumnail = data["Videos"]["Video"]["Images"]["Image"][0]["ImageURL"]["$"];
                        } else {
                           thumnail = data["Videos"]["Video"]["Images"]["Image"]["ImageURL"]["$"];
                        }

                        // get the thumbnail
                       // thumbnail = data["Videos"]["Video"]["Images"]["Image"]["ImageURL"]["$"];
                        // video url
                        extraVideoUrl = data["Videos"]["Video"]["VideoMedias"]["VideoMedia"][0]["DeliveryUrl"]["$"];

                    }
                }

                if ($.isArray(figcaption)) {
                    figcaption = figcaption.join("");
                }

                figureStr = '<figure data-id="'+videoId+'" data-videourl="'+extraVideoUrl+'">'+
                                    getViewedRelatedMarkup(SixtyMins.LocalStorageManager.wasVideoWatched(videoId))+
                                    '<img src="'+thumbnail+'" />'+
                                    '<figcaption>'+figcaption+'</figcaption>'+
                                '</figure>';

                extraContent.append(figureStr);

            }; // end of loop of extras

            $('#panel-extras').append(parentSection.append(extraContent));

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
     * Render the OT in the panel
     **/
    this.populateOvertime = function(data, id) {

        // check if it's defined
        if (typeof data === 'object' &&
            data.length !== 'undefined') {

            var videoUrl      = data["VideoMedias"]["VideoMedia"][0]["DeliveryUrl"]["$"],
                thumbnail     = '',
                title         = data["Title"]["$"],
                description   = data["Description"]["$"].join(""),
                parentSection = $('<section data-id="'+id+'"/>'),
                videoId       = '';

                if($.isArray(data["Images"]["Image"])){
                    thumnail = data["Images"]["Image"][0]["ImageURL"]["$"];
                } else {
                   thumnail = data["Images"]["Image"]["ImageURL"]["$"];
                }
                //articleStr = $('<figure class="playable" data-videourl="'+videoUrl+'"><span class="icon ico-play"></span><img src='+thumbnail+' /></figure><article class="scrollable"><h2>'+title+'</h2><p>'+description+'</p></article>')
                var articleStr = '<figure data-id="'+videoId+'" data-videourl="'+videoUrl+'">'+
                                    getViewedRelatedMarkup(SixtyMins.LocalStorageManager.wasVideoWatched(videoId))+
                                    '<img src="'+thumbnail+'" />'+
                                    '<figcaption>'+figcaption+'</figcaption>'+
                                '</figure>'+
                                '<article class="scrollable"><h2>'+title+'</h2><p>'+description+'</p></article>';
            ;

            $('#panel-overtime header').after( parentSection.append(articleStr) );

        }

    };

    /**
     * gets a date and renders in the right format
     **/
    this.populateDate = function(date) {

        var day                 = date.getDate(),
            month               = this.getMonthName( date.getMonth() ),
            year                = date.getFullYear(),
            $dateYear           = $('.date-year'),
            $dateLine           = $('.date-line'),
            $panelHeader        = $('#panel nav header'),
            $panelHeaderMonth   = $panelHeader.find('.date-line')
        ;

        $dateYear.text(year);
        $dateLine.text(month+" "+day+", "+year);

        // fix it to show MAR 20 instead of MARCH 20 that was previously set above
        $panelHeader.find('.date-line').html( $panelHeaderMonth.text().substring(0,3).toUpperCase() + '<span>'+day+'</span>' );

    };

	this.hideSideBar = function(event) {
		$sideBar.addClass('inactive');

	}

	this.showSideBar = function(event) {

		$sideBar.removeClass('inactive').removeClass('hidden');


	}

    /**
     * returns a string from the month number
     **/
    this.getMonthName = function(num) {

        var months = [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December"
                     ];

        return months[num];

    };

};

SixtyMins.View.ThisWeek.prototype = new SixtyMins.View.Base();