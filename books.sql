DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url TEXT,
  description TEXT,
  bookshelf VARCHAR(255)
);

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('Anna Katharine Green', 'The House of the Whispering Pines', '9781627937009', 'https://books.google.com/books/content?id=hkxFAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'The country club house The Whispering Pines was closed for the winter, but only one day after he locked the place personally, the narrator sees smoke come out of the chimney. He decides to investigate and enters the house. Hidden in the dark, he sees the sister of his fiance, the girl he secretly loves, run out of the house with tears in her eyes. Upstairs then, he discovers the dead body of his betrothed...', 'b13' );

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('David Dickens', 'The pines eyes 2', '9781627937009', 'http://books.google.com/books/content?id=7V0AAAAAYAAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'The country club house The Whispering Pines was closed for the winter, but only one day after he locked the place personally, the narrator sees smoke come out of the chimney. He decides to investigate and enters the house. Hidden in the dark, he sees the sister of his fiance, the girl he secretly loves, run out of the house with tears in her eyes. Upstairs then, he discovers the dead body of his betrothed...', 'b13' );

INSERT INTO books (author, title, isbn, image_url, description, bookshelf) VALUES ('David Dickens', 'The fake pine book', '9781627937009', 'http://books.google.com/books/content?id=awSeuym9vYYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api', 'The country club house The Whispering Pines was closed for the winter, but only one day after he locked the place personally, the narrator sees smoke come out of the chimney. He decides to investigate and enters the house. Hidden in the dark, he sees the sister of his fiance, the girl he secretly loves, run out of the house with tears in her eyes. Upstairs then, he discovers the dead body of his betrothed...', 'b13' );
