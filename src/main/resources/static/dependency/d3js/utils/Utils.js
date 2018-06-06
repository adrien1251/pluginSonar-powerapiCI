var createBoxPlot = function(jsonData, insert_div, width_cons, height_cons) {
    var labels = true; // show the text labels beside individual boxplots?

    var margin = {top: 30, right: 100, bottom: 70, left: 50};
    var width = width_cons || window.innerWidth;
    width = width - margin.left - margin.right;

    var height = height_cons || window.innerHeight;
    height = height - margin.top - margin.bottom;

    var min = Infinity,
        max = -Infinity;

    var data = [];

    var divPutBox = insert_div || "body";

    var cpt = 0;
    for (var name of Object.keys(jsonData[0])) {
        data[cpt] = [];
        data[cpt][0] = name;
        data[cpt][1] = [];
        cpt++;
    }

    jsonData.forEach(function (x) {
        cpt = 0;
        for (var name of Object.keys(jsonData[0])) {
            var nb = x[name];
            data[cpt][1].push(nb);

            if (max < nb) max = nb;
            if (min > nb) min = nb;
            cpt++;
        }
    });

    var chart = d3.box()
        .whiskers(iqr(1.5))
        .height(height)
        .domain([min, max])
        .showLabels(labels);

    var svg = d3.select(divPutBox).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "box")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // the x-axis
    var x = d3.scale.ordinal()
        .domain(data.map(function (d) {
            return d[0]
        }))
        .rangeRoundBands([0, width], 0.7, 0.3);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    // the y-axis
    var y = d3.scale.linear()
        .domain([min, max])
        .range([height + margin.top, margin.top]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    // draw the boxplots
    svg.selectAll(".box")
        .data(data)
        .enter().append("g")
        .attr("transform", function (d) {
            return "translate(" + x(d[0]) + "," + margin.top + ")";
        })
        .call(chart.width(x.rangeBand()));

    // draw y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
};

// Returns a function to compute the interquartile range.
function iqr(k) {
    return function(d) {
        var q1 = d.quartiles[0],
            q3 = d.quartiles[2],
            iqr = (q3 - q1) * k,
            i = -1,
            j = d.length;
        while (d[++i] < q1 - iqr);
        while (d[--j] > q3 + iqr);
        return [i, j];
    };
};


var remplirJSonForD3JS = function(test){
    var json = [];
    var nbIterations = test.iterations.length;
    for(var i=0; i<nbIterations; i++){
        var iteration = {};
        iteration[test.name] = test.iterations[i].energy;
        json.push(iteration);
    }
    return json;
};