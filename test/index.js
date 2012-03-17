var counter = require('../index.js'),
	assert = require('assert');

suite('Counter', function() {
	test('Readme Example-ish', function(done) {
		var count = counter(0), i, total = 0;

		for (i = 0; i < 100; i += 1) {
			count.value += 1;
			setTimeout(function() {
				total += 1;
				count.value -= 1;
			}, 1 + Math.random()*20);
		}

		count.on('target', function(count) {
			assert.equal(total, 100);
			assert.equal(count, 0);
			done();
		}).start();
	});
	test('Triggered if the counter meets the target on start()', function(done) {
		var count = counter(0);

		count.on('target', function(count) {
			assert.equal(count, 0);
			done();
		}).start();
	});
	suite('options.target', function() {
		test('Non-zero target', function(done) {
			var count = counter(0, { target: 10 }),
				i, l = 10;

			for (i = 0; i < l; i += 1) {
				setTimeout(function() {
					count.value += 1;
				}, 1 + Math.random() * 20);
			}

			count.on('target', function(count) {
				assert.equal(count, 10);
				done();
			}).start();
		});
	});
	suite('options.once', function() {
		test('true:  Only calls once', function(done) {
			var count = counter(0, { target: 1, once: true });

			count.on('target', function(count){
				done();
			}).start();

			count.value = 1;
			count.value = 1;
		});
		test('false: Calls multiple times', function(done) {
			var count = counter(0, { target: 1, once: false }),
				beenOnce = false;

			count.on('target', function(count) {
				if (beenOnce) {
					done();
				}
				beenOnce = true;
			}).start();

			count.value = 1;
			count.value = 1;
		});
	});
	test('event: changed', function(done) {
		var count = counter(10, { target: 0 }),
			changes = 0;

		count.on('changed', function() {
			changes += 1;
		}).on('target', function() {
			assert.equal(changes, this.options.target);
			done();
		}).start();
	});
});