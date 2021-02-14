const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
const duration = document.getElementById('duration');
const spinner = document.getElementById('spinner');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div);
    toggleItem(false);
  })
  
}

const getImages = (query) => {
  toggleItem(true);
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      if(data.hits.length){
        showImages(data.hits)
      } else {
        alert("Search results not found");
        gallery.innerHTML = '';
        toggleItem(false);
      }
    })
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  // element.classList.add('added');
 
  let item = sliders.indexOf(img);
  if (item === -1) {
    element.classList.toggle('added');
    sliders.push(img);
  } else {
    element.classList.toggle('added');
  }
}

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const slideDuration = duration.value || 1000;
  sliders.forEach(slide => {
    let item = document.createElement('div')
    item.className = "slider-item";
    item.innerHTML = `<img class="w-100"
    src="${slide}"
    alt="">`;
    sliderContainer.appendChild(item)
  })
  changeSlide(0)
  if(slideDuration < 0) {
    alert("Duration can't be negative");
  } else {
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, slideDuration);
  }
  // timer = setInterval(function () {
  //   slideIndex++;
  //   changeSlide(slideIndex);
  // }, duration);
}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

const toggleItem = (show) => {
  if (show) {
    spinner.classList.toggle('d-none');
  } else {
    spinner.classList.add('d-none');
  }
}

const keyActivity = (inputArea, button) => {
  inputArea.addEventListener('keypress', function (event) {
  if(event.key === 'Enter') {
    button.click();
  }
})
}
keyActivity(searchInput, searchBtn);
keyActivity(duration, sliderBtn);

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
})


// searchInput.addEventListener('keypress', function (event) {
//   if(event.key === 'Enter') {
//     searchBtn.click();
//   }
// })

// duration.addEventListener('keypress', function (event) {
//   if(event.key === 'Enter') {
//     sliderBtn.click();
//   }
// })
sliderBtn.addEventListener('click', function () {
  createSlider()
})
