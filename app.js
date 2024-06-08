const annualDeforestationFile = new File([], "annual-deforestation.csv");
const fileReader = new FileReader();
let annualDeforestationDict = {};
let mobileDevice;

const header1s = document.querySelectorAll("h1");
const header2s = document.querySelectorAll("h2");
const header3s = document.querySelectorAll("h3");
const mainContainer = document.querySelector(".main-container");
const topContainerDivs = document.querySelectorAll(".top-container div")
const topLeftContainer = document.querySelector(".top-left-container");
const topRightContainer = document.querySelector(".top-right-container");
const scoreCounterHeader = document.querySelector(".score-counter");
const highscoreCounterHeader = document.querySelector(".high-score-counter");
const leftContainer = document.querySelector(".left-container");
const countryFlagImg = document.querySelector(".country-flag");
const countryNameHeader = document.querySelector(".country-name");
const countryDeforestationHeader = document.querySelector(".country-deforestation");
const circleSeparator = document.querySelector(".circle-separator");
const orTextHeader = document.querySelector(".or-text");
const markIconImg = document.querySelector(".mark-icon");
const rightContainer = document.querySelector(".right-container");
const countryFlagGuessImg = document.querySelector("#country-flag-guess");
const countryNameGuessHeader = document.querySelector("#country-name-guess");
const countryDeforestationGuessHeader = document.querySelector("#country-deforestation-guess");
const deforestationSelectionDiv = document.querySelector(".deforestation-selection");
const selectionDivs = document.querySelectorAll(".deforestation-selection div");
const selectionDivHeaders = document.querySelectorAll(".deforestation-selection div h2");
const moreSelectionDiv = document.querySelector(".more-selection");
const lessSelectionDiv = document.querySelector(".less-selection");

let country1;
let country2;
let score = 0;
let highscore = 0;

fetch("annual-deforestation.csv")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
    return response.text();
  })
  .then(text => {
    processData(text);
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  })

fileReader.onload = function(event) {
  const text = event.target.result;
  processData(text);
}

function processData(csvData) {
  const lines = csvData.split("\n");
  const result = [];

  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentLine = lines[i].split(",");

    if (currentLine[2] == "2015" && currentLine[3] > 0) {
      headers.forEach((header, index) => {
        obj[header] = currentLine[index];
      });
      
      result.push(obj);
    }
  }

  annualDeforestationDict = result;

  mobileDevice = window.innerHeight > window.innerWidth;
  
  header1s.forEach((header1) => {
    header1.style["font-size"] = mobileDevice && "15vw" || "5vw";
  });
  header2s.forEach((header2) => {
    header2.style["font-size"] = mobileDevice && "9vw" || "3vw";
  });
  header3s.forEach((header3) => {
    header3.style["font-size"] = mobileDevice && "4.5vw" || "1.5vw";
  });
  
  mainContainer.style["flex-direction"] = mobileDevice && "column" || "row";
  topContainerDivs.forEach((topContainerDiv) => {
    topContainerDiv.style["padding-left"] = mobileDevice && "3.75vw" || "1.25vw";
    topContainerDiv.style["padding-right"] = mobileDevice && "3.75vw" || "1.25vw";
    topContainerDiv.style["padding-top"] = mobileDevice && "3vw" || "1vw";
    topContainerDiv.style["padding-bottom"] = mobileDevice && "3vw" || "1vw";
  });
  topLeftContainer.style["text-align"] = mobileDevice && "left" || "right";
  topRightContainer.style["text-align"] = mobileDevice && "right" || "left";
  leftContainer.style[mobileDevice && "border-bottom-width" || "border-right-width"] = mobileDevice && "1vw" || "0.2vw";
  rightContainer.style[mobileDevice && "border-top-width" || "border-left-width"] = mobileDevice && "1vw" || "0.2vw";

  circleSeparator.style.width = mobileDevice && "16vw" || "4vw";
  circleSeparator.style.height = mobileDevice && "16vw" || "4vw";
  orTextHeader.style["font-size"] = mobileDevice && "8vw" || "2vw";

  deforestationSelectionDiv.style.width = mobileDevice && "50%" || "30%";
  selectionDivs.forEach((selectionDiv) => {
    selectionDiv.style["border-width"] = mobileDevice && "0.9vw" || "0.3vw";
    selectionDiv.style["border-radius"] = mobileDevice && "3vw" || "1vw";
  });
  selectionDivHeaders.forEach((selectionDivHeader) => {
    selectionDivHeader.style["font-size"] = mobileDevice && "6vw" || "2vw";
  })
  moreSelectionDiv.style["margin-top"] = mobileDevice && "1.5vw" || "0.5vw";
  moreSelectionDiv.style["margin-bottom"] = mobileDevice && "0.6vw" || "0.2vw";
  lessSelectionDiv.style["margin-top"] = mobileDevice && "0.6vw" || "0.2vw";
  lessSelectionDiv.style["margin-bottom"] = mobileDevice && "1.5vw" || "0.5vw";

  generateCountries(pickRandomCountry());
}

function generateCountries(_country1) {
  country1 = _country1;

  leftContainer.style["background-color"] = getColorFromRange(parseInt(country1["Deforestation"]));
  countryNameHeader.innerHTML = country1["Entity"];
  countryDeforestationHeader.innerHTML = parseInt(country1["Deforestation"], 10).toLocaleString('en-US') + " ha";

  country2 = null;
  rightContainer.style["background-color"] = "rgb(200, 200, 200)";

  do {
    country2 = pickRandomCountry();
  } while (country2 == country1);

  countryNameGuessHeader.innerHTML = country2["Entity"];
  
  countryFlagGuessImg.src = "flags/" + country2["Code"] + ".svg";
  countryFlagImg.src = "flags/" + country1["Code"] + ".svg";
}

function pickRandomCountry() {
  const dictKeys = Object.keys(annualDeforestationDict);
  const randomNum = Math.floor(Math.random() * dictKeys.length);

  return annualDeforestationDict[dictKeys[randomNum]];
}

function getColorFromRange(deforestation) {
  const deforestationFactor = deforestation / 300000;
  const redFactor = 89;
  const greenFactor = 214;
  const blueFactor = 196;
  if (deforestation <= 300000) {
    return "rgb(" + (254 - deforestationFactor * redFactor) + ", " + (229 - deforestationFactor * greenFactor) + ", " + (217 - deforestationFactor * blueFactor);
  } else {
    return "rgb(165, 15, 21)";
  }
}

function increaseDeforestationCount(country1, country2, guessHigher) {
  const country1Deforestation = parseInt(country1["Deforestation"], 10);
  const country2Deforestation = parseInt(country2["Deforestation"], 10);

  const deforestationIncrement = country2Deforestation / 100;
  let currentDeforestationCount = 0;
  let currentIndex = 0;

  countryDeforestationGuessHeader.innerHTML = currentDeforestationCount;
  countryDeforestationGuessHeader.style.display = "block";
  deforestationSelectionDiv.style.display = "none";
  orTextHeader.style.opacity = "0";

  setTimeout(() => {
    orTextHeader.style.display = "none";
    markIconImg.style.opacity = "0";
    markIconImg.style.display = "block";
  }, 350);

  function increment() {
    if (currentIndex < 100) {
      currentDeforestationCount = Math.ceil(currentDeforestationCount + deforestationIncrement);
      countryDeforestationGuessHeader.innerHTML = currentDeforestationCount.toLocaleString('en-US') + " ha";
      rightContainer.style["background-color"] = getColorFromRange(parseInt(currentDeforestationCount));
  
      currentIndex++;

      setTimeout(() => {
        increment();
      }, 10);
    } else {
      countryDeforestationGuessHeader.innerHTML = country2Deforestation.toLocaleString('en-US') + " ha";
      rightContainer.style["background-color"] = getColorFromRange(parseInt(country2["Deforestation"]));

      if ((country2Deforestation > country1Deforestation && guessHigher == true) || (country2Deforestation < country1Deforestation && guessHigher == false)) {
        markIconImg.src = "icons/correct.svg";
        score++;
      } else if ((country2Deforestation < country1Deforestation && guessHigher == true) || (country2Deforestation > country1Deforestation && guessHigher == false)) {
        markIconImg.src = "icons/incorrect.svg";

        if (score > highscore) {
          highscore = score;
        }
        
        score = 0;
      }
      markIconImg.style.opacity = "1";

      setTimeout(() => {
        generateCountries(country2);

        scoreCounterHeader.innerHTML = score;
        highscoreCounterHeader.innerHTML = highscore;

        markIconImg.style.display = "none";
        orTextHeader.style.opacity = "1";
        orTextHeader.style.display = "block";
        countryDeforestationGuessHeader.style.display = "none";
        deforestationSelectionDiv.style.display = "flex";
      }, 1000);
    }
  }

  increment();
}

function addEventListeners() {
  moreSelectionDiv.addEventListener("click", () => {
    increaseDeforestationCount(country1, country2, true);
  });

  lessSelectionDiv.addEventListener("click", () => {
    increaseDeforestationCount(country1, country2, false);
  })
}

addEventListeners();