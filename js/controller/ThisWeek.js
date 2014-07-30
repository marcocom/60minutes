
SixtyMins.Controller.ThisWeek = function() {

	this.videoToShowOnShow = null;

	var segments = null,

		callbacks = {

			populateMainSegments : function(_segments) {
				segments = _segments;

				// call to view to render segments
				this.getView().renderMainSegments(segments);
			}

		}
	;

	this.changeBackground = function(path) {

	};

	this.onBeforeShow = function(){
        this.getView().showSideBar();
	}

	this.onDataUpdate = function() {

		if(this.data.pathSegments && this.data.pathSegments.length) {

			if(this.data.pathSegments[0] == 'video') {

				// get the id
				var id = this.data.pathSegments[1];

				// send it to the view
				this.videoToShowOnShow = id;

				//If we clicked on the back button
				//and the first segment is video
				//then show the video
				if(!this.data.firstState){
					if(this.videoToShowOnShow) {
						this.getView().triggerVideo(this.videoToShowOnShow);
						this.videoToShowOnShow = null;
					}
				}

			} else {
				//If we clicked on the back button and the first
				//segment is not video the close any opened video
				if(!this.data.firstState){

					$logo.removeClass('show-back');
					$logo.removeClass('active');

					SixtyMins.Lookup.getController('Video').hideVideo();
					SixtyMins.Lookup.getView('Panel').closePanel();

					// hide side panel
					SixtyMins.Lookup.getController('VideoSidebar').close();

					this.getView().showSideBar();

				}

			}
		} else {

			$logo.removeClass('show-back');
			$logo.removeClass('active');

			SixtyMins.Lookup.getController('Video').hideVideo();
			SixtyMins.Lookup.getView('Panel').closePanel();

			// hide side panel
			SixtyMins.Lookup.getController('VideoSidebar').close();

		}

		this.data.firstState = false;
	}

	this.onShow = function() {

		// enforce that we hide the logo
		$("#top-logo").removeClass('active');

		// close the panel
		SixtyMins.Lookup.getView('Panel').closePanel();

		// and show the sidebar
		this.getView().showSideBar();
		this.getView().startCarousel();

		if(this.videoToShowOnShow) {
			this.getView().triggerVideo(this.videoToShowOnShow);
			this.videoToShowOnShow = null;
		}
	}

	/**
	 * Constructor
	 **/
	this.postInitialize = function() {

		this.getModel().getMainSegments(callbacks.populateMainSegments, this);

	}

	this.onHide = function() {

		this.getView().stopCarousel();


	}
}

SixtyMins.Controller.ThisWeek.prototype = new SixtyMins.Controller.Base();