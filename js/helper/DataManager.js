
SixtyMins.DataManager = new function() {

    var cachedData  = [], // cache data for subsequent requests
        url         = "http://posidn-api.cnet.com/rest/v1.0/cbsNews60ChromeVideoDetail?videoIds={VIDEO_ID}&viewType=json";


    /*
    var templateDataObject          = {
        //video -> videos -> video -> @id
       Id : '50104187',
       //video -> videos -> video -> title
       Title : 'Is Zenyatta the best racehorse ever?',
       //video -> videos -> video -> description
       Description : 'With the greatest American horse race coming up next week in Kentucky',
       //video -> videos -> video -> production date
       ProductionDate : "2011-05-01 14:33:15.0",
       //video -> videos -> video -> VideoMedias -> videomedia -> DeliveryUrl //The video media is an array. Get the one that has a prefered property with value
       VideoUrl: "http://download.cbsnews.com/media/2011/05/01/60_zenyattapart2_501_1100.m4v",
        //video -> videos -> video -> VideoMedias -> videomedia -> width
       VideoWidth: 640,
        //video -> videos -> video -> VideoMedias -> videomedia -> height
       VideoHeight: 360,
       Images: [
            {
                //video -> videos -> video -> images -> image -> ImageURL
                ImageURL: "http://i.i.com.com/cnwk.1d/i/tim/2011/05/05/zenyatta_segmentRESIZE_360x203.jpg",
                //video -> videos -> video -> images -> image -> @width
                Width: 360,
                //video -> videos -> video -> images -> image -> @height
                Height: 203
            }
       ],
       Story: {
           // post -> posts -> post -> head -> $
           Title: 'Is Zenyatta the best racehorse ever?',
           // post -> posts -> post -> Publish Date -> $
           Body: '',
           PublishDate: '2011-05-01 16:53:58.0'
       },
       //extra -> videos -> video
       ExtraVideos : [
            //Same structure as video
       ],
       OvertimeVideos : [
            //Same structure as video
       ]
    }
    */

    function parseVideo(videoNode) {

      var videoObj = {
        Id              : videoNode['@id'],
        Title           : videoNode.Title ? videoNode.Title['$'] : undefined,
        VideoUrl        : undefined,
        VideoWidth      : undefined,
        VideoHeight     : undefined,
        Description     : videoNode.Description ? ($.isArray(videoNode.Description['$']) ? videoNode.Description['$'].join('') : videoNode.Description['$']) : undefined,
        ProductionDate  : videoNode.ProductionDate ? videoNode.ProductionDate['$'] : undefined,
        Images          : [],
        Cast            : ''

      };

        if(videoNode.Cast != undefined && videoNode.Cast != null ){
            if(videoNode.Cast.CastMember != null && videoNode.Cast.CastMember != undefined){
                videoObj.Cast = videoNode.Cast.CastMember['$'];
            }
        }

      // parse VideoMedia

      if(videoNode.VideoMedias.VideoMedia != undefined){

          var VideoMedia = videoNode.VideoMedias.VideoMedia;

          if($.isArray(VideoMedia)){
             VideoMedia = VideoMedia[0];
          }


          videoObj.VideoUrl     = VideoMedia.DeliveryUrl['$'];
          videoObj.VideoWidth   = VideoMedia.Width['$'];
          videoObj.VideoHeight  = VideoMedia.Height['$'];


          // parse Images
          for (var j in videoNode.Images.Image) {
            var Image = videoNode.Images.Image[j];
            videoObj.Images.push({
              ImageURL  : Image.ImageURL['$'],
              Width     : Image['@height'],
              Height    : Image['@width']
            });
          }

      } else {
          console.log('Malformed node: ',videoNode.VideoMedias)
      }

      return videoObj;

    }


    this.loadVideoDetails = function(videoId, callback) {

      //console.log(this,'loadVideoDetails',videoId, typeof callback);

      function parseResponse(data) {

        // parse feed into desired object
        //try {

          // parse root video object

          videoObj = parseVideo(data.video.Videos.Video);


          // add extra videos - sometimes an array, sometimes not... *sigh*
         videoObj.ExtraVideos = [];
          if ($.isArray(data.extra.Videos.Video)) {
            for (var i in data.extra.Videos.Video) {
              var ExtraVideo = data.extra.Videos.Video[i];
              // exclude main video from extras
              if (ExtraVideo['@id'] !== videoObj.Id) {
                var videoDataParsed = parseVideo(ExtraVideo);
                if(videoDataParsed.VideoUrl != undefined){
                    videoObj.ExtraVideos.push(videoDataParsed);
                }
              }
            }
          }
          else {
             if(data.extra.Videos.Video != undefined && data.extra.Videos.Video != null){
                 videoObj.ExtraVideos.push(parseVideo(data.extra.Videos.Video));
             }
          }


          // add overtime videos - sometimes an array, sometimes not... *sigh*
          videoObj.OvertimeVideos = [];
          if(data.ot !=null && data.ot != undefined){
              if ($.isArray(data.ot.Videos.Video)) {
                for (var i in data.ot.Videos.Video) {
                  var OvertimeVideo = data.ot.Videos.Video[i];
                  // exclude main video from extras
                  if (OvertimeVideo['@id'] !== videoObj.Id) {
                    videoObj.OvertimeVideos.push(parseVideo(OvertimeVideo));
                  }
                }
              }
              else {
                 if(data.ot.Videos.Video != undefined && data.ot.Videos.Video != null){
                     videoObj.OvertimeVideos.push(parseVideo(data.ot.Videos.Video));
                 }
              }
          }

          // add story to main video
          try
          {
          	if(data.post !=null && data.post != undefined){
	              if(data.post.Posts !=null && data.post.Posts != undefined){
                    var title = "";
                    if(typeof(data.post.Posts.Post.Head['$']) != "string"){
                      for(var i=0;i<data.post.Posts.Post.Head['$'].length;i++){
                        title += data.post.Posts.Post.Head['$'][i];
                      }
                    } else {
                      title = data.post.Posts.Post.Head['$']
                    }
                    videoObj.Story = {
	                    Title       : title,
	                    PublishDate : data.post.Posts.Post.PublishDate['$'],
	                    Body        : function () {
	                      var body = [];
	                      for (var i in data.post.Posts.Post.Pages.Page) {
	                        var Page = data.post.Posts.Post.Pages.Page[i];
	                        body.push(Page.Body['$'].join(''));
	                      }
	                      return body.join('',videoObj);
	                    }()
	                  }
	              }
	          }
          }
		  catch(e) {
			console.log("No story data");
		  }

          //console.log(this,'videoObj',videoObj);

          cachedData[videoId] = videoObj;
          callback(videoObj);
        //} catch (e) {
          // ERROR IN FEED!
          //throw e;
        	//console.log(this,'error',e, data);
        //}
      }

      // reuse ajax method in base model
      var targetURL = url.replace('{VIDEO_ID}', videoId);

      new SixtyMins.Model.Base().retrieveData(targetURL, parseResponse, this, 'CNETResponse');

    }


    /**
     * Loads video details from the API - store data in cache for subsequent calls
     * Callback is invoked with the video data object as the first param
     *
     * @param {int} videoId
     * @param {function} callback success callback
     * @return void
     */
    this.getVideoDetails = function(videoId, callback){

        if (!videoId || !callback) {
          throw "SixtyMins.DataManager.getVideoDetails() was called without videoId or callback function";
        }
        // If we have cached the object then get it from the cache
        if (cachedData[videoId] != null && cachedData[videoId] != undefined) {
          callback(cachedData[videoId]);
        }
        else {
          // load from API and store in cache
           this.loadVideoDetails(videoId, callback);
        }
    }

};