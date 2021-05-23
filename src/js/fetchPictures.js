import { info } from '@pnotify/core';
import * as PNotifyAnimate from '@pnotify/animate';
import { defaults } from '@pnotify/animate';
defaults.inClass = 'fadeInDown';
defaults.outClass = 'fadeOutUp';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/bootstrap4/dist/PNotifyBootstrap4.css';

// templates
import galleryTpl from '../template/pictures.hbs';

// modules
import NewsApiService from './apiService';

// refs
import getRefs from './components/get-refs';

// variables
const newsApiService = new NewsApiService();
const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.query.value.trim();

  if (newsApiService.query === '') {
    return info({
      text: 'You must enter query parameters. Try again',
    });
  }
  newsApiService.resetPage();
  clearPicturesContainer();
  fetchPictures();
  e.currentTarget.elements.query.value = '';
}

async function fetchPictures() {
  try {
    const hits = await newsApiService.fetchPictures();
    if (hits.length == 0) {
      return info({
        text: 'No country has been found. Please enter a more specific query!',
      });
    }
    appendPicturesMarkup(hits);
  } catch (error) {
    info({
      text: 'Sorry. we cannot process your request!',
    });
  }
}

function appendPicturesMarkup(pictures) {
  refs.picturesContainer.insertAdjacentHTML('beforeend', galleryTpl(pictures));
}

function clearPicturesContainer() {
  refs.picturesContainer.innerHTML = '';
}

const options = { rootMargin: '150px' };
const onEntry = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && newsApiService.query !== '') {
      fetchPictures();
    }
  });
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinelEl);
