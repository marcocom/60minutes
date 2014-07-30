
SixtyMins.Controller.SixtyMinsOvertimeGrid = function() {

	this.cachedData = [];
    this.isInitalized = false;

	var recent = null,
		currentId,
		segments,
		me = this,
		parsedDataSet,
        videoToLoadOnInitialize = null,
		xhr,


	callbacks = {

		populate : function(_segments) {

		    this.getView().clearGrid();

            console.log(_segments);
			segments = _segments;

			parsedDataSet = [];

			if(segments.CNETResponse.videos["@numReturned"] > 0) {

                var videos = segments.CNETResponse.videos.video;

                for(var i = 0; i< videos.length; i++)
                {

                    var sourceItem = videos[i];

                    //Getting the title
                    var title = '';
                    try{

                        title = sourceItem.Title.$;
                        if($.isArray(title)){
                            title = title.join("");
                        }

                    } catch (errr){
                        title = '';
                    }

                    //Get the image @aspectRatio
                    var image = '';

                    try{
                        if($.isArray(sourceItem.Images.Image))
                        {
                            if(sourceItem.Images.Image.length == 1)
                            {
                            image = sourceItem.Images.Image[0].ImageURL.$;
                            }
                            else
                            {
                                for(d = 0; d < sourceItem.Images.Image.length; d++){

                                    if(sourceItem.Images.Image[d]['@aspectRatio'] == '4:3'){
                                      image =  sourceItem.Images.Image[d].ImageURL.$;
                                    }
                                }

                                if(image === ''){
                                    image = sourceItem.Images.Image[0].ImageURL.$ ;
                                }
                            }
                        }
                        else
                        {
                            image = sourceItem.Images.Image.ImageURL.$;
                        }

                    } catch (err) {
                        image = '';
                    }

                    //Get the date
                    var date = '';
                    try {
                        date = createDateString(sourceItem.ProductionDate.$.split(' ')[0]);
                    } catch (errrr){
                        date = '';
                    }

                    var id = sourceItem['@id'];

                    var dataItem = {
                        id: id,
                        title: title,
                        thumbURL: image,
                        date: date,

                        viewed:SixtyMins.LocalStorageManager.wasVideoWatched(id)
                    };

                    parsedDataSet.push(dataItem);
                }

                var cachedItems = jQuery.extend(true, {}, _segments);

                if(me.cachedData['c'+currentId] === null || me.cachedData['c'+currentId] === undefined){
                    me.cachedData['c'+currentId] = cachedItems;
                }
            }

			this.getView().setData(parsedDataSet);
			this.getView().draw();

            this.isInitalized = true;
            this.getView().triggerClickForElementWithId(videoToLoadOnInitialize);

            SixtyMins.Lookup.getView('SixtyMinsOvertime').hidePreloader();

		},

        repopulate : function(_segments) {
            
            SixtyMins.Lookup.getView('SixtyMinsOvertime').hidePreloader();
            segments = _segments;
            parsedDataSet = [];
            var videos = segments.CNETResponse.videos.video;                        
            for(var i = 0; i< videos.length; i++){
                var sourceItem = videos[i];
                
                //Getting the title
                var title = '';
                try{
                    title = sourceItem.Title.$;
                    if($.isArray(title)){
                        title = title.join("");
                    }
                } catch (err){
                    title = '';
                }

                //Get the image @aspectRatio
                var image = '';
                try{
                    if($.isArray(sourceItem.Images.Image)){
                        if(sourceItem.Images.Image.length == 1){
                            image = sourceItem.Images.Image[0].ImageURL.$;
                        } else {
                            for(d = 0; d < sourceItem.Images.Image.length; d++){
                                if(sourceItem.Images.Image[d]['@aspectRatio'] == '4:3'){
                                    image =  sourceItem.Images.Image[d].ImageURL.$;   
                                }
                            }
                            if(image == ''){
                                image = sourceItem.Images.Image[0].ImageURL.$ ;
                            }
                        }
                    } else {
                        image = sourceItem.Images.Image.ImageURL.$;
                    }
                } catch (err){
                    image = '';
                } 
                               
                //Get the date
                var date = '';
                try {
                    date = createDateString(sourceItem.ProductionDate.$.split(' ')[0]);
                } catch (err){
                    date = '';
                }
                var id = sourceItem['@id'];
                var dataItem = {
                    id: id,
                    title: title,
                    thumbURL: image,
                    date: date,
                    viewed:SixtyMins.LocalStorageManager.wasVideoWatched(id)
                };
                parsedDataSet.push(dataItem);
            }  
            var cachedItems = jQuery.extend(true, {}, _segments);
            if(me.cachedData['c'+currentId] == null || me.cachedData['c'+currentId] == undefined){
                me.cachedData['c'+currentId] = cachedItems;          
            }
            this.getView().setData(parsedDataSet);
            this.getView().draw();  
            this.isInitalized = true;
            this.getView().triggerClickForElementWithId(videoToLoadOnInitialize);           
        }

	};

    // expose callbacks
    this.callbacks = callbacks;

	function createDateString(inStr){

		var date = new Date(inStr);

        return SixtyMins.Lookup.getModel('Base').getMonth( date.getMonth() ) + " " + date.getDate() + ", " + date.getFullYear();
	}


	/**
	 * Initialies the Grid
	 */
	this.postInitialize = function() {
		//SixtyMins.ControllerManager.initialize('Grid', 'PreviousSegments');
	};

	this.showCategory = function(id){

		if(id != currentId)
		{
			this.getView().clearGrid();

			currentId = id;

			//If we have cached the data then we get it from the cache
			if(this.cachedData['c'+currentId] !== undefined && this.cachedData['c'+currentId] !== null){

                callbacks.populate.apply( this, [this.cachedData['c'+currentId]]);

            } else {

                if(xhr !== null && xhr !== undefined){
                    xhr.abort();
                }

                SixtyMins.Lookup.getView('SixtyMinsOvertime').showPreloader();
                this.getModel().setCategory(id);
                xhr = this.getModel().getData(callbacks.populate, this);

            }

		}
	};


    /**
     * Set the id for the video to load
     */
    this.setVideoToLoadOnInitialize = function(id){

        videoToLoadOnInitialize = id;

        if(this.isInitalized){
          this.getView().triggerClickForElementWithId(videoToLoadOnInitialize);
        }

    };

	this.updateViewed = function(){

		if(parsedDataSet)
		{
			for(var i = 0 ;i < parsedDataSet.length;i++)
			{
				parsedDataSet[i].viewed = SixtyMins.LocalStorageManager.wasVideoWatched(parsedDataSet[i].id);
			}

			me.getView().updateViewed(parsedDataSet);
		}
	};

};

SixtyMins.Controller.SixtyMinsOvertimeGrid.prototype = new SixtyMins.Controller.Base();
