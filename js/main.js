document.getElementById('save').addEventListener('click', addToLocal);
document.getElementById('clear').addEventListener('click', clearLocal);

function addToLocal(){
  const url = `http://numbersapi.com/${date.split('-')[1]}/${date.split('-')[2]}/date?json`

  fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
};