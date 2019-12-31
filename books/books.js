const {serverlessHandler} = require('serverless-provider-handler');

const R = require('ramda');

const mongoose = require("mongoose");
const uri = process.env.DB;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


require("./book");
const Book = mongoose.model("book");

if (process.env.IS_OFFLINE) { //Permet d'éviter l'erreur override du model dans le cas où on crée plusieurs livres dans une seule connection
    mongoose.models = {};
  }

const bookSaver_ = book => {
    console.log(book)
    return new Book(book).save()
        .then(() => {
            return { message: "new book created" }
        }).catch((err) => {
            if (err) {
                throw err;
            }
        });
}


const bookLister_ = x => {
    const result = Book.find();
    
    return result;
};

/*const bookFinder_ = params => { //Check pourquoi j'arrive pas à le gérer de cette façon (pareil pour BookLister)
    let id = params.id;
    console.log(id);
    Book.findById(id).then((book) => {
        if(book){
            console.log("here");
            return book;
        }
        else{
            console.log("here2");
            return "This id doesn't exist";
        }

    }).catch(err =>{
        if(err){
            console.log("here3");
            throw err;
        }
    })
    
};*/



const bookFinder_ = params => {
    let id = params.id;
    return Book.findById(id);
};

const bookDeleter_ = params => { //Trouver un moyen d'afficher une réponse dans l'appli
    let id = params.id;
    console.log(id);
    Book.findByIdAndRemove(id).then(() => {
        console.log("removed");
    }).catch(err => {
        throw err;
    })
     
}

const bookSaver = async event => serverlessHandler(bookSaver_)(event);
const bookLister = async event => serverlessHandler(bookLister_)(event);
const bookFinder = async event => serverlessHandler(bookFinder_)(event);
const bookDeleter = async event => serverlessHandler(bookDeleter_)(event);


module.exports = {
    bookSaver,
    bookLister,
    bookFinder,
    bookDeleter
};