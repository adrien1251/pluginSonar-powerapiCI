/**
 * Create select list to select commit name.
 * @param list
 * @param nameList
 * @return the select list to add
 */
var initSelectList = function (list, nameList) {
    var div_list = document.createElement('div');
    div_list.setAttribute('id', nameList);

    var label_list = document.createElement('label');
    label_list.textContent = nameList;

    var commit_list = document.createElement('select');
    commit_list.setAttribute('name', nameList);
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

var printPowerapiCIData = function (powerapiData, filter) {
    divToInsert.textContent = '';
    divToInsert.appendChild(actual_select_list);

    if (powerapiData === null) {
        divToInsert.textContent += "Aucune donnée n'est disponible pour votre selection actuel";
    } else {
        mapHeader(powerapiData);

        var labels = [];
        labels[0] = []; //graph 1
        labels[1] = []; // graph 2
        var data = [];
        data[0] = [];
        data[1] = [];

        var objetForGraph = [];

        powerapiData.methods.forEach(function (test) {
            if (filter === undefined || test.name.match(filter)) {
                divToInsert.appendChild(document.createElement("hr"));
                mapDetailTest(test, powerapiData.build_name);

                labels[0].push(test.name);
                data[0].push(test.energy);

                objetForGraph.push({duree: test.duration, energy: test.energy, name: test.name});
            }
        });

        var canvas = document.createElement("canvas");
        createGraph(canvas, "bar", createDataForGraph(labels[0], data[0]));
        divToInsert.appendChild(canvas);

        objetForGraph.sort(function (a, b) {
            return a.duree - b.duree;
        });
        objetForGraph.forEach(function (obj) {
            if (obj.name != "should_test_suite_fibonacci_use_puissance") {
                labels[1].unshift(obj.name + " " + obj.duree + "ms");
                data[1].unshift(obj.energy);
            }
        });
        var canvas1 = document.createElement("canvas");
        createGraph(canvas1, "horizontalBar", createDataForGraph(labels[1], data[1]));
        divToInsert.appendChild(canvas1);
    }
};


var changeVisibility = function (div) {

    div = div.nextSibling;
    while (div.className === undefined) {
        div = div.nextSibling;
    }
    if (div.style.visibility == 'hidden') {
        div.style.visibility = 'visible';
    } else {
        div.style.visibility = 'hidden';
    }
};
