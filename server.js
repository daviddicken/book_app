'use strict';

//global variables

const pg = require('pg');

const express = require('express');

const superagent = require('superagent');

require('dotenv').config();

require('ejs');

const PORT = process.env.PORT || 3001;

const app = express();

const client = new pg.Client(process.env.DATABASE_URL);

client.on('client', error => {
  console.log('error', error);
});

app.set('view engine', 'ejs');

// middleware

app.use(express.static('./public'));

app.use(express.urlencoded({extended:true}));

// paths

app.get('/', renderHome);

app.get('/searches/new', searchPage);

app.post('/searches', searchBooks);

app.get('*', errorHandler);
// functions

function errorHandler(req, resp)
{
  resp.render('pages/error.ejs')
}

function renderHome(req, resp){
  let sql = 'SELECT * FROM books;';
  client.query(sql)
    .then(book => {
      let abook = book.rows;
      resp.render('pages/index.ejs', {faves: abook});
    })
}

// let sql = 'SELECT * FROM tasks;';
// client.query(sql)
//   .then(results => {
//     // display them on the index.ejs
//     let tasks = results.rows;
//     response.render('index.ejs', {banana: tasks});
//   })
// }



function searchPage(req, resp){
  resp.render('pages/searches/new.ejs');
}

function searchBooks(req, resp){
  let query = req.body.search[0];
  let category = req.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(category === 'title'){url += `+intitle:${query}`}
  if(category === 'author'){url += `+inauthor:${query}`}

  superagent.get(url).then(results => {
    let bookArr = results.body.items;

    //// delete that!
    const finalBookArr = bookArr.map(book => {
      console.log(book.volumeInfo);
      return new Book(book.volumeInfo);
    });
    resp.render('pages/searches/show.ejs', {searchResults: finalBookArr})
  });

}

// constructor

//once you get to 'http vs http' Inside constructor on img check on the url of the image if it has http or
//https: change the http to https if image is missing that s for Heroku's sake.

function Book(obj){
  this.title = obj.title ? obj.title : 'no title available';
  let x = obj.imageLinks.thumbnail;
  let tempArr = x.split(':');
  tempArr[0] = 'https:';
  let str = `${tempArr[0]}${tempArr[1]}`;
  this.image_url = str ? str : 'public/styles/img/cover.jpeg';
  this.authors = obj.authors ? obj.authors : 'no author available';
  this.description = obj.description ? obj.description : 'no information available';
  let type = obj.industryIdentifiers[0].type;
  let num = obj.industryIdentifiers[0].identifier
  let isbn = `${type}:${num}`;
  this.isbn = isbn ? isbn : 'no information available';
  this.bookshelf = 1;
}

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  });
