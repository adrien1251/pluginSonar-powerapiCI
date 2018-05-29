window.registerExtension('powerapiCI/powerapiCI_page', function (options) {
    //Clear l'affichage
    options.el.textContent = '';

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
            if(fields.length === 0){
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

/* Mes fonctions */
var divToInsert;
var proxy = 'https://cors-anywhere.herokuapp.com/';
const ES_URL = "http://elasticsearch.app.projet-davidson.fr/powerapici_test/_search";
const URL_CHARTJS = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.min.js";
const LIST_COMMIT_NAME = "build_name";
var actual_select_list;
/**
 * Do ajax call to get dataSearch
 * @param dataForSearch
 * @returns {*}
 */
var esCall = function (dataForSearch) {
    return $.ajax({
        url: proxy + ES_URL,
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(dataForSearch),
    });
}

/**
 * Search all field on the elasticsearch index
 * @param fieldName the field to search
 */
var searchAllSomething = function (fieldName) {
    var data = {
        "query": {
            "match_all": {}
        },
        "_source": [fieldName]
    };

    return esCall(data);
}

/**
 * Create select list to select commit name.
 * @param list
 * @param nameList
 * @return the select list to add
 */
var initSelectList = function (list, nameList) {
    var div_list = document.createElement('div');
    
    var label_list = document.createElement('label');
    label_list.textContent = nameList;
    
    var commit_list = document.createElement('select');
    commit_list.setAttribute('name', nameList);
    commit_list.setAttribute('class', nameList);
    commit_list.setAttribute('onchange', 'dataFromField(this.options[this.selectedIndex].value)');
    var option;
    list.forEach(function (obj) {
        option = document.createElement('option');
        option.setAttribute('value', obj);
        option.textContent = obj;
        commit_list.appendChild(option);
    });

    div_list.appendChild(label_list);
    div_list.appendChild(commit_list);
    return div_list;
};

/**
 * Get data from field
 * @param nameField : name of the fields in ES
 * @param searchField : which is search into the field
 */
var dataFromField = function (searchField) {
    var data = {
        "query": {
            "bool": {
                "must": [
                    {"match": {build_name: searchField}}
                ]
            }
        }
    };

    esCall(data).done(function (response) {
        printPowerapiCIData(response.hits.hits[0]._source);
    });
};

var printPowerapiCIData = function (powerapiData) {
    var div = document.createElement("div");

    var headerDiv = document.createElement("div");
    headerDiv.setAttribute('class', 'header_div');

    var titreProject = document.createElement("h2");
    titreProject.innerHTML = "Numéro de build : " + powerapiData.build_name +  " <br/> Projet : " + powerapiData.app_name +
        " <br/>  Branche : " + powerapiData.branch + " <br/>  Commit : " + powerapiData.commit_name;
    headerDiv.appendChild(titreProject);

    var energy = document.createElement("h3");
    energy.innerHTML = powerapiData.energy + " Joules répartis sur " + powerapiData.methods.length + " tests";
    headerDiv.appendChild(energy);
    div.appendChild(headerDiv);
    divToInsert.appendChild(div);

    var testsDiv = document.createElement("div");
    var titletest = document.createElement("h1");
    titletest.innerHTML = "Détails des tests : ";
    testsDiv.appendChild(titletest);

    var labels = [];
    var data = [];
    var cpt = 1;
    powerapiData.methods.forEach(function (test) {
        testsDiv.appendChild(document.createElement("hr"));
        testsDiv.appendChild(createTestDiv(test, cpt++));

        labels.push(test.name);
        data.push(test.energy);
    });

    divToInsert.appendChild(testsDiv);

    var canvas = document.createElement("canvas");
    loadChartJS(canvas, "line", create_data_for_graph(labels, data));
    divToInsert.appendChild(canvas);
};

var createTestDiv = function(test, cpt){
    var testDiv = document.createElement("div");
    testDiv.setAttribute('class', 'test_div');

    var nom_test = document.createElement("h2");
    nom_test.textContent = test.name;
    testDiv.appendChild(nom_test);

    var data_test_div = document.createElement("div");
    data_test_div.setAttribute('id', 'details' + cpt);
    data_test_div.style.visibility = "hidden";

    var button = document.createElement("button");
    button.type='button';
    button.setAttribute('class', 'btn btn-secondary');
    button.setAttribute('onclick','changeVisibility(details'+cpt+')');
    button.textContent='Afficher les détails du test';
    testDiv.appendChild(button);


    var data_test = document.createElement("p");
    data_test.textContent = "Sur " + test.iterations.length + " itérations, le test à consommé " + test.energy + " Joules et a duré en moyenne " +
        "" + test.duration + "ms";
    data_test_div.appendChild(data_test);

    testDiv.appendChild(data_test_div);

    return testDiv;
}

var changeVisibility = function(div){

    if(div.style.visibility == 'hidden'){
        div.style.visibility = 'visible';
    } else {
        div.style.visibility = 'hidden';
    }
}

/**
 * Load chartJS
 */
var loadedChartJS = false;
var loadChartJS = function(canvas, type, data) {
    if(!loadedChartJS){
        var chartJS = document.createElement("script");
        chartJS.onload = function () {
            creer_graph(canvas, type, data);
        };
        chartJS.src = URL_CHARTJS;
        document.head.appendChild(chartJS);
    } else {
        creer_graph(canvas, type, data);
    }
    loadedChartJS = true;
};

var create_data_for_graph = function(labels, data){
    return {
        labels: labels,
        datasets: [{
            label: 'Energie par test',
            data: data
        }]
    }
};

var creer_graph = function(canvas, type, data){
    new Chart(canvas, {
        type: type,
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
}