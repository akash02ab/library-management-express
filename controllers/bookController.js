const BookModel = require('../models/books');
const CategoryModel = require('../models/category');

async function seeAllBooks() {
    try {
        let books = await BookModel.find();
        return books.map(book => ({'title': book.title,  'authors': book.authors.join()}));
    }
    catch(err) {
        return err;
    }
}

async function addBook({title, price, category, authors}) {
    try {
        let thisCategory = await CategoryModel.find({name: category});
        
        if(thisCategory.length) {
            const id = thisCategory[0].id;
            const book = new BookModel({
                title: title,
                price: price,
                category: id,
                authors: authors
            });
            await book.save();
            return 'Book added successfully';
        }
        else {
            const categories = await CategoryModel.find();
            const categoriesList = categories.map(category => category.name);
            return `You entered invalid category, here's the name of all categories: \n ${categoriesList}`;
        }
    }
    catch(err) {
        return err;
    }
}

async function searchBook(title) {
    try {
        let books = await BookModel.find({title: title});

        if(books.length) {
            return books.map(book => `Title: ${book.title},  Authors: ${book.authors.join()}`);
        }
        else {
            return 'No book found with ' + title;
        }
    }
    catch(err) {
        return err;
    }
}

async function deleteBook(title) {
    try {
        let res = await BookModel.deleteOne({title: title});
        if(res.deletedCount) {
            return 'Deletion Successful';
        }
        else {
            return 'No record found named ' + response;
        }
    }catch(err) {
        return err;
    }
}

async function searchBookByCategory(category) {
    let thisCategory = await CategoryModel.find({name: category});
    
    try {
        let books = await BookModel.find({category: thisCategory[0]._id});

        if(books.length) {
            return books.map(book => `Title: ${book.title},  Authors: ${book.authors.join()}`);
        }
        else {
            return 'No book found with ' + category;
        }
    }
    catch(err) {
        return err;
    }

}

const BookController = {
    seeAllBooks,
    addBook,
    searchBook,
    deleteBook,
    searchBookByCategory,
}

module.exports = BookController;