'use strict';

//global variables

const express = require('express');

const superagent = require('superagent');

require('dotenv').config();

require('ejs');

const PORT = process.env.PORT || 3001;

const app = express();

// middleware

app.use(express.static('./public'));

app.use(express.urlencoded({extended:true}));

// setup view engine

app.set('view engine', 'ejs');

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
