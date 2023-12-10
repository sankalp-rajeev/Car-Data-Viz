let globalData;

// Load the data
d3.csv("Data/cars.csv").then(csvData => {
  globalData = csvData;
  populateDropdownforI(globalData);
  createVisualization(globalData); // Initial plot with all data
});

function populateDropdownforI(data) {
  var select = d3.select("#carSelect");

  // Extract unique makes
  var uniqueMakes = ["Select a car", ...new Set(globalData.map(d => d["Identification.Make"]))];
  
// ["Select a car", ...new Set(carsData2.map(d => d["Identification.Make"]))];
  // Sort the makes alphabetically
  uniqueMakes.sort();

  // Populate dropdown with unique makes
  select.selectAll("option")
    .data(uniqueMakes)
    .enter()
    .append("option")
    .text(function (d) { return d; }) // Use the car make as the text
    .attr("value", function (d) { return d; });

  // Dropdown change event listener
  select.on("change", function () {
    var selectedMake = d3.select(this).property("value");
    updateVisualization(selectedMake);
  });
}

function createVisualization(data) {
  // Dimensions and margins of the plot
  var margin = { top: 90, right: 30, bottom: 30, left: 30 },
    width = 1600 - margin.left - margin.right,  // Increased width
    height = 550 - margin.top - margin.bottom;  // Increased height

  var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  colorScale.domain(data.map(function (d) { return d["Identification.Make"]; }));
  var abbreviations = {
    "Dimensions.Length": "Length",
    "Dimensions.Width": "Width",
    "Dimensions.Height": "Height",
    "Engine Information.Number of Forward Gears": "Gears",
    "Fuel Information.City mpg": "City mpg",
    "Fuel Information.Highway mpg": "Hwy mpg",
    "Engine Information.Engine Statistics.Horsepower": "HP",
    "Engine Information.Engine Statistics.Torque": "Torque"
  };

  // Append the svg object to the body of the page
  var svg = d3.select("#car-visualization")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Convert numeric data from strings to numbers
  data.forEach(function (d) {
    d["Dimensions.Length"] = +d["Dimensions.Length"];
    d["Dimensions.Width"] = +d["Dimensions.Width"];
    d["Dimensions.Height"] = +d["Dimensions.Height"];
    d["Engine Information.Number of Forward Gears"] = +d["Engine Information.Number of Forward Gears"];
    d["Fuel Information.City mpg"] = +d["Fuel Information.City mpg"];
    d["Fuel Information.Highway mpg"] = +d["Fuel Information.Highway mpg"];
    d["Engine Information.Engine Statistics.Horsepower"] = +d["Engine Information.Engine Statistics.Horsepower"];
    d["Engine Information.Engine Statistics.Torque"] = +d["Engine Information.Engine Statistics.Torque"];
    // d["Fuel Information.Fuel Type"] = +d["Fuel Information.Fuel Type"];
  });

  // Define y as an object to hold scales for each dimension
  var y = {};
  var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  // Extract the list of dimensions (only numeric ones for parallel coordinates) and create a scale for each
  var dimensions = ["Dimensions.Length", "Dimensions.Width", "Dimensions.Height",
    "Engine Information.Number of Forward Gears", "Fuel Information.City mpg",
    "Fuel Information.Highway mpg", "Engine Information.Engine Statistics.Horsepower",
    "Engine Information.Engine Statistics.Torque"].filter(function (d) {
      y[d] = d3.scaleLinear()
        .domain(d3.extent(data, function (p) { return +p[d]; }))
        .range([height, 0]);
      return true;
    });

  // Build the X scale -> it finds the best position for each Y axis
  var x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);

  // Draw the lines
  svg.selectAll("myPath")
    .data(data)
    .enter().append("path")
    .attr("d", function (d) {
      return d3.line()(dimensions.map(function (p) { return [x(p), y[p](d[p])]; }));
    })
    .style("fill", "none")
    .style("stroke", function (d) { return colorScale(d["Identification.Make"]); })
    .style("opacity", 0.5)
    .on("mouseover", function (event, d) {
      // Show tooltip
      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);

      // Customize the content of the tooltip based on your data
      var tooltipContent = Object.entries(d).map(entry => `<strong>${entry[0]}:</strong> ${entry[1]}<br>`).join("");

      tooltip.html(tooltipContent)
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function () {
      // Hide tooltip on mouseout
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });
  // Draw the axes
  svg.selectAll("myAxis")
    .data(dimensions).enter()
    .append("g")
    .attr("class", "axis")
    .attr("transform", function (d) { return `translate(${x(d)})`; })
    .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append("text")
    .attr("y", -15) // Adjust position as needed
    .attr("x", 0)
    .style("text-anchor", "middle")
    .text(function (d) { return abbreviations[d] || d; }) // Use abbreviations
    .style("fill", "black")
    .style("font-size", "12px");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Innovative : Parallel Coordinate Plot");

  svg.selectAll("myPath")
    .style("stroke-width", "1px") // Thinner lines
    .style("stroke", "#69b3a2"); // A more muted color
}

function updateVisualization(selectedCarID) {
  var filteredData = globalData.filter(function (d) {
    return d["Identification.Make"] === selectedCarID;
  });

  // Clear the existing visualization
  d3.select("#car-visualization").selectAll("*").remove();

  createVisualization(filteredData);
}