
SixtyMins.Model.ThisWeek = function() {
	
	var url = 'http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeRecSeg?partTag=60Chrome&sortDesc=true&categoryIds=504143,504144,504145,504146,504147,504148,504483,504865&viewType=json';
	
	var data 	  = {},
		callbacks = {},
		that 	  = this
	;

	this.initialize = function() {
	}

	/**
	 * Get this week segments
	 **/
	this.getMainSegments = function(callback, context) {

		this.retrieveData(url, callback, context, "CNETResource");
		// var data = this.retrieveData("thisWeek", callback, context);
		// this.cleanData( data );

	};

	this.cleanData = function(data) {
		// return data["recentSegments"]["recentSegment"];
	};

}; // end of class

SixtyMins.Model.ThisWeek.prototype = new SixtyMins.Model.Base();