updateMyList();
setLighting();

document.getElementById('search-isbn').addEventListener('click', getBook);
document.getElementById('search-data').addEventListener('click', getBook);
document.querySelector('body').addEventListener('click', toggleBookList);
document.querySelector('body').addEventListener('click', toggleShowAuthor);
document.querySelector('body').addEventListener('click', authorCompare);
document.getElementById('title').addEventListener('input', checkInputs);
document.getElementById('author').addEventListener('input', checkInputs);
document.getElementById('subject').addEventListener('input', checkInputs);
document.getElementById('place').addEventListener('input', checkInputs);
document.getElementById('person').addEventListener('input', checkInputs);
document.getElementById('publisher').addEventListener('input', checkInputs);
document.getElementById('lightToggle').addEventListener('click', lightToggle);

let isbn, title, author, subject, place, person, publisher, results;
let spanLength = 30;

function getBook(){ // takes search parameters and does a general search on Open Library API, returning results and populating the search section below
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
        .then(async (data) => {
          results.innerHTML = '';
          let resCover = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`)
            .then(res => {
              if (res.redirected != true) {
                return "img\\not_found.jpg";
              };
              return `https://covers.openlibrary.org/b/isbn/${isbn}-S.jpg`;
            });
          let resTitle = data.title;
          let resAuthor = await fetch(`https://openlibrary.org${data.authors[0].key}.json`)
            .then(res => res.json())
            .then(data => {
              return data.name;
            })
            .catch(err => {
              console.log(`error ${err}`)
            });
          let resKeys = data.authors[0].key.split('/')[2];
          let resPublisher = data.publishers[0];
          let resPubDate = data.publish_date;

          results.innerHTML = 
            `<div data-isbn="${isbn}" data-authorkeys=${resKeys}>
              <button>${checkList(isbn)}</button>
              <img src="${resCover}" alt="cover">
              <span>${trimString(resTitle,spanLength)}</span>
              <span>${trimString(resAuthor,spanLength)}</span>
              <span>${trimString(resPublisher,spanLength)}</span>
              <span>${resPubDate}</span>
            </div>`;
        })
        .catch(err => {
          console.log(`error ${err}`)
        });
    }
  } else if (event.target.id == 'search-data') { // the lord of the rings -- title, for testing
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
      .then(async (data) => {
        // console.log(data.docs);
        // console.log(data.docs[0].author_key);
        // console.log(data.docs[data.docs.length-1].author_name);
        for (let i = 0; i < data.docs.length; i++) {
          if (!data.docs[i].isbn) continue;
          if (!data.docs[i].publisher) continue;
          let resISBN = data.docs[i].isbn.find(el=>`${el}`.length == 13) || data.docs[i].isbn.find(el=>`${el}`.length == 10);
          let resCover = await fetch(`https://covers.openlibrary.org/b/isbn/${resISBN}-S.jpg`)
            .then(res => {
              if (res.redirected != true) {
                return "img\\not_found.jpg";
              };
              return `https://covers.openlibrary.org/b/isbn/${resISBN}-S.jpg`;
            });
          let resTitle = data.docs[i].title;
          let resAuthor = data.docs[i].author_name || 'n/a';
          let resKeys = data.docs[i].author_key || 'n/a';
          let resPublisher = data.docs[i].publisher[0] || 'n/a';
          let resPubDate = data.docs[i].first_publish_year || 'n/a';
          results.innerHTML +=
            `<div data-isbn="${resISBN}" data-authorkeys=${resKeys}>
              <button>${checkList(resISBN)}</button>
              <img src="${resCover}" alt="cover">
              <span>${trimString(resTitle,spanLength)}</span>
              <span>${trimString(resAuthor,spanLength)}</span>
              <span>${trimString(resPublisher,spanLength)}</span>
              <span>${resPubDate}</span>
            </div>`;
        }
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
    // console.log(`data-search`);
  };
};

function toggleBookList() { // adds or removes individual search result to local storage with ISBN as key and remaining data as a combined string; then runs helper function updateMyList()
  if (event.target.tagName != 'BUTTON') return;
  if (event.target.id == 'search-isbn' || event.target.id == 'search-data') return;
  if (event.target.innerHTML == '<i class="fa-regular fa-square-plus"></i>') {
    event.target.innerHTML = '<i class="fa-regular fa-square-minus"></i>';
    let key = event.target.parentElement.getAttribute('data-isbn');
    let authorKeys = event.target.parentElement.getAttribute('data-authorkeys');
    let addedTitle = event.target.nextElementSibling.nextElementSibling;
    let addedAuthor = addedTitle.nextElementSibling;
    let addedPublisher = addedAuthor.nextElementSibling;
    let addedPubDate = addedPublisher.nextElementSibling;
    let value = `${addedTitle.innerText}---${addedAuthor.innerText}---${addedPublisher.innerText}---${addedPubDate.innerText}---${authorKeys}`;
    localStorage.setItem(key, value);
    updateMyList();
  } else if (event.target.innerHTML == '<i class="fa-regular fa-square-minus"></i>') {
    event.target.innerHTML = '<i class="fa-regular fa-square-plus"></i>';
    let key = event.target.parentElement.getAttribute('data-isbn');
    localStorage.removeItem(key);
    updateMyList();
  };
};

function toggleShowAuthor() { // collapses or expands My List authors
  if (event.target.tagName != 'H3') return;
  let sublist = event.target.nextElementSibling;
  if (sublist.getAttribute('data-show') == 'true') {
    sublist.setAttribute('data-show', 'false');
  } else if (sublist.getAttribute('data-show') == 'false') {
    sublist.setAttribute('data-show', 'true');
  };
};

function trimString(str, length) { // helper function to limit string length in search results section
  if (Array.isArray(str)) str = str.join(', ');
  return (str.length > length) ? str.substring(0, length - 3).toLowerCase() + '...' : str.toLowerCase();
};

function updateMyList() { // clears existing list in DOM, then grabs data from local storage to populate my list, first by building a collection of an array of arrays, then builds My List according to authors and sorted using sortMyList()
  let myList = document.getElementById('my-list-authors');
  myList.innerHTML = '';

  let collection = [];
  for (let book in localStorage) { // builds collection
    if (Number(book)) {
      let bookISBN = book;
      let bookData = localStorage.getItem(book).split('---');
      let bookTitle = bookData[0];
      let bookAuthor = bookData[1];
      let bookPublisher = bookData[2];
      let bookPubDate = bookData[3];
      let bookAuthorKeys = bookData[4];

      collection.push([bookAuthor,bookPubDate,bookPublisher,bookTitle,bookISBN,bookAuthorKeys]);
      sortMyList(collection);
    };
  };
  let listAuthors = [];
  for (let i=0; i<collection.length; i++) { // builds list in DOM
    if (listAuthors.includes(collection[i][0])) { // if author already exists in DOM list
      let listSingleAuthor = document.getElementById(`${collection[i][0].replace(' ','')}`);
      let authorBooks = listSingleAuthor.nextElementSibling;
      authorBooks.innerHTML += `<li data-isbn=${collection[i][4]}><span>${collection[i][1]}</span> -- <strong>${collection[i][3]}  :</strong>  ${collection[i][2]}</li>`;
    } else { // if author does not yet exist in DOM list
      listAuthors.push(collection[i][0]);
      myList.innerHTML += 
        `<div>
          <h3 id=${collection[i][0].replaceAll(' ','')}>${collection[i][0]}<button class="compare" data-authorKeys=${collection[i][5]}>Compare</button></h3>
          <ul data-show="true">
            <li data-isbn=${collection[i][4]}><span>${collection[i][1]}</span> -- <strong>${collection[i][3]}  :</strong>  ${collection[i][2]}</li>
          </ul>
        </div>`;
    };
  };
};

function sortMyList(list) { // helper function to sort collection first by author, then by publish date
  list.sort((a,b)=>{ // author sort
    const nameA = a[0].toUpperCase();
    const nameB = b[0].toUpperCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  list.sort((a,b)=>{ // pub date sort
    const nameA = a[0].toUpperCase();
    const nameB = b[0].toUpperCase();
    if (nameA != nameB) return 0;
    return a[1] - b[1];
  });
  return list;
};

function checkInputs() { // disables general search button when nothing is written
  if(document.getElementById('title').value.trim() === '' &&
      document.getElementById('author').value.trim() === '' &&
      document.getElementById('subject').value.trim() === '' &&
      document.getElementById('place').value.trim() === '' &&
      document.getElementById('person').value.trim() === '' &&
      document.getElementById('publisher').value.trim() === '') {
    document.getElementById('search-data').setAttribute("disabled","disabled");
  } else {
    document.getElementById('search-data').removeAttribute("disabled");  
  }
};

function checkList(isbn) { // helper function to determine if a result is already in local storage when populating search results
  const keys = Object.keys(localStorage);
  if (keys.includes(isbn)) {
    return '<i class="fa-regular fa-square-minus"></i>';
  } else {
    return '<i class="fa-regular fa-square-plus"></i>';
  }
};

function lightToggle() { // toggles lighting mode within local storage, then runs setLighting()
  let lighting = localStorage.getItem('lighting');
  if (lighting === 'dark') {
    localStorage.setItem('lighting', 'light');
  } else {
    localStorage.setItem('lighting', 'dark');
  };
  setLighting();
};

function setLighting() { // actually changes lighting mode on site, plus changing icon on button
  let lighting = localStorage.getItem('lighting');
  if (lighting === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('lightToggle').innerHTML = 
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95M17.33,17.97C14.5,17.81 11.7,16.64 9.53,14.5C7.36,12.31 6.2,9.5 6.04,6.68C3.23,9.82 3.34,14.64 6.35,17.66C9.37,20.67 14.19,20.78 17.33,17.97Z" /></svg>';
  } else {
    document.body.classList.remove('dark');
    document.getElementById('lightToggle').innerHTML = 
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13" /></svg>'
  };
};

function authorCompare() {
  if (event.target.tagName != 'BUTTON') return;
  if (!Array.from(event.target.classList).includes('compare')) return;
  
  const comparedKeys = event.target.dataset.authorkeys.split(',');
  const comparedAuthors = event.target.parentElement.innerText.split('\n')[0];
  // author photo -- `https://covers.openlibrary.org/a/olid/${comparedKeys[i]}-M.jpg`

  const modalCompare = document.querySelector('#modal-compare');
  const compareLeft = modalCompare.querySelector('.modal-header-left');
  const compareRight = modalCompare.querySelector('.modal-header-right');

  if (comparedKeys.length == 1) { // one author to compare
    fetch(`https://openlibrary.org/authors/${comparedKeys[0]}.json`)
      .then(res => res.json())
      .then(async (data) => {
        const foundName = data.name || 'Not Found';
        const foundBirthdate = data.birthdate || 'Not Found';
        const foundBio = data.bio || 'Not Found';
        const foundPhoto = await fetch(`https://covers.openlibrary.org/a/olid/${comparedKeys[0]}-M.jpg`)
          .then(res => {
            if (res.redirected != true) {
              return `https://covers.openlibrary.org/a/olid/OL6791840A-M.jpg`;
            } else {
              return 'img\\not_found.jpg';
            };
          });
        const foundWiki = data.wikipedia || `https://en.wikipedia.org/wiki/${foundName.replaceAll(' ','_')}`;

        compareLeft.innerHTML = 
          `<h2>${foundName}</h2>
          <img class="photo" src=${foundPhoto}>`;
        compareRight.innerHTML = 
          `<button>&times;</button>
          <p><span>Birth Date: </span>${foundBirthdate}</p>
          <p><span>Bio: </span>${foundBio}</p>
          <a>${foundWiki}</a>`;
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  } else if (comparedKeys.length > 1) { // multiple authors to compare
    // need second modal to pick author to compare with from possible selection
  };
};