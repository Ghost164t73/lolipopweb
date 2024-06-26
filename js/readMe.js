// import { resetRecommended } from '../utils/showClickedItem.js';
// import { articles } from '../data/articles.js';
import { generateTexts } from '../utils/showClickedItem.js';

const imageURL = 'http://localhost:4000/images';
let lengthNum = readNewTab.length;
let showedArticle = readNewTab[lengthNum - 1];
let history = JSON.parse(localStorage.getItem('history')) || [];
const previousArticleDiv = document.querySelector('.previous-article');

const API_URL = 'http://localhost:4000/api/article/list';
let textcontent;

function updateHTML() {
  //Update welcome text
  textcontent = generateTexts(showedArticle);

  //Set the html content
  let html = ' ';
  html += `
    <div class="information">
        <div class="title-read">
            <h1>${showedArticle.title.toUpperCase()}</h1>
        </div>
        <div class="info">
            By <span class="author text-bold">${showedArticle.author}</span>
            <div class="date">${showedArticle.date}</div>
        </div>
    </div>
    <pre class="poem">${showedArticle.poem}</pre>
    `;

  document.querySelector('.content-read').innerHTML = html;
  document.querySelector(
    'header img'
  ).src = `${imageURL}/${showedArticle.image}`;

  document.title = showedArticle.title;
}

// const array = [];
// array.

updateHTML();

// resetRecommended();
async function suggest(articles) {
  let suggested = '';

  articles.reverse();
  articles.forEach((article) => {
    suggested += `
        <li><a href="" class="article-feed">
            <img src="${imageURL}/${article.image}" alt="">
            <div class="info">
                <h3>${article.title}</h3>
                <div class="views">${article.views} views✨</div>
            </div>    
        </a></li>
        `;

    document.querySelector('.articles-feed').innerHTML = suggested;
  });

  document.querySelectorAll('.article-feed').forEach((link, i) => {
    link.onclick = (e) => {
      currentArticle--;
      readInNewTab(articles, i);
    };
  });
}

if (recommended.length === 0) {
  document.querySelector('.article-feed').style.display = 'none';
}

if (recommended.length >= 1) {
  suggest(recommended);
}

history.push(showedArticle);
let currentArticle;

function addToHistory(showed) {
  history.push(showed);
  currentArticle = history.length - 1;

  if (currentArticle != 0)
    previousArticleDiv.textContent = history[currentArticle - 1].title;

  localStorage.setItem('history', JSON.stringify(history));
}

previousArticleDiv.onclick = () => {
  currentArticle--;
  if (currentArticle < 0) return;
  history.push(showedArticle);

  if (currentArticle != 0)
    previousArticleDiv.textContent = history[currentArticle - 1].title;

  showedArticle = history[currentArticle];
  updateHTML();
};

function readInNewTab(articles, index) {
  const selectedArticle = articles[index];

  const existingData = JSON.parse(localStorage.getItem('readInNewTab')) || [];
  existingData.splice(0, existingData.length, selectedArticle);
  localStorage.setItem('readInNewTab', JSON.stringify(existingData));

  // Redefine showed article
  showedArticle = selectedArticle;

  // Update the HTML with the new article
  updateHTML();
  addToHistory(showedArticle);

  // Change the document title
  document.title = showedArticle.title;
}

const h1Text = document.querySelector('.h1-text');
h1Text.textContent = textcontent;

const recents = async () => {
  try {
    let response = await fetch(API_URL);
    let data = await response.json();
    let articles = data.data || [];
    const currentMonth = (new Date().getMonth() + 1)
      .toString()
      .padStart(2, '0');

    articles = articles.filter((article) => {
      const articleMonth = article.date;
      return articleMonth.includes(currentMonth);
    });

    articles.reverse();
    articles = articles.slice(0, 5);

    articles.forEach((article, index) => {
      const link = document.createElement('a');
      link.innerHTML = `
        <img src="${imageURL}/${article.image}" alt="${article.image} ${
        article.category
      }" />
        <div>
          <p><b>${article.title}</b></p>
          <small>${article.poem.slice(0, 50)}...</small>
        </div>`;
      link.classList.add('recent-list');
      link.onclick = () => {
        readInNewTab(articles, index);
      };
      link.href = `readArticle.html`;
      link.target = '_blank';

      document.querySelector('.recents').append(link);
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

await recents();
