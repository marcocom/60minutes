
SixtyMins.Controller.CorrespondentsGrid = function() {
	
    var isInitialized = false;

	/**
	 * Initialies the Grid
	 */
	this.postInitialize = function() {

		// create elements
		var model = SixtyMins.Lookup.getModel(this.name);		
		this.getView().setData(model.getData());
		
	}
	
	this.initializeView = function(){		
		
	    this.getView().draw();
	}

	this.resetScroll = function() {
		this.getView().resetScroll();
	}
}

SixtyMins.Controller.CorrespondentsGrid.prototype = new SixtyMins.Controller.Base();
