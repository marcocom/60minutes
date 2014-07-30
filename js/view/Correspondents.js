
SixtyMins.View.Correspondents = function(name) {
	
	this.setName(name);
	this.domElement = $("#correspondents");
	
	var $detailsWrapper        = this.domElement.find('.correspondent-details-container'),
	    $gridWrapper           = this.domElement.find('.grid'); 
	
	this.draw = function() {
	    
	}
}

SixtyMins.View.Correspondents.prototype = new SixtyMins.View.Base();