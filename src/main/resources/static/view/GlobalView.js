var establishDesign = function(){
    var globalDiv = document.createElement('div');
    globalDiv.setAttribute('class', 'row');

    divForInsertingMenu = document.createElement("div");
    divForInsertingMenu.setAttribute('class', 'menu-fixed col-3');

    var rightDiv = document.createElement("div");
    rightDiv.setAttribute('class', 'col-9');

    divForInsertingTest = document.createElement("div");
    divForInsertingTest.setAttribute('class', 'margin-top');

    divForChart = document.createElement("div");
    divForChart.setAttribute('class', 'margin-top');

    rightDiv.appendChild(divForInsertingTest);
    rightDiv.appendChild(divForChart);

    var divUseless = document.createElement("div");
    divUseless.setAttribute('class', 'col-3');

    globalDiv.appendChild(divUseless);
    globalDiv.appendChild(divForInsertingMenu);
    globalDiv.appendChild(rightDiv);

    divToInsert.appendChild(globalDiv);
};


var generateOptionList = function(list, selectedValue){
    var optionList = "";
    var option;
    list.forEach(function (obj) {
        option = document.createElement('option');
        option.setAttribute('value', obj);
        option.textContent = obj;
        if(selectedValue === obj){
            option.setAttribute('selected', 'selected');
        }
        optionList += option.outerHTML;
    });

    return optionList;
};

var setFilter = function(powerapiData, filter){
  actual_filter = filter;
  printPowerapiCIData(powerapiData);
};

var printPowerapiCIData = function (powerapiData) {
    divForInsertingTest.textContent = '';

    if (powerapiData === null) {
        divForInsertingTest.textContent += "Aucune donnée n'est disponible pour votre selection actuel";
    } else {
        mapHeader(powerapiData);

        var labels = [];
        var data = [];

        var dataBubble = [];
        var cpt = 0;

        var divDesign = document.createElement('div');
        divDesign.setAttribute('class', 'row');

        powerapiData.methods.forEach(function (test) {
            if (actual_filter === undefined || test.name.match(actual_filter)) {
                var bubble = [];

                if(cpt%2 === 0 && cpt != 0){
                    divForInsertingTest.appendChild(divDesign);
                    divDesign = document.createElement('div');
                    divDesign.setAttribute('class', 'row');
                }
                mapDetailTest(test, powerapiData.build_name, divDesign);

                labels.push(test.name);
                data.push(test.energy);

                test.iterations.forEach(function(it){
                    bubble.push({x:(it.time_end-it.time_begin), y:it.energy, r:10});
                });

                dataBubble.push(bubble);
                cpt++;
            }
        });
        /* for the last div */
        divForInsertingTest.appendChild(divDesign);

        var canvas = document.createElement("canvas");
        createGraph(canvas, "bar", createDataForGraph(labels, data));
        divForChart.appendChild(canvas);

        var canvas1 = document.createElement("canvas");
        createGraph(canvas1, "bubble", createDataForBubbleGraph(labels, dataBubble));
        divForChart.appendChild(canvas1);
    }
};


var changeVisibility = function (div) {

    div = div.nextSibling;
    while (div.className === undefined) {
        div = div.nextSibling;
    }
    if (div.style.display == 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
};
