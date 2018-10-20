﻿var MENUS = [];
var f_log = 1 ? console.log.bind(console, '[LOG] ') : function () { };
var f_get = function (url, callback_ok, callback_fail) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200)
            if (callback_ok) callback_ok(xhttp.responseText);
            else if (callback_fail) callback_fail();
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function f_api_executeByKey(menu_id) {
    f_menu_Hide();
    var menu = _.find(MENUS, function (o) { return o.id == menu_id; });
    if (menu && menu.fun) {
        f_log(menu);
        var fun = 'f_api_' + menu.fun;
        if (API && API[fun]) API[fun](JSON.stringify(menu));
    }
}

////////////////////////////////////////////////////////////

function f_menu_Init() {
    MENUS = [];

    f_get('/view/json/menu_english_main.json', function (text) {
        //f_log(text);
        var items = JSON.parse(text), li = '', _click = '';
        for (var i = 0; i < items.length; i++) {
            items[i].id = i;
            MENUS.push(items[i]);
            switch (items[i].type) {
                case 'api':
                    _click = ' onclick="f_api_executeByKey(' + i + ');" ';
                    li += '<li ' + _click + '>' + items[i].text + '</li>';
                    break;
                default:
                    _click = ' onclick="f_menu_Click(' + i + ');" ';
                    li += '<li ' + _click + '>' + items[i].text + '</li>';
                    break;
            }
        }
        if (li.length > 0) {
            var el = document.getElementById('___menu_context');
            if (el) {
                el.innerHTML = '<ul>' + li + '</ul>';
            }
        }
    }, function () {
        alert('Cannot build context menu!');
    });
}

function f_menu_Click(menu_id) {
    f_menu_Hide();
    var menu = _.find(MENUS, function (o) { return o.id == menu_id; });
    if (menu && menu.fun) {
        f_log(menu);
        var fun = menu.fun;
        if (window[fun]) window[fun](menu);
    }
}

function f_menu_Show(e) {
    f_log(e.type + ': ' + e.x + ';' + e.y);
    var el = document.getElementById('___menu_context');
    if (el) {
        el.style.top = e.y + 'px';
        el.style.left = e.x + 'px';
        el.style.display = 'inline-block';
    }
}

function f_menu_Hide() {
    var el = document.getElementById('___menu_context');
    if (el) el.style.display = 'none';
}

////////////////////////////////////////////////////////////

function f_editor_highLightOpen(menu) {
    if (menu) {
        if (menu.value == true) {
            menu.text = 'Hight light [OFF]';
            menu.value = false;
        } else {
            menu.value = true;
            menu.text = 'Hight light [ON]';
        }
        var ok = API.f_api_writeFile('view/json/menu_english_main.json', JSON.stringify(MENUS)); 
        if (ok) {
            f_menu_Init();
        }
    }
}

////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function (event) {
    f_log('DOMContentLoaded');

    window.oncontextmenu = function (e) {
        f_menu_Show(e);
        return false;     // cancel default menu
    }
    f_menu_Init();

    var trs = document.querySelectorAll('table tr');
    for (var i = 0; i < trs.length; i++) {
        var tds = trs[i].querySelectorAll('td'), wi = parseInt(100 / tds.length);
        //f_log(i, wi);
        for (var j = 0; j < tds.length; j++) {
            tds[j].setAttribute('width', wi + '%');
        }
    }

});