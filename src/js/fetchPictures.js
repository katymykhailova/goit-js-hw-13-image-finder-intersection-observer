import { info } from '@pnotify/core';
import * as PNotifyAnimate from '@pnotify/animate';
import { defaults } from '@pnotify/animate';
defaults.inClass = 'fadeInDown';
defaults.outClass = 'fadeOutUp';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/bootstrap4/dist/PNotifyBootstrap4.css';

import 'lazysizes';

// templates
import galleryTpl from '../template/pictures.hbs';

// modules
import PicturesApiService from './apiService';

// refs
import getRefs from './components/get-refs';

// variables
const picturesApiService = new PicturesApiService();
const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  picturesApiService.query = e.currentTarget.elements.query.value.trim();

  if (picturesApiService.query === '') {
    return info({
      text: 'You must enter query parameters. Try again',
    });
  }
  picturesApiService.resetPage();
  clearPicturesContainer();
  fetchPictures();
  e.currentTarget.elements.query.value = '';
}

async function fetchPictures() {
  try {
    const hits = await picturesApiService.fetchPictures();
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
  lazySizesMarkup();
}

function lazySizesMarkup() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    lazyImages.forEach(img => {
      img.classList.add('lazyload');
    });
  }
}

function clearPicturesContainer() {
  refs.picturesContainer.innerHTML = '';
}

const options = { rootMargin: '200px' };
const onEntry = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && picturesApiService.query !== '' && picturesApiService.page > 1) {
      fetchPictures();
    }
  });
};
const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.sentinelEl);
