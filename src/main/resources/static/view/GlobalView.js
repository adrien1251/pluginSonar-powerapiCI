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
    divToInsert.textContent = '';
    divToInsert.appendChild(actual_select_list);

    if(powerapiData === null){
        divToInsert.textContent += "Aucune donnée n'est disponible pour votre selection actuel";
    } else {
        mapHeader(powerapiData);

        var labels = [];
        var data = [];

        powerapiData.methods.forEach(function (test) {
            divToInsert.appendChild(document.createElement("hr"));
            mapDetailTest(test);

            labels.push(test.name);
            data.push(test.energy);


        });

        var json = remplirJSonForD3JS(powerapiData.methods);
        createBoxPlot(json);

        var canvas = document.createElement("canvas");
        createGraph(canvas, "line", createDataForGraph(labels, data));
        divToInsert.appendChild(canvas);
    }
};



var changeVisibility = function(div){

    div = div.nextSibling;
    while(div.className === undefined){
        div = div.nextSibling;
    }
    if(div.style.visibility == 'hidden'){
        div.style.visibility = 'visible';
    } else {
        div.style.visibility = 'hidden';
    }
};

var remplirJSonForD3JS = function(methods){
    var json = [];
    var nbIterations = methods[0].iterations.length;
    for(var i=0; i<nbIterations; i++){
        var iteration = {};
        methods.forEach(function (test) {
            if(test.name != "should_test_suite_fibonacci_use_puissance") {
                iteration[test.name] = test.iterations[i].energy;
            }
        });
        json.push(iteration);
    }
    return json;
};