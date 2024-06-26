import {
  generateArticle,
  updateViewCount,
  toastify,
} from '../utils/showClickedItem.js';

import { Search, closeItem, searchBox } from './search.js';

window.addEventListener('load', function () {
  document.querySelector('.preloader').style.display = 'none';
  document.querySelector('.content').style.display = 'block';
});

// let verticalLine = document.querySelector(".vertical-line");
export const API_URL = 'http://localhost:4000/api/article/list';
const popUp = document.querySelector('.pop-up');
const toTop = document.querySelector('.top');
const content = document.querySelector('.content');

export const imageURL = 'http://localhost:4000/images';

const main = document.querySelector('.main');
const header = document.querySelector('header');
const image = document.querySelector('.image');
const closeBtn = document.querySelector('#close');
const loadingArticle = document.querySelector('.loading-article');

const getArticles = async (articles) => {
  let articleContent = '';
  try {
    setLoading(true);
    const response = await fetch(API_URL);
    if (!response.ok) throw Error('Something went wrong..');
    articles = (await response.json()) || [];

    if (!articles.data.success) {
      articles.data.reverse();
      articles.data.forEach((article, index) => {
        let date = new Date();
        let day = date.getDate();
        let year = date.getFullYear();
        let month = date.getMonth();
        month = month < 10 ? '0' + month : month;

        date = `${day}th ${month} ${year} `;
        articleContent += `
                <div class="article">
                <i class="ri-star-fill star"></i>
                <img src="${imageURL}/${
          article.image
        }" alt="read read read" class="read">
                <div class="link">
                    <span><h1 class="title">${article.title}</h1></span>
                    <span class="date">Date: ${article.date}</span><br>
                    <span class="author">By <b>${article.author}</b></span><br>
                    <span class="views" id="views-${index}">● ${
          article.views
        } views</span><br><br>
                    <div class="preview" id="views-${index}"> ●  ${article.poem.slice(
          0,
          50
        )}...</div>
                </div>
                <div class="options">
                    <button class="read-later"><i class="ri-add-circle-fill"></i>Add to favorites</button>
                    <a href="" class="read-now">Read now<i class="ri-arrow-right-up-line arrow"></i></a>
                </div>
                </div>
                `;
      });
    } else {
      console.log('Your request was unsuccessfull');
    }
  } catch (err) {
    console.log(err);
    createElement(
      'p',
      `${err.message}...please try again `,
      'error',
      document.querySelector('.article-place')
    );
  } finally {
    setLoading(false);
  }

  document.querySelector('.article-place').innerHTML += articleContent;
  const artic = document.querySelectorAll('.read');
  artic.forEach((art, i) => {
    let item = articles.data[i];
    art.onclick = () => {
      showClickedArticle(item);
      generateArticle(item._id);
      showLink();
      document.querySelector('.read-in-link').onclick = (e) => {
        readInNewTab(articles.data, i);
      };
    };
  });

  //scroll reveal
  ScrollReveal().reveal('.article', {
    interval: 30,
    reset: true,
    delay: 100,
    origin: 'bottom',
    distance: '80px',
    duration: 1000,
  });

  addToReadLater(articles);
  readNow(articles);
  // articles.data ? verticalLine.style.display = "block" : verticalLine.style.display = "none";
};

Search();
getArticles();

function addToReadLater(articles) {
  document.querySelectorAll('.read-later').forEach((readLater, index) => {
    readLater.addEventListener('click', () => {
      const selectedArticle = articles.data[index];

      const existingData = JSON.parse(localStorage.getItem('readLater')) || [];
      const isAlreadyAdded = existingData.some(
        (article) => article._id === selectedArticle._id
      );

      if (!isAlreadyAdded) {
        existingData.push(selectedArticle);
        localStorage.setItem('readLater', JSON.stringify(existingData));
        toastify(`Added`, 'success');
      } else {
        toastify(`Already added`, 'error');
      }
    });
  });
}

const poem = document.querySelector('.poem');

const fonts = [
  'Dancing scripts',
  'monospace',
  'sans-serif',
  'Montserrat',
  'Poppins',
  'Pacifico',
];
let randomNumber = 0;
function changeFont() {
  randomNumber++;
  if (randomNumber > fonts.length - 1) {
    randomNumber = 0;
  }

  const font = fonts[randomNumber];
  poem.style.fontFamily = font;

  font === 'Montserrat' ? (poem.style.fontWeight = 'bold') : '400';
}

document.querySelector('.change-font').onclick = () => {
  changeFont();
};

//Reading section of the page
function readNow(articles) {
  document.querySelectorAll('.read-now').forEach((readNow, i) => {
    let item = articles.data[i];
    if (item.image) {
      readNow.addEventListener('click', (e) => {
        e.preventDefault();
        if (popUp.classList.contains('show-popup')) {
          popUp.classList.remove('show-popup');
        }

        showClickedArticle(item);
        showLink();

        document.querySelector('.read-in-link').onclick = (e) => {
          readInNewTab(articles.data, i);
        };
      });
    }
    document.querySelector('.change-font').style.opacity = '1';
  });

  closeBtn.onclick = () => {
    closeArticle();
  };
}

const mainOverlay = document.querySelector('#overlay');
const sidebarOverlay = document.querySelector('#sidebar-overlay');

const blurMain = () => {
  mainOverlay.style.visibility = 'visible';
};

const unblurMain = () => {
  mainOverlay.style.visibility = 'hidden';
};

const blurSidebar = () => {
  sidebarOverlay.style.visibility = 'visible';
};

const unblurSidebar = () => {
  sidebarOverlay.style.visibility = 'hidden';
};

const menuBtn = document.querySelector('.menu');
menuBtn.onclick = (e) => {
  e.stopPropagation();
  popUp.classList.toggle('show-popup');
  blurMain(); // Blur the main content
  blurSidebar(); // Blur the sidebar
};

function closeSideBar() {
  popUp.classList.remove('show-popup');
  unblurMain(); // Unblur the main content
  unblurSidebar(); // Unblur the sidebar
}

function closeArticle() {
  main.classList.remove('show-main');
  image.classList.remove('show-image');
  closeBtn.style.display = 'none';
  hideLink();
}

const productKey = '4NWXJ-XXTB2-VTBX3-86Y37-T29HP';

window.onscroll = () => {
  if (!main.classList.contains('show-main')) {
    toTop.style.opacity = window.scrollY > 400 ? '1' : null;
  }

  closeSideBar();
};

document.body.addEventListener('click', (e) => {
  if (!e.target.closest('.pop-up')) {
    closeSideBar();
  }
});

const alertSpan = document.querySelector('.alert');

//show any alert
// function showAlert(content, color) {
//   alertSpan.innerHTML = content;
//   alertSpan.style.color = color;
//   alertSpan.classList.add('show-alert');

//   setTimeout(() => {
//     alertSpan.classList.remove('show-alert');
//   }, 1500);
// }

function showClickedArticle(item) {
  if (popUp.classList.contains('show-popup')) {
    popUp.classList.remove('show-popup');
  }

  main.classList.add('show-main');
  image.classList.add('show-image');
  closeBtn.style.display = 'block';
  document.querySelector('.heading-big').innerHTML = item.title;
  image.src = `${imageURL}/${item.image}`;

  let poem = item.poem;
  poem = poem.replace(/\./g, `<br>`);
  document.querySelector('.poem').innerHTML = poem;
  updateViewCount(item._id);
}

document.body.onkeydown = (e) => {
  if (e.key == 'Escape') {
    closeArticle();
  }

  if (e.key === 'Escape') {
    closeItem(searchBox);
  }
};

export function readInNewTab(articles, index) {
  const selectedArticle = articles[index];

  const existingData = JSON.parse(localStorage.getItem('readInNewTab')) || [];
  existingData.splice(0, existingData.length, selectedArticle);
  localStorage.setItem('readInNewTab', JSON.stringify(existingData));
}

function setLoading(loading) {
  loading
    ? (loadingArticle.style.display = 'block')
    : (loadingArticle.style.display = 'none');
}

function showLink() {
  document.querySelector('.read-in-link').style.visibility = 'visible';
}

function hideLink() {
  document.querySelector('.read-in-link').style.visibility = 'hidden';
}

const overlayclass = document.querySelector('.overlay');

function blurr() {
  overlayclass.style.display = 'block';
}

function unblurr() {
  overlayclass.style.display = 'none';
}

function stabilizeScreen() {
  document.body.style.overflow = 'hidden';
}

function unStabilizeScreen() {
  document.body.style.overflow = 'auto';
}

// function showCase(whatToShow) {
//   const showCaseElement = document.createElement('div');
//   showCaseElement.classList.add('showcase');
//   showCaseElement.innerHTML = whatToShow;
//   content.append(showCaseElement);
//   blurr();
//   stabilizeScreen();
// }

function closeShowCase(showCaseElement) {
  showCaseElement.classList.add('showcase-hidden');
  unblurr();
  unStabilizeScreen();
}

overlayclass.onclick = () => {
  document
    .querySelectorAll('.showcase')
    .forEach((showcase) => closeShowCase(showcase));
  unblurr();
  unStabilizeScreen();
};

function closeByEscape() {
  document.addEventListener('keydown', () => {
    document
      .querySelectorAll('.showcase')
      .forEach((showcase) => closeShowCase(showcase));
  });
}

closeByEscape();

function createElement(
  element = 'div',
  content = '',
  className = null,
  appendTo = null
) {
  const div = document.createElement(element);
  div.innerHTML = content;
  div.classList.add(className);
  appendTo !== null ? appendTo.append(div) : null;
}

createElement();
