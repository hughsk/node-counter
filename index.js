/*global require, module*/
var EventEmitter = require('events').EventEmitter;

(function(module){
"use strict";

/**
 * Watches changes to its value and emits an event when complete.
 * 
 * @param {Number} startValue The initial value of the counter.
 */
var Counter = function (startValue, options) {
	if (!(this instanceof Counter)) {
		return new Counter(startValue, options);
	}
	this.options = options || {};
	this.options.target = Number(this.options.target) || 0;
	this.options.once = !!this.options.once;

	this.value = 0;
	this.ready = !!this.options.ready;

	EventEmitter.prototype.constructor.apply(this, arguments);
};
Counter.prototype = new EventEmitter();

Object.defineProperty(Counter.prototype, 'value', {
	get : function() {
		return this.realValue || 0;
	},
	set : function(newValue) {
		if (this.realValue != newValue) {
			this.emit('changed', newValue, this.realValue);
		}
		this.realValue = newValue;

		if (this.ready && this.realValue === this.options.target) {
			this.emit('target', this.realValue);
			
			if (this.options.once) {
				this.ready = false;
			}
		}
	}
});

Counter.prototype.start = function() {
	this.ready = true;
	this.value = this.value;
	return this;
};


module.exports = Counter;

}(module));