(function(root){
	//_____Public_Helper_Function___________________________________________________________________/
	var Extend = root.extend = function (d, b) { // extends taken function from typescript
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
		function __() { this.constructor = d; }
		d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};

	//_____Public___________________________________________________________________________________/
	var WJEvents = root.WJEvents = {
		/**
		 * Add function to event list
		 *
		 * @method on
		 * @param {string} eventName - Name of the event the function has to listen to
		 * @param {function} callback - Function that has te be triggered on the event
		 * @return null
		 */
		on: function(eventName, callback){
			_add(this, 'on', eventName, callback);
		},
		/**
		 * Add function to event once list
		 *
		 * @method once
		 * @param {string} eventName - Name of the event the function has to listen to
		 * @param {function} callback - Function that has te be triggered on the event
		 * @return null
		 */
		once: function(eventName, callback){
			_add(this, 'once', eventName, callback);
		},
		/**
		 * Trigger the event with optional arguments

		 * @method trigger
		 * @param {string} eventName - Name of the event that has to be triggered
		 * @param {object} [params] - Extra parameters to be set as argument array for callback functions
		 * @return null
		 */
		trigger: function(eventName){
			if(_legal("string",eventName) && this._events) {
				var args = Array.apply(null, arguments);
				args.shift();

				var fns = ( this._events.on && this._events.on[eventName] )? this._events.on[eventName].concat() : [];
				if( this._events.once && this._events.once[eventName] ){
					fns = fns.concat(this._events.once[eventName]);
				}
				_trigger(fns, args);
			}
		},
		/**
		 * Removes function from the event list and once list
		 *
		 * @method off
		 * @param {string} eventName - Name of the event the function has to be removed from
		 * @param {function} [callback] - Function that has to be removed from the list
		 * @return null
		 */
		off: function(eventName, callback){
			_off(this, eventName, callback);
		},
		/**
		 * Removes all callback functions and events from the main object
		 *
		 * @method kill
		 * @return null
		 */
		kill: function(){
			delete this._events;
		}
	};

	//_____Private__________________________________________________________________________________/
	var _add = function(ctx, where, eventName, callback){
		if(_legal("string",eventName) && _legal("function",callback)) {
			if (!ctx._events) ctx._events = {};
			if (!ctx._events[where]) ctx._events[where] = {};
			if (!ctx._events[where][eventName]) ctx._events[where][eventName] = [];

			if (_exist(ctx._events[where], eventName, callback) === false) ctx._events[where][eventName].push(callback);			
		}
	};

	var _trigger = function(fns, args){
		for(var i=0; i<fns.length; i++) fns[i].apply(fns[i], args);
	}

	var _off = function(ctx, eventName, callback){
		if(_legal("string",eventName) && ctx._events){
		    if(_legal("function",callback)){
		        if(ctx._events.on){
			        var i = _exist(ctx._events.on, eventName, callback);
			        if (i !== false) ctx._events.on[eventName].splice(i, 1);
			    }
			    if(ctx._events.once){
			        i = _exist(ctx._events.once, eventName, callback);
			        if (i !== false) ctx._events.once[eventName].splice(i, 1);
			    }
		    } else if(callback === undefined){
		        if (ctx._events.on) delete ctx._events.on[eventName];
		        if (ctx._events.once) delete ctx._events.once[eventName];
		    }
		}
	};

	//_____Private_Helpers__________________________________________________________________________/
	var _exist = function(list, eventName, callback){
		if (list[eventName]) for(var i=0; i<list[eventName].length; i++){
			if (list[eventName][i] === callback) return i;
		}
		return false;
	};

	var _legal = function(type,item){
		if(item) switch(type){
			case "string":
				return item.constructor === String;
				break;
			case "function":
				return item.constructor === Function;
				break;
			case "array":
				return item.constructor === Array;
				break;
			default:
				break;
		}
		return false;
	};
}(this));