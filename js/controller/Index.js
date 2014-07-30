
SixtyMins.Controller.Index = function() {
	
	this.postInitialize = function()
	{
		SixtyMins.ControllerManager.initialize('Navigation');
		SixtyMins.ControllerManager.initialize('PageHolder');
	}
}

SixtyMins.Controller.Index.prototype = new SixtyMins.Controller.Base();