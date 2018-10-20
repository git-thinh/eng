﻿var _menus = [];
var _links = [];

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
    var menu = _.find(_menus, function (o) { return o.id == menu_id; });
    if (menu && menu.fun) {
        f_log(menu);
        var fun = 'f_api_' + menu.fun;
        if (API && API[fun]) API[fun](JSON.stringify(menu));
    }
}

////////////////////////////////////////////////////////////

function f_menu_Init() {
    _menus = [];

    f_get('/view/json/menu_english_main.json', function (text) {
        //f_log(text);
        var items = JSON.parse(text), li = '', _click = '';
        for (var i = 0; i < items.length; i++) {
            items[i].id = i;
            _menus.push(items[i]);
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
    var menu = _.find(_menus, function (o) { return o.id == menu_id; });
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

    _links = f_link_getList();
    f_link_Search();
});
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
        var ok = API.f_api_writeFile('view/json/menu_english_main.json', JSON.stringify(_menus)); 
        if (ok) {
            f_menu_Init();
        }
    }
}

////////////////////////////////////////////////////////////

function f_english_Keywords(menu) {
    var text = _.startCase(document.body.innerText.trim());
    var words = text.split(' ');
    words = _.filter(words, function (wo) { return wo.length > 3; });
    words = _.uniqBy(words, function (e) { return e; });
    words = _.orderBy(words);
    var data = _.map(words, function (wo, index) { return { recid: index + 1, word: wo }; });


    $().w2layout({
        name: 'layout_link',
        padding: 0,
        panels: [
            { type: 'top', size: '30px', resizable: false, style: 'padding:5px;overflow:hidden;' },
            { type: 'main', minSize: 300 }
        ]
    });

    $().w2grid({
        name: 'grid_link',
        show: {
            header: false,  // indicates if header is visible
            toolbar: false,  // indicates if toolbar is visible
            footer: true,  // indicates if footer is visible
            columnHeaders: false,   // indicates if columns is visible
            lineNumbers: false,  // indicates if line numbers column is visible
            expandColumn: false,  // indicates if expand column is visible
            selectColumn: true,  // indicates if select column is visible
            emptyRecords: true,   // indicates if empty records are visible
            toolbarReload: false,   // indicates if toolbar reload button is visible
            toolbarColumns: false,   // indicates if toolbar columns button is visible
            toolbarSearch: false,   // indicates if toolbar search controls are visible
            toolbarAdd: false,   // indicates if toolbar add new button is visible
            toolbarEdit: false,   // indicates if toolbar edit button is visible
            toolbarDelete: false,   // indicates if toolbar delete button is visible
            toolbarSave: false,   // indicates if toolbar save button is visible
            selectionBorder: false,   // display border around selection (for selectType = 'cell')
            recordTitles: false,   // indicates if to define titles for records
            skipRecords: false    // indicates if skip records should be visible
        },
        multiSelect: true,
        columns: [
            { field: 'recid', caption: 'Index', size: '10%' },
            { field: 'word', caption: 'Word', size: '90%', sortable: true, searchable: true }
        ],
        records: data,
        onClick: function (event) {
            //var grid = this;
            //var form = {};
            //event.onComplete = function () {
            //    var sel = grid.getSelection();
            //    if (sel.length == 1) {
            //        form.recid = sel[0];
            //        form.record = $.extend(true, {}, grid.get(sel[0]));
            //    } else {
            //    }
            //}
        }
    });

    w2popup.open({
        title: 'Keywords',
        width: 900,
        height: 600,
        showMax: true,
        body: '<div id="popup_link" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'hidden';

                $('#w2ui-popup #popup_link').w2render('layout_link');
                w2ui.layout_link.content('top', '<input type=text class=popup_right_search_txt placeholder="Search ..." onkeypress="if(event.keyCode == 13)  w2ui.grid_link.search(\'word\', this.value); " />');
                w2ui.layout_link.content('main', w2ui.grid_link);

                //$('#w2ui-popup #grid_link').w2render('grid_link');
                w2popup.toggle();
            };
        },
        onClose: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'auto';
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
            }
        }
    });
}

function f_link_getList() { 
    var URL = location.href,
        aHost = location.hostname.split('.'),
        DOMAIN_MAIN = aHost.length > 1 ? (aHost[aHost.length - 2] + '.' + aHost[aHost.length - 1]) : aHost[0];
    aHost = URL.split('/');
    var URL_SCHEME = aHost[0].substring(0, aHost[0].length - 1),
        HTTP_ROOT = URL_SCHEME + '://' + aHost[2] + '/',
        URL_DIR = URL;
    if (URL[URL.length - 1] != '/')
        URL_DIR = URL.substring(0, URL.length - URL[URL.length - 1].length);

    //f_log("----> DOM loaded: URL = " + URL);
    //f_log("----> DOM loaded: URL_SCHEME = " + URL_SCHEME);
    //f_log("----> DOM loaded: DOMAIN_MAIN = " + DOMAIN_MAIN);
    //f_log("----> DOM loaded: URL_DIR = " + URL_DIR);
    //f_log("----> DOM loaded: HTTP_ROOT = " + HTTP_ROOT);

    var links = document.querySelectorAll('a'),
        aLink = [], index = 0;
    for (var i = 0; i < links.length; i++) {
        var el = links[i], text = el.innerText;
        if (text != null && text.length > 0 && el.hasAttribute('href') == true) {
            text = text.trim();
            if (text.length == 0 || text[0] == '#') { el.parentElement.removeChild(el); continue; }
            var link = el.getAttribute('href').trim();
            if (link.length == 0 || link[0] == '#') { el.parentElement.removeChild(el); continue; }

            if (link.indexOf(DOMAIN_MAIN) != -1 || link.indexOf('http') != 0) {
                text = text.split("'").join('').split('"').join('');

                var link_full = '';
                if (link.indexOf('//') == 0)
                    link_full = URL_SCHEME + ':' + link;
                else {
                    if (link.indexOf('http') != 0) {
                        if (link[0] == '/') link_full = HTTP_ROOT + link.substr(1);
                        else if (link.indexOf('../') == 0) { }
                        else {
                            link_full = URL_DIR + link;
                        }
                    }
                }

                if (link_full.length > 0) {
                    //f_log('A = ' + link + ' -> ' + link_full);
                    link = link_full;
                }

                if (URL == link || URL == link + '/' || link.indexOf('javascript:') != -1) continue;

                //el.parentElement.removeChild(el);
                el.setAttribute("href", "javascript:void(-1);");
                el.setAttribute("onclick", "f_main_openUrl('" + link + "','" + text + "');");

                index++;
                aLink.push({ recid: index, text: text, url: link, level: link.split('/').length - 3 });
            } else { el.parentElement.removeChild(el); continue; }
        } else { el.parentElement.removeChild(el); continue; }
    }

    aLink = _.uniqBy(aLink, function (e) { return e.text });
    aLink = _.orderBy(aLink, 'level', ['desc']);

    return aLink;
}

function f_link_Search(menu) {
    
    $().w2layout({
        name: 'layout_link',
        padding: 0,
        panels: [
            { type: 'top', size: '30px', resizable: false, style: 'padding:5px;overflow:hidden;' },
            { type: 'main', minSize: 300 }
        ]
    });

    $().w2grid({
        name: 'grid_link',
        show: {
            header: false,  // indicates if header is visible
            toolbar: false,  // indicates if toolbar is visible
            footer: true,  // indicates if footer is visible
            columnHeaders: false,   // indicates if columns is visible
            lineNumbers: false,  // indicates if line numbers column is visible
            expandColumn: false,  // indicates if expand column is visible
            selectColumn: true,  // indicates if select column is visible
            emptyRecords: true,   // indicates if empty records are visible
            toolbarReload: false,   // indicates if toolbar reload button is visible
            toolbarColumns: false,   // indicates if toolbar columns button is visible
            toolbarSearch: false,   // indicates if toolbar search controls are visible
            toolbarAdd: false,   // indicates if toolbar add new button is visible
            toolbarEdit: false,   // indicates if toolbar edit button is visible
            toolbarDelete: false,   // indicates if toolbar delete button is visible
            toolbarSave: false,   // indicates if toolbar save button is visible
            selectionBorder: false,   // display border around selection (for selectType = 'cell')
            recordTitles: false,   // indicates if to define titles for records
            skipRecords: false    // indicates if skip records should be visible
        },
        multiSelect: true,
        columns: [
            { field: 'recid', caption: 'Index', size: '10%' },
            { field: 'level', caption: 'Level', size: '10%', sortable: true, searchable: true },
            { field: 'text', caption: 'Title', size: '90%', sortable: true, searchable: true },
        ],
        records: _links,
        onClick: function (event) {
            //var grid = this;
            //var form = {};
            //event.onComplete = function () {
            //    var sel = grid.getSelection();
            //    if (sel.length == 1) {
            //        form.recid = sel[0];
            //        form.record = $.extend(true, {}, grid.get(sel[0]));
            //    } else {
            //    }
            //}
        }
    });

    w2popup.open({
        title: 'Search Links',
        width: 900,
        height: 600,
        showMax: true,
        body: '<div id="popup_link" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'hidden';

                $('#w2ui-popup #popup_link').w2render('layout_link');
                w2ui.layout_link.content('top', '<input type=text class=popup_right_search_txt placeholder="Search ..." onkeypress="if(event.keyCode == 13)  w2ui.grid_link.search(\'text\', this.value); " />');
                w2ui.layout_link.content('main', w2ui.grid_link);

                //$('#w2ui-popup #grid_link').w2render('grid_link');
                w2popup.toggle();
            };
        },
        onClose: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'auto';
            };
        },
        onToggle: function (event) {
            event.onComplete = function () {
            }
        }
    });
}