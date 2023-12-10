# Automotive Insights: Interactive Data Visualization
### By Dipanshu Singh, Sankalp Rajeev, Omar Hernandez

## Overview:


**Data Description:**

- Domain-Specific Language: This is a dataset focused on the automotive industry, particularly analyzing different characteristics and performance metrics of cars.
- Abstract Language: It's a structured collection of data points, each representing a car, with various attributes detailing its specifications and performance.
- Type of Dataset: Structured, tabular dataset.
- Attributes Used: The dataset includes attributes like make, model, year, horsepower, city miles per gallon (MPG), highway MPG, and possibly others related to car performance and emissions.
- Attributes' Types, Scales, Cardinalities: These attributes are a mix of categorical (e.g., make, model), ordinal (e.g., year), and ratio (e.g., horsepower, MPG).
- Preprocessing: Data was already preprocessed so we did not have to preprocess it.
- Dataset Inclusion: The dataset can be accessed and included in the project via the URL: https://corgis-edu.github.io/corgis/csv/cars/

## Goals and Tasks:

**Domain-Specific Tasks:**
- Comparative Analysis of Vehicle Mileage: Utilizing a radial bar chart, the project enables users to compare average mileage across various car brands. This allows for an in-depth look at fuel efficiency and can be crucial for both consumers and industry analysts in assessing vehicle performance.
Evolution of Automotive Power: Through a line chart, the project traces the development of average horsepower over time. This visualization presents a historical perspective on how car manufacturers have evolved in terms of vehicle power, offering insights into the changing dynamics of automotive engineering and design.
- Classification of Vehicles: The tree map visualization categorizes cars based on their make, further breaking them down by model year and transmission type. This hierarchical representation aids in understanding the diversity within the automotive market and provides a clear overview of different vehicle classes.
- Performance Metrics Analysis: An interactive heatmap is used to examine key performance metrics like torque. By selecting different car makes from a dropdown menu, users can explore how these metrics vary across brands and over years, gaining an understanding of the performance landscape in the automotive industry.
- Power Distribution in Cars: The beeswarm chart uniquely displays the horsepower of various cars, offering a visual comparison of vehicle power across a wide range of models. The color coding based on car brands adds an additional layer of analysis, making it easy to identify trends specific to manufacturers.

**Abstract Tasks:**
- Data-Driven Insight Generation: The project synthesizes complex automotive data into interactive visualizations, transforming raw numbers into comprehensible, visually engaging formats. This approach facilitates deeper insights and understanding, making the data accessible to a broader audience.
- Interactive Exploration: With interactive elements like dropdown menus and tooltips, the project allows users to actively engage with the data. This interactivity not only enhances the user experience but also empowers users to explore and discover patterns and trends within the automotive industry.
- Visual Storytelling: Each visualization within the project tells a unique story about the automotive sector, from technological advancements to market diversity. These stories are crafted to cater to a range of audiences, including industry professionals, analysts, and enthusiasts.
- Empirical Decision-Making Support: By providing a clear visual representation of automotive data, the project supports data-driven decision-making. Whether it's for purchasing decisions, market analysis, or industry research, the visualizations offer a solid empirical foundation for informed conclusions.


## Idioms:

The interface built for visualizing the automotive dataset is a comprehensive and interactive dashboard, designed to provide a multi-dimensional exploration of car performance data. It encompasses several types of visualizations, each tailored to highlight specific aspects of the dataset:

**Radial Bar Chart:**
 The visualization utilizes radial bars plotted on a circular grid, where each bar's length represents the average MPG for a car make. This radial format, chosen over traditional bar charts, provides a more engaging visual comparison of MPG across different brands. A color gradient is applied to each bar, enhancing visual appeal and differentiation between makes. The bars dynamically expand on mouseover, accompanied by tooltips that display precise MPG values, enhancing interactivity and information accessibility. Labels around the chart's circumference identify each car make, and the chart's central title succinctly conveys the visualization's focus. This design balances aesthetic engagement with functional clarity, making complex data accessible and easily interpretable for users.
 
![Radial](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/0eb04b3b-eaef-4a47-a59a-c156af523e33)

**Line Chart:** 
It illustrates the evolution of average horsepower in relation to mileage over time, providing insights into the balance between automotive power and fuel efficiency.  Interactivity allows users to select cars by specific brands showing how horsepower and mileage are correlated. This interactive line chart for the automotive dataset is meticulously designed for clarity and user engagement. It features a dual-axis layout to display average horsepower and MPG over time, differentiated by distinct colors and dash styles. Interactive tooltips provide detailed data insights on hover, enhancing user experience. A dynamic dropdown menu allows for customized car make selection, with the chart updating accordingly. The integration of clear legends, bold labels, and a responsive design culminates in a user-friendly and informative tool for analyzing automotive performance trends.

![Linechart](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/acaed926-20fe-4477-81c0-64afacf1ecfc)

**Beeswarm Chart:** 
The beeswarm chart effectively visualizes car data, focusing on horsepower as a primary attribute. Each car is represented by a circle, with its position determined by a force simulation to prevent overlap and ensure even distribution, enhancing readability. The circles' size is proportional to the car's horsepower, making it intuitive to compare the relative power of different vehicles. Cars from various manufacturers are distinguished through a categorical color scale, facilitating quick brand identification. Interactive elements like checkboxes allow users to filter the visualization by car make, and tooltips provide detailed information about each car, including dimensions, driveline, engine type, and fuel efficiency. This design approach not only ensures clarity and visual differentiation but also encourages user engagement through interactive exploration. The aesthetic appeal of the chart, combined with its functional adaptability, makes it a valuable tool for exploring and understanding the automotive dataset.

![Beeswarm](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/67448451-d88e-4cd8-b32b-f23c7433703d)


**Heatmap:** 
The interactive heatmap visualization effectively displays the torque distribution across different car makes and years, using a grid where each cell represents a specific make and year. Color encoding, achieved through a sequential color scale (d3.interpolateYlGnBu), intuitively indicates varying torque levels, enhancing data comprehension. Axes are clearly labeled for ease of navigation, and tooltips provide detailed information (torque, horsepower, MPG) upon hovering, enriching the user experience without overwhelming the primary visual. A color legend elucidates the scale of torque values, essential for interpreting the range and distribution. The inclusion of a dropdown menu for cars adds an interactive element, allowing users to filter and explore the dataset dynamically. This heat map design adeptly balances aesthetics, clarity, and user engagement, making it a versatile tool for analyzing and understanding automotive performance trends.

![heatmap](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/1189870f-47b7-40c9-80a7-487143473e5e)


**TreeMap:** 
The TreeMap visualization for the automotive dataset employs a hierarchical layout, distinguishing car makes and model years through size and color encodings. Interactive checkboxes enable dynamic brand selection, tailoring the display to user preferences. Each rectangle's size reflects the number of models, intuitively conveying distribution, while an ordinal color scale enhances segment differentiation. Tooltips activate on hover, providing detailed car information, enriching user engagement without overwhelming the visual space. A central title and bold text labels ensure clarity and context. This design, focused on interactivity, clarity, and visual appeal, offers an engaging, informative exploration of automotive data.

![treemap](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/58a09029-5664-4a0f-b82c-cb8fb7bd1dc0)

**Donut Chart:**
 A clear and concise representation of car distributions based on their 'Identification.Classification,' offering a straightforward overview of car types in the dataset. It processes 'Identification.Classification' data to visualize car distributions, employing D3's scaleOrdinal and schemeCategory10 for vibrant color differentiation. The chart, centered within an SVG canvas, features interactive arcs that respond to mouse events, highlighting segments upon hover for enhanced user engagement. Arcs represent data proportions, with labels indicating counts and percentages for immediate comprehension. A dynamically generated, color-coded legend further aids in classification identification. Overall, this design combines visual appeal with functional clarity, ensuring an intuitive and informative user experience.
 
![donut](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/a19e2807-d64a-4d96-994f-51e5bfb5c5de)

**Innovative Chart:** 
The interactive parallel coordinates plot is generated to display multifaceted data.The visualization successfully integrates multiple attributes of cars, including dimensions, gears, mpg, horsepower, and torque. Users can explore this complex dataset through a dropdown menu, which dynamically filters the data based on car make, enhancing interactivity and user engagement.
The plot employs linear scales for each attribute, mapped along vertical axes, which facilitates the comparison of different car characteristics across multiple dimensions. The use of a color scale, linked to car makes, allows for easy identification and distinction between various brands, adding visual clarity. The lines representing individual cars intersect across these axes, making it possible to trace and compare multiple attributes for a single car or a group of cars.Interactive tooltips, appearing on hover, provide detailed information about each car, offering an in-depth look at individual data points without cluttering the main visualization. This feature is crucial for allowing users to understand specific aspects of each car while maintaining a clean and readable chart.The choice of a parallel coordinates plot is particularly effective for this type of multidimensional data, as it allows for the comparison of several quantitative and qualitative attributes simultaneously. This visualization technique is especially valuable for users like car enthusiasts, analysts, or potential buyers, who are interested in comparing various aspects of different car makes in a single integrated view.

![innovative](https://github.com/asu-cse494-f2023/-Dipanshu-Omar-Sankalp/assets/81537336/01eda065-e378-4e6f-9d3b-a7259d4680b5)

The interface, overall, is an effective tool for automotive industry enthusiasts, analysts, and potential buyers, offering a user-friendly platform for in-depth analysis and comparison of car performance metrics.

## Reflection:

- Project Development: The project began with a straightforward proposal to visualize car performance data. As the project progressed, we adapted our visualizations to more effectively communicate the data story. This led to the introduction of interactive elements and the choice of more complex chart types like radial bar charts instead of a normal one.
- Changes in Goals: Initially, the project was focused on simple data representation. However, as we dig deeper, the goal shifted towards creating a more interactive experience for users, allowing them to explore the data in a multi-dimensional manner.
- Realism of Original Proposal: The original proposal was realistic in its foundation but didn't fully anticipate the potential depth and interactivity of the visualizations. 
Challenges and Workarounds: One significant challenge was ensuring that the more complex visualizations remained user-friendly and informative. To address this, we invested time in refining the interactivity features and optimizing the visual aesthetics for clarity and impact.
- Future Approaches: In future projects, we would allocate more time for exploring the data in the initial stages, allowing for a more informed decision-making process regarding visualization types and interactivity features.


## Team Workload:

- Dipanshu Singh: Radial bar chart, Tree Map
- Sankap Rajeev : Heat Map, Line Chart, innovative visualization
- Omar Hernandez: Beeswarm chart, Donut Chart

