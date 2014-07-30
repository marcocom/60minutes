
SixtyMins.Model.SixtyMinsOvertimeGrid = function() {
	          
	var url = '';//http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start=0&limit=50&viewType=json&categoryIds=';
	//var urlSecondary = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start=0&limit=50&viewType=json&secondaryCategoryIds=';
	
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
		var fullURL = url.replace("{{start}}",start); 

		/*var fullURL = '';
		
		if(categoryId == "504863" || categoryId =="504865"){
		    
		   fullURL = urlSecondary + categoryId;
		        
		} else {
		    
		    fullURL = url + categoryId;
		    
		}*/		 
        
		return this.retrieveData(fullURL, callback, context);
	};

	this.setCategory = function(id) {
		
		categoryId = id;
		//console.log(categoryId);
		
		switch(categoryId) {
			
			// recent
			case 0: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=504803&secondaryCategoryIds=504863,504864,504865';
				break;
			
			//case 0: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504803&viewType=json&limit=50&start=0';
			//	break;
			
			// overtime originals
			case 1: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=504803&secondaryCategoryIds=504864';
					break;
			
			// correspondent candids		
			case 2: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=504803&secondaryCategoryIds=504863';
					break;
			
			//60 rewind		
			case 3: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=504803&secondaryCategoryIds=504865';
					break;
			
			// full episodes
			case 4: url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromePreSeg?partTag=60Chrome&orderBy=productionDate&sortDesc=true&start={{start}}&limit=50&viewType=json&categoryIds=504903';
					break;
		}
	};
	
	this.feedLatest = function(data) {	
		

	};


}; // end of class

SixtyMins.Model.SixtyMinsOvertimeGrid.prototype = new SixtyMins.Model.Base();