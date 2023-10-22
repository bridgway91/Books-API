document.getElementById('search-isbn').addEventListener('click', getBook);


function getBook(){
  const url = `https://openlibrary.org/isbn/9780140328721.json`

  fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
};