
SixtyMins.ViewManager = new function() {
	
	var currentView = new SixtyMins.View.Base(), newView;
	
	/**
	 * Shows a view
	 */
	this.show = function(name, container) {
	
		container = container || document.body;

		try {
			newView = SixtyMins.Lookup.getView(name);
			
			var newViewDOMElement = $(newView.getDOMElement());
			if(!newViewDOMElement.parent().length) {
				$(container).append(newViewDOMElement);
			}
			
			currentView.hide();
			newView.show();
			
		} catch(e) {
			console.log("View does not exist: " + name);
		}
		
	};
	
	/**
	 * Appends one view to another
	 */
	this.appendToView = function(name, view)
	{
		// get the view to append to from the lookup
		var viewToAppendTo = SixtyMins.Lookup.getView(name);
		
		// add in the view's DOM element
		$(view.getDOMElement()).appendTo(viewToAppendTo.getDOMElement());
	}
};