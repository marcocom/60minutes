
SixtyMins.Model.SixtyMinsOvertime = function() {
	           
	var url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&categoryIds=504803&viewType=json';
	
	var data 	  = {},
		callbacks = {},
		that 	  = this
	;

	this.initialize = function() {
		
	};

	/**
	 * Get the 60OT FD feed
	 **/
	this.getOtSegments = function(callback, context) {		
        
		this.retrieveData(url, callback, context, "CNETResource");

	};

}; // end of class

SixtyMins.Model.SixtyMinsOvertime.prototype = new SixtyMins.Model.Base();