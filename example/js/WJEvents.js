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
			_add.call(this, 'on', eventName, callback);
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
			_add.call(this, 'once', eventName, callback);
		},
		/**
		 * Trigger the event with optional arguments

		 * @method trigger
		 * @param {string} eventName - Name of the event that has to be triggered
		 * @param {object} [params] - Extra parameters to be set as argument array for callback functions
		 * @return null
		 */
		trigger: function(eventName){
			_trigger.apply(this, arguments);
			
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
			_off.call(this, eventName, callback);
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
	var _add = function(where, eventName, callback){
		if(_legal("string",eventName) && _legal("function",callback)) {
			if (!this._events) this._events = {};
			if (!this._events[where]) this._events[where] = {};
			if (!this._events[where][eventName]) this._events[where][eventName] = [];

			if (_exist(this._events[where], eventName, callback) === false) this._events[where][eventName].push(callback);			
		}
	};

	var _trigger = function(eventName){
		var args = Array.apply(null,arguments);
		args.shift();
		if(_legal("string",eventName) && this._events) {
			if (this._events.on && this._events.on[eventName]){
				for (var i=0; i < this._events.on[eventName].length; i++) this._events.on[eventName][i].apply(this._events.on[eventName][i], args);
			}
			if (this._events.once && this._events.once[eventName]) while (this._events.once[eventName][0]){ 
				var f = this._events.once[eventName].shift();
				f.apply(f,args);
			}
		}
	};

	var _off = function(eventName, callback){
		if(_legal("string",eventName) && this._events){
		    if(_legal("function",callback)){
		        if(this._events.on){
			        var i = _exist(this._events.on, eventName, callback);
			        if (i !== false) this._events.on[eventName].splice(i, 1);
			    }
			    if(this._events.once){
			        i = _exist(this._events.once, eventName, callback);
			        if (i !== false) this._events.once[eventName].splice(i, 1);
			    }
		    } else if(callback === undefined){

		        if (this._events.on) delete this._events.on[eventName];
		        if (this._events.once) delete this._events.once[eventName];
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