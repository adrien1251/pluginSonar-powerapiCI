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
 * Print powerapiData to HTML
 * @param powerapiData : data to print
 */
var printPowerapiCIData = function (powerapiData) {
    divToInsert.textContent = '';
    divToInsert.appendChild(actual_select_list);

    if(powerapiData === null){
        divToInsert.textContent += "Aucune donnée n'est disponible pour votre selection actuel";
    } else {
        var div = document.createElement("div");

        var headerDiv = document.createElement("div");
        headerDiv.setAttribute('class', 'header_div');

        var titreProject = document.createElement("h2");
        titreProject.innerHTML = "Numéro de build : " + powerapiData.build_name + " <br/> Projet : " + powerapiData.app_name +
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
        createGraph(canvas, "line", createDataForGraph(labels, data));
        divToInsert.appendChild(canvas);
    }
};

/**
 * Create a div for test details
 * @param test : full test
 * @param cpt : for div id
 * @return {HTMLDivElement}
 */
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
};

var changeVisibility = function(div){
    if(div.style.visibility == 'hidden'){
        div.style.visibility = 'visible';
    } else {
        div.style.visibility = 'hidden';
    }
};