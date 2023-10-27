document.getElementById('search-isbn').addEventListener('click', getBook);
document.getElementById('search-data').addEventListener('click', getBook);
document.querySelector('body').addEventListener('click', toggleBookList);
document.querySelector('body').addEventListener('click', toggleShowAuthor);

let isbn, title, author, subject, place, person, publisher;

function getBook(){
  isbn = document.getElementById('isbn').value;
  title = document.getElementById('title').value;
  author = document.getElementById('author').value;
  subject = document.getElementById('subject').value;
  place = document.getElementById('place').value;
  person = document.getElementById('person').value;
  publisher = document.getElementById('publisher').value;
  if (event.target.id == 'search-isbn') {
    console.log('isbn search'+' '+isbn);
  } else if (event.target.id == 'search-data') {
    console.log('data search');
  };

  // fetch(url)
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(err => {
  //       console.log(`error ${err}`)
  //     });
};

// function seturl() {
//   if (event.target.id == 'search-isbn') {
//     console.log('isbn search'+' '+isbn);
//   } else if (event.target.id == 'search-data') {
//     console.log('data search');
//   };
// };

function toggleBookList() {
  if (event.target.tagName != 'BUTTON') return;
  if (event.target.id == 'search-isbn' || event.target.id == 'search-data') return;
  // console.log(event.target.parentNode.id);
  if (event.target.innerText == '+') {
    event.target.innerText = '-';
  } else if (event.target.innerText == '-') {
    event.target.innerText = '+';
  };
};

function toggleShowAuthor() {
  if (event.target.tagName != 'H3') return;
  let sublist = event.target.nextElementSibling;
  if (sublist.getAttribute('data-show') == 'true') {
    sublist.setAttribute('data-show', 'false');
  } else if (sublist.getAttribute('data-show') == 'false') {
    sublist.setAttribute('data-show', 'true');
  };
};