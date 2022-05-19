import './css/styles.css';
import { fetchCountries } from "./fetchCountries";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countriesMarkup from "./countriesMarkup.hbs";

var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

let searchCountry = "";

const refs = {
    inputEl: document.querySelector("input#search-box"),
    cardContainer: document.querySelector(".country-info"),
    listEl: document.querySelector(".country-list"),
}

refs.inputEl.addEventListener("input", debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(e) {
    searchCountry = e.target.value.trim();
    if (searchCountry === "") {
        refs.listEl.innerHTML = "";
        refs.cardContainer.innerHTML = "";
        return;
    }
    fetchCountries(searchCountry)
        .then(data => showCountries(data))
        .catch(error => showError(error));
}
            
function  showCountries(countries)  {      
    if (countries.length > 10) { return Notify.info('Too many matches found. Please enter a more specific name.') };
    if (countries.length >= 2 && countries.length <= 10) {
        return renderListCountries(countries);
    }
    renderCountryCard(countries);
}

function renderListCountries(countries) {
    const markup = countriesMarkup(countries);
    refs.listEl.insertAdjacentHTML("beforeend", markup);
}


function renderCountryCard(countries) {
    refs.listEl.innerHTML = "";
    refs.cardContainer.innerHTML = "";
    const markup = countries.map(({ capital, population, flags, languages, name }) => {
        return `<img src="${flags.svg}" alt="${name.official}" width="30">
        <span class = "country-title"> <b> ${ name.official } </b> </span>
        <ul class = "country-info-list"
        <li> <b> Capital: </b> <span class="country-info"> ${ capital } </span> </li>
        <li> <b> Population: </b> <span class="country-info"> ${population} </span> </li>
        <li>  <b> Languages: </b> <span class="country-info"> ${Object.values(languages).join(", ")} </span> </li>
        </ul>
        `
    })
    refs.cardContainer.insertAdjacentHTML("beforeend", markup);
}

function showError(error) {
    Notify.failure('Oops, there is no country with that name');
};