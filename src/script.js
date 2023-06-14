// extract variables from js file
const tagsCategories = [group_1, group_2, group_3, group_4];
const tagsCategoriesString = ['group_1', 'group_2', 'group_3', 'group_4'];

const ScreenBorderOffsetX = 100; // in px
const ScreenBorderOffsetY = 100; // in px

// Function to update the positions of the images on window resize
function updateImagePositions() {
  const imageContainers = document.querySelectorAll('.image-container');
  imageContainers.forEach((imageContainer) => {
    const left = Math.floor(Math.random() * (window.innerWidth - (300 + ScreenBorderOffsetX * 2))) + ScreenBorderOffsetX + "px";
    const top = Math.floor(Math.random() * (window.innerHeight - (300 + ScreenBorderOffsetY * 2))) + ScreenBorderOffsetY + "px";
    imageContainer.style.left = left;
    imageContainer.style.top = top;
  });
}

window.addEventListener('resize', updateImagePositions);

const fooElement = document.getElementById('oaClick');
let originalPositions = [];
let isRandomLayout = true;

fooElement.addEventListener('click', handleClick);

// Function to handle the click event on the button
function handleClick() {
  const imageContainers = document.querySelectorAll('.image-container');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  if (isRandomLayout) {
    if (originalPositions.length === 0) {
      imageContainers.forEach((container, index) => {
        const { left, top } = container.getBoundingClientRect();
        originalPositions[index] = { left, top };
      });
    }

    const gridSize = 200;
    const gridColumns = Math.floor(windowWidth / gridSize);
    const gridRows = Math.floor(windowHeight / gridSize);
    const offsetX = (windowWidth - (gridColumns * gridSize)) / 2;
    const offsetY = (windowHeight - (gridRows * gridSize)) / 2;

    let gridX = 0;
    let gridY = 0;

    imageContainers.forEach((container, index) => {
      const left = offsetX + gridX * gridSize;
      const top = offsetY + gridY * gridSize;

      container.style.left = `${left}px`;
      container.style.top = `${top + 50}px`;
      gridX++;
      if (gridX >= gridColumns) {
        gridX = 0;
        gridY++;
      }
    });

    fooElement.removeEventListener('click', handleClickAgain);
    isRandomLayout = false;
  } else {
    imageContainers.forEach((container, index) => {
      const { left, top } = originalPositions[index];
      container.style.left = `${left}px`;
      container.style.top = `${top}px`;
    });

    originalPositions = [];
    fooElement.addEventListener('click', handleClickAgain);
    isRandomLayout = true;
  }
}

function handleClickAgain() {
  handleClick();
}




// Loop through the tag categories and add images with text
for (let i = 0; i < tagsCategories.length; i++) {
  let category = tagsCategories[i];
  let count = 1;
  let counterElement = document.getElementById(tagsCategoriesString[i] + "N");
  counterElement.innerText = "(" + Object.keys(category).length + ")";

  Object.keys(category).forEach((key) => {
    let headerImg = category[key][2]["headerImg"];
    addImageWithText(headerImg, key, tagsCategoriesString[i], Math.random(), count);
    count++;
  });
}

// Function to add an image with text to the page
function addImageWithText(imageSrc, text, id, display, count) {
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('image-container');
  imageContainer.id = id;

  const image = document.createElement('img');
  image.src = imageSrc;

  const titleText = document.createElement('span');
  titleText.id = 'titleText';
  titleText.textContent = text;

  const contentText = document.createElement('a');
  contentText.id = 'contentText';
  contentText.textContent = "full article";
  contentText.href = './pages/' + text + ".html";

  const contentId = document.createElement('span');
  contentId.id = 'contentId';
  contentId.textContent = id + "[" + count + "]";

  imageContainer.appendChild(image);
  imageContainer.appendChild(titleText);
  imageContainer.appendChild(contentText);
  imageContainer.appendChild(contentId);

  const tagsDiv = document.querySelector('#images');
  tagsDiv.appendChild(imageContainer);

  const left = Math.floor(Math.random() * (window.innerWidth - (300 + ScreenBorderOffsetX * 2))) + ScreenBorderOffsetX + "px";
  const top = Math.floor(Math.random() * (window.innerHeight - (300 + ScreenBorderOffsetY * 2))) + ScreenBorderOffsetY + "px";
  imageContainer.style.left = left;
  imageContainer.style.top = top;

  const iframe = document.createElement('iframe');
  iframe.src = './pages/' + text + "-intro.html";
  let displayMode = display < 0.2 ? "block" : "none";
  iframe.style.display = displayMode;
  iframe.style.position = 'absolute';
  iframe.style.left = '0';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.top = '0';
  iframe.setAttribute(id, "myFrame");

  imageContainer.appendChild(iframe);

  imageContainer.addEventListener('click', () => {
    iframe.style.opacity = (iframe.style.display === 'none') ? '1' : '0';
    iframe.style.display = (iframe.style.display === 'none') ? 'block' : 'none';
  });

  iframe.addEventListener('click', () => {
    window.location.href = './pages/' + text + ".html";
  });

  iframe.addEventListener('load', function() {
    var iframeDocument = iframe.contentWindow.document;
    iframeDocument.addEventListener('click', function() {
      iframe.style.display = 'none';
    });
  });
}

// Function to toggle menu visibility
function toggleVisibilityOnMenu(id, targetId) {
  var menuItem = document.getElementById(id);
  menuItem.addEventListener("click", function() {
    var elements = document.querySelectorAll("#" + targetId);

    for (var i = 0; i < elements.length; i++) {
      var currentOpacity = parseFloat(elements[i].style.opacity);
      elements[i].style.opacity = (currentOpacity === 0) ? "1" : "0";
      menuItem.style.textDecoration = (currentOpacity === 0) ? "underline" : "none";
    }
  });
}

toggleVisibilityOnMenu("group_1Click", "group_1");
toggleVisibilityOnMenu("group_3Click", "group_3");
toggleVisibilityOnMenu("group_4Click", "group_4");
toggleVisibilityOnMenu("group_2Click", "group_2");

// Function to resize the iframe on index.html
function resizeIframe() {
  var iframe = document.getElementById("iframeData");
  var screenWidth = window.innerWidth;
  var screenHeight = window.innerHeight;

  var iframeWidth = (screenWidth < 500) ? screenWidth : screenWidth / 2;

  iframe.style.width = iframeWidth + "px";
  iframe.style.height = screenHeight * 0.8 + "px";
}

resizeIframe();
window.addEventListener("resize", resizeIframe);

// Function to change the parent URL if clicked inside an iframe link
function changeParentURL(url) {
  window.parent.location.href = url;
}