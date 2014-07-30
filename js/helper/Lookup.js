
SixtyMins.Lookup = new function() {
	
	var _models 		= {},
		_views			= {},
		_controllers 	= {};
	
	this.getController = function(name) {
		
		try {
			if(!_controllers[name] && $.isFunction(SixtyMins.Controller[name])) {
				_controllers[name] = new SixtyMins.Controller[name](name);			
			}
		} catch(e) {
			console.log(name, e);
		}
		
		return _controllers[name];
	};
	
	this.getView = function(name) {
		
		try {
			if(!_views[name] && $.isFunction(SixtyMins.View[name])) {
				_views[name] = new SixtyMins.View[name](name);
			}
		} catch(e) {
			console.log(name, e);
		}
		
		return _views[name];
	};
	
	this.getModel = function(name) {
		
		try {
			if(!_models[name] && $.isFunction(SixtyMins.Model[name])) {
				_models[name] = new SixtyMins.Model[name](name);
			}
		} catch(e) {
			console.log(name, e);
		}
		
		return _models[name];
	};
	
};