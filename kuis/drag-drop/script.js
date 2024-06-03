// Initial References
let draggableObjects;
let dropPoints;
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");
const data = [
  "Seorang anak dengan tanda-tanda malnutrisi",
  "Seorang ibu menyusui bayinya",
  "Keluarga yang menikmati makanan bergizi seimbang",
  "Anak-anak bermain di lingkungan yang bersih dan aman",
  "Anak yang sehat dan bergizi berlari dan bermain",
  "Pemeriksaan kesehatan anak",
  "Pendidikan gizi untuk orang tua",
  "Akses air bersih dan sanitasi yang baik",
  "Akses imunisasi anak",
];
let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

// Detect touch device
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

// Random value from Array
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

// Win Game Display
const stopGame = () => {
  setTimeout(() => {
    window.location.href = "drag-drop2.html";
    alert("Congratulations! You Won!");
  }, 0);
};

// Drag & Drop Functions
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    moveElement = true;
    currentElement = e.target;
  } else {
    e.dataTransfer.setData("text", e.target.id);
  }
}

function dragOver(e) {
  e.preventDefault();
}

const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

const drop = (e) => {
  e.preventDefault();
  if (isTouchDevice()) {
    moveElement = false;
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    const currentDropBound = currentDrop.getBoundingClientRect();
    if (
      initialX >= currentDropBound.left &&
      initialX <= currentDropBound.right &&
      initialY >= currentDropBound.top &&
      initialY <= currentDropBound.bottom
    ) {
      currentDrop.classList.add("dropped");
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    const draggedElementData = e.dataTransfer.getData("text");
    const droppableElementData = e.target.getAttribute("data-id");
    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      e.target.classList.add("dropped");
      draggedElement.classList.add("hide");
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="${draggedElementData}.png">`
      );
      count += 1;
    }
  }
  if (count == 3) {
    result.innerText = `You Won!`;
    stopGame();
  }
};

const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  for (let i = 1; i <= 3; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      i -= 1;
    }
  }
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
    }
    flagDiv.innerHTML = `<img src="${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }
  randomData = randomData.sort(() => 0.5 - Math.random());
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>
    `;
    dropContainer.appendChild(countryDiv);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  currentElement = "";
  controls.classList.add("hide");
  await creator();
  count = 0;
  dropPoints = document.querySelectorAll(".countries");
  draggableObjects = document.querySelectorAll(".draggable-image");

  draggableObjects.forEach((element) => {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("touchstart", dragStart);
    element.addEventListener("touchend", drop);
    element.addEventListener("touchmove", touchMove);
  });
  dropPoints.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", drop);
  });

  // Play music on page load
  const backgroundMusic = document.getElementById("background-music");
  backgroundMusic.play();

  // Toggle music on button click
  const musicToggle = document.getElementById("music-toggle");
  const musicIcon = document.getElementById("music-icon");
  musicToggle.addEventListener("click", () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play();
      musicIcon.src = "../../img/music-on.svg";
    } else {
      backgroundMusic.pause();
      musicIcon.src = "../../img/music-off.svg";
    }
  });

  // Stop music when leaving the page
  window.addEventListener("beforeunload", () => {
    backgroundMusic.pause();
  });
});
