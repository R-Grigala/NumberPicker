const list = [4544,7878];

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
      for (const door of doors) {
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
          pool.push(...shuffle(arr));
  
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
  
    function shuffle([...arr]) {
      let num = 4656;
      let numArray = num.toString().split('').map(Number);
      let numIndex = 0; // Initialize an index for the digits of num
      for (let m = arr.length; m > 0; m--) {
        // Generate i using the current digit of num
        const digit = numArray[numIndex];
        const i = digit % m;
        numIndex = (numIndex + 1) % numArray.length; // Cycle through digits
        m--;
        [arr[m], arr[i]] = [arr[i], arr[m]];
        
      }
      console.log("shuffle" + arr);
      return arr;
    }
  
    init();
  