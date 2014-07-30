
SixtyMins.LocalStorageManager = new function() {
	//XXX: remove it
//	localStorage.removeItem("watchedVideos");
	
	var videos;
	
	if(!localStorage["watchedVideos"])
	{
		videos = {};
		
		localStorage.setItem("watchedVideos", JSON.stringify(videos));
	}
	else
	{
		videos = JSON.parse(localStorage.getItem("watchedVideos"));
	}
	
	this.getVideos = function(){
		
		return videos;
	}
	
	this.wasVideoWatched = function(id){
		
		return videos[id] == true;
	}
	
	this.videoWasWatched = function(id){
		
		videos[id] = true;
		// update value in
		localStorage.setItem("watchedVideos", JSON.stringify(videos));
	}
}