var createBoxPlot = function(jsonData) {
    var labels = true; // show the text labels beside individual boxplots?

    var margin = {top: 30, right: 50, bottom: 70, left: 50};
    var width = 1200 - margin.left - margin.right;
    var height = 800 - margin.top - margin.bottom;

    var min = Infinity,
        max = -Infinity;

    var data = [];

    var cpt = 0;
    for(var name of Object.keys(jsonData[0])){
        data[cpt] = [];
        data[cpt][0] = name;
        data[cpt][1] = [];
        cpt++;
    }

    jsonData.forEach(function (x) {
        cpt = 0;
        for(var name of Object.keys(jsonData[0])){
            var nb = x[name];
            data[cpt][1].push(nb);

            if(max < nb) max = nb;
            if(min > nb) min = nb;
            cpt++;
        }
    });

    var chart = d3.box()
        .whiskers(iqr(1.5))
        .height(height)
        .domain([min, max])
        .showLabels(labels);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "box")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // the x-axis
    var x = d3.scale.ordinal()
        .domain(data.map(function (d) {
            console.log(d);
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


    // add a title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        //.style("text-decoration", "underline")
        .text("BoxPlot energy");

    // draw y axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text") // and text1
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style("font-size", "16px")
        .text("Energy en J");

    // draw x axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height + margin.top + 10) + ")")
        .call(xAxis);
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