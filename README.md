# counter

A counter for Node, installed with `npm install counter`. Watches changes to its value and emits an event when it hits a target, and comes in handy when you're waiting on a large number of asynchronous operations but want a smaller callback queue in memory compared to using a control flow library or similar tool.

## Usage

In the example below, we create a counter and then loop over a number of files. The counter counts up for every file in the loop, and counts down when that file is loaded. Before the async calls are complete, we listen for the "target" event then start the counter. Once it hits zero again

    var counter = require('counter'),
        count = counter(0);
    
    files.each(function(err) {
        count.value += 1; 
        fs.readFile(function(err, value) {
            count.value -= 1;
        });
    });

    count.once('target', function() {
        console.log('We have read every file now');
    }).start();

By default the counter's target is zero, but you can change this with the `target` option. Additionally, you can disable the counter after it's first triggered with the `once` option.

    var counter = require('counter'),
        count = counter(0, { target: 5, once: true }),
        i, l = 5;

    count.on('target', function() {
        console.log('This is only called once');
    }).start();

    for (i = 0; i < l; i += 1) {
        count.value += 1;
    }

    count.value = 5;

If you didn't include the `once` option above, the counter would trigger twice.