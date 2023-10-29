document.getElementById('search-isbn').addEventListener('click', getBook);
document.getElementById('search-data').addEventListener('click', getBook);
document.querySelector('body').addEventListener('click', toggleBookList);
document.querySelector('body').addEventListener('click', toggleShowAuthor);

let isbn, title, author, subject, place, person, publisher, results;

function getBook(){
  isbn = Number(document.getElementById('isbn').value);
  title = document.getElementById('title').value;
  author = document.getElementById('author').value;
  subject = document.getElementById('subject').value;
  place = document.getElementById('place').value;
  person = document.getElementById('person').value;
  publisher = document.getElementById('publisher').value;

  results = document.getElementById('search-results');

  if (event.target.id == 'search-isbn') {
    document.getElementById('isbn-error').style.display = 'none';
    if (isNaN(isbn) || (`${isbn}`.length != 10 && `${isbn}`.length != 13)) {
      document.getElementById('isbn-error').style.display = 'inline';
    } else { // 9780140328721  -- fantastic mr fox, for testing
      fetch(`https://openlibrary.org/isbn/${isbn}.json`)
        .then(res => res.json())
        .then(data => {
          results.innerHTML = '';
          console.log(data);

          let resCover = `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`;
          let resTitle = data.title;
          let resAuthor;
          fetch(`https://openlibrary.org${data.authors[0].key}.json`)
            .then(res => res.json())
            .then(data => {
              resAuthor = data.name;
            })
            .catch(err => {
              console.log(`error ${err}`)
            });

          let resPublisher = data.publishers[0];
          let resPubDate = data.publish_date;

          results.innerHTML = 
            `<div id="result-0">
              <button>+</button>
              <img src="${resCover}" alt="cover">
              <span>${resTitle}</span>
              <span>${resAuthor}</span>
              <span>${resPublisher}</span>
              <span>${resPubDate}</span>
            </div>`;
        })
        .catch(err => {
          console.log(`error ${err}`)
        });
    }
  } else if (event.target.id == 'search-data') {
    results.innerHTML = '';

    let searchString = '';
    if (title) {searchString ? searchString += `&title=${title}` : searchString += `?title=${title}`};
    if (author) {searchString ? searchString += `&author=${author}` : searchString += `?author=${author}`};
    if (subject) {searchString ? searchString += `&subject=${subject}` : searchString += `?subject=${subject}`};
    if (place) {searchString ? searchString += `&place=${place}` : searchString += `?place=${place}`};
    if (person) {searchString ? searchString += `&person=${person}` : searchString += `?person=${person}`};
    if (publisher) {searchString ? searchString += `&publisher=${publisher}` : searchString += `?publisher=${publisher}`};

    console.log(`https://openlibrary.org/search.json${searchString.split(' ').join('+')}`);

    fetch(`https://openlibrary.org/search.json${searchString.split(' ').join('+')}`)
      .then(res => res.json())
      .then(data => {
        console.log(data.docs[99]);
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
    // console.log(`data-search`);
  };
};

// function fetchAuthor(key) {
//   let authorName = '';
//   fetch(`https://openlibrary.org${key}.json`)
//     .then(res => res.json())
//     .then(data => {
//       authorName = data.name;
//       console.log(authorName);
//       return authorName;
//     })
//     .catch(err => {
//       console.log(`error ${err}`)
//     });
//   // return authorName;
// };

function toggleBookList() {
  if (event.target.tagName != 'BUTTON') return;
  if (event.target.id == 'search-isbn' || event.target.id == 'search-data') return;
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