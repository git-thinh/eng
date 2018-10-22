var _CONFIG_FILE = '/view/json/menu_english_main.json';
var _config = {
    AutoSave: 0,
    HtmlChanged: false,
    HighLight: false,
    StarThisLink: false,
};
var _menus = [];
var _links = [];

var f_log = 1 ? console.log.bind(console, '[LOG] ') : function () { };

function f_get(url, callback_ok, callback_fail) {
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
function f_main_openUrl(url, event) {
    var el = event.target, title = '';
    if (el && el.parentElement && el.parentElement.tagName == 'A') el = el.parentElement;
    if (el && el.innerText) title = el.innerText;
    f_log(title, url);
    document.body.innerHTML = '<!--_____PAGE_LOADING_____--><h1>' + title + '<br><br><br><br><br><img src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PHN2ZyB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjAiIHdpZHRoPSI2NHB4IiBoZWlnaHQ9IjY0cHgiIHZpZXdCb3g9IjAgMCAxMjggMTI4IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNNzEgMzkuMlYuNGE2My42IDYzLjYgMCAwIDEgMzMuOTYgMTQuNTdMNzcuNjggNDIuMjRhMjUuNTMgMjUuNTMgMCAwIDAtNi43LTMuMDN6IiBmaWxsPSIjMDAwIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoNDUgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iI2UxZTFlMSIgdHJhbnNmb3JtPSJyb3RhdGUoMTM1IDY0IDY0KSIvPjxwYXRoIGQ9Ik03MSAzOS4yVi40YTYzLjYgNjMuNiAwIDAgMSAzMy45NiAxNC41N0w3Ny42OCA0Mi4yNGEyNS41MyAyNS41MyAwIDAgMC02LjctMy4wM3oiIGZpbGw9IiNiZWJlYmUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA2NCA2NCkiLz48cGF0aCBkPSJNNzEgMzkuMlYuNGE2My42IDYzLjYgMCAwIDEgMzMuOTYgMTQuNTdMNzcuNjggNDIuMjRhMjUuNTMgMjUuNTMgMCAwIDAtNi43LTMuMDN6IiBmaWxsPSIjOTc5Nzk3IiB0cmFuc2Zvcm09InJvdGF0ZSgyMjUgNjQgNjQpIi8+PHBhdGggZD0iTTcxIDM5LjJWLjRhNjMuNiA2My42IDAgMCAxIDMzLjk2IDE0LjU3TDc3LjY4IDQyLjI0YTI1LjUzIDI1LjUzIDAgMCAwLTYuNy0zLjAzeiIgZmlsbD0iIzZlNmU2ZSIgdHJhbnNmb3JtPSJyb3RhdGUoMjcwIDY0IDY0KSIvPjxwYXRoIGQ9Ik03MSAzOS4yVi40YTYzLjYgNjMuNiAwIDAgMSAzMy45NiAxNC41N0w3Ny42OCA0Mi4yNGEyNS41MyAyNS41MyAwIDAgMC02LjctMy4wM3oiIGZpbGw9IiMzYzNjM2MiIHRyYW5zZm9ybT0icm90YXRlKDMxNSA2NCA2NCkiLz48YW5pbWF0ZVRyYW5zZm9ybSBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIHR5cGU9InJvdGF0ZSIgdmFsdWVzPSIwIDY0IDY0OzQ1IDY0IDY0OzkwIDY0IDY0OzEzNSA2NCA2NDsxODAgNjQgNjQ7MjI1IDY0IDY0OzI3MCA2NCA2NDszMTUgNjQgNjQiIGNhbGNNb2RlPSJkaXNjcmV0ZSIgZHVyPSI3MjBtcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT48L2c+PGc+PGNpcmNsZSBmaWxsPSIjMDAwIiBjeD0iNjMuNjYiIGN5PSI2My4xNiIgcj0iMTIiLz48YW5pbWF0ZSBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBkdXI9IjcyMG1zIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBrZXlUaW1lcz0iMDswLjU7MSIgdmFsdWVzPSIxOzA7MSIvPjwvZz48L3N2Zz4="/></h1>';
    ////////setTimeout(function () { API.GoTitle(url, title); }, 3000);
    API.f_main_openUrl(url, title);
}
function f_alert(message, callback_ok) {
    w2alert(message)
        .done(function () {
            //f_log('done: call back when alert closed');
            if (callback_ok) callback_ok();
        });
}
function f_writeFile(file, text) {
    if (API && API.f_api_writeFile)
        return API.f_api_writeFile(file, text);
    return false;
}
function f_api_existFile(file) {
    if (API && API.f_api_existFile)
        return API.f_api_existFile(file);
    return false;
}
function f_html_getPathFile() {
    var domain = location.href.split('/')[2].toLowerCase(),
        file = _.startCase(location.href.split(location.href.split('/')[2])[1].substr(1)).split(' ').join('-');
    return 'view/html/' + domain + '/' + file + '.htm';
}
////////////////////////////////////////////////////////////

function f_menu_Init() {
    _menus = [];

    f_get(_CONFIG_FILE, function (text) {
        //f_log(text);
        var items = JSON.parse(text), li = '', _click = '';
        for (var i = 0; i < items.length; i++) {
            if (items[i].fun && items[i].value) {
                switch (items[i].fun) {
                    case 'f_editor_autoSave':
                        _config.AutoSave = items[i].value;
                        f_editor_autoSaveRun();
                        if (_config.AutoSave) {
                            var fileHtm = f_html_getPathFile();
                            var not_exist = f_api_existFile(fileHtm);
                            if (not_exist == false)
                                f_editor_Save(true);
                        }
                        break;
                    case 'f_editor_highLightOpen':
                        _config.HighLight = items[i].value;
                        break;
                }
            }

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
    //f_log(e.type + ': ' + e.x + ';' + e.y);
    var el = document.getElementById('___menu_context');
    if (el) {
        //el.style.top = e.y + 'px';
        el.style.top = '0px';
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
            tds[j].className = 'td' + wi;
            //tds[j].setAttribute('width', wi + '%');
        }
    }

    _links = f_link_getList();
    //f_link_Search();
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
        var ok = f_writeFile(_CONFIG_FILE, JSON.stringify(_menus));
        if (ok) {
            f_menu_Init();
        }
    }
}

function f_editor_autoSave(menu) {
    if (menu) {
        w2prompt({
            label: 'Auto save after once miliseconds',
            value: menu.value,
            attrs: 'style="width: 250px"',
            title: w2utils.lang('Notification'),
            ok_text: w2utils.lang('Ok'),
            cancel_text: w2utils.lang('Cancel'),
            width: 500,
            height: 250
        })
        .change(function (event) {
            //console.log('change', event);
        })
        .ok(function (_value) {
            var val = Number(_value); 
            if (val.toString() == 'NaN' || val < 0) {
                f_alert('Please input is number >= 0', function () { f_editor_autoSave(menu); });
                return;
            }
            menu.value = val;
            if (val == 0) {
                menu.text = 'Auto Save [OFF]';
            } else {
                menu.text = 'Auto Save [ON]';
            }
            var ok = f_writeFile(_CONFIG_FILE, JSON.stringify(_menus));
            if (ok) {
                f_menu_Init();
                f_alert('Write setting of the Auto Save successfully');
            }
        });
    }
}

var _timer_autoSave = null;
function f_editor_autoSaveRun() {
    if (_timer_autoSave || _config.AutoSave == 0) clearInterval(_timer_autoSave);
    if (_config.AutoSave > 0) {
        _timer_autoSave = setInterval(function () { f_editor_Save(true); }, _config.AutoSave);
    }
}

function f_editor_Save(isAutoSave) {
    //w2popup.lock('Saving document ...', true);
    var fileHtm = f_html_getPathFile();
    var data = document.body.innerHTML.split('<!--END_BODY-->')[0].trim();

    if (data.indexOf('<!--_____PAGE_LOADING_____-->') != -1) return;

    var ok = f_writeFile(fileHtm, data);

    if (isAutoSave) {
        if (_config.HtmlChanged == true) return;
        f_log('AUTO_SAVE = ' + ok.toString() + ' at ' + new Date().toString());
        _config.HtmlChanged = true;
    } else {
        if (ok) {
            f_alert('Save the document successfully');
            _config.HtmlChanged = true;
        }
        else {
            f_alert('Save the document fail');
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
        name: 'layout_words',
        padding: 0,
        panels: [
            { type: 'top', size: '30px', resizable: false, style: 'padding:5px;overflow:hidden;' },
            { type: 'main', minSize: 300 }
        ]
    });

    $().w2grid({
        name: 'grid_words',
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
        modal: true,
        showMax: true,
        body: '<div id="popup_words" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'hidden';

                $('#w2ui-popup #popup_words').w2render('layout_words');
                w2ui.layout_words.content('top', '<input type=text class=popup_right_search_txt placeholder="Search ..." onkeypress="if(event.keyCode == 13)  w2ui.grid_words.search(\'word\', this.value); " />');
                w2ui.layout_words.content('main', w2ui.grid_words);

                //$('#w2ui-popup #grid_words').w2render('grid_words');
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

////////////////////////////////////////////////////////////

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
        if (el.hasAttribute('onclick')) continue;

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
                //el.setAttribute("href", "javascript:void(-1);");
                el.setAttribute("onclick", "f_main_openUrl('" + link + "', event);");

                if (el.hasAttribute('target')) el.removeAttribute('target');
                if (el.hasAttribute('href')) el.removeAttribute('href');

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
        modal: true,
        showMax: true,
        body: '<div id="popup_link" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>',
        onOpen: function (event) {
            event.onComplete = function () {
                document.body.style.overflowY = 'hidden';

                var s = '<input type=text class=popup_search_txt placeholder="Search ..." onkeypress="if(event.keyCode == 13)  w2ui.grid_link.search(\'text\', this.value); " /><button onclick="f_link_Save()" class=popup_button>Save</button>'

                $('#w2ui-popup #popup_link').w2render('layout_link');
                w2ui.layout_link.content('top', s);
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

function f_link_Save() {
    w2popup.lock('Saving links ...', true);
    var domain = location.href.split('/')[2].toLowerCase();
    var ok = f_writeFile('view/json/' + domain + '.json', JSON.stringify(_links));
    if (ok)
        f_alert('Save the links successfully');
    else
        f_alert('Save the links fail');

}

////////////////////////////////////////////////////////////
