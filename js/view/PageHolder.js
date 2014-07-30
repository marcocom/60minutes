
SixtyMins.View.PageHolder = function(name) {
	this.setName(name);
	this.domElement = $('#page-container');
	
	this.draw = function() {
		
	}
	
	this.makeVisible = function() {
		this.domElement.css({visibility:"visible"});
		this.domElement.addClass('active');
	}
}

SixtyMins.View.PageHolder.prototype = new SixtyMins.View.Base();