describe("Promise", function() {

	describe("constructor", function() {

		it("does not require arguments", function() {
			var promise = new Promise();

			expect(promise.promiser).toBe(null);
		});

		it("takes a \"promiser\" object, which is the object making the promise", function() {
			var x = {};
			var promise = new Promise(x);

			expect(promise.promiser).toBe(x);
		});

	});

	describe("callbackDefined", function() {

		var TestPromise = Promise.create(["success", "error", "complete"]),
		    instance;

		beforeEach(function() {
			instance = new TestPromise();
		});

		it("returns true if a sub class has defined a callback", function() {
			expect(instance.callbackDefined("success")).toBe(true);
		});

		it("returns false if a sub class has not defined that callback", function() {
			expect(instance.callbackDefined("I_do_not_exist")).toBe(false);
		});

		it("returns false for methods that exist on the Promise class, but not defined as a callback", function() {
			expect(instance.callbackDefined("destructor")).toBe(false);
			expect(instance.callbackDefined("fulfill")).toBe(false);
		});

	});

	describe("fulfill", function() {

		var TestPromise = Promise.create(["success", "error", "complete"]);

		it("throws an error if no arguments are given", function() {
			var promise = new TestPromise();

			expect(function() {
				promise.fulfill();
			}).toThrow(new Error("The first argument to Promise#fulfill must be the name of the promise to fulfill"));
		});

		it("fulfills a promise by the given name if one exists", function() {
			var o = {
				test: function() {}
			};
			spyOn(o, "test");

			var promise = new TestPromise();
			promise.success(o.test);
			promise.fulfill("success");

			expect(o.test).toHaveBeenCalled();
		});

		it("passes the promiser to all the callbacks as the last argument", function() {
			var x = {};

			var o = {
				test: function(promiser) {
					expect(promiser).toBe(x);
				}
			};
			spyOn(o, "test").and.callThrough();

			var promise = new TestPromise(x);
			promise.success(o.test);
			promise.fulfill("success");

			expect(o.test).toHaveBeenCalled();
		});

		it("invokes callbacks with the given context", function() {
			var x = {};

			var context = {
				test: function(promiser) {
					expect(this).toBe(context);
				}
			};
			spyOn(context, "test").and.callThrough();

			var promise = new TestPromise(x);
			promise.success(context.test, context);
			promise.fulfill("success");
		});

		it("passes arbitrary arguments on to the callbacks", function() {
			var x = {};
			var a = {}, b = false, c = 32;

			var context = {
				test: function(arg1, arg2, arg3, promiser) {
					expect(this).toBe(context);
					expect(arg1).toBe(a);
					expect(arg2).toEqual(b);
					expect(arg3).toEqual(c);
					expect(promiser).toBe(x);
				}
			};
			spyOn(context, "test").and.callThrough();

			var promise = new TestPromise(x);
			promise.success(context.test, context);

			promise.fulfill("success", a, b, c);
		});

		describe("before callbacks have been added", function() {

			it("caches the fulfilled promise until a callback has been added by that name", function() {
				var promiser = {};

				var context = {
					test: function() {}
				};
				spyOn(context, "test");

				var promise = new TestPromise(promiser);

				promise.fulfill("success");

				expect(promise._pendingCallbacks.success instanceof Object).toBe(true);
				expect(promise._pendingCallbacks.success.args instanceof Array).toBe(true);
				expect(promise._pendingCallbacks.success.args.length).toEqual(2);
				expect(promise._pendingCallbacks.success.args[0]).toBe(promiser);
				expect(promise._pendingCallbacks.success.args[1]).toBe(promise);

				promise.success(context.test);

				expect(context.test).toHaveBeenCalledWith(promiser, promise);
			});

		});

	});

	describe("create", function() {

		it("throws an error if no arguments are passed", function() {
			expect(function() {
				Promise.create();
			}).toThrow(new Error("Missing required argument: callbackNames (Array<String>)"));
		});

		it("sub classes Promise with just callback names", function() {
			var ChildPromise = Promise.create(["success", "error"]);
			var x = new ChildPromise({});

			expect(x instanceof ChildPromise).toBe(true);
			expect(x instanceof Promise).toBe(true);
			expect(typeof x.success).toBe("function");
			expect(typeof x.error).toBe("function");
			expect(typeof ChildPromise.create).toBe("function");
			expect(typeof ChildPromise.prototype.success).toBe("function");
			expect(typeof ChildPromise.prototype.error).toBe("function");
			expect(typeof Promise.prototype.success).toBe("undefined");
			expect(typeof Promise.prototype.error).toBe("undefined");
		});

		it("sub classes a Promise sub class", function() {
			var ChildPromise = Promise.create(["a"]);
			var GrandChildPromise = ChildPromise.create(["b"]);
			var x;

			expect(typeof ChildPromise.prototype.a).toBe("function");
			expect(typeof ChildPromise.prototype.b).toBe("undefined");
			expect(typeof Promise.prototype.b).toBe("undefined");

			expect(typeof GrandChildPromise.prototype.a).toBe("function");
			expect(typeof GrandChildPromise.prototype.b).toBe("function");
			expect(typeof ChildPromise.prototype.b).toBe("undefined");
			expect(typeof Promise.prototype.b).toBe("undefined");

			x = new GrandChildPromise({});

			expect(typeof ChildPromise.prototype.a).toBe("function");
			expect(typeof ChildPromise.prototype.b).toBe("undefined");
			expect(typeof Promise.prototype.b).toBe("undefined");

			expect(typeof GrandChildPromise.prototype.a).toBe("function");
			expect(typeof GrandChildPromise.prototype.b).toBe("function");
			expect(typeof ChildPromise.prototype.b).toBe("undefined");
			expect(typeof Promise.prototype.b).toBe("undefined");

			expect(x instanceof GrandChildPromise).toBe(true);
			expect(x instanceof ChildPromise).toBe(true);
			expect(x instanceof Promise).toBe(true);
		});

	});

	it("allows you to chain calls to a promise", function() {
		var ctx = {
			success: function() {
				expect(this).toBe(ctx);
			},
			fail: function() {
				expect(this).toBe(ctx);
			},
			complete: function() {
				expect(this).toBe(ctx);
			}
		};

		var TestPromise = Promise.create(["success", "fail", "complete"]);
		var promise = new TestPromise();

		spyOn(ctx, "success");
		spyOn(ctx, "fail");
		spyOn(ctx, "complete");

		promise
			.context(ctx)
			.success(ctx.success)
			.fail(ctx.fail)
			.complete(ctx.complete);

		promise
			.fulfill("success")
			.fulfill("complete");

		expect(ctx.success).toHaveBeenCalled();
		expect(ctx.fail).not.toHaveBeenCalled();
		expect(ctx.complete).toHaveBeenCalled();
	});

});