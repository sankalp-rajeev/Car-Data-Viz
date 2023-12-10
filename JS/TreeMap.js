
let carsData = [];
let selectedBrands = [];
function populateCheckboxes() {
    const carMakes = Array.from(new Set(carsData.map(d => d["Identification.Make"])));
    const checkboxesContainer = document.getElementById("brand-checkboxes");

    carMakes.forEach(make => {
        const checkboxId = `brand-${make.replace(/\s+/g, '-')}`; // Replace spaces with dashes for valid id

        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('checkbox-container');

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = checkboxId;
        checkbox.value = make;
        checkbox.checked = selectedBrands.includes(make);
        checkbox.onchange = updateTreeMap; // Attach the update event

        const label = document.createElement("label");
        label.htmlFor = checkboxId;
        label.textContent = make;

        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        checkboxesContainer.appendChild(checkboxContainer);
    });
}

function updateTreeMap() {
    const checkedBoxes = document.querySelectorAll("#brand-checkboxes input[type='checkbox']:checked");
    selectedBrands = Array.from(checkedBoxes).map(cb => cb.value);
    TreeMap(); // Redraw TreeMap with updated brands
}
//load "data 
d3.csv("Data/cars.csv")
    .then(function (data) {
        carsData = data;
        // filteredData = carsData;
        selectedBrands = selectRandomBrands(carsData, 5);
        populateCheckboxes()
        TreeMap();
    })
    .catch(function (error) {
        console.error("Error loading the file", error)
    });
function TreeMap() {

    d3.select("#chart").selectAll("*").remove();
    const width = 1600;
    const height = 900;
    const margin = { top: 80, right: 20, bottom: 20, left: 20 };
    const svg = d3.select("#chart")
        .attr("viewBox", `0 0 ${width} ${height}`)
        // .attr("preserveAspectRatio", "xMidYMid meet")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);


    svg.append("text")
        .attr("class", "tree-map-title")
        .attr("x", (width - margin.left - margin.right) / 2) // Centering the title
        .attr("y", -margin.top / 2) // Position above the TreeMap
        .attr("text-anchor", "middle")
        .text("Car Models Distribution by Make and Model Year")
        .style("font-size", "24px")
        .style("font-weight", "bold");
    const filteredData = carsData.filter(car => selectedBrands.includes(car['Identification.Make']));


    const groupedData = Array.from(d3.group(filteredData, d => d['Identification.Make'], d => d['Identification.Model Year']),
        ([make, models]) => ({
            make,
            models: Array.from(models, ([modelYear, entries]) => ({ modelYear, transmissionCount: entries.length }))
        })
    );

    const hierarchyData = {
        name: "root",
        children: groupedData.map(make => ({
            name: make.make,
            children: make.models.map(model => ({
                name: model.modelYear,
                value: model.transmissionCount
            }))
        }))
    };

    // Creating the root for the treemap layout
    const root = d3.hierarchy(hierarchyData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    // console.log(hierarchyData)
    d3.treemap()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .paddingTop(15)
        .paddingLeft(1)
        .paddingInner(5)
        (root);

    // const getColor = colorScale();
    const getColor = colorScale();
    // Creating rectangles for the treemap
    svg.selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", d => getColor(d.parent.data.name))
        .on("mouseover", function (event, d) { handleMouseOver(event, d, svg); })
        .on("mouseout", handleMouseOut);

    svg.selectAll(".make-text")
        .data(root.children) // Use children of the root node which are the makes
        .enter()
        .append("text")
        .attr("class", "make-text")
        .attr("x", d => d.x0 + 1) // Slightly offset from the top left corner
        .attr("y", d => d.y0 - 2)
        .text(d => d.data.name)
        .attr("font-size", "25px")
        .attr("alignment-baseline", "hanging")
        .style("fill", "black")
        .style("font-weight", "bold")
}

function colorScale() {
    // Use a D3 color scheme
    const scheme = d3.schemeTableau10; // You can choose from various D3 schemes

    // Create an ordinal scale with the color scheme
    const scale = d3.scaleOrdinal(scheme);

    return (make) => scale(make);
}

function handleMouseOver(event, d, svgElement) {
    const tooltip = d3.select("#tooltip-tree-map");

    // Adjust the event position relative to the SVG container
    const [x, y] = d3.pointer(event, svgElement.node());
    const svgBounds = svgElement.node().getBoundingClientRect();
    const adjustedX = x;
    const adjustedY = y;
    // Finding a car that matches the make and model year from the hovered rectangle
    const car = carsData.find(car => car['Identification.Make'] === d.parent.data.name &&
        car['Identification.Model Year'] === d.data.name);

    if (car) {
        // Tooltip content based on the car details
        const content = `  
            <strong>Make:</strong> ${car['Identification.Make']}<br>
            <strong>Model Year:</strong> ${car['Identification.Model Year']}<br>
            <strong>Transmission:</strong> ${car['Engine Information.Transmission']}<br>`;
        tooltip.html(content)
            .style("opacity", 1)
            .style("left", adjustedX + "px")
            .style("top", adjustedY + "px");
    }
}



function handleMouseOut() {
    const tooltip = d3.select("#tooltip-tree-map");
    tooltip.transition().duration(200).style("opacity", 0);
}
function selectRandomBrands(data, count) {
    // const uniqueBrands = Array.from(new Set(data.map(d => d['Identification.Make'])));
    // const shuffledBrands = uniqueBrands.sort(() => 0.5 - Math.random());
    // return shuffledBrands.slice(0, count);
    return d3.shuffle(data.map(d => d["Identification.Make"]))
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, count);
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}
