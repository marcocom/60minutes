
SixtyMins.Controller.SixtyMinsOvertime = function() {

  var firstShow             = true;
  var currentId             = 0;

  var $filterBar            = $('#sixty-minutes-overtime .filter-bar');

  var me                    = this,
  segments                = null
  ;

  this.isGridVisible        = false;
  this.rootURL              = '/htdocs/60minutesapp/60-minutes-overtime';

  /**
   * Initialies the Grid
   */
  this.postInitialize = function() {
    // create elements
    //SixtyMins.ControllerManager.initialize('SixtyMinsOvertimeGrid');

    //SixtyMins.ViewManager.show('SixtyMinsOvertimeGrid', $('.grid', this.getView().getDOMElement()));

    this.getModel().getOtSegments(callbacks.populateOtSegments, this);

    //console.log("Post init on 60 Mins Overtime Controller", callbacks);

  };

  this.triggerGrid = function() {

    // tell the Controller grid is visible
    this.isGridVisible = true;

    // initialize the grid
    if(firstShow) {
      firstShow = false;
      SixtyMins.ControllerManager.initialize('SixtyMinsOvertimeGrid');
    }

    if(SixtyMins.RouteManager.currentPath !== undefined) {

      if(SixtyMins.RouteManager.currentPath[0] === "" || SixtyMins.RouteManager.currentPath[0] === "video"){
        SixtyMins.RouteManager.pushState(null,null, this.rootURL + '/' + this.getView().openedTab);
      }

    } else {

      SixtyMins.RouteManager.pushState(null,null, this.rootURL + '/' + this.getView().openedTab);

    }

    // tell the View to show
    SixtyMins.ViewManager.show('SixtyMinsOvertimeGrid', $('.grid', this.getView().getDOMElement()));

    $('.grid', '#sixty-minutes-overtime').show().css('opacity', 1);
    // $('.grid', '#sixty-minutes-overtime').fadeIn();

    SixtyMins.Lookup.getView('SixtyMinsOvertimeGrid').doResize();

    $('#sixty-minutes-overtime').removeClass('hidden').addClass('active');

    //Get the lement that should be active
    $element = this.getView().findElementByAttr('data-friendly-url', SixtyMins.RouteManager.currentPath[0]);
    //If there is an element
    if($element.length == 1){
      SixtyMins.Lookup.getController('SixtyMinsOvertimeGrid').showCategory($element.data('id'));
    } else {
      SixtyMins.Lookup.getController('SixtyMinsOvertimeGrid').showCategory(this.getView().getActiveTabId());
    }

    // fadeIn the filter-bar
    $filterBar.show().addClass('opaque');

  };

  this.hideGrid = function() {

    this.isGridVisible = false;

    $filterBar.fadeOut();

    $(['.preloader', '#sixty-minutes-overtime']).removeClass('active');

    $('.grid', '#sixty-minutes-overtime').css('opacity', '0').hide();

  };

  this.onDataUpdate = function(){

    if (this.data.pathSegments.length) {

      //If there is a value on the first segment of the
      //deep linking
      if (this.data.pathSegments[0] !== "") {

        // trigger the grid
        //this.triggerGrid();

        //If we have one or more segments
        if(this.data.pathSegments.length >= 1){

          //If the first segment is not video
          if(this.data.pathSegments[0] != "video"){

            // hide the sidebar
            this.getView().doCloseSidebar();

            // show the logo
            $logo.addClass('active');

            var $element = this.getView().findElementByAttr('data-friendly-url', this.data.pathSegments[0]);
            this.getView().openedTab = $element.data('friendly-url');
            this.getView().setActiveTab($element.data('id'));

          } else {

            //it is video so show it
            var id = this.data.pathSegments[1];
            var view = this.getView();
            setTimeout(function(){
              view.triggerVideo(id);
            }, 1000);


          }

        }

        //If the second segment is video it means that
        //we want to show a video from an overtime category
        if(this.data.pathSegments[1] == "video"){

            // hide the sidebar
          this.getView().doCloseSidebar();

          // show the logo
          $logo.addClass('active');

          SixtyMins.Lookup.getController('SixtyMinsOvertimeGrid').setVideoToLoadOnInitialize(this.data.pathSegments[2]);

        } else if(this.data.pathSegments[0] != "video" ) {
          SixtyMins.Lookup.getView('SixtyMinsOvertimeGrid').deactivateVideo();

        }

      //No segments so hide video
      } else {

        SixtyMins.Lookup.getView('SixtyMinsOvertimeGrid').deactivateVideo();

        // Show main page of the 60 mins overtime
        this.getView().startCarousel();
        this.showSideBar();
        this.hideGrid();

        // fadeOut the background
        $('.backgrounds-ot').removeClass('hidden');

        setTimeout(function(){
          $('.backgrounds-ot').removeClass('inactive');
        }, 200);

        $("#top-ot-logo").removeClass('show-back');
        $("#top-ot-logo").removeClass('active');

      }

    }

  };

  this.onBeforeShow = function() {
    // check here if it's in the grid or not
    if (this.isGridVisible) {
      $("#top-ot-logo").addClass('active');
    }
    else {
      this.getView().showSideBar();
    }

  };

  this.onShow = function() {

    if(!this.data.firstState)
    {
      this.getView().startCarousel();

      this.showSideBar();
      this.hideGrid();

      // fadeOut the background
      $('.backgrounds-ot').removeClass('hidden');

      setTimeout(function(){
      $('.backgrounds-ot').removeClass('inactive');
      }, 200);

      $("#top-ot-logo").removeClass('show-back');
      $("#top-ot-logo").removeClass('active');
    }

    this.data.firstState = false;

  };

  this.onHide = function() {

    // enforce that we hide the logo
    $("#top-ot-logo").removeClass('active');

    this.getView().stopCarousel();

    this.hideGrid();

  };

  this.showSideBar = function() {

    this.getView().showSideBar();

  };

  var callbacks = {

    populateOtSegments : function(_segments) {

      // console.log(_segments);

      segments = _segments;

      // call to view to render segments
      this.getView().renderOtSegments(segments);
    }

  };

};

SixtyMins.Controller.SixtyMinsOvertime.prototype = new SixtyMins.Controller.Base();