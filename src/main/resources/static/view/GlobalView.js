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
    nom_test.style.display = "inline";
    nom_test.style.verticalAlign = "middle";
    nom_test.style.margin = "10px 10px 10px 10px";
    testDiv.appendChild(nom_test);

    var data_test_div = document.createElement("div");
    data_test_div.setAttribute('id', 'details' + cpt);
    data_test_div.style.visibility = "hidden";

    var button = document.createElement("button");
    button.type='button';
    button.setAttribute('class', 'btn btn-secondary');
    button.setAttribute('onclick','changeVisibility(details'+cpt+')');
    button.textContent='Détails du test';
    testDiv.appendChild(button);

    var data_test = document.createElement("p");
    data_test.innerHTML = "<div class='card border-light bg-dark text-center text-white' style='width:18rem; display:inline-grid; verticalAlign:middle; margin:10px 10px 10px 10px;'><img class='card-img-top' <div class='card-body'><h5 class='card-title'>Iterations</h5><p class='card-text'> " + test.iterations.length + " </p></div></div><div class='card bg-dark border-light text-center text-white' style='width:18rem; display:inline-grid; verticalAlign:middle; background-color:#2f171757; margin:10px 10px 10px 10px;'><img class='card-img-top' <div class='card-body'><h5 class='card-title'>Energie Moyenne</h5><p class='card-text'>" + test.energy + " Joules</p></div></div><div class='card text-center text-white border-light bg-dark' style='width:18rem; display:inline-grid; verticalAlign:middle; margin:10px 10px 10px 10px;'><img class='card-img-top' <div class='card-body'><h5 class='card-title'>Durée moyenne</h5><p class='card-text'>" + test.duration + " Millisecondes</p></div></div>"
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