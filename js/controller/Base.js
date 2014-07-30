
SixtyMins.Controller.Base = function() {
	
	var _view, _model;

	this.data = {};
	
	this.name = '';

	this.initialize = function(name, data) {

		this.name = name;
		this.data = data || {};
		
		// get a reference to view
		_view = SixtyMins.Lookup.getView(name);
		
		// get a reference to the model
		_model = SixtyMins.Lookup.getModel(name);

		// ask it to draw
		_view.draw();
	}

	this.getView = function() {
		return _view;
	}

	this.getModel = function() {
		return _model;
	}
	
	this.updateData = function(newData) {
		
		// use jQuery to merge in the new data
		this.data = $.extend(this.data, newData);
		
		// update the inheriting controller
		if($.isFunction(this.onDataUpdate)) {
			this.onDataUpdate();
		}
	}
}