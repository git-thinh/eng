_CLIENT_ID = 1;
_CLIENT_NAME = _NAME_UI.LINK;
function f_receiveMessageFromAPI(m) {
    f_log('API.' + _CLIENT_NAME + ' <- ', m);
}
function f_domLoaded() { }
///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////



var _TAB_SELECT = 'english', _FILTER_SELECT = 'dictionary';
////////////////////////////////////////////////////////////

function f_event_Init() {
    var fs = document.querySelectorAll('.filter-items input, .filter-items label');
    for (var i = 0; i < fs.length; i++) {
        var el = fs[i];
        el.addEventListener("click", f_filterSelected_onClick, true);
    }
}

////////////////////////////////////////////////////////////

function f_filterSelected_onClick(event) {
    var val = event.target.getAttribute('value');
    //console.log(event.target.tagName + ': click = ' + val);

    if (event.target.tagName == 'LABEL') {
        var fs = document.querySelectorAll('.filter-items input');
        for (var i = 0; i < fs.length; i++)
            if (fs[i].hasAttribute('checked')) fs[i].checked = false;

        var el = document.querySelector('.filter-items input[value="' + val + '"]');
        if (el) {
            el.checked = true;
        }
    }
}

function f_displayTranslate(oTran) {
    //f_log('SETTING_TRANS: ' + JSON.stringify(oTran));
    if (oTran && oTran.success == true) {
        var id = oTran.id, text = oTran.text, mean_vi = oTran.mean_vi;

        var items = document.getElementById('items-english-dictinary');
        var fs = document.querySelectorAll('#items-english-dictinary li');
        for (var i = 0; i < fs.length; i++)
            fs[i].removeClass('active');

        f_log(id + ': ' + text + ' = ' + mean_vi);

        var li = document.getElementById(id);
        if (li) {
            li.addClass('active');
        } else {
            li = document.createElement('li');
            li.id = oTran.id;
            li.className = 'link active';

            var _label = '<label>' + text + '</label>',
                _em = '<em>' + mean_vi + '</em>',
                _p = '';//'<p>' + it.Text + '</p>',
            _span_i = ''; // it.Tags.length > 0 ? ('<span><i>' + it.Tags.split(',').join('</i><i>') + '</i></span>') : '';

            li.innerHTML = _label + _em + _p + _span_i;

            if (items) {
                items.style.display = 'inline-block';
                items.appendChild(li);
            }
        }
    }
}

////////////////////////////////////////////////////////////
var _openUrl = function (url) {
    //console.log('-> ' + url);
    API.Go(url);
};

////////////////////////////////////////////////////////////

function f_ready() {

    f_event_Init();

    ////////////////////////////////////////////////////////////

    var data;

    //data = f_getJson('search');
    data = {
        "Ok": true,
        "Keyword": "Learn English",
        "Link": {
            "Total": 123,
            "Count": 99,
            "pageNumber": 1,
            "pageSize": 10,
            "Result": []
        },
        "English": {
            "Total": 123,
            "Count": 99,
            "pageNumber": 1,
            "pageSize": 10,
            "Result": []
        },
        "Media": {
            "Total": 123,
            "Count": 99,
            "pageNumber": 1,
            "pageSize": 10,
            "Result": []
        }
    };

    // #region [LINK]

    //var rs_link = data.Link;
    //for (var i = 0; i < rs_link.pageSize; i++) rs_link.Result.push({ "Type": "link", "Url": "https://dictionary.cambridge.org/grammar/british-grammar/above-or-over", "Tags": "grammar, above, over", "Title": "Above or over?", "Text": "When we use above as a preposition, it means ‘higher than’. Its meaning is close to that of the preposition over. In the following sentences, over can be used instead of above" });
    //if (rs_link) {
    //    var items = document.getElementById('items-link');
    //    for (var i = 0; i < rs_link.pageSize; i++) {
    //        var it = rs_link.Result[i],
    //            li = document.createElement('li'),
    //            domain = '<em>' + it.Url.split('/')[2] + '</em>',
    //            tags = '';
    //        li.className = it.Type;
    //        //li.onclick = function () { _openUrl(it.Url); };
    //        if (it.Tags.length > 0) tags = '<span><i>' + it.Tags.split(',').join('</i><i>') + '</i></span>';
    //        li.innerHTML = '<label onclick="_openUrl(\'' + it.Url + '\')">' + it.Title + '</label>' + domain + '<p>' + it.Text + '</p>' + tags;

    //        items.appendChild(li);
    //    }
    //}

    // #endregion

    // #region [ENGLISH]

    //var rs_english = data.English;
    //for (var i = 0; i < rs_english.pageSize; i++) rs_english.Result.push({ "Type": "english", "Url": "https://dictionary.cambridge.org/grammar/british-grammar/above-or-over", "Tags": "grammar, above, over", "Title": "Above or over?", "Text": "When we use above as a preposition, it means ‘higher than’. Its meaning is close to that of the preposition over. In the following sentences, over can be used instead of above" });
    //if (rs_english) {
    //    var items = document.getElementById('items-english');
    //    for (var i = 0; i < rs_english.pageSize; i++) {
    //        var it = rs_english.Result[i],
    //            li = document.createElement('li'),
    //            domain = '<em>' + it.Url.split('/')[2] + '</em>',
    //            tags = '';
    //        li.className = it.Type;
    //        //li.onclick = function () { _openUrl(it.Url); };
    //        if (it.Tags.length > 0) tags = '<span><i>' + it.Tags.split(',').join('</i><i>') + '</i></span>';
    //        li.innerHTML = '<label onclick="_openUrl(\'' + it.Url + '\')">' + it.Title + '</label>' + domain + '<p>' + it.Text + '</p>' + tags;
    //        items.appendChild(li);
    //    }
    //}

    // #endregion

    // #region [MEDIA]

    //var rs_media = data.Media;
    //for (var i = 0; i < rs_media.pageSize; i++) rs_media.Result.push({ "Type": "media", "Url": "https://dictionary.cambridge.org/grammar/british-grammar/above-or-over", "Tags": "grammar, above, over", "Title": "Above or over?", "Text": "When we use above as a preposition, it means ‘higher than’. Its meaning is close to that of the preposition over. In the following sentences, over can be used instead of above" });
    //if (rs_media) {
    //    var items = document.getElementById('items-media');
    //    for (var i = 0; i < rs_media.pageSize; i++) {
    //        var it = rs_media.Result[i],
    //            li = document.createElement('li'),
    //            domain = '<em>' + it.Url.split('/')[2] + '</em>',
    //            tags = '';
    //        li.className = it.Type;
    //        //li.onclick = function () { _openUrl(it.Url); };
    //        if (it.Tags.length > 0) tags = '<span><i>' + it.Tags.split(',').join('</i><i>') + '</i></span>';
    //        li.innerHTML = '<label onclick="_openUrl(\'' + it.Url + '\')">' + it.Title + '</label>' + domain + '<p>' + it.Text + '</p>' + tags;
    //        items.appendChild(li);
    //    }
    //}

    // #endregion

    var tab = document.getElementById('items-' + _TAB_SELECT);
    if (tab) tab.style.display = 'block';
}

function f_search(type, event) {
    var el = event.target;

    var bs = document.querySelectorAll('#header button');
    for (var i = 0; i < bs.length; i++) bs[i].className = '';
    el.toggleClass('active');

    var elKey = document.getElementById('txt_search');
    var keyword = elKey.value;

    ////$('#header button').removeClass('active');
    ////$('#header button.' + type.toLowerCase()).addClass('active');

    //switch (type) {
    //    case 'all':
    //        break;
    //    case 'domain':
    //        break;
    //    case 'tag':
    //        break;
    //    case 'star':
    //        break;
    //    default:
    //        break;
    //}

    console.log(type + ':' + keyword);
}
