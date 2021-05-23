export default function getRefs() {
  return {
    searchForm: document.querySelector('#search-form'),
    picturesContainer: document.querySelector('.gallery'),
    galleryContainer: document.querySelector('.gallery-container'),
    sentinelEl: document.querySelector('#sentinel'),
    bodyEl: document.body,
  };
}
