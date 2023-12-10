let carsData2 = [];
// // Common chart dimensions
const width = 1200;
const height = 800;
const margin = { top: 100, right: 200, bottom: 100, left: 200 };


d3.csv("Data/cars.csv")
    .then(function (data) {
        carsData2 = data;
        createDropdown(); // Add dropdown after loading data
        createChart("Audi"); // Initial chart creation with Audi data
    })
    .catch(function (error) {
        console.error("Error loading file", error);
    });

// Function to create a dropdown menu
function createDropdown() {
    const carDropdown = d3.select("#car-dropdown");

    const carOptions = ["Select a car", ...new Set(carsData2.map(d => d["Identification.Make"]))];

    carDropdown
        .append("select")
        .attr("id", "car-select")
        .selectAll("option")
        .data(carOptions)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Add event listener to update the chart on dropdown change
    d3.select("#car-select").on("change", function () {
        const selectedCar = d3.select(this).property("value");
        if (selectedCar !== "Select a car") {
            updateChart(selectedCar);
        }
    });
}

function createChart(selectedCar) {
    const filteredData = carsData2.filter(d => d["Identification.Make"] === selectedCar);

    // Calculate average horsepower and mileage for each year
    const averageData = d3.rollup(
        filteredData,
        v => ({
            avgHorsepower: d3.mean(v, d => +d["Engine Information.Engine Statistics.Horsepower"]),
            avgMPG: d3.mean(v, d => +d["Fuel Information.City mpg"])
        }),
        d => parseInt(d["Identification.Year"])
    );

    const sortedData = Array.from(averageData.entries()).sort((a, b) => a[0] - b[0]);

    const maxValues = {
        avgHorsepower: d3.max(sortedData, d => d[1].avgHorsepower),
        avgMPG: d3.max(sortedData, d => d[1].avgMPG)
    };

    const buffer = Math.max(maxValues.avgHorsepower, maxValues.avgMPG) * 0.1;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(sortedData, d => d[0])) // Use d3.extent to dynamically set the domain
        .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, maxValues.avgHorsepower + buffer]) // Start from 0 and go up to max horsepower
        .range([height - margin.bottom, margin.top]);

    const y2Scale = d3.scaleLinear()
        .domain([0, maxValues.avgMPG + buffer]) // Start from 0 and go up to max MPG
        .range([height - margin.bottom, margin.top]);

    const lineHorsepower = d3.line()
        .x(d => xScale(d[0]))
        .y(d => yScale(d[1].avgHorsepower));

    const lineMPG = d3.line()
        .x(d => xScale(d[0]))
        .y(d => y2Scale(d[1].avgMPG));

    const svg = d3.select("#actual-container-line-chart").append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g");

    // Create the line for horsepower
    svg.append("path")
        .datum(sortedData)
        .attr("class", "horsepower-line")
        .attr("d", lineHorsepower)
        .attr("fill", "none")
        .attr("stroke", "#1f77b4")
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5, 5");

    // Create the line for MPG
    svg.append("path")
        .datum(sortedData)
        .attr("class", "mpg-line")
        .attr("d", lineMPG)
        .attr("fill", "none")
        .attr("stroke", "#ff7f0e")  // Choose a different color for MPG
        .attr("stroke-width", 3)
        .attr("stroke-dasharray", "5, 5");

    svg.append("text")
        .attr("class", "chart-title")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .text(`Average Horsepower and MPG Over Years - ${selectedCar}`)
        .style("font-size", "24px")
        .style("font-weight", "bold");



    const tooltip = d3.select("#tooltip-line-chart")
        .append("div")
        // .attr("class", "tooltip-line-chart")
        .style("opacity", 0);

    // Add points to the line for horsepower
    const pointsHorsepower = svg.selectAll(".horsepower-point")
        .data(sortedData);

    pointsHorsepower.enter().append("circle")
        .attr("class", "horsepower-point")
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => yScale(d[1].avgHorsepower))
        .attr("r", 4.5)
        .attr("fill", "#1f77b4")  // Use the same color as the horsepower line
        .on("mouseover", function (event, d) {
            const tooltipWidth = 200; // Approximate width of your tooltip
            const tooltipHeight = 100; // Approximate height of your tooltip
            const pageX = event.pageX;
            const pageY = event.pageY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Adjust X position
            let tooltipX = pageX + 10;
            if (pageX + tooltipWidth > viewportWidth) {
                tooltipX = pageX - tooltipWidth - 10;
            }

            // Adjust Y position
            let tooltipY = pageY - 25;
            if (pageY + tooltipHeight > viewportHeight) {
                tooltipY = pageY - tooltipHeight - 10;
            }

            tooltip.style("left", tooltipX + "px")
                .style("top", tooltipY + "px")
                .transition()
                .duration(200)
                .style("opacity", 0.9);

            tooltip.html(`Avg Horsepower: ${d[1].avgHorsepower.toFixed(2)}<br>Avg MPG: ${d[1].avgMPG.toFixed(2)}`);
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


    // Add points to the line for MPG
    const pointsMPG = svg.selectAll(".mpg-point")
        .data(sortedData);

    pointsMPG.enter().append("circle")
        .attr("class", "horsepower-point")
        // .attr("cx", d => xScale(d[0]) + jitter())
        .attr("cx", d => xScale(d[0]))
        .attr("cy", d => y2Scale(d[1].avgMPG))
        .attr("r", 4.5)
        .attr("fill", "#ff7f0e")  // Use the same color as the MPG line
        .on("mouseover", function (event, d) {
            const tooltipWidth = 200; // Approximate width of your tooltip
            const tooltipHeight = 100; // Approximate height of your tooltip
            const pageX = event.pageX;
            const pageY = event.pageY;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            // Adjust X position
            let tooltipX = pageX + 10;
            if (pageX + tooltipWidth > viewportWidth) {
                tooltipX = pageX - tooltipWidth - 10;
            }

            // Adjust Y position
            let tooltipY = pageY - 25;
            if (pageY + tooltipHeight > viewportHeight) {
                tooltipY = pageY - tooltipHeight - 10;
            }

            tooltip.style("left", tooltipX + "px")
                .style("top", tooltipY + "px")
                .transition()
                .duration(200)
                .style("opacity", 0.9);

            tooltip.html(`Avg Horsepower: ${d[1].avgHorsepower.toFixed(2)}<br>Avg MPG: ${d[1].avgMPG.toFixed(2)}`);
        })
        .on("mouseout", function () {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Add x and y axes to the svg
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(xScale).tickValues(sortedData.map(d => d[0])).tickFormat(d3.format("d")))
        .selectAll("text")
        .style("font-size", "16px");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale))
        .selectAll("text")
        .style("font-size", "14px");

    // Add a second y-axis for MPG
    svg.append("g")
        .attr("class", "y2-axis")
        .attr("transform", `translate(${width - margin.right}, 0)`)
        .call(d3.axisRight(y2Scale))
        .selectAll("text")
        .style("font-size", "14px");

    // Add labels to x and y axes
    svg.append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 2 + 20)
        .text("Identification Year")
        .style("font-size", "20px")
        .style("font-weight", "bold");


    // Updated y-axis label position
    svg.append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height / 2))
        .attr("y", margin.left / 2)
        .text("Avg Horsepower")
        .style("font-size", "20px")
        .style("font-weight", "bold");

    // Add a second y-axis label for MPG
    svg.append("text")
        .attr("class", "y2-label")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(90)")
        .attr("x", height / 2)
        .attr("y", width - margin.right / 4)
        .text("Avg MPG")
        .style("font-size", "20px")
        .style("font-weight", "bold");

    // Add a legend
    const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + (width / 2) + "," + margin.top + ")");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", "#1f77b4");  // Color for horsepower

    legend.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .text("Horsepower");

    legend.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("x", 0)            // X position of the second rectangle
        .attr("y", 20)
        .attr("fill", "#ff7f0e");  // Color for MPG

    legend.append("text")
        .attr("x", 24)
        .attr("y", 27)
        .attr("dy", ".35em")
        .text("MPG");

}

// Function to update the chart based on the selected car
function updateChart(selectedCar) {
    d3.select("#actual-container-line-chart svg").remove(); // Remove existing chart before updating
    createChart(selectedCar);
}
