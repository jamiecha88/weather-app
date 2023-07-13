let weather = {
  apiKey: "ce309858c9580a2f86ac0e0f45374afb",
  units: "metric",

  fetchWeather: function (query) {
    fetch(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      query +
      "&units=" +
      this.units +
      "&appid=" +
      this.apiKey
    )
      .then((response) => response.json())
      .then((data) => this.displayWeather(data));
  },

  getGeoLocation: function () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.fetchWeather(latitude + "," + longitude);
        },
        (error) => {
          console.log(error);
          document.querySelector(".location").innerText =
            "Unable to retrieve your location.";
        }
      );
    } else {
      document.querySelector(".location").innerText =
        "Geolocation is not supported by your browser.";
    }
  },

  displayWeather: function (data) {
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;

    const tempElement = document.querySelector(".temp");
    const unitButton = document.querySelector(".unit-toggle");

    tempElement.innerHTML = `${temp}<span class="unit">${this.getUnitSymbol()}</span>`;
    document.querySelector(".city").innerText = name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind speed: " + speed + " m/s";
    document.querySelector(".weather").classList.remove("loading");

    unitButton.innerText = "°C/°F";
    unitButton.addEventListener("click", () => {
      this.toggleUnits();
      tempElement.innerHTML = `${temp}<span class="unit">${this.getUnitSymbol()}</span>`;
    });
  },

  getUnitSymbol: function () {
    return this.units === "metric" ? "°C" : "°F";
  },

  toggleUnits: function () {
    this.units = this.units === "metric" ? "imperial" : "metric";
  },

  search: function () {
    this.fetchWeather(document.querySelector(".search-bar").value);
  },
};

document.addEventListener("DOMContentLoaded", function () {
  weather.getGeoLocation();
});

document.querySelector(".search button").addEventListener("click", function () {
  weather.search();
});

document
  .querySelector(".search-bar")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });

weather.fetchWeather("Seattle");
