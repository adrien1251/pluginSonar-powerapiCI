window.registerExtension('powerapiCI/powerapiCI_page', function (options) {
    //Clear l'affichage
    projectName = options.component.key.substring(options.component.key.indexOf(':')+1);
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
        divToInsert.setAttribute('class', 'bootstrap-iso');

        establishDesign();

        searchAllSomething("build_name").done(function (response) {
            var fields = [];
            var table_fields = response.hits.hits;
            table_fields.forEach(function (field) {
                fields.push(field._source.build_name);
            });
            if (fields.length === 0) {
                divToInsert.textContent = "Aucune données n'est actuellement présente sur votre base "+ES_URL;
            } else {
                mapSelectList(fields, LIST_COMMIT_NAME, "choose your build name", "dataFromField(this.options[this.selectedIndex].value)", fields[fields.length-1]);
                dataFromField(fields[fields.length-1]);
            }
        });
    });
    return function () {
        options.el.textContent = '';
    };
});

const LIST_COMMIT_NAME = "build_name";
var divToInsert;
var divForInsertingTest;
var divForInsertingMenu;
var divForChart;
var actual_select_list;
var actual_powerapi_data;
var actual_filter;
var projectName;

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
    //"https://stackpath.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css",
    //"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css",
    "/static/powerapiCI/dependency/bootstrap-iso/bootstrap4less.css",
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

const URL_LOADED_HTML_FILE = [
    "/static/powerapiCI/view/html/selectList.html",
    "/static/powerapiCI/view/html/detailsTests.html",
    "/static/powerapiCI/view/html/header.html",
    "/static/powerapiCI/view/html/detailClass.html"
];

/**
 * [0] : selectList
 * [1] : detailsTests.html
 * [2] : header.html
 * [3] : detail class
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