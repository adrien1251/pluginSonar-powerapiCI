var randomColor = function () {
    return "rgba(" + Math.floor(Math.random() * Math.floor(256)) + "," +
        "" + Math.floor(Math.random() * Math.floor(256)) + ", " +
        "" + Math.floor(Math.random() * Math.floor(256)) + ", 1)";
};

/**
 * Create data for feed graph
 * @param labels : title of data
 * @param data : data to print
 * @return {{labels: *, datasets: *[]}}
 */
var createDataForGraph = function (labels, data) {
    return {
        labels: labels,
        datasets: [{
            label: 'Energie par test',
            data: data
        }]
    }
};

var createDataForBubbleGraph = function (labels, data) {
    var dataReturn = {};
    dataReturn.datasets = [];
    for (var i = 0; i < labels.length; i++) {
        dataReturn.datasets.push({label: labels[i], data: data[i], backgroundColor: randomColor()});
    }
    return dataReturn;
};

var fillDataForTestSuiteGraph = function (classes) {
    var labels = [];
    var data = [];
    classes.forEach(function (classe) {
        var bubble = [];

        var nbIterations = classe.methods[0].iterations.length;
        for(var i=1; i<=nbIterations; i++) {
            var obj = {energy: 0, duration: 0};
            classe.methods.forEach(function (method) {
                var o = method.iterations.find(function (it) {
                    return it.n === i;
                });
                obj.energy = o.energy;
                obj.duration = o.time_end - o.time_begin;
            });
            bubble.push({x:obj.duration, y:obj.energy, r: 10});
        }

        labels.push(classe.name);
        data.push(bubble);
    });

    return createDataForBubbleGraph(labels, data);
};
/**
 * Create graph and display it into canvas
 * @param canvas : display the graph into it
 * @param type : Line, Bar, Radar, Bubble, Area, Mixed..
 * @param data : data create by "createDataForGraph"
 */
var createGraph = function (canvas, type, data) {
    new Chart(canvas, {
        type: type,
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
};