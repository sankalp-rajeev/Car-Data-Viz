// //Nav back to home page
// function goHome() {
//     window.location.href = "index.html";
// }
// ----------------------------------------------------------------
//data storing
// ----------------------------------------------------------------
// let carsData = [];  check the data
// ----------------------------------------------------------------
// let FuelInfoCityMpg = [];
// let IdentificationModelMake = [];

//data loading for 
d3.csv("Data/cars.csv")
    .then(function (data) {
        carsData = data;
        createRadialBarChart()
    })
    .catch(function (error) {
        console.error("Error loading file", error)
    });

function toggleMake(d) {
    const isVisible = !d3.select(this).classed("disabled");
    d3.select(this).classed("disabled", isVisible);
    svg.selectAll("path")
        .filter(e => e.make === d.make)
        .transition()
        .duration(500)
        .attr("opacity", isVisible ? 0 : 1);
}
//function for viz-1: radial bar chart
function createRadialBarChart() {
    const width = 1200;
    const height = 800;
    const margin = { top: 100, right: 200, bottom: 100, left: 200 };
    const innerRadius = 75;
    const outerRadius = Math.min(width, height) / 2 - margin.top;

    // Process data to calculate average MPG for each make
    let avgMpgByMake = {};
    carsData.forEach(function (d) {
        if (!avgMpgByMake[d['Identification.Make']]) {
            avgMpgByMake[d['Identification.Make']] = { totalMpg: 0, count: 0 };
        }
        avgMpgByMake[d['Identification.Make']].totalMpg += Number(d['Fuel Information.City mpg']);
        avgMpgByMake[d['Identification.Make']].count += 1;
    });

    for (let make in avgMpgByMake) {
        avgMpgByMake[make] = avgMpgByMake[make].totalMpg / avgMpgByMake[make].count;
    }

    // Convert the object to an array for D3 processing
    let avgMpgData = Object.keys(avgMpgByMake).map(function (key) {
        return { make: key, avgMpg: avgMpgByMake[key] };
    });

    // Sort the data
    avgMpgData.sort(function (a, b) {
        return b.avgMpg - a.avgMpg;
    });



    const svg = d3.select("#actual-container").append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");;


    svg.append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text("Average MPG by Car Make");
    // Scale for the radial bars
    const x = d3.scaleBand()
        .range([0, 2 * Math.PI])
        .align(0)
        .domain(avgMpgData.map(d => d.make))
        .padding(0.5);

    const y = d3.scaleRadial()
        .range([innerRadius, outerRadius])
        .domain([0, d3.max(avgMpgData, d => d.avgMpg)]);
    // color scale 
    const color = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(avgMpgData.map(d => d.make));
    //creating a tooltip for the chart 
    const tooltip = d3.select("#actual-container").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    svg.append("defs")
        .selectAll("linearGradient")
        .data(avgMpgData)
        .enter().append("linearGradient")
        .attr("id", d => "gradient-" + d.make)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", y(0))
        .attr("x2", 0).attr("y2", d => y(d.avgMpg))
        .selectAll("stop")
        .data(d => [
            { offset: "0%", color: color(d.make) },
            { offset: "100%", color: d3.rgb(color(d.make)).brighter(0.5) } // Adjust brightness
        ])
        .enter().append("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    // Adding the bars with colors
    svg.append("g")
        .selectAll("path")
        .data(avgMpgData)
        .enter()
        .append("path")
        .attr("fill", d => "url(#gradient-" + d.make + ")")
        .attr("d", d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(d => y(d.avgMpg))
            .startAngle(d => x(d.make))
            .endAngle(d => x(d.make) + x.bandwidth())
            .padAngle(0.01)
            .padRadius(innerRadius))
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(y(d.avgMpg) * 1.75) // increase the bar size
                    .startAngle(x(d.make))
                    .endAngle(x(d.make) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius));

            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Avg MPG of  " + d.make + ": " + d.avgMpg.toFixed(2))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(y(d.avgMpg))
                    .startAngle(x(d.make))
                    .endAngle(x(d.make) + x.bandwidth())
                    .padAngle(0.01)
                    .padRadius(innerRadius));

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    
    // Add label
    svg.append("g")
        .selectAll("g")
        .data(avgMpgData)
        .enter()
        .append("g")
        .attr("text-anchor", function (d) { return (x(d.make) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "end" : "start"; })
        .attr("transform", function (d) { return "rotate(" + ((x(d.make) + x.bandwidth() / 2) * 180 / Math.PI - 90) + ")" + "translate(" + (y(d.avgMpg) + 10) + ",0)"; })
        .append("text")
        .text(d => d.make)
        .attr("transform", function (d) { return (x(d.make) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI ? "rotate(180)" : "rotate(0)"; })
        .style("font-size", "14px")
        .attr("alignment-baseline", "middle");

    const legend = svg.append("g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2 + outerRadius + 30) + ")") // Adjust the translation
        .selectAll("g")
        .data(avgMpgData)
        .enter().append("g")
        .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", d => color(d.make))
        .on("click", toggleMake);

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text(d => d.make)
        .on("click", toggleMake);
}
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
