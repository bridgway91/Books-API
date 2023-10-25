document.getElementById('search-isbn').addEventListener('click', getBook);
document.getElementById('search-data').addEventListener('click', getBook);
document.querySelector('body').addEventListener('click', toggleBookList);
document.querySelector('body').addEventListener('click', toggleShowAuthor);




function getBook(){
  let url;
  seturl(url);

  fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
};

function seturl() {
  if (event.target.id == 'search-isbn') {
    console.log('isbn search');
  } else if (event.target.id == 'search-data') {
    console.log('data search');
  };
}