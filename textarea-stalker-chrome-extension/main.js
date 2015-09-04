var app = {
    "now_pos_top": undefined,
    "now_pos_left": undefined,
    "EXPAND": 5,
    "DEFAULT_WIDTH": 200,
    "DEFAULT_HEIGHT": 80,
    "rotate_degree": 0,
    "target_element": undefined
}

app.get_random_color = function() {
    var r = Math.floor(Math.random() * 255).toString(16);
    var g = Math.floor(Math.random() * 255).toString(16);
    var b = Math.floor(Math.random() * 255).toString(16);
    return "#" + r + g + b;
}

app.memory_pos_now = function(left, top) {
    app.now_pos_top = top;
    app.now_pos_left = left;
}

app.compute_pos_diff = function(left, top) {
    // 保持されている値
    var p_top = app.now_pos_top || top;
    var p_left = app.now_pos_left || left;
    // 値を更新
    app.memory_pos_now(left, top);
    return [Math.abs(left - p_left), Math.abs(top - p_top)];
}

app.num_to_px = function(n) {
    return n + "px";
}

app.toggle = function(f) {
    if(f === "off") {
        return "on";
    }
    return "off";
}

// obj を (x, y) の位置に移す
app.stalk = function(left, top, obj) {
    var diff_lt = app.compute_pos_diff(left, top);
    var l = app.DEFAULT_WIDTH + (app.EXPAND * diff_lt[0]);
    var t = app.DEFAULT_HEIGHT + (app.EXPAND * diff_lt[1]);

    obj.style.top = app.num_to_px(top - t/2);
    obj.style.left = app.num_to_px(left - l/2);
    obj.style.width = app.num_to_px(l);
    obj.style.height = app.num_to_px(t);

    obj.className = "on";
}

// objのvalueをその場に固定する
app.str_lock = function(left, top, obj) {
    if(obj.value !== "") {
        var span = document.createElement("span");
        span.style.position = "fixed";
        span.style.top = app.num_to_px(top);
        span.style.left = app.num_to_px(left);
        span.innerHTML = (obj.value).replace(/\n/g, "<br>");
        span.style.color = app.get_random_color();
        span.style.transform = "rotate(-"+ app.rotate_degree +"deg)";

        document.querySelector("body").appendChild(span);
        obj.value = "";
        app.rotate_degree = 0;
        obj.style.transform = "rotate(-"+ app.rotate_degree +"deg)";
    }
}

app.create_ufo = function() {
    var obj = document.createElement('textarea');
    obj.id = "ms_ufo";
    obj.class = "off";
    obj.placeholder = "Switch focus: Ctrl";
    obj.style.zIndex = 1000;

    var parent = document.querySelector("body");
    var firstc = parent.firstChild;
    parent.insertBefore(obj, firstc);
    app.target_element = document.querySelector("#ms_ufo");
}

window.addEventListener("keyup", function(e) {
    var obj = document.querySelector("#ms_ufo");
    app.rotate_degree = obj.value.length;
    obj.style.transform = "rotate(-"+ app.rotate_degree +"deg)";
}, false);

window.addEventListener("keydown", function(e) {
    var obj = document.querySelector("#ms_ufo");
    if(e.ctrlKey) {
        obj.style.zIndex = (+obj.style.zIndex === 0) ? 1000 : 0;
    }
}, false);

window.addEventListener("mousemove", function(e) {
    var obj = app.target_element;
    var w = obj.clientWidth / 2 - 15;
    var h = obj.clientHeight / 2 - 15;

    app.str_lock(
        (app.now_pos_left || e.clientX) - w,
        (app.now_pos_top  || e.clientY) - h,
        obj
    );
    app.stalk(e.clientX, e.clientY, obj);
}, false);

window.addEventListener("load", app.create_ufo, false);
