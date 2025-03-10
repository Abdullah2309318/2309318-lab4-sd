const searchButton = document.getElementById('search-button');
const countryInput = document.getElementById('country-input');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

searchButton.addEventListener('click', () => {
  const countryName = countryInput.value.trim();
  if (!countryName) {
    alert('Please enter a country name.');
    return;
  }
  fetchCountryData(countryName);
});

async function fetchCountryData(name) {
  try {
    countryInfoSection.innerHTML = '';
    borderingCountriesSection.innerHTML = '';

    const response = await fetch(`https://restcountries.com/v3.1/name/${name}?fullText=true`);
    if (!response.ok) {
      throw new Error('Country not found. Please check the spelling or try another country.');
    }

    const data = await response.json();
    const country = data[0];

    const countryNameCommon = country.name?.common || 'N/A';
    const capital = country.capital ? country.capital[0] : 'N/A';
    const population = country.population ? country.population.toLocaleString() : 'N/A';
    const region = country.region || 'N/A';
    const flag = country.flags?.png || '';

    // Main Country
    countryInfoSection.innerHTML = `
      <h2>${countryNameCommon}</h2>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Population:</strong> ${population}</p>
      <p><strong>Region:</strong> ${region}</p>
      <img class="country-flag" src="${flag}" alt="Flag of ${countryNameCommon}">
    `;

    // Bordering countries
    if (country.borders && country.borders.length > 0) {
      await fetchBorderCountries(country.borders);
    } else {
      borderingCountriesSection.innerHTML = 'No bordering countries found.';
    }

  } catch (error) {
    countryInfoSection.innerHTML = `Error: ${error.message}`;
    borderingCountriesSection.innerHTML = '';
  }
}

async function fetchBorderCountries(borders) {
  const borderCodes = borders.join(',');

  try {
    const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
    if (!borderResponse.ok) {
      throw new Error('Failed to fetch bordering countries');
    }
    const borderData = await borderResponse.json();

    let borderingCountriesHTML = '<h3>Bordering Countries:</h3>';
    borderData.forEach((borderCountry) => {
      const borderCountryName = borderCountry.name?.common || 'Unknown';
      const borderFlag = borderCountry.flags?.png || '';
      borderingCountriesHTML += `
        <div class="border-country">
          <img src="${borderFlag}" alt="Flag of ${borderCountryName}">
          <span>${borderCountryName}</span>
        </div>
      `;
    });

    borderingCountriesSection.innerHTML = borderingCountriesHTML;
  } catch (error) {
    borderingCountriesSection.innerHTML = `Error: ${error.message}`;
  }
}
