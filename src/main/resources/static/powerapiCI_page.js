window.registerExtension('powerapiCI/powerapiCI_page', function (options) {
    //Clear l'affichage
    options.el.textContent = '';
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

/* Constant des autres fichiers */
const URL_LOADED_FILE = [
    "/static/powerapiCI/dependency/chart/Chart.bundle.min.js",
    "/static/powerapiCI/dependency/chart/utils/Utils.js",
    "/static/powerapiCI/view/GlobalView.js",
    "/static/powerapiCI/js/Es_call.js"];

const LIST_COMMIT_NAME = "build_name";
var divToInsert;
var actual_select_list;

var loadAllJSScript = function () {
    URL_LOADED_FILE.forEach(function (URL) {
        var chartJS = document.createElement("script");
        chartJS.src = URL;
        document.head.appendChild(chartJS);
    });
};
