'use strict';

//global variables

const pg = require('pg');

const express = require('express');

const superagent = require('superagent');

const methodOverride = require('method-override');

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

app.use(methodOverride('_method'));

// paths

app.get('/books/:id', getOneBook);

app.get('/', renderHome);

app.get('/searches/new', searchPage);

app.post('/searches', searchBooks);

app.post('/books', addBooks);

app.get('/books/edit/:id', getAbook)

app.put('/books/edit/:id', editInfo)

app.delete('/books/edit/:id', deleteBook)

app.get('*', errorHandler);

// functions
function deleteBook(request, response)
{
  let id = request.params.id;

  let sql = 'DELETE FROM books WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(() => {
      response.status(200).redirect('/');
    }).catch(err => {
      response.status(500).render('pages/error.ejs', {error:err});
    })
}

function editInfo(request, response)
{
  let id = request.params.id;

  let {author, title, isbn, image_url, description, bookshelf} = request.body;

  let sql = 'UPDATE books SET author=$1, title=$2, isbn=$3, image_url=$4, description=$5, bookshelf=$6 WHERE id=$7;';
  let safeValues = [author, title, isbn, image_url, description, bookshelf, id];
  client.query(sql, safeValues)
    .then(() => {
      response.status(200).redirect(`/books/${id}`);
    }).catch(err => {
      response.status(500).render('pages/error.ejs', {error:err});
    })
}

function getAbook(request, response)
{
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [request.params.id];

  return client.query(SQL, values)
    .then(result => {

      return response.render('./pages/books/edit.ejs', { book: result.rows[0] });
    }).catch(err => {
      response.status(500).render('pages/error.ejs', {error:err});
    })

}

function addBooks(request, response){


  let {author, title, isbn, image, description, bookshelf} = request.body;

  let image_url = image;
  // save it to the database
  let sql = 'INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID;';
  let safeValues = [author, title, isbn, image_url, description, bookshelf];


  client.query(sql, safeValues)
    .then(results => {
      let id = results.rows[0].id;

      response.status(200).redirect(`/books/${id}`);

    }).catch(err => {
      response.status(500).render('pages/error.ejs', {error:err});
    })
}


function getOneBook(request, response){
  let id = request.params.id;
  let sql = 'SELECT * FROM books WHERE id=$1;';
  let safeValues = [id];
  client.query(sql, safeValues)
    .then(results => {
      let selectedBook = results.rows[0];

      response.render('pages/books/detail.ejs', { book:selectedBook});
    })
}

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
    }).catch(err => {
      resp.status(500).render('pages/error.ejs', {error:err});
    })
}

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
    const finalBookArr = bookArr.map(book => {
      return new Book(book.volumeInfo);
    });
    resp.render('pages/searches/show.ejs', {searchResults: finalBookArr})
  });

}

// constructor

function Book(obj){

  this.title = obj.title ? obj.title : 'no title available';
  let f = obj.imageLinks.thumbnail;
  let tempArr = f.split(':');
  tempArr[0] = 'https:';
  let str = `${tempArr[0]}${tempArr[1]}`;
  this.image = str ? str : 'public/styles/img/cover.jpeg';

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
