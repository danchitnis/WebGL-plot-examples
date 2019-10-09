"use strict";
/**
 * Author Danial Chitnis 2019
 */
exports.__esModule = true;
var webgl_plot_1 = require("@danchitnis/webgl-plot");
var webgl_plot_2 = require("@danchitnis/webgl-plot");
var webgl_plot_3 = require("@danchitnis/webgl-plot");
var noUiSlider = require("nouislider");
var Statsjs = require("stats.js");
var canv = document.getElementById("my_canvas");
var devicePixelRatio = window.devicePixelRatio || 1;
var num = Math.round(canv.clientWidth * devicePixelRatio);
//let num=1000;
var stats = new Statsjs();
stats.showPanel(0);
document.body.appendChild(stats.dom);
var line_num = 100;
var yscale = 1;
var line_colors;
var lines;
var wglp;
var fps_divder = 1;
var fps_counter = 0;
var new_num = 10;
var line_num_list = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
//sliders
var slider_lines = document.getElementById('slider_lines');
var slider_yscale = document.getElementById('slider_yscale');
var slider_new_data = document.getElementById('slider_new_data');
var slider_fps = document.getElementById('slider_fps');
noUiSlider.create(slider_lines, {
    start: [0],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 0,
        max: 11
    }
});
noUiSlider.create(slider_yscale, {
    start: [1],
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 0.01,
        max: 10
    }
});
noUiSlider.create(slider_new_data, {
    start: [1],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 1,
        max: 100
    }
});
noUiSlider.create(slider_fps, {
    start: [1],
    step: 1,
    connect: [true, false],
    //tooltips: [false, wNumb({decimals: 1}), true],
    range: {
        min: 1,
        max: 10
    }
});
slider_lines.noUiSlider.on("update", function (values, handle) {
    line_num = line_num_list[parseFloat(values[handle])];
    document.getElementById("display_lines").innerHTML = line_num.toString();
});
slider_lines.noUiSlider.on("set", function (values, handle) {
    init();
});
slider_yscale.noUiSlider.on("update", function (values, handle) {
    yscale = parseFloat(values[handle]);
    document.getElementById("display_yscale").innerHTML = yscale.toString();
});
slider_new_data.noUiSlider.on("update", function (values, handle) {
    new_num = parseFloat(values[handle]);
    document.getElementById("display_new_data_size").innerHTML = new_num.toString();
});
slider_fps.noUiSlider.on("update", function (values, handle) {
    fps_divder = parseFloat(values[handle]);
    document.getElementById("display_fps").innerHTML = (60 / fps_divder).toString();
});
var resizeId;
window.addEventListener('resize', function () {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});
init();
function new_frame() {
    if (fps_counter == 0) {
        stats.begin();
        plot(new_num);
        wglp.scaleY = yscale;
        wglp.update();
        stats.end();
    }
    fps_counter++;
    if (fps_counter >= fps_divder) {
        fps_counter = 0;
    }
    window.requestAnimationFrame(new_frame);
}
window.requestAnimationFrame(new_frame);
function plot(shift_size) {
    var _loop_1 = function (i) {
        lines.forEach(function (line) {
            line.xy.set(i, 1, line.xy.get(i + shift_size, 1));
        });
    };
    for (var i = 0; i < num - shift_size; i++) {
        _loop_1(i);
    }
    lines.forEach(function (line) {
        var y = random_walk(line.xy.get(num - 1, 1), shift_size);
        for (var i = 0; i < shift_size; i++) {
            line.xy.set(i + num - shift_size, 1, y[i]);
        }
    });
}
function random_walk(init, walk_size) {
    var y = new Float32Array(walk_size);
    y[0] = init + 0.01 * (Math.round(Math.random()) - 0.5);
    for (var i = 1; i < walk_size; i++) {
        y[i] = y[i - 1] + 0.01 * (Math.round(Math.random()) - 0.5);
    }
    return y;
}
function init() {
    line_colors = [];
    lines = [];
    for (var i = 0; i < line_num; i++) {
        line_colors.push(new webgl_plot_2.color_rgba(Math.random(), Math.random(), Math.random(), 0.5));
        lines.push(new webgl_plot_3.lineGroup(line_colors[i], num));
    }
    wglp = new webgl_plot_1.webGLplot(canv);
    lines.forEach(function (line) {
        wglp.add_line(line);
    });
    console.log(num);
    var _loop_2 = function (i) {
        //set x to -num/2:1:+num/2
        lines.forEach(function (line) {
            line.xy.set(i, 0, 2 * i / num - 1);
            line.xy.set(i, 1, 0);
        });
    };
    for (var i = 0; i < num; i++) {
        _loop_2(i);
    }
}
function doneResizing() {
    wglp.viewport(0, 0, canv.width, canv.height);
    console.log(window.innerWidth);
}
