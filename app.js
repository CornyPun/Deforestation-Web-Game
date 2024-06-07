const annualDeforestationFile = new File([], "annual-deforestation.csv");
const fileReader = new FileReader();
let annualDeforestationDict = {};

const countryNameHeader = document.querySelector(".country-name");
const countryDeforestationHeader = document.querySelector(".country-deforestation");
const countryNameGuessHeader = document.querySelector("#country-name-guess");
const countryDeforestationGuessHeader = document.querySelector("#country-deforestation-guess");
const deforestationSelectionDiv = document.querySelector(".deforestation-selection");
const moreSelectionDiv = document.querySelector(".more-selection");
const lessSelectionDiv = document.querySelector(".less-selection");
const orTextHeader = document.querySelector(".or-text");
const markIconImg = document.querySelector(".mark-icon");

let country1;
let country2;

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

  generateCountries(pickRandomCountry());
}

function generateCountries(_country1) {
  country1 = _country1;

  countryNameHeader.innerHTML = country1["Entity"];
  countryDeforestationHeader.innerHTML = parseInt(country1["Deforestation"], 10).toLocaleString('en-US') + " ha";

  country2 = null;

  do {
    country2 = pickRandomCountry();
  } while (country2 == country1);

  countryNameGuessHeader.innerHTML = country2["Entity"];

  addEventListeners();
}

function pickRandomCountry() {
  const dictKeys = Object.keys(annualDeforestationDict);
  const randomNum = Math.floor(Math.random() * dictKeys.length);

  return annualDeforestationDict[dictKeys[randomNum]];
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
  
      currentIndex++;

      setTimeout(() => {
        increment();
      }, 10);
    } else {
      countryDeforestationGuessHeader.innerHTML = country2Deforestation.toLocaleString('en-US') + " ha";
      console.log(country2Deforestation);
      console.log(country1Deforestation);
      console.log(country2Deforestation > country1Deforestation);
      console.log(country2Deforestation > country1Deforestation && guessHigher == true)
      console.log();
      console.log(guessHigher);
      if ((country2Deforestation > country1Deforestation && guessHigher == true) || (country2Deforestation < country1Deforestation && guessHigher == false)) {
        markIconImg.src = "icons/correct.svg";
      } else if ((country2Deforestation < country1Deforestation && guessHigher == true) || (country2Deforestation > country1Deforestation && guessHigher == false)) {
        markIconImg.src = "icons/incorrect.svg";
      }
      markIconImg.style.opacity = "1";

      setTimeout(() => {
        generateCountries(country2);

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