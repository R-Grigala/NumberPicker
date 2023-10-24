const items = [{
      0:"0️⃣",
      1:"1️⃣",
      2:"2️⃣",
      3:"3️⃣",
      4:"4️⃣",
      5:"5️⃣",
      6:"6️⃣",
      7:"7️⃣",
      8:"8️⃣",
      9:"9️⃣"
}];

    const joinedText = Object.values(items[0]).join(" ");
    document.querySelector(".info").textContent = joinedText;
  
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
    function anotherFunction() {
      const randomIndex = Math.floor(Math.random() * columnData.length);
      return columnData[randomIndex];
    }

    async function spin() {
      init(false, 1, 2);
      for (const door of doors) {
        const boxes = door.querySelector(".boxes");
        const duration = parseInt(boxes.style.transitionDuration);
        boxes.style.transform = "translateY(0)";
        await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      }
    }
  
    function init(firstInit = true, groups = 1, duration = 1) {
      const randomValue = anotherFunction();
      let numArray = randomValue.toString().split('').map(Number);
      for (let j = 0; j < doors.length; j++) {
        const door = doors[j];
        // console.log(door)
        if (firstInit) {
          door.dataset.spinned = "0";
        } else if (door.dataset.spinned === "1") {
          return;
        }
  
        const boxes = door.querySelector(".boxes");
        const boxesClone = boxes.cloneNode(false);
  
        const pool = ["0️⃣"];
        if (!firstInit) {
          const arr = [];
          for (let n = 0; n < (groups > 0 ? groups : 1); n++) {
            arr.push(...Object.values(items[0]));
          }

          pool.push(...shuffle(arr, numArray[j])); // Call the shuffle function with the current digit
          
          boxesClone.addEventListener(
            "transitionstart",
            function () {
              door.dataset.spinned = "1";
              this.querySelectorAll(".box").forEach((box) => {
                box.style.filter = "blur(1px)";
              });
            },
            { once: true }
          );
  
          boxesClone.addEventListener(
            "transitionend",
            function () {
              this.querySelectorAll(".box").forEach((box, index) => {
                box.style.filter = "blur(0)";
                if (index > 0) this.removeChild(box);
              });
            },
            { once: true }
          );
        }
  
        for (let i = pool.length - 1; i >= 0; i--) {
          const box = document.createElement("div");
          box.classList.add("box");
          box.style.width = door.clientWidth + "px";
          box.style.height = door.clientHeight + "px";
          box.textContent = pool[i];
          boxesClone.appendChild(box);
        }
        boxesClone.style.transitionDuration = `${duration > 0 ? duration : 1}s`;
        boxesClone.style.transform = `translateY(-${
          door.clientHeight * (pool.length - 1)
        }px)`;
        door.replaceChild(boxesClone, boxes);
      }
    }
  
    function shuffle([...arr], numArray) {

      arr[arr.length - 1]= arr[numArray]
      
      return arr;
    }
  
    init();
  