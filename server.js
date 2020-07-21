'use strict';

//global variables

const express = require('express');

const superagent = require('superagent');

require('dotenv').config();

require('ejs');

const PORT = process.env.PORT || 3001;

const app = express();

app.set('view engine', 'ejs');

// middleware

app.use(express.static('./public'));

app.use(express.urlencoded({extended:true}));

// paths

app.get('/', renderHome);

app.get('/searches/new', searchPage);

app.post('/searches', searchBooks);

// functions

function renderHome(req, resp){
  resp.render('pages/index.ejs');
}

function searchPage(req, resp){
  resp.render('pages/searches/new.ejs');
}

function searchBooks(req, resp){
  let query = req.body.search[0];
  console.log('this is query: ', query);
  let category = req.body.search[1];
  console.log('this is category: ', category);
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(category === 'title'){url += `+intitle:${query}`}
  if(category === 'author'){url += `+inauthor:${query}`}

  superagent.get(url).then(results => {
    let bookArr = results.body.items;
    const finalBookArr = bookArr.map(book => {

      // console.log('this is the author: ',);
      // console.log('this is the description: ');
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
  let y = 'https';

  let g = x.slice(4);


  this.image = y+g ? y+g : 'public/styles/img/cover.jpeg';
  this.authors = obj.authors ? obj.authors : 'no author available';
  this.description = obj.description ? obj.description : 'no information available';
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
