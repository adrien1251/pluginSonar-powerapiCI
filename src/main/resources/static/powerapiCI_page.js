window.registerExtension('powerapiCI/powerapiCI_page', function (options) {

    window.SonarRequest.getJSON('/api/issues/search', {
        resolved: false,
        componentKeys: options.component.key
    }).then(function (arg) {
        var titre = document.createElement('h1');
        titre.textContent = "Stat global du projet sur le dernier commit " + options.component.key;
        options.el.appendChild(titre);

        var proxy = 'https://cors-anywhere.herokuapp.com/';
        $.ajax({
            url: proxy+"http://elasticsearch.app.projet-davidson.fr/powerapici/_search",
            type: "GET",
            dataType: 'json'

        }).done(function(response) {
            var table_data = response.hits.hits;
            table_data.forEach(function(powerapiData){
                options.el.appendChild(printPowerapiCIData(powerapiData._source));
            });
        });
    });
    return function () {
        options.el.textContent = '';
    };
});

/* Mes fonctions */
var printPowerapiCIData = function(powerapiData){
    var liste = document.createElement('ul');

    var li = document.createElement('li');
    li.textContent = "Nom du test: "+powerapiData.testName;
    liste.appendChild(li);

    li = document.createElement('li');
    li.textContent = "Commit du test: "+powerapiData.commitName;
    liste.appendChild(li);

    li = document.createElement('li');
    li.textContent = "Puissance du test: "+powerapiData.power;
    liste.appendChild(li);

    return liste;
}