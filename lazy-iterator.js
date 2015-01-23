(function(){
	function node(value){
		return {
			value: value,
			next: undefined,
			prev: undefined
		}
	}

	function Queue(){
		var head, ass, length = 0;
		this.add = function(value){
			var nd = node(value);
			if (length === 0){
				head = ass = nd;
			} else {
	 			nd.next = ass;
	 			ass.prev = nd;
	 			ass = nd;
			}

			length++;
		}

		this.pop = function(){
			if (length === 0){
				throw new Error("Cannot pop");
			} else {
				var rval = head.value;
				if (length === 1){
					head = ass = undefined;
				} else {
					head.prev.next = undefined;
					head = head.prev;
				}

				length--;
				return rval;
			}
		}

		this.isEmpty = function(){
			return length === 0;
		}

		Object.defineProperty(this, "length", {
			get: function(){
				return length;
			},
			set: function(value){
				throw new Error("Readonly property");
			}
		});
	}

	function Stream(){
		var fulfillers 	= new Queue();
		var values		= new Queue();
		var done		= false;

		var update = function(){
			while(!fulfillers.isEmpty() && !values.isEmpty()){
				var win = fulfillers.pop(), value = values.pop();
				win({
					done: false,
					value: value
				});
			}

			if (done){
				while (!fulfillers.isEmpty()){
					var win = fulfillers.pop();
					win({
						done: true,
						value: undefined
					});
				}
			}
		}

		this.close = function(){
			done = true;
			update();
		}

		this.send = function(value){
			if (done){
				return;
			}
			values.add(value);
			update();
		}

		this.next = function(){
			return new Promise(function(win, fail){
				fulfillers.add(win);
				update();
			});
		}

		this.nextValue = function(){
			var prom = this.next();
			prom.then(function(wf){
				return wf.value;
			})
		}

		Object.defineProperty(this, "closed", {
			get: function(){
				return done;
			},
			set: function(value){
				throw new Error("Readonly property");
			}
		});
	}

	if (window !== undefined){
		window.Stream = Stream;
	} else {
		module.exports = Stream;
	}
})();