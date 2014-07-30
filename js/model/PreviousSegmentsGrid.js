
SixtyMins.Model.PreviousSegmentsGrid = function() {
	
	var url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=';

	var categoryId = '',
	
		data = {},
	
		callbacks = {
			getAllData : function() {
				this.feedLatest(this.getData());
			}
		}
	;

	this.initialize = function() {

	}

	/**
	 * Get the recent 
	 **/
	this.getData = function(callback, context, start) {
		
		// Check for a start ID
		start = (start != false && typeof(start) != "undefined") ? start : 0;
		// Concatenate categoryId
		var fullURL = url.replace("{{start}}",start) + categoryId; 

		//TODO: we need to stop loading old one or continue but in background, without view update
		
		return this.retrieveData(fullURL, callback, context);
	};

	this.setCategory = function(id) {
		
		categoryId = id;
	};
	
	this.feedLatest = function(data) {	
		

	};


}; // end of class

SixtyMins.Model.PreviousSegmentsGrid.prototype = new SixtyMins.Model.Base();