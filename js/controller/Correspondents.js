
SixtyMins.Controller.Correspondents = function() {

  this.correspondentDetailsVisible = false;

  var $logo          = $("#top-logo");

  /**
   * Initialies the Grid
   */
  this.postInitialize = function() {

    SixtyMins.ControllerManager.initialize('CorrespondentsGrid');

    SixtyMins.ViewManager.show('CorrespondentsGrid', $('.grid', this.getView().getDOMElement()));

    SixtyMins.ControllerManager.initialize('CorrespondentDetails');

  }

  this.resetScroll = function() {
    SixtyMins.Lookup.getController('CorrespondentsGrid').resetScroll();
  }

  /**
   * Triggered by PageHolder just before sliding to the view
   */
  this.onBeforeShow = function() {

    this.resetScroll();

    if( this.correspondentDetailsVisible === true  && this.data.firstState != true) {

      this.hideCorrespondentDetails( false );
    }

	this.data.firstState = false;
  }

  this.onShow = function() {
    SixtyMins.Lookup.getController('CorrespondentsGrid').initializeView();
    //this.hideCorrespondentDetails(true);
  }

  this.onHide = function() {
    //this.hideCorrespondentDetails( false );
  }

  this.onDataUpdate = function() {

    //console.log(this.data);

    if(this.data.pathSegments.length && this.data.pathSegments.length > 0 ) {

      var targetUrlParameter = this.data.pathSegments[0];

      if(targetUrlParameter != "") {

        //Check if we want to see a video
        if(this.data.pathSegments.length > 1 ){
            if(this.data.pathSegments[1] == 'video'){
                SixtyMins.Lookup.getView('CorrespondentDetails').videoToShowOnInitialize = this.data.pathSegments[2];
            }
        }

        //console.log(targetUrlParameter);

        this.showCorrespondentDetails(targetUrlParameter, false);

      } else {

        this.hideCorrespondentDetails(false);

      }

    }
  }

  /**
   * Function for showing the Correspondant details
   */

  this.showCorrespondentDetails = function(url, animate) {

    var index = 0;

    this.correspondentDetailsVisible = true;

    if(animate == undefined || animate == null) {
      animate = true;
    }

    //Get the data from the Corespondents Grid
    var targetData = SixtyMins.Lookup.getModel('CorrespondentsGrid').getData();

    for(d = 0; d < targetData.length; d++){

        if(targetData[d].url == url){
            index = d;
        }
    }

    //Get the id of the correspondant and refresh the data
    SixtyMins.Lookup.getController('CorrespondentDetails').openedCorrespondent = url;
    SixtyMins.Lookup.getController('CorrespondentDetails').refreshData(targetData[index]);

    //Show the details
    SixtyMins.Lookup.getView('CorrespondentDetails').show(animate);

    //Hide the corespondants
    SixtyMins.Lookup.getView('CorrespondentsGrid').hide(animate);

  }

  this.hideCorrespondentDetails = function(animate) {

    this.correspondentDetailsVisible = false;

    if(animate == undefined || animate == null) {
      animate = true;
    }

    //Show the correspondents
    SixtyMins.Lookup.getView('CorrespondentsGrid').show(animate);
    //Hide the details
    SixtyMins.Lookup.getView('CorrespondentDetails').hide(animate);

    // must show the logo back
    $logo.addClass('active');


  }

}

SixtyMins.Controller.Correspondents.prototype = new SixtyMins.Controller.Base();