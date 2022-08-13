const createTestResponse = (body:any, code:number) => {
  return ({
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: body }),
    statusCode: code,
    isBase64Encoded: false,
  });
};

// Succes 200 responses
export const getBookRespons = createTestResponse('book', 200);
export const getBooksRespons = createTestResponse('books', 200);
export const getFilteredBooksRespons = createTestResponse('filtered books', 200);
export const postBookResponse = createTestResponse('Added 1 book(s) to library', 200);
export const postBooksResponse = createTestResponse('Added 2 book(s) to library', 200);
export const patchBookResponse = createTestResponse('Updated book with isbn: 1234567890 in library', 200);
export const deletBookResponse = createTestResponse('Deleted book with isbn: 1234567890 from library', 200);

// Fail 400 responses
export const getFilteredBooksInvalidErrorResponse = createTestResponse('No valid filters received', 400);
export const invalidEventResponse = createTestResponse('Bad Request', 400);

// Error 500 responses
export const getBookErrorResponse = createTestResponse('Error getting book with isbn: 1234567890 from library', 500);
export const getBooksErrorResponse = createTestResponse('An error occured when getting books from library', 500);
export const getFilteredBooksErrorResponse = createTestResponse('An error occured when getting filtered books from library', 500);
export const postBookErrorResponse = createTestResponse('Error adding book(s) to library', 500);
export const patchBookErrorResponse = createTestResponse('Error occured when updating library', 500);
export const deleteBookErrorResponse = createTestResponse('Error deleting book with isbn: 1234567890 from library', 500);
