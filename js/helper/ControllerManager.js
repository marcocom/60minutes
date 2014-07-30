
SixtyMins.ControllerManager = new function() {
	
	var newController;
	this.data = null
	
	
	this.initialize = function(name, data) {
	
		this.data = data;

		newController = SixtyMins.Lookup.getController(name);			

		// base initialization			
		newController.initialize(name, data);			
					
		// class-specific initialization
		if($.isFunction(newController.postInitialize)) {
			newController.postInitialize();				
		}

		return newController;
	};
	
};