function goHome() {
  window.location.href = "index.html";
  }
  

// Set up chart dimensions
const beeWidth = 1840;
const beeHeight = 1100;
const beeMargin = { top: 0, right: 0, bottom: 0, left: 10 };



const svg = d3.select("#bee-chart")

.append("svg")
.attr("width", 2000)
.attr("height", beeHeight + beeMargin.top + beeMargin.bottom)
.append("g");




// Load the data from the CSV file
d3.csv("Data/cars.csv").then(function (data_bee) {
  console.log("Data Loaded:", data_bee);

  // Convert necessary columns to numeric values
  data_bee.forEach(function (d) {
    d["Engine Information.Engine Statistics.Horsepower"] = +d["Engine Information.Engine Statistics.Horsepower"];
  });

  

// Create a custom color scale for different brands using a different color scheme
const uniqueBrands = [...new Set(data_bee.map(d => d["Identification.Make"]))];
console.log("Unique Brands:", uniqueBrands);
const brandColorScale = d3.scaleOrdinal()
.domain(uniqueBrands)
.range(d3.schemeCategory10);




  // Create checkboxes for brands
  const brandCheckboxes = d3.select("#brand-checkboxes-bee")
    .selectAll("input")
    .data([...new Set(data_bee.map(d => d["Identification.Make"]))])
    .enter().append("div")
    .html(d => `<input type="checkbox" id="brand-${d}" value="${d}"> ${d}`);

    svg.append("text")
    .attr("x", beeWidth / 2)
    .attr("y", beeMargin.top)
    .attr("dy", "1em") // Adjust the vertical position if needed
    .attr("text-anchor", "middle")
    .style("font-size", "1.5em")
    .style("font-weight", "bold")
    .text("Bee Chart - Car Information");

  // Function to update the chart based on user selection
  function updateChart(selectedAttribute, selectedBeeBrands) {
    // Check if no checkboxes are selected
    if (selectedBeeBrands.length === 0) {
      // Clear existing chart
      svg.selectAll("*").remove();
      return;
    }

    // Clear existing chart
    svg.selectAll("*").remove();
    console.log("selected Brands:", selectedBeeBrands);
    // Filter data based on selected brands
    const filteredBeeData = data_bee.filter(d => selectedBeeBrands.includes(d["Identification.Make"]));
    console.log("Filtered Bee Data:", filteredBeeData);
    // Exit if no brands are selected
    if (filteredBeeData.length === 0) return;

    // Create the beeswarm chart
    const simulation = d3.forceSimulation(filteredBeeData)
      .force("x", d3.forceX(beeWidth / 2).strength(.05)) // Center horizontally
      .force("y", d3.forceY(beeHeight / 2))
      .force("collide", d3.forceCollide(d => horsepowerToRadius(d[selectedAttribute]) + 2).strength(0.8)) // Adjust collide force strength and radius
      .on("tick", ticked);


     
      
      
    // Draw circles for each data point
    const circles = svg.selectAll("circle")
      .data(filteredBeeData)
      .enter().append("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => horsepowerToRadius(d[selectedAttribute]))
      .style("fill", d => brandColorScale(d["Identification.Make"]))
      .style("stroke", "black") // Outline color
      .style("stroke-width", 2) // Outline width
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("mouseover", handleMouseOver2)
      .on("mouseout", handleMouseOut2);
      console.log("Circles", circles);
      

    // Function to convert horsepower to circle radius
    function horsepowerToRadius(horsepower) {
      // Adjust the scaling factor as needed
      const scalingFactor = 1;
      return Math.sqrt(horsepower) * scalingFactor;
    }

    function dragstarted(event, d) {
if (!event.active) simulation.alphaTarget(0.3).restart();
d.fx = d.x;
d.fy = d.y;
}

function dragged(event, d) {
d.fx = event.x;
d.fy = event.y;
}

function dragended(event, d) {
if (!event.active) simulation.alphaTarget(0);
d.fx = null;
d.fy = null;
}
function handleMouseOver2(event, d) {
const tooltip_bee = d3.select("#tooltip-bee");




// Extract and emphasize the ID with additional styling
const idInfo = `<span style="font-weight: bold; font-size: 1.2em; color: #ff7f0e;">ID: ${d["Identification.ID"]}</span><br>`;

// Display various information in the tooltip
const heightInfo = `<strong>Height:</strong> ${d["Dimensions.Height"]}<br>`;
const lengthInfo = `<strong>Length:</strong> ${d["Dimensions.Length"]}<br>`;
const widthInfo = `<strong>Width:</strong> ${d["Dimensions.Width"]}<br>`;
const drivelineInfo = `<strong>Driveline:</strong> ${d["Engine Information.Driveline"]}<br>`;
const engineTypeInfo = `<strong>Engine Type:</strong> ${d["Engine Information.Engine Type"]}<br>`;
const hybridInfo = `<strong>Hybrid:</strong> ${d["Engine Information.Hybrid"]}<br>`;
const transmissionInfo = `<strong>Transmission:</strong> ${d["Engine Information.Transmission"]}<br>`;
const cityMPGInfo = `<strong>City MPG:</strong> ${d["Fuel Information.City mpg"]}<br>`;
const fuelTypeInfo = `<strong>Fuel Type:</strong> ${d["Fuel Information.Fuel Type"]}<br>`;
const highwayMPGInfo = `<strong>Highway MPG:</strong> ${d["Fuel Information.Highway mpg"]}<br>`;
const horsepowerInfo = `<strong>Horsepower:</strong> ${d["Engine Information.Engine Statistics.Horsepower"]}<br>`;
const torqueInfo = `<strong>Torque:</strong> ${d["Engine Information.Engine Statistics.Torque"]}<br>`;

// Combine and set the tooltip content
tooltip_bee.html(idInfo + heightInfo + lengthInfo + widthInfo + drivelineInfo + engineTypeInfo +
hybridInfo + transmissionInfo + cityMPGInfo + fuelTypeInfo + highwayMPGInfo +
horsepowerInfo + torqueInfo);

// Adjust opacity for tooltip visibility
tooltip_bee.transition().duration(200).style("opacity", 0.9);

// Update tooltip position to follow the cursor
tooltip_bee.style("left", (event.pageX + 10) + "px")
.style("top", (event.pageY - 10) + "px"); // Adjust the offset as needed
}


function handleMouseOut2(event, d) {
const tooltip_bee = d3.select("#tooltip-bee");
tooltip_bee.transition().duration(200).style("opacity",0);

// Remove the mousemove event listener on mouse out
d3.select("#bee-chart").on("mousemove", null);
}



    // Add tooltip container
    d3.select("#bee-chart").append("div")
      .attr("id", "tooltip-bee")
      .attr("class", "tooltip-bee")
      .style("opacity", 0);

    function ticked() {
    
      circles
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }
  }


  // Initialize chart with no data
  updateChart(null, []);

  // Event listeners for dropdown and checkboxes change
  d3.selectAll("input[type='checkbox']").on("change", function () {
    console.log("Checkbox changed"); 
    
    
    const selectedAttribute = d3.select("#attribute-select").node().value;
    const selectedBeeBrands = getSelectedCheckboxValues("brand");
    
    updateChart(selectedAttribute, selectedBeeBrands);
  });

  // Helper function to get selected checkbox values
  function getSelectedCheckboxValues(checkboxGroupName) {
    const checkboxes = document.querySelectorAll(`input[type='checkbox'][id^='${checkboxGroupName}-']:checked`);
    return Array.from(checkboxes).map(checkbox => checkbox.value);
  }




     // Function to handle "Deselect All" checkbox
     window.deselectAll = function () {
      d3.selectAll("input[type='checkbox'][id^='brand-']").property("checked", false);
      updateChart(null, []); // Clear the chart
    };

});