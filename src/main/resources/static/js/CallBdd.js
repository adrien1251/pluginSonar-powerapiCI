/**
 * The proxy to dodge access control
 * @type {string}
 */
var proxy = 'https://cors-anywhere.herokuapp.com/';

/**
 * ElasticSearch index String URL
 * @type {string}
 */
const ES_URL = "http://elasticsearch.app.projet-davidson.fr/powerapici/_search";

/**
 * Do ajax call to get data you need
 * @param dataForSearch json data
 * @returns {*} ajax request, you can do more with .done()
 */
var esCall = function (dataForSearch) {
    return $.ajax({
        url: proxy + ES_URL,
        type: "POST",
        dataType: 'json',
        data: JSON.stringify(dataForSearch)
    });
};


/**
 * Search all field on the elasticsearch index with project name project
 * @param fieldName it's the column you need in table
 * @returns {*} ajax request, you can do more with .done()
 */
var searchAllSomething = function (fieldName) {
    var data = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            app_name: projectName
                        }
                    }
                ]
            }
        },
        "_source": fieldName
    };

    return esCall(data);
};


/**
 * print on screen all data for the build you give
 * @param buildName : build name to search
 */
var dataFromField = function (buildName) {
    var data = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            app_name: projectName
                        }
                    },
                    {
                        "term": {
                            build_name: buildName
                        }
                    }
                ]
            }
        }
    };

    esCall(data).done(function (response) {
        printPowerapiCIData(response.hits.hits[0]._source);
        actual_powerapi_data = response.hits.hits[0]._source;
    });
};

/**
 * Get the previous build name
 * @param actualTimetamps: the timestamp you need to search previous
 * @return {String} the previous build name
 */
function getPreviousBuildName(actualTimetamps) {
    var returnBuild = {build_name: "", timestamp:0};
    all_build_timestamp.forEach(function(build){
        if(build.timestamp < actualTimetamps && build.timestamp > returnBuild.timestamp){
            returnBuild = build;
        }
    });

    return returnBuild.build_name;
}

const UPPER_ENERGY = 1.1;
const LOWER_ENERGY = 0.9;
/**
 * Fill div into the hashmap for saw the tendency.
 * @param actualBuildTimestamp : timestamp you need to search previous
 * @param hashMap : [testName] = {divToFill, energy}
 */
var fillTendency = function (actualBuildTimestamp, hashMap) {
    var previous_build_name = getPreviousBuildName(actualBuildTimestamp);
    var data = {
        "query": {
            "bool": {
                "must": [
                    {
                        "term": {
                            app_name: projectName
                        }
                    },
                    {
                        "term": {
                            build_name: "" + previous_build_name
                        }
                    }
                ]
            }
        }
    };

    esCall(data).done(function (response) {
        if (response.hits.total === 0) {
            for (var key in hashMap) {
                if (hashMap.hasOwnProperty(key)) hashMap[key].divToFill.setAttribute('class', hashMap[key].divToFill.getAttribute('class') + ' oi oi-media-record');
            }
        } else {
            var classes = response.hits.hits[0]._source.classes;

            //For the header
            if (hashMap.hasOwnProperty('totalEnergy'))
                hashMap['totalEnergy'].divToFill.setAttribute('class', hashMap['totalEnergy'].divToFill.getAttribute('class') + " " + findArrow(response.hits.hits[0]._source.energy, hashMap['totalEnergy'].energy));

            classes.forEach(function (classe) {
                var previousEnergy = 0;
                classe.methods.forEach(function (method) {
                    if (actual_filter === undefined || method.name.match(actual_filter))
                        previousEnergy += method.energy;

                    if (hashMap.hasOwnProperty(method.name)) {
                        hashMap[method.name].divToFill.setAttribute('class', findArrow(method.energy, hashMap[method.name].energy));
                        hashMap[method.name].divToFill.style.color = getColor(method.energy, hashMap[method.name].energy);
                    }
                });
                if (hashMap.hasOwnProperty(classe.name))
                    hashMap[classe.name].divToFill.style.color = getColor(previousEnergy, hashMap[classe.name].energy);
            });
        }
    });
};

/**
 * Return the color of the text need to be
 * @param previousEnergy
 * @param actualEnergy
 * @return {string} GREEN if the energy is good tendency, RED else
 */
var getColor = function (previousEnergy, actualEnergy) {
    return actualEnergy > previousEnergy * UPPER_ENERGY ? "red" : actualEnergy < previousEnergy * LOWER_ENERGY ? "#2ae12a" : "";
};

/**
 * Return the arrow class to put
 * @param previousEnergy
 * @param actualEnergy
 * @return {string} arrow class (UP if energy is good tendency, RED else)
 */
var findArrow = function (previousEnergy, actualEnergy) {
    return actualEnergy > previousEnergy * UPPER_ENERGY ? 'oi oi-arrow-thick-top' :
        actualEnergy < previousEnergy * LOWER_ENERGY ? 'oi oi-arrow-thick-bottom' : 'oi oi-arrow-thick-right';
};