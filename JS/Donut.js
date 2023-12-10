function goHome() {
    window.location.href = "index.html";
}

// Load the CSV file and create the donut chart
d3.csv("Data/cars.csv").then(function (data) {
    // Extract the "Identification.Classification" values
    var classifications = data.map(function (d) {
        return d["Identification.Classification"];
    });

    // Count the occurrences of each classification
    var counts = {};
    classifications.forEach(function (classification) {
        counts[classification] = (counts[classification] || 0) + 1;
    });

    // Convert counts to an array of objects
    var dataForDonut = Object.keys(counts).map(function (classification) {
        return { classification: classification, count: counts[classification] };
    });

    // Set up the dimensions for the chart
    var width = 1500;
    var height = 400;
    var radius = Math.min(width, height) / 2;

    // Set up color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the SVG element
    var svg = d3.select("#donut-container")
        .append("svg")
        .attr("width", width+50)
        .attr("height", height+50)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    svg.append('text')
        .attr('x',-550)
        .attr('y', -150) // Adjust the y-position as needed
        .attr('text-anchor', 'middle') // This ensures the text is centered
        .style('font-size', '50px') // Adjust font size as needed
        .style('font-family', 'Roboto, sans-serif') // Adjust the font family as needed
        .text('Donut Chart ');
    // Create the donut chart
    var arc = d3.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.count; });

    var arcs = svg.selectAll("arc")
        .data(pie(dataForDonut))
        .enter()
        .append("g")
        .attr("class", "arc")
        .on("mouseover", function (event, d) {
            // Mouseover event handler
            d3.select(this)
                .select("path")
                .attr("stroke", "black")
                .attr("stroke-width", 2)
                .attr("opacity", 0.8);
        })
        .on("mouseout", function (event, d) {
            // Mouseout event handler
            d3.select(this)
                .select("path")
                .attr("stroke", "none")
                .attr("stroke-width", 0)
                .attr("opacity", 1);
        });

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) { return color(i); });

    // Append text with count to the center of each arc
    arcs.append("text")
        .attr("class", "count-label")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) { return d.data.count; })
        .style("font-size", "12px");

    // Append text with percentage to each arc
    arcs.append("text")
        .attr("class", "percentage-label")
        .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", "1.5em")
        .attr("text-anchor", "middle")
        .text(function (d) { return ((d.data.count / d3.sum(dataForDonut, function (d) { return d.count; })) * 100).toFixed(2) + "%"; })
        .style("font-size", "10px");

    // Create legend
    var legend = d3.select("#donut-container")
        .append("div")
        .attr("class", "donut-legend")
        .selectAll("div")
        .data(dataForDonut)
        .enter()
        .append("div")
        .style("display", "flex")
        .style("align-items", "center");

    legend.append("div")
        .attr("class", "donut-legend-rect")
        .style("background-color", function (d, i) { return color(i); });

    legend.append("div")
        .attr("class", "donut-legend-text")
        .text(function (d) { return d.classification; });
});




