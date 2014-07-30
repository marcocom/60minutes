
SixtyMins.View.SixtyMinsOvertime = function(name) {

  this.setName(name);
  this.domElement           = $("#sixty-minutes-overtime");
  this.openedTab            = 'recent';

  var $filterBar            = this.domElement.find('.filter-bar');

  var preloader             = this.domElement.find('.preloader'),
    that                    = this,
    $sideBar                = this.domElement.find('.sidebar'),
    $sideBarBtnOvertime     = $sideBar.find('.btn-overtime'),
    $sideBarBtnExtras       = $sideBar.find('.btn-extras'),
    $sideBarBtnWatch        = $sideBar.find('.btn-watch'),
    $panel                  = $("#panel"),
    me                      = this,
    $panelBtnClose          = $panel.find('.btn-close'),
    sideBarView             = new SixtyMins.View.Sidebar('SixtyMinutesOvertimeSidebar', $sideBar, 'ot'),
    rootURL                 = '/htdocs/60minutesapp/60-minutes-overtime';

  var callbacks = {
    onSideBarBtnClick: function(event) {
      that.hideSideBar();
    },

    onPanelCloseClick: function(event) {
      that.showSideBar();
    },

    addHiddenToPreloader: function() {
      //var $this = preloader;
      // $this.unbind();
      // $this.addClass('hidden');
      console.log('ef');
      preloader.fadeOut(250);  
    },
    navClickHandler : function(e){

      var $target = $(e.target);

      // we check if user clicked a button
      if($target.is('a'))
      {
        currentId = $target.data('id');

        // clear active classes and add it to current element
        $('li', $filterBar).removeClass('active');

        // set active class on current element
        $target.parent().addClass('active');

        //Push the state
        SixtyMins.RouteManager.pushState(null,null, rootURL+'/' + $target.data('friendly-url'));

        me.openedTab = $target.data('friendly-url');

        SixtyMins.Lookup.getController('SixtyMinsOvertimeGrid').showCategory(currentId);
        e.preventDefault();
      }
    }
  };

  $sideBarBtnOvertime.click(callbacks.onSideBarBtnClick);
  $sideBarBtnExtras.click(callbacks.onSideBarBtnClick);
  $sideBarBtnWatch.click(callbacks.onSideBarBtnClick);
  $panelBtnClose.click(callbacks.onPanelCloseClick);

  $filterBar = this.domElement.find('.filter-bar');

  this.startCarousel = function() {
    sideBarView.startCarousel();
  };

  this.stopCarousel = function() {
    sideBarView.stopCarousel();
  };

  this.draw = function() {
     $filterBar.bind('click', callbacks.navClickHandler);
  };

  this.doCloseSidebar = function() {
      sideBarView.doCloseSidebar();
  };


  this.showBackgroundFor = function(id) {

    if(id) {
      this.domElement.find('.segment-background').removeClass('active');
      this.domElement.find('.segment-background[data-segment-id="'+id+'"]').addClass('active');
    }
  };

  this.triggerVideo = function(id) {
    sideBarView.triggerOTVideo(id);
  };

  /**
     * Render the main segments data
     **/
    this.renderOtSegments = function(data) {

      var obj = data["recentSegments"]["recentSegment"],
          date = obj[0]["video"]["Videos"]["Video"]["ProductionDate"]["$"],
          objTotal = -1
        ;

        obj = obj.reverse();
        
        // loop through each object data
        for (var i = 0, len = obj.length; i < len; i++) {

      var overtimeCount = obj[i]["video"]["Videos"]["@numReturned"];

      // if we have an overtime at all
      if(overtimeCount > 0) {

        objTotal++;

        var title                     = obj[i]["video"]["Videos"]["Video"]["Title"]["$"],
          description                 = obj[i]["video"]["Videos"]["Video"]["Description"]["$"],
          id                          = obj[i]["@loopValue"],
          videoContentUrl             = obj[i]["video"]["Videos"]["Video"]["VideoMedias"]["VideoMedia"];

        if($.isArray(videoContentUrl)) {
          videoContentUrl             = videoContentUrl[0];
        }

        var currentVideoUrl           = videoContentUrl["DeliveryUrl"]["$"],
          extrasCount                 = obj[i]["extras"]["Videos"]["@numReturned"],
          $segment                    = $("#ot-segment-"+i, this.domElement),
          figureStr                   = thumbnail = extraVideoUrl = figcaption = duration = ""
          ;

        var imageCollection           = obj[i]["video"]["Videos"]["Video"]["Images"]["Image"],
          largeImage                  = imageCollection[0];

        for(var ic = 0; ic < imageCollection.length; ic++) {
          if(imageCollection[ic]["@width"] == 1280) {
            largeImage = imageCollection[ic];
            break;
          }
        }

        // we need to add in the background images
        var itemBackground      = $('<figure class="segment-background" data-segment-id="'+id+'" />').appendTo(this.domElement.find('.backgrounds-ot'));
        var itemBackgroundImage = $('<div class="segment-background-image" />').appendTo(itemBackground);
        itemBackground.append('<div class="preloader active" data-segment-id="'+id+'"><div class="preloader-dial"></div></div>');

        var tempImage           = $('<img/>');
        tempImage.data('target-segment-id', id);
        tempImage.bind('load', function(){

          var $this             = $(this);
          var segmentID         = $this.data('target-segment-id');
          var item              = that.domElement.find('figure[data-segment-id="'+segmentID+'"]');
          var preloader         = item.find('.preloader');
          var target            = item.find('.segment-background-image');

          // remove the active class from the rr
          //preloader.removeClass('active');
          preloader.fadeOut(250);

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
        if (extrasCount === 0) $segment.find(".btn-extras").hide();

          // add data to buttons
          $btnOvertime = $segment.find(".btn-overtime");
          $btnOvertime.attr('data-id', id);
          $btnOvertime.attr("data-thumbURL", getThumbURL(obj[i]["video"]["Videos"]["Video"]));
          $btnOvertime.attr('data-title', title);
          $btnOvertime.attr('data-date', getVideoDateText(date));

          $btnReadFull = $segment.find(".btn-fullstory");
          if($btnReadFull) {
            $btnReadFull.attr('data-id', id);
          }

          // add video urls to watch video buttons
          // $segment.find(".btn-overtime").data("videourl", currentVideoUrl);

          } // end of if overtimeCount
        } // end of loop for each segment

        if (objTotal == -1) {
          $('#ot-sidebar').remove();
        } else {
          // eliminate empty lists
          $('#ot-sidebar li:gt('+(objTotal)+')').remove();
        }

        // done with data, display the sidebar
        sideBarView.calculateItemHeights();
        sideBarView.recountList();
        this.showSideBar();

    // for debugging and study the data:
        // $.each(obj, function(key, value) {
        //     console.log("recentSegments",value);
        // });

    };

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

    var date = new Date(date);

    var day                 = date.getDate(),
        month               = that.getMonthName( date.getMonth() ),
        year                = date.getFullYear()
    ;

    return month+' '+day+', '+year;
  }


  this.hideSideBar = function(event) {

    $sideBar.addClass('inactive');

  };

  this.showSideBar = function(event) {

    $sideBar.removeClass('inactive').removeClass('hidden');

  };


  this.showPreloader = function() {

    console.log('show preloader');

    /*
    preloader.unbind().removeClass('hidden');
    setTimeout(function(){
      preloader.addClass('active');
    }, 50);
    */
    preloader.fadeTo(250,1);
  };

  this.hidePreloader = function() {
    console.log('hide preloader');
    /*
    preloader.unbind();
    preloader.removeClass('active');
    preloader.addClass('hidden');
    */
    console.log(preloader);
    preloader.fadeOut(250);
  };

    /**
     * Returns the id of the active tab
     */
    this.getActiveTabId = function(){
        return $filterBar.find('nav ul li.active a').data('id');
    };

    /**
     * Sets the active tab
     */
    this.setActiveTab = function(id){
        currentId = id;
        // clear active classes and add it to current element
        $('li', $filterBar).removeClass('active');

        //Selecting the correct one
        $filterBar.find('nav ul li a[data-id='+id+']').parent().addClass('active');

    };

    /**
     * Finds an element by an attribute
     */
    this.findElementByAttr = function(attr, value){
        return this.domElement.find('['+attr+'='+value+']');
    };

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

SixtyMins.View.SixtyMinsOvertime.prototype = new SixtyMins.View.Base();