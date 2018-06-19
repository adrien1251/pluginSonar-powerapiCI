/**
 * Add the principal div to the  HTML
 * the divForInsertingMenu
 * the divForInsertingTest
 * the divForChart
 */
var establishDesign = function(){
    var globalDiv = document.createElement('div');
    globalDiv.setAttribute('class', 'row');

    divForInsertingMenu = document.createElement("div");
    divForInsertingMenu.setAttribute('class', 'menu-fixed col-3 margin-left');

    var rightDiv = document.createElement("div");
    rightDiv.setAttribute('class', 'col-9');

    divForInsertingTest = document.createElement("div");
    divForInsertingTest.setAttribute('class', 'margin-top padding-left');

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

/**
 * Create the list to select build
 * @param list : table with different name
 * @param selectedValue : actual value need to be selected
 * @return {string} html list
 */
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

/**
 * Set a filter to get less than all test and reprint data with actual filter
 * @param powerapiData : powerAPI data to find new data
 * @param filter the new filtre
 */
var setFilter = function(powerapiData, filter){
  actual_filter = filter;
  printPowerapiCIData(powerapiData);
};

/**
 * Print the all screen with data powerapiData
 * @param powerapiData data you need to print
 */
var printPowerapiCIData = function (powerapiData) {
    divForInsertingTest.textContent = '';
    divForChart.textContent = '';
    if (powerapiData === null) {
        divForInsertingTest.textContent += "Aucune donnée n'est disponible pour votre selection actuel";
    } else {
        var tendencyMap = {};
        tendencyMap['totalEnergy'] = {divToFill: mapHeader(powerapiData), energy: powerapiData.energy};

        var labels = [];
        var data = [];

        var dataBubble = [];
        var cpt = 0;


        powerapiData.classes.forEach(function(classe){
            var energy = 0;
            var nbTest = 0;

            var enveloppingDiv = document.createElement('div');
            enveloppingDiv.style.display = 'none';
            enveloppingDiv.setAttribute('role', 'hidden');
            enveloppingDiv.setAttribute('class', 'clear-both');

            var divDesign = document.createElement('div');
            divDesign.setAttribute('class', 'row');

            classe.methods.forEach(function (test) {
                if (actual_filter === undefined || test.name.match(actual_filter)) {
                    var bubble = [];

                    if(cpt%2 === 0 && cpt !== 0){
                        enveloppingDiv.appendChild(divDesign);
                        divDesign = document.createElement('div');
                        divDesign.setAttribute('class', 'row');
                    }

                    tendencyMap[test.name] = {divToFill: mapDetailTest(test, powerapiData.build_name, divDesign), energy: test.energy};

                    labels.push(test.name);
                    data.push(test.energy);

                    energy += test.energy;
                    nbTest++;

                    test.iterations.forEach(function(it){
                        bubble.push({x:(it.time_end-it.time_begin), y:it.energy, r:10});
                    });

                    dataBubble.push(bubble);
                    cpt++;
                }
            });

            enveloppingDiv.appendChild(divDesign);
            if(enveloppingDiv.textContent !== '') {
                var divClass = mapDetailClass(classe, energy, nbTest);
                tendencyMap[classe.name] = {divToFill: divClass.getElementsByClassName('colorEnergy')[0], energy: energy};
                divClass.appendChild(enveloppingDiv);
                divForInsertingTest.appendChild(divClass);
            }
        });

        fillTendency(powerapiData.timestamp, tendencyMap);
/*
        var canvas = document.createElement("canvas");
        createGraph(canvas, "bar", createDataForGraph(labels, data));
        divForChart.appendChild(canvas);
*/
        var canvas1 = document.createElement("canvas");
        createGraph(canvas1, "bubble", createDataForBubbleGraph(labels, dataBubble));
        divForChart.appendChild(canvas1);

        var canvas2 = document.createElement("canvas");
        createGraph(canvas2, "bubble", fillDataForTestSuiteGraph(powerapiData.classes));
        divForChart.appendChild(canvas2);
    }
};

/**
 * Change the visibility to the next div with attribute 'role'
 * @param div, the div we need to hide brother.
 */
var changeVisibility = function (div) {
    div = div.nextSibling;
    while (div.className === undefined || div.getAttribute('role') !== "hidden") {
        div = div.nextSibling;
    }
    if (div.style.display === 'none') {
        div.style.display = 'block';
    } else {
        div.style.display = 'none';
    }
};
