const main = document.querySelector('.main');
(image = document.querySelector('.image')),
  (closeBtn = document.querySelector('#close')),
  (section = document.querySelector('.section-read-later'));

const imageURL = 'http://localhost:4000/images';

function removeFromReadLater(indexToRemove) {
  const removedArticle = readlater.splice(indexToRemove, 1)[0];
  localStorage.setItem('readLater', JSON.stringify(readlater));
  toastify(`${removedArticle.title.toUpperCase()} was removed`, 'success');

  renderReadLaterSection();
}

function closeArticle() {
  main.classList.remove('show-main');
  image.classList.remove('show-image');
  closeBtn.style.display = 'none';
  document.body.style.overflow = 'auto';
  hideLink();
}

readlater.reverse();

function renderReadLaterSection() {
  let sectionContent = '';

  readlater.forEach((read) => {
    let poem = read.poem.slice(0, 50);
    sectionContent += `
        <div class="article-read">
        <img src="${imageURL}/${read.image}" alt="read read read" class="image-read">
        <div class="margin"> 
        <div class="link">
                    <span><h1 class="title read-title">${read.title}</h1></span><br>
                    <li class="views"> ${poem}...  </li>
                </div>
                <div class="options-read">
                    <a href="#" class="read-now" target="_blank">Read now<i class="ri-arrow-right-up-line arrow"></i></a>
                    <button class="remove">Remove</button>
                    </div>
                    </div>
                    </div>  
                    `;
  });

  section.innerHTML = sectionContent;
  if (!sectionContent) {
    let empty = document.createElement('div');
    empty.classList.add('empty');
    empty.textContent = 'Your favorite list is empty';
    section.appendChild(empty);
  }
  const articleRead = document.querySelectorAll('.image-read');
  articleRead.forEach((art, i) => {
    let item = readlater[i];
    art.onclick = () => {
      readInNewTab(readlater, i);
      showLink();
      showClickedArticle(item);
    };
  });

  document.querySelectorAll('.remove').forEach((remove, index) => {
    remove.onclick = () => {
      removeFromReadLater(index);
    };
  });

  readNow();
}

renderReadLaterSection();

function readNow() {
  document.querySelectorAll('.read-now').forEach((readNow, i) => {
    let item = readlater[i];
    readNow.addEventListener('click', (e) => {
      e.preventDefault();
      readInNewTab(readlater, i);
      showLink();
      showClickedArticle(item);
    });
  });

  closeBtn.onclick = () => {
    main.classList.remove('show-main');
    image.classList.remove('show-image');
    closeBtn.style.display = 'none';
    document.body.style.overflow = 'auto';
  };
}

const alertSpan = document.querySelector('.alert');

document.body.onkeydown = (e) => {
  if (e.key == 'Escape') {
    closeArticle();
  }
};

function showClickedArticle(item) {
  main.classList.add('show-main');
  image.classList.add('show-image');
  closeBtn.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.querySelector('.heading-big').innerHTML = item.title;
  image.src = `${imageURL}/${item.image}`;

  document.querySelector('.poem').innerHTML = item.poem;
}

function showLink() {
  document.querySelector('.read-in-link').style.visibility = 'visible';
}

function hideLink() {
  document.querySelector('.read-in-link').style.visibility = 'hidden';
}

function readInNewTab(articles, index) {
  document.querySelector('.read-in-link').onclick = (e) => {
    const selectedArticle = articles[index];

    const existingData = JSON.parse(localStorage.getItem('readInNewTab')) || [];
    existingData.splice(0, existingData.length, selectedArticle);
    localStorage.setItem('readInNewTab', JSON.stringify(existingData));

    console.log(existingData);
    console.log('reading...');
  };
}

function wow() {
  const sscroll = window.scrollY;
  document.querySelectorAll('.wow').forEach((element) => {
    const elementPosition = element.getBoundingClientRect().top;
    if (sscroll > elementPosition) {
    }
  });
}
closeBtn.onclick = () => {
  closeArticle();
};

//Toastify
const toastify = (message, type) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  let timeoutId;
  let startTime;
  let remainingTime = 3000;

  // Check if type argument is provided and is a string
  if (!type || typeof type !== 'string') {
    console.error(
      "The toastify function is missing or invalid 'type' argument."
    );
    return;
  }

  // Set class and content based on type
  if (type === 'success') {
    progressBar.classList.add('success');
    toast.innerHTML = `<img src="image/success.jpg" class="toast-img">  <p>${message}</p><span class="close-btn">X</span>`;
  } else if (type === 'error') {
    progressBar.classList.add('error');
    toast.innerHTML = `<img src="image/error.jpg" class="toast-img">   <p>${message}</p><span class="close-btn">X</span>`;
  } else {
    console.error('Invalid toast type.');
    return;
  }

  // Append progress bar to toast
  toast.appendChild(progressBar);

  const toasts = document.querySelectorAll('.toast');

  if (toasts.length > 2) {
    return;
  }

  // Close button function
  const closeBtn = toast.querySelector('.close-btn');
  closeBtn.onclick = () => {
    document.body.removeChild(toast);
  };

  toasts.forEach((toast, index) => {
    if (toasts.length > 0) {
      const lastToastPosition = toasts[index].getBoundingClientRect().top;
      let newPosition = lastToastPosition + 70;
      toast.style.top = `${newPosition}px`;
    }
  });

  // Function to pause timeout and animation
  const pauseToast = () => {
    clearTimeout(timeoutId); // Clear the timeout
    const elapsedTime = Date.now() - startTime; // Calculate elapsed time
    remainingTime -= elapsedTime; // Update remaining time
    progressBar.style.animationPlayState = 'paused'; // Pause animation
  };

  // Function to resume timeout and animation
  const resumeToast = () => {
    startTime = Date.now(); // Reset start time
    timeoutId = setTimeout(() => {
      // Start new timeout with remaining time
      document.body.removeChild(toast);
    }, remainingTime);
    progressBar.style.animationPlayState = 'running'; // Resume animation
  };

  // Event listeners for hover
  toast.addEventListener('mouseenter', pauseToast);
  toast.addEventListener('mouseleave', resumeToast);

  document.body.append(toast);

  // Remove toast and clear interval after timeout
  startTime = Date.now(); // Record start time
  timeoutId = setTimeout(() => {
    document.body.removeChild(toast);
  }, remainingTime); // 3000ms is the duration of the toast
};
