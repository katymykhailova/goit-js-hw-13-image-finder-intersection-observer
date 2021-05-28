//basiclightbox
import * as basicLightbox from 'basiclightbox';

// spinner
import 'spin.js/spin.css';
import { ligtboxSpinn } from './spinner';

// refs
import getRefs from './get-refs';

// variables
const refs = getRefs();
refs.galleryContainer.addEventListener('click', onCardClick);

function onCardClick(evt) {
  evt.preventDefault();

  const isGalleryImgEl = evt.target.classList.contains('gallery__img');
  if (!isGalleryImgEl) {
    return;
  }
  const src = evt.target.dataset.source;
  openModal(src);
}

function openModal(src) {
  const instance = basicLightbox.create(
    `<img class = "basiclightbox-img" src="${src}" width="800" height="600">`,
  );
  instance.show();
  const lightboxEl = instance.element();
  const modalSpinner = ligtboxSpinn.spin(lightboxEl);
  const basiclightboxImg = document.querySelector('.basiclightbox-img');

  basiclightboxImg.addEventListener('load', event => {
    modalSpinner.stop();
  });
}

// прелоад картинки для модалки
// показываем картинку прелоад
// document.querySelector('img').addEventListener('load', e => {
//   console.log(e);
//   // тут подставляем уже загруженное изображение
// });
