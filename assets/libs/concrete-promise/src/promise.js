(function() {

	function createCallback(Klass, name) {
		if (name in Klass.prototype) {
			throw new Error("A callback named '" + name + "' has already been defined");
		}

		Klass.prototype[name] = function __PromiseCallback(func, context) {
			if (this._pendingCallbacks[name]) {
				var info = this._pendingCallbacks[name];
				func.apply(context || this.ctx || null, info.args);
				this._pendingCallbacks[name] = info = null;
			}
			else {
				this._callbacks[name] = { fn: func, context: context || null };
			}

			return this;
		};
	}

	function Promise(promiser) {
		this.promiser = promiser || null;
		this.ctx = null;
		this._callbacks = {};
		this._pendingCallbacks = {};
	}

	Promise.create = function create(ParentPromise, callbackNames) {
		if (!arguments.length) {
			throw new Error("Missing required argument: callbackNames (Array<String>)");
		}
		else if (!callbackNames) {
			callbackNames = ParentPromise;
			ParentPromise = Promise;
		}

		function ChildPromise() {
			ParentPromise.apply(this, arguments);
		}

		ChildPromise.create = function create(x) {
			return Promise.create(ChildPromise, x);
		};

		ChildPromise.prototype = new ParentPromise();
		ChildPromise.prototype.constructor = ChildPromise;

		for (var i = 0, length = callbackNames.length; i < length; i++) {
			createCallback(ChildPromise, callbackNames[i]);
		}

		return ChildPromise;
	};

	Promise.prototype = {

		_callbacks: null,

		_pendingCallbacks: null,

		promiser: null,

		constructor: Promise,

		destructor: function destructor() {
			var key;

			if (this._callbacks) {
				for (key in this._callbacks) {
					if (!this._callbacks.hasOwnProperty(key)) {continue;}
					this._callbacks[key] = null;
				}

				this._callbacks = null;
			}

			if (this._pendingCallbacks) {
				for (key in this._pendingCallbacks) {
					if (!this._pendingCallbacks.hasOwnProperty(key)) {continue;}
					this._pendingCallbacks[key] = null;
				}

				this._pendingCallbacks = null;
			}

			this.promiser = null;
		},

		callbackDefined: function callbackDefined(name) {
			return (this.__proto__[name] && this.__proto__[name].name === "__PromiseCallback") ? true : false;
		},

		context: function context(ctx) {
			this.ctx = ctx;

			return this;
		},

		fulfill: function fulfill() {
			if (arguments.length === 0) {
				throw new Error("The first argument to Promise#fulfill must be the name of the promise to fulfill");
			}

			var name = arguments[0],
			    callback = this._callbacks[name],
			    args = Array.prototype.slice.call(arguments, 1, arguments.length) || [];

			args.push(this.promiser, this);

			if (callback) {
				callback.fn.apply(callback.context || this.ctx || null, args);
			}
			else {
				this._pendingCallbacks[name] = { args: args };
			}

			return this;
		}

	};

	window.Promise = Promise;

})();
