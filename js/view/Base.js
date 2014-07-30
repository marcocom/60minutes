
SixtyMins.View.Base = function() {
	
	this.name = "Base";
	this.domElement = null;
	
	this.show = function() {
	}
	
	this.hide = function() {
	}
	
	this.setName = function(newName) {
		this.name = newName;
	}	
	
	this.getDOMElement = function() {
		return this.domElement;
	}
}