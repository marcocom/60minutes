
SixtyMins.Controller.CorrespondentDetails = function() {
	
	var callbacks          = {};
	
	//Will store the model for this view
	var _model             = null;
	
	//Check if is initialized
	var isInitialized      = false;
	
	//Opened correspondant 
	this.openedCorrespondent = '';
	
	/**
	 * Initializes the Correspondent Details
	 */
	this.postInitialize = function() {
	    	    
		// create elements
		_model = SixtyMins.Lookup.getModel('CorrespondentsGrid');
	
	}  
    
    /**
     * Gets a new data set and redraws the view
     */ 
    this.refreshData = function(data){
        
        this.getView().showPreloader();    
        this.getModel().getCorrespondantGridData(data.url, callbacks.populateGrid, this);        
        this.getView().setData(data);
        this.getView().draw();        
        
    };
    
    this.getModel = function() {
        return _model;
    }    
    
    this.onShow = function() {
	}
    
    /**
     * Callback function for when the correspondent's grid data are loaded
     */
    callbacks.populateGrid = function(result){        
        
        this.getView().createGrid(result.videos.video);
        this.getView().hidePreloader();
        
    }

    this.callbacks = callbacks;
	
}

SixtyMins.Controller.CorrespondentDetails.prototype = new SixtyMins.Controller.Base();
