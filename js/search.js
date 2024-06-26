import { imageURL, readInNewTab } from './app.js';

const search = document.querySelector('.search input');
export const searchBox = document.querySelector('.search-section');
search.onclick = (e) => {
  e.preventDefault();
  searchBox.style.visibility = 'visible';
};

const API_URL = 'http://localhost:4000/api/article/list';

const closeBtn = document.querySelector('.close-btn');
closeBtn.onclick = () => {
  closeItem(searchBox);
};

const input = document.querySelector('.input');
const result = document.querySelector('.result');

export function closeItem(item) {
  item.style.visibility = 'hidden';
  input.value = '';
  result.innerHTML = '';
}

const Search = () => {
  document.body.addEventListener('keyup', async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw Error('Something went wrong..');
      let articles = (await response.json()) || [];

      result.innerHTML = '';
      const inputValue = input.value.toLowerCase();
      const filteredArray = articles.data.filter(
        (item) =>
          item.title.toLowerCase().includes(inputValue) ||
          item.category.toLowerCase().includes(inputValue)
      );

      filteredArray.forEach((value, index) => {
        const link = document.createElement('a');
        link.innerHTML = `
        <img src= "${imageURL}/${value.image}" alt="${value.image}+${
          value.category
        }"/>
        <div>
        <p><b>${value.title}</b></p>
        <small>${value.poem.slice(0, 30)}...</small>
        </div>`;
        link.classList.add('list-value');
        link.onclick = () => {
          readInNewTab(filteredArray, index);
        };
        link.href = `readArticle.html`;
        link.target = '_blank';

        result.append(link);
      });

      if (result.innerHTML == '') {
        result.textContent = `No result found for "${inputValue}"`;
      }
      if (!inputValue) {
        result.innerHTML = '';
      }
    } catch (err) {
      console.error('There was an error' + err);
    }
  });
};

export { Search };
