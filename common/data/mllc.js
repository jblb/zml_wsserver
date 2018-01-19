'use strict';

var gServers = [
    {
        name: 'Test', // test
        url: 'ws:/192.168.0.107:81'
    },
    {
        name: 'Grosse caisse', // JoParrot
        url: 'ws:/192.168.2.18:81'
    },
    {
        name: 'Caisse claire', // Bird
        url: 'ws:/192.168.2.10:81'
    },
    {
        name: 'Sousaphone', // SkullyBeno
        url: 'ws:/192.168.2.12:81'
    },
    {
        name: 'Banjo', // FoxyNico
        //url: 'ws:/192.168.0.42:81',
        url: 'ws:/192.168.2.13:81'
    },
    {
        name: 'Trompette', // DedeBiabolo
        url: 'ws:/192.168.2.17:81'
    },
    {
        name: 'Trombone', // Jaguar
        url: 'ws:/192.168.2.15:81'
    },
    {
        name: 'Sax Baryton', // FilouDevil
        url: 'ws:/192.168.2.14:81'
    },
    {
        name: 'Danseur Sorcier', // Sorcerer
        url: 'ws:/192.168.2.11:81'
    },
    {
        name: 'Danseur BBoy', // DancySkull
        url: 'ws:/192.168.2.16:81'
    },
    {
        name: 'Bâton', // MiniJag
        url: 'ws:/192.168.2.19:81'
    },
];

function $(expr) {
    return document.querySelector(expr);
}

function $$(expr) {
    return Array.from(document.querySelectorAll(expr));
}

var CMD_DELAY = 100; // ms

var gLastCommandTime = 0;

function sendCommand(str, forceToAll) {
    var now = Date.now();
    if (now - gLastCommandTime < CMD_DELAY) {
        return;
    }
    gLastCommandTime = now;

    gServers.forEach(function(server) {
        if (server.websocket && server.websocket.readyState == WebSocket.OPEN) {
            if (forceToAll || (server.checkbox && server.checkbox.checked)) {
                server.websocket.send(str)
            }
        } else {
            updateStatus();
        }
    });
}

function updateStatus() {
    var nb_servers = gServers.length;
    var nb_servers_ok = 0;

    gServers.forEach(function(server) {
        if (server.websocket && server.websocket.readyState == WebSocket.OPEN) {
            nb_servers_ok++;
            if (server.status_box) {
                //server.status_box.innerHTML =
                //    server.name + ' : ' +
                //    '<span class="status-txt status-ok">OK</span>';
                server.status_box.className = 'status-txt status-ok';
                server.status_box.innerHTML = 'OK';
            }
        } else if (server.status_box) {
            server.status_box.innerHTML =
                //server.name + ' : ' +
                //'<span class="status-txt status-alert">KO</span>';
                server.status_box.className = 'status-txt status-alert';
                server.status_box.innerHTML = 'KO';
        }
    });

    var main_status_box = $('#main-status-box');
    if (!main_status_box)
        return;

    if (nb_servers_ok === 0) {
        main_status_box.innerHTML =
            '<big class="status-txt status-alert">! KO !</big>';
    } else if (nb_servers === nb_servers_ok) {
        main_status_box.innerHTML =
            '<big class="status-txt status-ok">OK</big>';
    } else if (nb_servers_ok < nb_servers) {
        main_status_box.innerHTML =
            '<big class="status-txt status-warning">warning !</big>';
    }
}

function rgb2hsl(r, g, b) {
    var h = 0, s = 0, l = 0;

    var r = r / 255;
    var g = g / 255;
    var b = b / 255;

    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var delta = max - min;

    var sum = max + min;
    l = Math.round(sum * 50);

    if (max == min) {
        s = 0
    } else {
        if (l <= 50)
            s = Math.round(100 * delta / sum);
        else
            s = Math.round(100 * delta / (2 - sum));
    }

    if (max == min)  {
        h = 0;
    } else if (max == r) {
        h = Math.round(60 * (g - b) / delta);
    } else if (max == g) {
        h = Math.round(120 + 60 * (b - r) / delta);
    } else if (max == b) {
        h = Math.round(240 + 60 * (r - g) / delta);
    }

    if (h < 0) h += 360;

    return {h: h, s: s, l: l};
}

function h2rgb(aV1, aV2, aH) {
    if (aH < 0) aH += 6;
    if (aH > 6) aH -= 6;

    if (aH < 1)
        return aV1 + (aV2 - aV1) * aH;
    if (aH < 3)
        return aV2;
    if (aH < 4)
        return aV1 + (aV2 - aV1) * (4 - aH);

    return aV1;
}

function hsl2rgb(h, s, l) {
    var r = 0, g = 0, b = 0;

    if (s == 0) {
        // gray
        r = g = b = Math.round(l * 2.55);

        return {r: r, g: g, b: b};
    }

    var hr = h / 60,
        sr = s / 100,
        lr = l / 100;

    var v2;
    if (l < 50)
        v2 = lr * (1 + sr);
    else
        v2 = lr + sr - lr * sr;

    var v1 = 2 * lr - v2;

    r = Math.round(255 * h2rgb(v1, v2, (hr + 2)));
    g = Math.round(255 * h2rgb(v1, v2, hr));
    b = Math.round(255 * h2rgb(v1, v2, (hr - 2)));

    return {r: r, g: g, b: b};
}

function hex(n) {
    var x = n.toString(16);
    if (x.length == 1)
        x = '0' + x;

    return x;
}

function rgb2hexa(r, g, b, a3digit) {
    var hex_r = hex(r);
    var hex_g = hex(g);
    var hex_b = hex(b);

    if (a3digit && hex_r[0] == hex_r[1] && hex_g[0] == hex_g[1]
        && hex_b[0] == hex_b[1]) {
        hex_r = hex_r[0];
        hex_g = hex_g[0];
        hex_b = hex_b[0];
    }

    return "#" + hex_r + hex_g + hex_b;
}

var gHSL_H_slider, gHSL_S_slider, gHSL_L_slider;
var gHSL_H_gradient, gHSL_S_gradient, gHSL_L_gradient;
var gColorsample, gColortext;

function _setHSLdata(h, s, l, ignore) {
    if (h === undefined || h === null) {
        h = gHSL_H_slider.value;
    } else {
        gHSL_H_slider.value = h;
    }
    if (s === undefined || s === null) {
        s = gHSL_S_slider.value;
    } else {
        gHSL_S_slider.value = s;
    }
    if (l === undefined || l === null) {
        l = gHSL_L_slider.value;
    } else {
        gHSL_L_slider.value = l;
    }
    if (ignore === undefined || ignore === null)
        ignore = {};

    if (! ('h' in ignore)) {
        gHSL_H_gradient.style.backgroundImage =
            'linear-gradient(to right, ' +
            'hsl(0, ' + s + '%, ' + l + '%), ' +
            'hsl(60, ' + s + '%, ' + l + '%) 16.66%, ' +
            'hsl(120, ' + s + '%, ' + l + '%) 33.33%, ' +
            'hsl(180, ' + s + '%, ' + l + '%) 50%, ' +
            'hsl(240, ' + s + '%, ' + l + '%) 66.66%, ' +
            'hsl(300, ' + s + '%, ' + l + '%) 83.33%, ' +
            'hsl(360, ' + s + '%, ' + l + '%) ' +
            ')';
    }

    if (! ('s' in ignore)) {
        gHSL_S_gradient.style.backgroundImage =
            'linear-gradient(to right, ' +
            'hsl(' + h + ', 0%, ' + l + '%), ' +
            'hsl(' + h + ', 100%, ' + l + '%) ' +
            ')';
    }

    if (! ('l' in ignore)) {
        gHSL_L_gradient.style.backgroundImage =
            'linear-gradient(to right, ' +
            'hsl(' + h + ', ' + s + '%, 0%), ' +
            'hsl(' + h + ', ' + s + '%, ' + l + '%) 50%, ' +
            'hsl(' + h + ', ' + s + '%, 100%) ' +
            ')';
    }

    gColorsample.style.backgroundColor = 'hsl(' + h + ',' + s + '%,' + l +  '%)';
    var rgb = hsl2rgb(h, s, l);
    var hexa = rgb2hexa(rgb.r, rgb.g, rgb.b);
    gColortext.innerHTML =
        'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')' + '<br>' +
        'hsl(' + h + ', ' + s + ', ' + l + ')' + '<br>' +
        hexa;
    sendCommand('color:' + hexa);
}

function setHSL_hue() {
    _setHSLdata(null, null, null, {h: true});
}

function setHSL_saturation() {
    _setHSLdata(null, null, null, {s: true});
}

function setHSL_lightness() {
    _setHSLdata(null, null, null, {l: true});
}

function init() {
    var textarea = $('#responses-textarea');
    //if (textarea) {
        textarea.style.display = 'none';
        textarea.value = '';
    //}
    var response_bt = $('#responses-bt');
    response_bt.addEventListener('click', function(e) {
        var textarea = $('#responses-textarea');
        var icon = $('#responses-bt-icon');
        if (textarea.style.display == 'none') {
            textarea.style.display = '';
            icon.innerHTML = '▲';
        } else {
            textarea.style.display = 'none';
            icon.innerHTML = '▼';
        }
    });

    var substatus_block = $('#substatus-block');
    substatus_block.style.display = 'none';
    var substatus_box = $('#substatus-box');
    gServers.forEach(function(server) {
        if (substatus_box) {
            server.status_block = document.createElement('div');
            server.status_block.className = 'substatus';
            server.status_block.innerHTML = server.name + ' : ';
            server.status_box = document.createElement('span');
            server.status_box.className = 'status-txt status-alert';
            server.status_box.innerHTML = 'KO';
            server.status_block.appendChild(server.status_box);
            server.checkbox = document.createElement('input');
            server.checkbox.type = 'checkbox';
            server.checkbox.checked = true;
            server.checkbox.className = 'status-cbox';
            server.status_block.appendChild(server.checkbox);
            substatus_box.appendChild(server.status_block);

            server.status_block.addEventListener('click', function(e) {
                if (e.target.nodeName && e.target.nodeName == 'INPUT')
                    return;
                server.checkbox.checked = !server.checkbox.checked;
            });
        }
        server.websocket = new WebSocket(server.url);
        server.websocket.addEventListener('open', function (evt) {
            updateStatus();
        });
        var sname = server.name;
        server.websocket.addEventListener('message', function (evt) {
            var textarea = $('#responses-textarea');
            if (textarea) {
                textarea.value =
                    (sname + ': ' + "\n" + evt.data + "\n\n" + textarea.value).
                    substr(0, 500);
            }
        });
    });

    $('#select-all-masks-bt').addEventListener('click', function() {
        gServers.forEach(function(server) {
            server.checkbox.checked = true;
        });
    });

    $('#unselect-all-masks-bt').addEventListener('click', function() {
        gServers.forEach(function(server) {
            server.checkbox.checked = false;
        });
    });

    var stati_bt = $('#stati-bt');
    if (substatus_box.children.length < 2)
        stati_bt.style.display = 'none';
    stati_bt.addEventListener('click', function(e) {
        //var substatus_box = $('#substatus-box');
        var substatus_block = $('#substatus-block');
        var icon = $('#stati-bt-icon');
        if (substatus_block.style.display == 'none') {
            substatus_block.style.display = '';
            icon.innerHTML = '▲';
        } else {
            substatus_block.style.display = 'none';
            icon.innerHTML = '▼';
        }
    });

    updateStatus();

    var mutable_bt = $('#mutable-cmd-bt');
    var mutable_input = $('#mutable-cmd-input');
    if (mutable_bt && mutable_input) {
        mutable_bt.addEventListener('click', function(evt) {
            var cmd = mutable_input.value;
            if (cmd)
                sendCommand(cmd);
        });
    }

    $$('.cmd-bt').forEach(function(elt) {
        elt.addEventListener('click', function(evt) {
            var cmd = this.getAttribute('data-cmd');
            if (cmd) {
                if (this.hasAttribute('data-cmd-all')) {
                    sendCommand(cmd, true);
                } else {
                    sendCommand(cmd);
                }
            }
        });
    });

    $$('.cmd-slider').forEach(function(elt) {
        // perhaps the 'input' event occurs too often, some tests should be tried...
        elt.addEventListener('input', function(evt) {
        //elt.addEventListener('change', function(evt) {
            var cmd = this.getAttribute('data-cmd');
            if (cmd)
                sendCommand(cmd + this.value);
        });
    });

    $$('.color-bt').forEach(function(elt) {
        elt.addEventListener('click', function(evt) {
            var color = this.getAttribute("data-color");
            if (!color)
                return;

            var re = /^\s*hsl\(\s*([\d]{1,3})\s*,\s*([\d]{1,3})%\s*,\s*([\d]{1,3})%\s*\)\s*/i;
            var res = re.exec(color);
            if (res) {
                _setHSLdata(res[1], res[2], res[3]);
            }
        });
    });

    gHSL_H_slider = $('#cs-hsl-h');
    gHSL_S_slider = $('#cs-hsl-s');
    gHSL_L_slider = $('#cs-hsl-l');
    gHSL_H_gradient = $('#gb-hsl-h');
    gHSL_S_gradient = $('#gb-hsl-s');
    gHSL_L_gradient = $('#gb-hsl-l');
    gColorsample = $('#colorsample');
    gColortext = $('#colortext');

    //gHSL_H_slider.addEventListener('change', setHSL_hue);
    //gHSL_S_slider.addEventListener('change', setHSL_saturation);
    //gHSL_L_slider.addEventListener('change', setHSL_lightness);
    gHSL_H_slider.addEventListener('input', setHSL_hue);
    gHSL_S_slider.addEventListener('input', setHSL_saturation);
    gHSL_L_slider.addEventListener('input', setHSL_lightness);

    setInterval(function() {updateStatus}, 1000);
}


document.addEventListener('DOMContentLoaded', function(e) {
    //console.log("DOM loaded");
    init();
});
