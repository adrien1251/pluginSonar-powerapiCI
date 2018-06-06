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

var mapDetailTest = function(test, buildName){
    var hashMap = {};
    hashMap['testName'] = test.name;
    hashMap['numberOfIterations'] = test.iterations.length;
    hashMap['energyTest'] = test.energy;
    hashMap['durationTest'] = test.duration;

    var toHtml = document.createElement('div');
    toHtml.innerHTML = mapFile(HTML_FILE[0], hashMap);

    createBoxPlot(remplirJSonForD3JS(test), toHtml.getElementsByClassName('canvas_boxplot')[0], 300, 200);
    arrowDirection(buildName, test, toHtml.getElementsByClassName('arrow')[0]);
    divToInsert.appendChild(toHtml);
};

const arrowDirection = function(buildName, test, div){
    energyFromPreviousBuild(buildName, test, div);

};

var mapHeader = function(powerapiData){
    var hashMap = {};
    hashMap['buildNumber'] = powerapiData.build_name;
    hashMap['projectName'] = powerapiData.app_name;
    hashMap['branchName'] = powerapiData.branch;
    hashMap['commitName'] = powerapiData.commit_name;
    hashMap['executionDuration'] = powerapiData.duration;
    hashMap['energyAllBuild'] = powerapiData.energy;
    hashMap['numberOfTests'] = powerapiData.methods.length;

    var toHtml = document.createElement('div');
    toHtml.innerHTML = mapFile(HTML_FILE[1], hashMap);
    divToInsert.appendChild(toHtml);
};
