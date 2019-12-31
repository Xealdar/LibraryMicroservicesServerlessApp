const {serverlessHandler} = require('serverless-provider-handler');

const R = require('ramda');
const rp = require('request-promise');
const mongoose = require("mongoose");
const uri = process.env.DB;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


require("./order");
const Order = mongoose.model("order");

if (process.env.IS_OFFLINE) { //Permet d'éviter l'erreur override du model dans le cas où on crée plusieurs livres dans une seule connection
    mongoose.models = {};
  }

const orderSaver_ = order => {
    console.log(order)
    return new Order(order).save()
        .then(() => {
            return { message: "New order created" }
        }).catch((err) => {
            if (err) {
                throw err;
            }
        });
}

const orderLister_ = x => {
    const result = Order.find();
    
    return result;
};




const orderFinder_ = params => {
    let id = params.id;
    Order.findById(id).then((order) => {
        if(order)
        {
            console.log("here");
            rp({
                method: "GET",
                uri: process.env.BookService + "?id=" + order.BookID,
                json: true
            })
            .then(function (response){
                
                var orderObject = {customerName: "", bookTitle: response.title}

                rp({
                    method: "GET",
                    uri: process.env.CustomerService + "?id=" + order.CustomerID,
                    json: true
                })
                .then(function (response){
                    orderObject.customerName = response.name;
                    console.log(orderObject);
                    
                })
                .catch(function (err) {
                    console.log("in error2");
                    throw(err);
                })

            })
            .catch(function (err) {
                console.log("in error");
                throw(err);
            })
        }

        else{
            console.log("Invalid order");
        }
    });
};


const orderDeleter_ = params => { //Trouver un moyen d'afficher une réponse dans l'appli
    let id = params.id;
    console.log(id);
    Order.findByIdAndRemove(id).then(() => {
        console.log("removed");
    }).catch(err => {
        throw err;
    })
     
};

const orderSaver = async event => serverlessHandler(orderSaver_)(event);
const orderLister = async event => serverlessHandler(orderLister_)(event);
const orderFinder = async event => serverlessHandler(orderFinder_)(event);
const orderDeleter = async event => serverlessHandler(orderDeleter_)(event);


module.exports = {
    orderSaver,
    orderLister,
    orderFinder,
    orderDeleter
}