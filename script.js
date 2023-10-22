const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
var input = document.getElementById('input');
let myChart; // Store the chart instance for later destruction

//background color for each piece
var pieColors = [
  "#8b35bc",
  "#0000FF",
  "#ff0000",
  "#b163da",
];

const data = [1,1,1,1,1,1,1,1,1,1];
const Cdata = [2723,2213,2231,3231,6533,8765,8987,4353,5647,9665];
createChart(Cdata, data, pieColors);

input.addEventListener('change', function() {
    var file = input.files[0];

    if (file) {
        readXlsxFile(file)
            .then(function(data) {
                // Assuming you want to store the first column (column index 0)
                let columnData = [];
                // Loop through the rows and collect data from the first column
                data.forEach(function(row) {
                    if (row && row.length > 0) {
                      columnData.push(row[0]);
                    }
                });

                const generatedRotateValues = rotationValues(columnData);
                const dataPieceSize = dataPiece(columnData);
                createChart(columnData, dataPieceSize, pieColors);
            })
            .catch(function(error) {
                console.error("Error reading Excel file:", error);
            });
    }
});

const rotationValues = function(columnData) {
  let columnDataLength = columnData.length
  let circleDeg = 360 / columnDataLength;

  const rotateValues = [];
  let currentMinDegree = 0;

  for (let i = 0; i < columnDataLength; i++) {
      const currentMaxDegree = currentMinDegree + circleDeg;

      rotateValues.push({
          minDegree: currentMinDegree,
          maxDegree: currentMaxDegree,
          value: columnData[i], // You can adjust this as needed
      });

      currentMinDegree = currentMaxDegree;
  }

  return rotateValues;
};

//Size of each piece
const  dataPiece = (columnData) => {
  const dataPiece = [];
  for (let i = 0; i < columnData.length; i++) {
    dataPiece[i] = 1
  }

  return dataPiece;
};


function createChart(columnData, dataPieceSize, pieColors) {
  // Destroy the previous chart (if it exists)
  if (myChart) {
    myChart.destroy();
  }

  // Create a new chart
  myChart = new Chart(wheel, {
    //Plugin for displaying text on pie chart
    plugins: [ChartDataLabels],
    //Chart Type Pie
    type: "pie",
    data: {
      //Labels(values which are to be displayed on chart)
      labels: columnData,
      //Settings for dataset/pie
      datasets: [
        {
          backgroundColor: pieColors,
          data: dataPieceSize,
        },
      ],
    },
    options: {
      //Responsive chart
      responsive: true,
      animation: { duration: 1 },
      plugins: {
        //hide tooltip and legend
        tooltip: false,
        legend: {
          display: false,
        },
        //display labels inside pie chart
        datalabels: {
          color: "#ffffff",
          formatter: (_, context) => context.chart.data.labels[context.dataIndex],
          font: { size: 20 }    
        },
      },
    },
  });  
}

//display value based on the randomAngle
const valueGenerator = (angleValue) => {
  for (let i of rotationValues) {
    //if the angleValue is between min and max then display it
    if (angleValue >= i.minDegree && angleValue <= i.maxDegree) {
      finalValue.innerHTML = `<p>Value: ${i.value}</p>`;
      spinBtn.disabled = false;
      break;
    }
  }
};

// //Spinner count
let count = 0;
//100 rotations for animation and last rotation for result
let resultValue = 501;
//Start spinning
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  //Empty final value
  finalValue.innerHTML = `<p>Good Luck!</p>`;
  //Generate random degrees to stop at
  let randomDegree = Math.floor(Math.random() * (355 - 0 + 1) + 0);
  //Interval for rotation animation
  let rotationInterval = window.setInterval(() => {
    //Set rotation for piechart
    /*
    Initially to make the piechart rotate faster we set resultValue to 101 so it rotates 101 degrees at a time and this reduces by 1 with every count. Eventually on last rotation we rotate by 1 degree at a time.
    */
    myChart.options.rotation = myChart.options.rotation + resultValue;
    //Update chart with new value;
    myChart.update();
    //If rotation>360 reset it back to 0
    if (myChart.options.rotation >= 360) {
      count += 1;
      resultValue -= 5;
      myChart.options.rotation = 0;
    } else if (count > 15 && myChart.options.rotation == randomDegree) {
      valueGenerator(randomDegree);
      clearInterval(rotationInterval);
      count = 0;
      resultValue = 101;
    }
  }, 10);
});