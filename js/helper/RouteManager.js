
SixtyMins.RouteManager = new function() {

	this.currentPath			= null;

	var currentSectionPath		= null,
		me 						= this,
		firstState				= true,
		callbacks 				= {

		// callback when a state is popped off the history
		popstate: function(event) {

			// now we have popped off the first state
			// we should show the view
			if(firstState) {
				SixtyMins.Lookup.getView('PageHolder').makeVisible();
			}

			// get the section from the location path
			var pathData		= /(\/htdocs\/60minutesapp\/[^\/]*\/)(.*)/.exec(location.pathname);

			// check we have a valid path
			if(pathData && pathData.length == 3) {

				var	pathSection		= pathData[1],
					pathSubsection	= pathData[2];

				me.currentPath = pathData[2].split('/');

				SixtyMins.Lookup.getView('Navigation').updateData(pathSection, pathSubsection, firstState);

				// if this signifies a section change
				if(pathSection != currentSectionPath) {

					// have the navigation go that section, and pass through the rest of the
					SixtyMins.Lookup.getView('Navigation').simulateClick(pathSection, !firstState);

					// store for next time
					currentSectionPath = pathSection;

					// set the first state to false
					// so we don't care the next time
					firstState = false;

				}
			}
			else {
				// go to the default
				SixtyMins.Lookup.getView('Navigation').simulateClick("", !firstState);
			}
		}
	}

	this.pushState = function(state, title, url) {

		// grab the URL and parse it to work out which section
		// we have now gone to.
		var pathData		= /(\/htdocs\/60minutesapp\/[^\/]*\/)(.*)/.exec(url);

		// update the current section var
		if(pathData && pathData.length == 3) {
			currentSectionPath = pathData[1];
			me.currentPath = pathData[2].split('/');

		}

		history.pushState(state, title, url);

	}

	$(window).bind('popstate', callbacks.popstate);

}