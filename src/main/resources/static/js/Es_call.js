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
        data: JSON.stringify(dataForSearch),
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