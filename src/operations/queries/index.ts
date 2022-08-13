/* eslint-disable complexity */
import { IBook, IFiltered, IPatch } from '../../types';
import { formatString, formatStringArray } from './formatters';

export const getBookQuery = (isbn:string) => {
  const query: string = `SELECT * FROM library WHERE isbn = '${formatString(isbn)}'`;
  return query;
};

export const getBooksQuery = (offset:number) => {
  const query: string = `SELECT * FROM library LIMIT 10 OFFSET ${offset}`;
  return query;
};

export const deleteBookQuery = (isbn:string) => {
  const query: string = `DELETE FROM library WHERE isbn = '${formatString(isbn)}'`;
  return query;
};

export const postBookQuery = (book: IBook) => {
  const {
    isbn,
    name,
    authors,
    languages,
    countries,
    numberOfPages,
    releaseDate,
  } = book;
  const query: string = `INSERT INTO library (isbn, name, authors, languages, countries, numberOfPages, releaseDate) VALUES('${
    formatString(isbn)}', '${
    formatString(name)}', '{${
    formatStringArray(authors).join()}}', '{${
    formatStringArray(languages).join()}}', '{${
    formatStringArray(countries).join()}}', ${
    numberOfPages}, '${
    formatString(releaseDate)}')`;
  return query;
};

export const patchBookQuery = (isbn:string, book: IPatch) => {
  const {
    name,
    authors,
    languages,
    countries,
    numberOfPages,
    releaseDate,
  } = book;
  const query: string = `UPDATE library SET name = '${formatString(name)
  }', authors = '{${formatStringArray(authors).join()
  }}', languages = '{${formatStringArray(languages).join()
  }}', countries = '{${formatStringArray(countries).join()
  }}', numberOfPages = ${numberOfPages
  }, releaseDate = '${formatString(releaseDate)
  }' WHERE isbn = '${formatString(isbn)}'`;
  return query;
};

export const filteredBooksQuery = (filter: IFiltered) => {
  try {
    const {
      name,
      authors,
      languages,
      countries,
      numberOfPages,
      releaseDate,
    } = filter;
    let queryFilters: string[] = [];
    if (name) queryFilters.push(` name = '${formatString(name)}'`);
    if (authors) queryFilters.push(` authors && '{${formatStringArray(JSON.parse(authors)).join()}}'`);
    if (languages) queryFilters.push(` languages && '{${formatStringArray(JSON.parse(languages)).join()}}'`);
    if (countries) queryFilters.push(` countries && '{${formatStringArray(JSON.parse(countries)).join()}}'`);
    if (numberOfPages) queryFilters.push(` numberOfPages = ${Number(numberOfPages)}`);
    if (releaseDate) queryFilters.push(` releaseDate = '${formatString(releaseDate)}'`);
    return queryFilters;
  } catch (error) {
    return [];
  }
};