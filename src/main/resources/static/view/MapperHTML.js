/**
 * Map HTML file with hashMap data
 * @param htmlFile
 * @param hashMap
 * @return {*} the map html file
 */
var mapFile = function (htmlFile, hashMap) {
    var html = htmlFile;
    var index = html.indexOf("${");
    var lastIndex = 0;
    while (index > -1) {
        var nextIndex = html.indexOf("}", index);
        var variableName = html.substring(index + 2, nextIndex);

        html = html.replace("${" + variableName + "}", hashMap[variableName]);

        lastIndex = index;
        index = html.indexOf("${", lastIndex + 1);
    }

    return html;
};

/**
 * Map detail test html
 * @param test the test you need to transform in html
 * @param buildName build name of the test
 * @param divInsert the div you need to insert the test
 * @return {Element} the arrow span to put arrow after that
 */
var mapDetailTest = function(test, buildName, divInsert){
    var hashMap = {};
    hashMap['testName'] = test.name;
    hashMap['numberOfIterations'] = test.iterations.length;
    hashMap['energyTest'] = Number.parseFloat(test.energy).toPrecision(4);
    hashMap['durationTest'] = test.duration;

    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'col-6 test_div');
    toHtml.innerHTML = mapFile(HTML_FILE["detailTest"], hashMap);

    createBoxPlot(fillJSonForD3JS(test), toHtml.getElementsByClassName('canvas_boxplot')[0], 300, 350);
    divInsert.appendChild(toHtml);

    return toHtml.getElementsByClassName('arrow')[0];
};

/**
 * map the header html
 * @param powerapiData the powerapiData to print in html
 * @return {Element} the span arrow to put arrow inside
 */
var mapHeader = function(powerapiData){
    var hashMap = {};
    hashMap['url_project'] = powerapiData.scm_url;
    hashMap['nameProject'] = powerapiData.app_name;
    hashMap['buildNumber'] = powerapiData.build_name;
    hashMap['branchName'] = powerapiData.branch;
    hashMap['commitName'] = powerapiData.commit_name;
    hashMap['executionDuration'] = powerapiData.duration;
    hashMap['energyAllBuild'] = Number.parseFloat(powerapiData.energy).toPrecision(4);
    hashMap['numberOfClass'] = powerapiData.classes.length;
    hashMap['url_build'] = powerapiData.build_url;

    var toHtml = document.createElement('div');
    toHtml.innerHTML = mapFile(HTML_FILE["header"], hashMap);
    divForInsertingTest.appendChild(toHtml);

    return toHtml.getElementsByClassName('arrow')[0];
};

/**
 * map the select list html
 * @param list the list to put inside
 * @param nameList
 * @param labelName
 * @param onChange string function to execute when we change the list
 * @param selectedValue actual value to print in first
 */
var mapSelectList = function(list, nameList, labelName, onChange, selectedValue){
    var hashMap = {};
    hashMap['nameList'] = nameList;
    hashMap['labelName'] = labelName;
    hashMap['onChange'] = onChange;
    hashMap['optionList'] = generateOptionList(list, selectedValue);


    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'center-vertical');
    toHtml.innerHTML = mapFile(HTML_FILE["selectList"], hashMap);
    actual_select_list = toHtml;
    divForInsertingMenu.appendChild(toHtml);
};

/**
 * map detail class HTML
 * @param classe
 * @param energy
 * @param nbTest
 * @return {HTMLDivElement} the text to insert color inside
 */
var mapDetailClass = function(classe, energy, nbTest){
    var hashMap = {};
    hashMap['className'] = classe.name;
    hashMap['numberOfTest'] = nbTest;
    hashMap['energy'] = Number.parseFloat(energy).toPrecision(4);

    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'margin-top-bot text-center');
    toHtml.innerHTML = mapFile(HTML_FILE["detailClass"], hashMap);

    return toHtml;
};