
SixtyMins.Controller.VideoSidebar = function() {

	var me					= this,
		openMaximized		= false,
		defaultOpenedTab	= '',
		cache				= {}
	;

	this.postInitialize = function() {
		view = this.getView();
	};

	/**
	 * Loads the video data from the data manager
	 *
	 * @param videoId {string} - The video id
	 */
	this.updateData = function(videoId){

	   if(cache["Item"+videoId]) {
	      this.setData(cache["Item"+videoId], true);
	   } else {
	      SixtyMins.DataManager.loadVideoDetails(videoId, me.setData);
	   }
	};

	/**
	 * Updates the view with the newest data
	 *
	 * @param {object} - The data object that will be sent to the view
	 */
	this.setData = function(dataList, ignoreCache){

			if(dataList && dataList.Id && !ignoreCache) {
			cache["Item"+dataList.Id] = dataList;
		}

		view.hidePreloader();
		view.setData(dataList);
		view.updateView();
		view.setDefaultTab(defaultOpenedTab);

	};

	/**
	 * Should send the command to the view to close the panel
	 */
	this.close = function(){
        view.close();
	};

	/**
	 * Opens the panel
	 *
	 * @param videoId {string} - The video id
	 * @param maximized {boolean} - Maximize the panel or open it minimized
	 * @param defaultTab {string} - The default active tab. Acceptable values [watching, extras, overtime, story]
	 * @param extra {array} - Extra object that will be pushed in the video
	 */
	this.show = function(videoId, maximized, defaultTab, extra){

		openMaximized = maximized;
		defaultOpenedTab = defaultTab;

		if(!openMaximized) {
            view.minimize();
        } else{
            view.maximize();
        }

        view.showPreloader();

		view.setExtra(extra);
	    me.updateData(videoId);

		view.doResize();
	};

};

SixtyMins.Controller.VideoSidebar.prototype = new SixtyMins.Controller.Base();