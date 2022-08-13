// Model for books in library
export interface IBook {
  isbn:string,
  name:string,
  authors:string[],
  languages:string[],
  countries:string[],
  numberOfPages:number,
  releaseDate:string,
}

// Model for post requests
export interface IPost {
  books: IBook[]
}

// Model for patch requests
export interface IPatch {
  name:string,
  authors:string[],
  languages:string[],
  countries:string[],
  numberOfPages:number,
  releaseDate:string,
}

// Model for get requests with filters request
export interface IFiltered {
  name?:string,
  authors?:string,
  languages?:string,
  countries?:string,
  numberOfPages?:number,
  releaseDate?:string,
}

// Model for operations output
export interface IOperationOutput {
  statusCode: number,
  output: { message: string | object }
}

// Model for api response
export interface IResponse {
  headers: {
    'Content-Type': 'application/json',
  }
  statusCode: number,
  body: string,
  isBase64Encoded: false
}