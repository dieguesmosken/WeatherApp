// Função para obter a previsão do tempo com base na localização
function getWeather(lat, lng) {
    const API_URL = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "771942e2133c550992679051d2537c29";
    const units = "metric";
    const lang = "pt_br";
    const params = {
      lat: lat,
      lon: lng,
      appid: API_KEY,
      units: units,
      lang: lang,
    };
    const queryString = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");
    const url = API_URL + "?" + queryString;
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const weatherData = data.weather[0];
        const mainData = data.main;
        const windData = data.wind;
        const sysData = data.sys;
  
        const weatherCard = document.createElement("div");
        weatherCard.classList.add("weather-card");
        weatherCard.innerHTML = `
          <div class="weather-icon">
            <img src="http://openweathermap.org/img/wn/${weatherData.icon}@4x.png" alt="${weatherData.description}">
          </div>
          <div class="weather-info">
            <h2>${weatherData.description}</h2>
            <p><strong>Temperatura:</strong> ${mainData.temp}°C</p>
            <p><strong>Sensação térmica:</strong> ${mainData.feels_like}°C</p>
            <p><strong>Umidade:</strong> ${mainData.humidity}%</p>
            <p><strong>Pressão:</strong> ${mainData.pressure} hPa</p>
            <p><strong>Velocidade do Vento:</strong> ${windData.speed} m/s</p>
            <p><strong>Direção do Vento:</strong> ${windData.deg}°</p>
            <p><strong>Nascer do Sol:</strong> ${new Date(sysData.sunrise * 1000).toLocaleTimeString('pt-BR')}</p>
            <p><strong>Pôr do Sol:</strong> ${new Date(sysData.sunset * 1000).toLocaleTimeString('pt-BR')}</p>
          </div>
        `;
        document.getElementById("weather").innerHTML = '';
        document.getElementById("weather").appendChild(weatherCard);
      })
      .catch((error) => {
        document.getElementById("weather").innerHTML = '<p>Erro ao obter a previsão do tempo. Tente novamente mais tarde.</p>';
        console.error("Fetch error:", error);
      });
  }
  
  // Obter a localização do usuário e mostrar a previsão do tempo
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      getWeather(lat, lng);
    },
    (error) => {
      document.getElementById("weather").innerHTML = '<p>Erro ao obter sua localização. Verifique as permissões de geolocalização.</p>';
      console.error("Geolocation error:", error);
    }
  );
  
  // Função para buscar a previsão do tempo com base na cidade
  function search() {
    const city = document.getElementById("city").value;
    const API_KEY = "771942e2133c550992679051d2537c29";
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=pt_br&units=metric&appid=${API_KEY}`
      )
      .then(function (response) {
        const weatherData = response.data.weather[0];
        const mainData = response.data.main;
        const windData = response.data.wind;
        const sysData = response.data.sys;

        console.log(response.data);
  
        const weatherContainer = document.getElementById("weather");
        weatherContainer.innerHTML = `
          <div class="weather-card">
            <div class="weather-icon">
              <img src="http://openweathermap.org/img/wn/${weatherData.icon}@4x.png" alt="${weatherData.description}">
            </div>
            <div class="weather-info">
              <h2>${weatherData.description}</h2>
              <p><strong>Cidade:</strong> ${response.data.name}</p>
              <p><strong>Temperatura:</strong> ${mainData.temp}°C</p>
              <p><strong>Tempo:</strong> ${weatherData.description}</p>
              <p><strong>Umidade:</strong> ${mainData.humidity}%</p>
              <p><strong>Pressão:</strong> ${mainData.pressure} hPa</p>
              <p><strong>Velocidade do Vento:</strong> ${windData.speed} m/s</p>
              <p><strong>Direção do Vento:</strong> ${windData.deg}°</p>
              <p><strong>Nascer do Sol:</strong> ${new Date(sysData.sunrise * 1000).toLocaleTimeString('pt-BR')}</p>
              <p><strong>Pôr do Sol:</strong> ${new Date(sysData.sunset * 1000).toLocaleTimeString('pt-BR')}</p>
            </div>
          </div>
        `;
      })
      .catch(function (error) {
        document.getElementById("weather").innerHTML = '<p>Erro ao obter a previsão do tempo. Verifique o nome da cidade e tente novamente.</p>';
        console.error("Axios error:", error);
      });
      
  }
  