window.registerExtension('powerapiCI/powerapiCI_page', function (options) {
    //Clear l'affichage
    options.el.textContent = '';
    loadAllHTML();
    loadAllCss();
    loadD3JS();
    loadAllJSScript();

    window.SonarRequest.getJSON('/api/issues/search', {
        resolved: false,
        componentKeys: options.component.key
    }).then(function (arg) {
        divToInsert = options.el;

        searchAllSomething("build_name").done(function (response) {
            var fields = [];
            var table_fields = response.hits.hits;
            table_fields.forEach(function (field) {
                fields.push(field._source.build_name);
            });
            if (fields.length === 0) {
                divToInsert.textContent = "Aucune données n'est actuellement présente sur votre base...";
            } else {
                actual_select_list = initSelectList(fields, LIST_COMMIT_NAME);
                dataFromField(fields[0]);
            }
        });
    });
    return function () {
        options.el.textContent = '';
    };
});

const LIST_COMMIT_NAME = "build_name";
var divToInsert;
var actual_select_list;

/* Constant des autres fichiers */
const URL_LOADED_JS_FILE = [
    "/static/powerapiCI/dependency/chart/Chart.bundle.min.js",
    "/static/powerapiCI/dependency/chart/utils/Utils.js",
    "/static/powerapiCI/view/GlobalView.js",
    "/static/powerapiCI/js/CallBdd.js",
    "/static/powerapiCI/view/MapperHTML.js",
    "/static/powerapiCI/dependency/d3js/utils/Utils.js"];

var loadAllJSScript = function () {
    URL_LOADED_JS_FILE.forEach(function (URL) {
        var script = document.createElement("script");
        script.src = URL;
        document.head.appendChild(script);
    });
};

var loadD3JS = function () {
    var script = document.createElement("script");
    script.onload = function(){
        var otherScript = document.createElement("script");
        otherScript .src = "/static/powerapiCI/dependency/d3js/utils/Box.js";
        document.head.appendChild(otherScript );
    };
    script.src ="https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.17/d3.min.js";
    document.head.appendChild(script);
};

/* Constant des autres fichiers */
const URL_LOADED_CSS_FILE = [
    "https://cdnjs.cloudflare.com/ajax/libs/open-iconic/1.1.1/font/css/open-iconic-bootstrap.css",
    "/static/powerapiCI/view/css/myStyle.css",
    "/static/powerapiCI/view/css/boxPlot.css"];

var loadAllCss = function () {
    URL_LOADED_CSS_FILE.forEach(function (css) {
        var link = document.createElement("link");
        link.setAttribute('href', css);
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');
        document.head.appendChild(link);
    });
};

//rel="stylesheet" type="text/css" href="/static/powerapiCI/view/myStyle.css"

const URL_LOADED_HTML_FILE = [
    "/static/powerapiCI/view/html/detailsTests.html",
    "/static/powerapiCI/view/html/header.html"
];

/**
 * [0] : detailsTests.html
 * [1] : header.html
 * @type {Array}
 */
var HTML_FILE = [];

var loadAllHTML = function(){
    URL_LOADED_HTML_FILE.forEach(function(htmlFile){
        jQuery.get(htmlFile, undefined, function(data) {
            HTML_FILE.push(data);
        });
    });
};

/* D3 JS */