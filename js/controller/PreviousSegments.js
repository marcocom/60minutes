
SixtyMins.Controller.PreviousSegments = function() {

	var firstShow = true;
	var rootURL = '/htdocs/60minutesapp/previous-segments/';

	var me = this;


	/**
	 * Initialies the Grid
	 */
	this.postInitialize = function() {
		// create elements
		SixtyMins.ControllerManager.initialize('PreviousSegmentsGrid');

		SixtyMins.ViewManager.show('PreviousSegmentsGrid', $('.grid', this.getView().getDOMElement()));


	}

	this.onDataUpdate = function(){

	    this.data.firstState = false;

	    if(this.data.pathSegments.length > 0){

	       if(this.data.pathSegments[0] != ""){

	           if(this.data.pathSegments.length >= 1){

	               var $element = this.getView().findElementByAttr('data-friendly-url', this.data.pathSegments[0]);
	               this.getView().setActiveTab($element.data('id'));
               }

               if(this.data.pathSegments[1] == "video"){
                   SixtyMins.Lookup.getController('PreviousSegmentsGrid').setVideoToLoadOnInitialize(this.data.pathSegments[2]);
               } else {

                 SixtyMins.Lookup.getView('PreviousSegmentsGrid').deactivateVideo();
               }

	       } else {

	         this.getView().setActiveTab(0);
             SixtyMins.Lookup.getView('PreviousSegmentsGrid').deactivateVideo();

	       }
	    }

	    SixtyMins.Lookup.getController('PreviousSegmentsGrid').showCategory(this.getView().getActiveTabId());


	}

	this.onShow = function() {

		if(firstShow)
		{
			firstShow = false;
			SixtyMins.Lookup.getController('PreviousSegmentsGrid').showCategory(this.getView().getActiveTabId());

		}


	}

	this.onHide = function() {


	}

	this.getOpenedTab = function(){

	    return this.getView().openedTab;
	}




}

SixtyMins.Controller.PreviousSegments.prototype = new SixtyMins.Controller.Base();