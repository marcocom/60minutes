
SixtyMins.Controller.Navigation = function() {
	
	this.change = function(target, url, animate) {
		
		// we have received the call to shift
		// the page so inform the PageHolder Controller
		SixtyMins.Lookup.getController('PageHolder').slideTo(target, animate);
		
		// have the route manager store the change
		if(url && url != location.pathname) {
			SixtyMins.RouteManager.pushState(null, null, url);
		}
		
		
		
	};
	
	this.updateData = function(target, data) {
		SixtyMins.Lookup.getController('PageHolder').updateData(target, data);
	}
}

SixtyMins.Controller.Navigation.prototype = new SixtyMins.Controller.Base();