// Define the URL from which to fetch the data
const dataUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Function to populate the dropdown menu
function populateDropdown(data) {
    const dropdown = document.getElementById('selDataset');
    const ids = data.names;
    
    ids.forEach(id => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = id;
      dropdown.appendChild(option);
    });
  }
  
  // Function to display sample metadata
  function displaySampleMetadata(metadata) {
    // Get the 'sample-metadata' element
    const sampleMetadataDiv = document.getElementById('sample-metadata');
    
    // Clear any existing content
    sampleMetadataDiv.innerHTML = '';
  
    // Iterate through the metadata object and create HTML elements
    for (const [key, value] of Object.entries(metadata)) {
      const keyValueParagraph = document.createElement('p');
      keyValueParagraph.textContent = `${key}: ${value}`;
      sampleMetadataDiv.appendChild(keyValueParagraph);
    }
  }
  
  // Function to create a bubble chart
  function createBubbleChart(sampleData) {
    // Define trace for the bubble chart
    const trace = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth',
        opacity: 0.5
      },
      text: sampleData.otu_labels
    };
  
    // Define layout for the bubble chart
    const layout = {
      title: 'Belly Button Biodiversity Bubble Chart',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' },
      showlegend: false
    };
  
    // Plot the bubble chart
    Plotly.newPlot('bubble', [trace], layout);
  }
  
  // Function to update the gauge chart with the weekly washing frequency
  function updateGaugeChart(washingFrequency) {
    // Define trace for the gauge chart
    const trace = {
      type: "indicator",
      mode: "gauge+number",
      value: washingFrequency,
      title: { text: "Weekly Washing Frequency", font: { size: 18 } },
      gauge: {
        axis: { range: [0, 9], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "red" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, 1], color: "rgb(255,255,217)" },
          { range: [1, 2], color: "rgb(237,248,177)" },
          { range: [2, 3], color: "rgb(199,233,180)" },
          { range: [3, 4], color: "rgb(127,205,187)" },
          { range: [4, 5], color: "rgb(65,182,196)" },
          { range: [5, 6], color: "rgb(29,145,192)" },
          { range: [6, 7], color: "rgb(34,94,168)" },
          { range: [7, 8], color: "rgb(12,44,132)" },
          { range: [8, 9], color: "rgb(8,29,88)" }
        ],
      }
    };
  
    // Define layout for the gauge chart
    const layout = {
      width: 400,
      height: 300,
      margin: { t: 40, r: 40, l: 40, b: 40 },
      paper_bgcolor: "rgba(0,0,0,0)",
      font: { color: "black", family: "Arial" }
    };
  
    // Plot the gauge chart
    Plotly.newPlot('gauge', [trace], layout);
  }
  
  // Function to handle dropdown change event
  function optionChanged(selectedId) {
    // Use d3.json() to fetch the data
    d3.json(dataUrl).then(function(data) {
      // Extract sample metadata for the selected ID
      const metadata = data.metadata.find(item => item.id === parseInt(selectedId));
      
      // Display sample metadata
      displaySampleMetadata(metadata);
      
      // Update the gauge chart with the weekly washing frequency
      updateGaugeChart(metadata.wfreq);
    }).catch(function(error) {
      // This code block will execute if there's an error loading the data
      console.error("Error loading data:", error);
    });
  }
  
  // Use d3.json() to fetch the data
  d3.json(dataUrl).then(function(data) {
    // Populate dropdown menu
    populateDropdown(data);
  
    // Extract required data for bar chart
    const sampleDataBarChart = data.samples[0];
    const sampleValuesBarChart = sampleDataBarChart.sample_values.slice(0, 10).reverse();
    const otuIdsBarChart = sampleDataBarChart.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const otuLabelsBarChart = sampleDataBarChart.otu_labels.slice(0, 10).reverse();
  
    // Create trace for the bar chart
    const traceBarChart = {
      x: sampleValuesBarChart,
      y: otuIdsBarChart,
      text: otuLabelsBarChart,
      type: 'bar',
      orientation: 'h'
    };
  
    // Create layout for the bar chart
    const layoutBarChart = {
      title: "Top 10 OTUs Found",
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
  
    // Plot the bar chart
    Plotly.newPlot('bar', [traceBarChart], layoutBarChart);
  
    // Extract required data for bubble chart
    const sampleDataBubbleChart = data.samples[0];
  
    // Create bubble chart
    createBubbleChart(sampleDataBubbleChart);
  
    // Display sample metadata for the initial selected ID
    displaySampleMetadata(data.metadata[0]);
    
    // Update the gauge chart with the weekly washing frequency for the initial selected ID
    updateGaugeChart(data.metadata[0].wfreq);
  }).catch(function(error) {
    // This code block will execute if there's an error loading the data
    console.error("Error loading data:", error);
  });