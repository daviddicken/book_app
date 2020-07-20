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

// functions

function renderHome(req, resp){
  resp.render('pages/index.ejs');
}

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
