
let carsData3 = [];
// Data loading
d3.csv("Data/cars.csv")
    .then(function (data) {
        carsData3 = data;
        // Populate the car make dropdown options
        populateDropdownforHeat(carsData3);
        // Draw the initial heatmap
        heatmap();
    })
    .catch(function (error) {
        console.error("Error loading file", error);
    });

// Function to populate the car make dropdown options
function populateDropdownforHeat(data) {
    var select = d3.select("#carMakeDropdown");
    
    // Extract unique makes
    var uniqueMakes = Array.from(new Set(data.map(function(d) { 
      return d["Identification.Make"]; 
    })));
  
    // Sort the makes alphabetically
    uniqueMakes.sort();
  
    // Populate dropdown with unique makes
    select.selectAll("option")
      .data(uniqueMakes)
      .enter()
      .append("option")
      .text(function(d) { return d; }) // Use the car make as the text
      .attr("value", function(d) { return d; });
  
    // Dropdown change event listener
    select.on("change", function() {
      var selectedMake = d3.select(this).property("value");
      updateHeatmap();
    });
  }
  
function initializeHeatmap() {
    d3.csv("Data/cars.csv")
        .then(function (data) {
            carsData3 = data;
            preprocessData();
            createScalesAndAxes();
            createColorScale();
            createHeatmapCells();
        })
        .catch(function (error) {
            console.error("Error loading file", error);
        });
}

function preprocessData() {
    carsData3.forEach(function (d) {
        d["Engine Information.Engine Statistics.Torque"] = parseInt(d["Engine Information.Engine Statistics.Torque"]);
        d["Identification.Year"] = parseInt(d["Identification.Year"]);
    });
}


function heatmap(data) {
    const width = 1200;
    const height = 800;
    const margin = { top: 100, right: 200, bottom: 100, left: 200 };

    const tooltip = d3.select("#heatmap-container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip");
    const svg = d3.select("#heatmap-container").append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    svg.append("text")
        .attr("class", "heatmap-title")
        .attr("x", width / 2) // Centering the title
        .attr("y", -margin.top / 2 + 20) // Positioning above the heatmap
        .attr("text-anchor", "middle")
        .text("Car Torque Distribution by Make and Year")
        .style("font-size", "24px")
        .style("font-weight", "bold");
    carsData3.forEach(function (d) {
        d["Engine Information.Engine Statistics.Torque"] = parseInt(d["Engine Information.Engine Statistics.Torque"]);
        d["Identification.Year"] = parseInt(d["Identification.Year"]);
    });

    // Define the scales and axes
    const x = d3.scaleBand()
        .range([0, width])
        .domain(carsData3.map(d => d["Identification.Year"]))
        .padding(0.1);
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");


    const sortedCarMakes = Array.from(new Set(carsData3.map(d => d["Identification.Make"]))).sort((a, b) => a.localeCompare(b));

    const y = d3.scaleBand()
        .range([height, 0])
        .domain(sortedCarMakes) // Use the sorted array
        .padding(0.1);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Build color scale
    const myColor = d3.scaleSequential()
        .interpolator(d3.interpolateYlGnBu)
        .domain([0, d3.max(carsData3, d => d["Engine Information.Engine Statistics.Torque"])]);

    // Create the heatmap cells
    svg.selectAll()
        .data(data || carsData3)
        .enter()
        .append("rect")
        .attr("x", d => x(d["Identification.Year"]))
        .attr("y", d => y(d["Identification.Make"]))
        .attr("width", x.bandwidth())
        .attr("height", y.bandwidth())
        .style("fill", d => myColor(d["Engine Information.Engine Statistics.Torque"]))
        .style("stroke", "#ffffff")// Add white border for better separation
        .on("mouseover", function (event, d) {
            // Show tooltip with additional information
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);

            const tooltipContent = `
            <strong>Year:</strong> ${d["Identification.Year"]}<br>
            <strong>Make:</strong> ${d["Identification.Make"]}<br>
            <strong>Torque:</strong> ${d["Engine Information.Engine Statistics.Torque"]}<br>
            <strong>Horsepower:</strong> ${d["Engine Information.Engine Statistics.Horsepower"]}<br>
            <strong>MPG (City):</strong> ${d["Fuel Information.City mpg"]}<br>
            <strong>MPG (Highway):</strong> ${d["Fuel Information.Highway mpg"]}<br>
        `;

            tooltip.html(tooltipContent)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function () {
            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    const legendWidth = 20;
    const legendHeight = 300;
    const legendPosition = { x: width + margin.right - legendWidth - 60, y: (height - legendHeight) / 2 };

    // Append legend SVG group
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendPosition.x}, ${legendPosition.y})`);

    legend.append("text")
        .attr("x", 0)
        .attr("y", -10) // Positioning the title slightly above the top of the legend
        .text("Torque") // The title text
        .attr("class", "legend-title");
    // Define the number of legend elements and color range
    const numberOfLegendItems = 10;
    const legendDomain = d3.range(0, 1, 1.0 / numberOfLegendItems);

    const maxTorque = d3.max(carsData3, d => d["Engine Information.Engine Statistics.Torque"]);

    // Create legend rectangles
    legend.selectAll("rect")
        .data(legendDomain)
        .enter().append("rect")
        .attr("y", (d, i) => i * (legendHeight / numberOfLegendItems))
        .attr("width", legendWidth)
        .attr("height", legendHeight / numberOfLegendItems)
        .style("fill", d => myColor(d * maxTorque));

    // Add text labels to legend
    legend.selectAll("text")
        .data(legendDomain)
        .enter().append("text")
        .attr("x", legendWidth + 5)
        .attr("y", (d, i) => i * (legendHeight / numberOfLegendItems) + (legendHeight / numberOfLegendItems / 2))
        .text(d => Math.round(d * maxTorque))
        .attr("alignment-baseline", "middle");

}
function updateHeatmap() {
    const selectedMake = document.getElementById("carMakeDropdown").value;
    const filteredData = (selectedMake === "all") ? carsData3 : carsData3.filter(d => d["Identification.Make"] === selectedMake);

    // Select the existing heatmap SVG
    const svg = d3.select("#heatmap").select("svg");

    svg.selectAll("rect").remove();

    // Draw the updated heatmap
    heatmap(filteredData);
}
