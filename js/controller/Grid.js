
SixtyMins.Controller.Grid = function() {
	
	/**
	 * FIXME
	 **/
	this.delegate = function(scope, method) {

		var fn = function() {
			var target = arguments.callee.target;
			var func = arguments.callee.func;
			return func.apply(target, arguments);
		};

		fn.target = scope;
		fn.func = method;
		return fn;

	};

	/**
	 * Initializes the view
	 **/
	this.postInitialize = function() {
//		this.getView().clearOldGrid();
//		this.getView().
		this.getView().draw();
		
	};

}; // end of class

SixtyMins.Controller.Grid.prototype = new SixtyMins.Controller.Base();