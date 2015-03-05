$(function() {
    var requestAnimationFrame = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback, element) {
            return window.setTimeout(function() {
                return callback();
            }, 1000 / 60);
        };
    })();

    var queue = [];
    var step = function() {
        queue.forEach(function(f) {
            f();
        });
        requestAnimationFrame(step);
    };
    requestAnimationFrame(step);

    var target = {
        x: 0,
        y: 0
    };

    var timer;
    $(document).on('mousemove', function(event) {
        if (timer) return;
        timer = setTimeout(function() {
            timer = null;
        }, 100);
        target.x = event.pageX;
        target.y = event.pageY;
    });

    function new_stalker() {
        var message = location.search.length > 1 ? decodeURIComponent(location.search.replace(/^\?text=/, '')) : '★';
        if (message.length > 1) {
            message = message[Math.floor(Math.random() * message.length)];
        }
        var $star = $('<div>')
            .text(message)
            .css({
                position: 'absolute',
                color: "hsl(" + (Math.random()*360) + ", 100% ,50%)"
            })
            .appendTo('body');

        var current = {
            x: Math.random() * 1000,
            y: Math.random() * 1000
        };
        var vector = {
            x: 0,
            y: 0
        };
        var speed = 2.0;
        var friction = 0.99;

        var step = function() {
            var tan = (target.y - current.y) / (target.x - current.x);
            var theta = Math.atan(tan);
            if (target.x - current.x < 0) theta += Math.PI;

            vector.x += Math.cos(theta) * speed;
            vector.y += Math.sin(theta) * speed;

            vector.x *= friction;
            vector.y *= friction;

            current.x += vector.x;
            current.y += vector.y;

            $star.css({
                left: Math.floor(current.x) + 'px',
                top:  Math.floor(current.y) + 'px'
            });
        };

        queue.push(step);

    };

    var t;
    $(document).on('mousedown', function () {
        t = setInterval(new_stalker, 10);
    });
    $(document).on('mouseup', function () {
        clearInterval(t);
    });
});
