
SixtyMins.Controller.Video = function() {

	var fullScreen = true;
	var doAutoMute = false;
	var doAutoPlay = false;

	var normalSize = {
		width : 950,
		height : 640
	};
	var fullSize = {
		width : '100%',
		height : '100%'
	};

	var me = this;
	// reference to video object
	var videoObj = null;

	// reference to view
	var view = null;

	var hasFinished;
	var isPaused;
	var hasSource;
	var showingEndScreen;

	/**
	 * list of objects with data to be used in the player, first is the current
	 * video, rest is the list to be displayed in the end screen
	 */
	var dataSet;
	var dataCallback;
	var dataContext;
	var endScreenData;
	var currentData;
	
	var delayPlayTimeoutID;
	var delayPlayAmount = 3000;

	var isVideoShown = false;

	this.showVideo = function() {

		isVideoShown = true;
		
		this.getView().activateVideo();
	}

	this.hideVideo = function() {

		isVideoShown = false;
		
		this.getView().deactivateVideo();
		this.getView().disableUI();
		
		clearTimeout(delayPlayTimeoutID);
	}

	this.getIsVideoShown = function() {

		return isVideoShown;
	}

	this.getCurrentVideoID = function() {

		if (dataSet && dataSet.length) {
			var dataItem = dataSet[0];

			return dataItem.id;
		}
		return -1;
	}

	/**
	 * videoDataObject: { id: items id 
	 * thumbURL: path
	 * title
	 * date text
	 * to thumb image, also used in grid title: title to display date: string
	 * describing date }
	 */

	this.postInitialize = function() {

		view = this.getView();

		videoObj = view.getVideo()[0];

		this.reset();
	}

	/**
	 * clears/pauses video object
	 */

	this.reset = function() {

		isPaused = true;
		hasSource = false;
		hasFinished = false;
		showingEndScreen = false;

		view.pauseVideo();
		view.setSource(null);
		//view.hideVideo();
		view.reset();
		
		clearTimeout(delayPlayTimeoutID);
	}

	/**
	 * callback for all the events coming from view
	 */

	this.notify = function(type, data) {

		switch (type) {

		case 'READY':
			this.playVideo(true, false);
			break;

		case 'VIDEO_WAITING':
			break;

		case 'VIDEO_CANPLAY':
			break;

		case 'VIDEO_METADATA':

			// we know the size of the video so we can adjust it's size and show
			// it
			resizeView();
			//view.showVideo();

			if (doAutoMute === true) {
				view.mute();
			}
			break;

		case 'VIDEO_PLAY':

			if (showingEndScreen) {
				showingEndScreen = false;
				view.hideEndScreen(true);
			}

			isPaused = false;
			break;

		case 'VIDEO_PAUSE':

			isPaused = true;
			break;

		case 'VIDEO_END':

			isPaused = true;
			hasFinished = true;

			showingEndScreen = true;
			view.showEndScreen(endScreenData);
			break;

		case 'FULLSCREEN_TOGGLE':

			fullScreen = !fullScreen;
			resizeView();
			break;

		case 'VIDEO_REQUEST':
			
			var id = data;
			var newDataSetNextPrev;
			
			if (dataContext && dataCallback) {
				
				var newDataSet = dataCallback.apply(dataContext, [id]);
				
				this.setData(newDataSet, dataCallback, dataContext);
				this.playVideo(true, false);
				
				newDataSetNextPrev = newDataSet.concat();
				newDataSetNextPrev.shift();
				
				SixtyMins.Lookup.getController('VideoSidebar').show(id, false, 'watching', newDataSetNextPrev);
			}
			else
			{
				// we will cycle through the items
				
				//set current as first
				while(dataSet[0].id != data)
				{
					var item = dataSet.shift();
					dataSet.push(item);
				}
				
				this.setData(dataSet);
				this.playVideo(true, false);
				
				newDataSetNextPrev = dataSet.concat();
				newDataSetNextPrev.shift();
				
				SixtyMins.Lookup.getController('VideoSidebar').show(id, false, 'watching', newDataSetNextPrev);
			}
			break;
		}
	}

	this.setData = function(dataList, dataByIDCallback, dataByIDCallbackContext) {

//		console.log('controller.video', 'setData', dataList, typeof dataByIDCallback, dataByIDCallbackContext);

		dataSet = dataList;

		dataCallback = dataByIDCallback;
		dataContext = dataByIDCallbackContext;

		endScreenData = dataSet.concat();
		endScreenData.shift();
	}

	/**
	 * plays the video using given URL
	 * 
	 * @param url
	 *            address of the video file
	 * @param autoplay
	 * @param automute -
	 *            this functionality not seem to work, it is video object bug so
	 *            it is better to set it to false
	 */

	this.playVideo = function(autoplay, automute) {
		
		view.disableUI();
		view.clearVideo();
		view.showPreloader();

		currentData = dataSet[0];

		if (currentData) {

			SixtyMins.LocalStorageManager.videoWasWatched(currentData.id);

//			console.log('controller.video', 'playVideo:', currentData.id);

			if (showingEndScreen) {
				showingEndScreen = false;
				view.hideEndScreen();
			}

			doAutoMute = automute;
			doAutoPlay = autoplay;

			SixtyMins.DataManager.getVideoDetails(currentData.id, doVideoPlay);
		}
	}

	function doVideoPlay(data) {

		// console.log('controller.video', 'doVideoPlay', data, data.Id, data.VideoUrl);

		if (data.VideoUrl) {
			view.setSource(data.VideoUrl);

//			if (doAutoPlay === true) {
//				videoObj.play();
//			}

			if (doAutoMute === true) {
				
				view.mute();
			}
			
			clearTimeout(delayPlayTimeoutID);
			delayPlayTimeoutID = setTimeout(delayedPlay, delayPlayAmount);
		}
		else
		{
			//TODO: here we may want to show user some kind of modal window
			//console.log("DATA FEED ERROR: no video URL !!!");
		}
	}
	
	function delayedPlay(){
//		console.log('controller.video', 'delayedPlay');
		
		view.enableUI();
		view.hidePreloader();
		
		videoObj.play();
	}

	/**
	 * adjust video object to current video player size, it needs to adjust
	 * scale while keeping ratio and move the whole object to the center
	 */

	this.adjustToResized = function() {

		view.adjustVideo();
	}

	/**
	 * method toggles size of the player it uses object with width and height
	 * properities
	 */

	function resizeView() {

		if (fullScreen) {
			view.setSize(fullSize);
		} else {
			view.setSize(normalSize);
		}
	}
}

SixtyMins.Controller.Video.prototype = new SixtyMins.Controller.Base();