const items = [{
  0:"./assets/images/emoji_0.png",
  1:"./assets/images/emoji_1.png",
  2:"./assets/images/emoji_2.png",
  3:"./assets/images/emoji_3.png",
  4:"./assets/images/emoji_4.png",
  5:"./assets/images/emoji_5.png",
  6:"./assets/images/emoji_6.png",
  7:"./assets/images/emoji_7.png",
  8:"./assets/images/emoji_8.png",
  9:"./assets/images/emoji_9.png"
}];

var counter = 0;
var count = 1;
var numbersArray = [];
const usedIndices = [];

const doors = document.querySelectorAll(".door");
document.querySelector("#spinner").addEventListener("click", spin);
document.querySelector("#reseter").addEventListener("click", init);

var input = document.getElementById('uploadBtn');
let columnData = ["00000"]; // Declare the variable in the outermost scope

input.addEventListener('change', function() {
  var file = input.files[0];

  if (file) {
    readXlsxFile(file)
      .then(function(data) {
        // Clear the existing data
        columnData = []; // Assign the value to the outer variable
        // Loop through the rows and collect data from the first column
        data.forEach(function(row) {
          if (row && row.length > 0) {
            columnData.push(row[0]);
          }
        });
        // Now columnData is updated with the data
        // You can use it in other functions or access it globally
      })
      .catch(function(error) {
        console.error("Error reading Excel file:", error);
      });
  }
});

// Now you can use columnData in other functions or globally
function randomFunction() {
  if (usedIndices.length === columnData.length) {
    // All indices have been used, reset the usedIndices array
    usedIndices.length = 0;
  }

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * columnData.length);
  } while (usedIndices.includes(randomIndex));

  // Mark the index as used
  usedIndices.push(randomIndex);
  // console.log(columnData[randomIndex]);
  return columnData[randomIndex];
}

async function spin() {
  const randomValue = randomFunction();
  let numArray = randomValue.toString().split('').map(Number);
  init(false, 1, 2, numArray);
  for (const door of doors) {
    const boxes = door.querySelector(".boxes");
    const duration = parseInt(boxes.style.transitionDuration);
    boxes.style.transform = "translateY(0)";
    await new Promise((resolve) => setTimeout(resolve, duration * 1000));
  }
}

function tableFunc(arrNum){
  
  // Assuming you have an array of numbers
  if(count%5==0){
    numbersArray[counter] = arrNum;
    counter +=1;
  }
  console.log(count);
  
  count += 1;
  console.log(count);
  // Loop through the array and populate the table cells
  for (var i = 0; i < numbersArray.length; i++) {
    var personCell = document.getElementById("dice_" + (i + 1));
    personCell.textContent = numbersArray[i];
  }
}

function init(firstInit = true, groups = 1, duration = 1, numArray = []) {

  for (let j = 0; j < doors.length; j++) {
    const door = doors[j];
    if (firstInit) {
      door.dataset.spinned = "0";
    } else if (door.dataset.spinned === "1") {
      return;
    }

    const boxes = door.querySelector(".boxes");
    const boxesClone = boxes.cloneNode(false);

    const pool = ["./assets/images/emoji_empty.png"];
    if (!firstInit) {
      const arr = [];
      for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
        arr.push(...Object.values(items[0]));
      }
      // if(count<=31){
      //   tableFunc(randomValue);
      // }
      
      pool.push(...shuffle(arr, numArray[j])); // Call the shuffle function with the current digit
      boxesClone.addEventListener(
        "transitionstart",
        function () {
          door.dataset.spinned = "1";
          this.querySelectorAll(".boxes").forEach((img) => {
            img.style.filter = "blur(1px)";
          });
        },
        { once: true }
      );
      boxesClone.addEventListener(
        "transitionend",
        function () {
          this.querySelectorAll(".boxes").forEach((img, index) => {
            img.style.filter = "blur(0)";
            if (index > 0) this.removeChild(img);
          });
        },
        { once: true }
      );
    }

    for (let i = pool.length - 1; i >= 0; i--) {
      const img = document.createElement("img");
      img.src = pool[i];
      img.style.width = "100%";
      img.style.height = "100%";

      boxesClone.appendChild(img);
    }

    boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
    
    boxesClone.style.transform = `translateY(-${door.clientHeight * (pool.length - 1)*(pool.length - 9.5)}px)`;
    door.replaceChild(boxesClone, boxes);
  }
}

function shuffle([...arr], numArray) {
  // console.log(numArray)
  if(arr[numArray] === undefined){
    arr[arr.length - 1]= './assets/images/emoji_empty.png'
  } else {
    arr[arr.length - 1]= arr[numArray]
  }
  
  return arr;
}

init();