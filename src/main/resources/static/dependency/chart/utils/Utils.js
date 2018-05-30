/**
 * Create data for feed graph
 * @param labels : title of data
 * @param data : data to print
 * @return {{labels: *, datasets: *[]}}
 */
var create_data_for_graph = function(labels, data){
    return {
        labels: labels,
        datasets: [{
            label: 'Energie par test',
            data: data
        }]
    }
};

/**
 * Create graph and display it into canvas
 * @param canvas : display the graph into it
 * @param type : Line, Bar, Radar, Bubble, Area, Mixed..
 * @param data : data create by "create_data_for_graph"
 */
var creer_graph = function(canvas, type, data){
    new Chart(canvas, {
        type: type,
        data: data,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
};