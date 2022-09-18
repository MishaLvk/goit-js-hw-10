import './css/styles.css';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const countryInfo = document.querySelector('.country-info');
const countryList = document.querySelector('.country-list');
const request = document.querySelector('#search-box');
let deb = require('lodash.debounce');

request.addEventListener('input', deb(search, DEBOUNCE_DELAY));

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

function countryCard(country) {
  country.map(({ flags, name, capital, population, languages }) => {
    const lang = Object.values(languages).join(', ');
    const countryCard = `<div class='country-card'>
      <div class='card-title'>
        <img src='${flags.png}' alt='${name.official}' />
        <h2>${name.official}</h2>
      </div>
      <div class='card-body'>
        <p class='card-text'><span class='card-text_key'>capital: </span>${capital.join(
          ', '
        )}</p>
        <p class='card-text'><span class='card-text_key'>population: </span>${population}</p>
        <p class='card-text'><span class='card-text_key'>languages: </span>${lang}</p>
      </div>
    </div>`;
    countryInfo.innerHTML = countryCard;
  });
}

function countryLists(country) {
  const countryArr = country.map(el => {
    const element = document.createElement('li');
    element.innerHTML = `<div class='card-title'>
        <img src='${el.flags.png}' alt='${el.name.official}' />
        <h2>${el.name.official}</h2>
      </div>`;
    element.classList.add('country-style');
    return element;
  });
  countryList.append(...countryArr);
  // console.log(element);
}

function search() {
  const value = request.value;
  if (value.length == 0) {
    clearArticlesContainer();
    return;
  }
  fetchCountries(value)
    .then(interfaceAction)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
  clearArticlesContainer();
}

function clearArticlesContainer() {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
}

function interfaceAction(country) {
  if (country.length == 1) {
    countryCard(country);
  } else if ((country.length > 1) & (country.length <= 10)) {
    countryLists(country);
  } else {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }
}
