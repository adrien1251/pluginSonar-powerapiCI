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

var mapDetailTest = function(test, buildName, divInsert){
    var hashMap = {};
    hashMap['testName'] = test.name;
    hashMap['numberOfIterations'] = test.iterations.length;
    hashMap['energyTest'] = Number.parseFloat(test.energy).toPrecision(4);
    hashMap['durationTest'] = test.duration;

    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'col-6 test_div');
    toHtml.innerHTML = mapFile(HTML_FILE[1], hashMap);

    createBoxPlot(remplirJSonForD3JS(test), toHtml.getElementsByClassName('canvas_boxplot')[0], 300, 350);
    arrowDirection(buildName, test, toHtml.getElementsByClassName('arrow')[0]);
    divInsert.appendChild(toHtml);
};

const arrowDirection = function(buildName, test, div){
    energyFromPreviousBuild(buildName, test, div);
};

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
    toHtml.innerHTML = mapFile(HTML_FILE[2], hashMap);
    divForInsertingTest.appendChild(toHtml);
};

var mapSelectList = function(list, nameList, labelName, onChange, selectedValue){
    var hashMap = {};
    hashMap['nameList'] = nameList;
    hashMap['labelName'] = labelName;
    hashMap['onChange'] = onChange;
    hashMap['optionList'] = generateOptionList(list, selectedValue);


    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'center-vertical');
    toHtml.innerHTML = mapFile(HTML_FILE[0], hashMap);
    actual_select_list = toHtml;
    divForInsertingMenu.appendChild(toHtml);
};

var mapDetailClass = function(classe){
    var hashMap = {};
    hashMap['className'] = classe.name;
    hashMap['numberOfTest'] = classe.methods.length;
    hashMap['energy'] = Number.parseFloat(classe.energy).toPrecision(4);;

    var toHtml = document.createElement('div');
    toHtml.setAttribute('class', 'margin-top-bot text-center');
    toHtml.innerHTML = mapFile(HTML_FILE[3], hashMap);

    return toHtml;
};