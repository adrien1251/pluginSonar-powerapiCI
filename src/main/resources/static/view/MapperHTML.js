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

var mapDetailTest = function(test){
    var hashMap = {};
    hashMap['testName'] = test.name;
    hashMap['numberOfIterations'] = test.iterations.length;
    hashMap['energyTest'] = test.energy;
    hashMap['durationTest'] = test.duration;
    hashMap['tendency'] = 'oi oi-arrow-thick-right';

    divToInsert.innerHTML += mapFile(HTML_FILE[0], hashMap);
};

var mapHeader = function(powerapiData){
    var hashMap = {};
    hashMap['buildNumber'] = powerapiData.build_name;
    hashMap['projectName'] = powerapiData.app_name;
    hashMap['branchName'] = powerapiData.branch;
    hashMap['commitName'] = powerapiData.commit_name;
    hashMap['executionDuration'] = powerapiData.duration;
    hashMap['numberOfTests'] = powerapiData.methods.length;

    divToInsert.innerHTML += mapFile(HTML_FILE[1], hashMap);
};