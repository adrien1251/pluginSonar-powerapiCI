var proxy = 'https://cors-anywhere.herokuapp.com/';
const ES_URL = "http://elasticsearch.app.projet-davidson.fr/powerapici_test/_search";

/**
 * Do ajax call to get dataSearch
 * @param dataForSearch
 * @returns {*}
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
 * Search all field on the elasticsearch index
 * @param fieldName the field to search
 */
var searchAllSomething = function (fieldName) {
    var data = {
        "query": {
            "match_all": {}
        },
        "_source": [fieldName]
    };

    return esCall(data);
};


/**
 * Get value for the build name build_name
 * @param build_name : build name to search
 */
var dataFromField = function (build_name) {
    var data = {
        "query": {
            "bool": {
                "must": [
                    {"match": {build_name: build_name}}
                ]
            }
        }
    };

    esCall(data).done(function (response) {
        printPowerapiCIData(response.hits.hits[0]._source);
    });
};

/**
 * Get value for the build name previous_build_name
 * @param previous_build_name : build name to search
 */
var energyFromPreviousBuild = function (actual_select_list, build_name) {
var tmpList = [] ;
    for(var i = 0 ; i < actual_select_list.length ; i++){
        if(actual_select_list(i) < build_name){
            tmpList.add(build_name - actual_select_list)
        }
    }
    var previous_build_name = actual_select_list.max();
    var data = {
        "query": {
            "bool": {
                "must": [
                    {"match": {build_name: previous_build_name}}
                ]
            }
        }
    };

    esCall(data).done(function (response) {
        printPowerapiCIData(response.hits.hits[0].energy);
    });
};