const {serverlessHandler} = require('serverless-provider-handler');

const R = require('ramda');

const mongoose = require("mongoose");
const uri = process.env.DB;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

require("./customer");
const Customer = mongoose.model("customer");

if (process.env.IS_OFFLINE) { //Permet d'éviter l'erreur override du model dans le cas où on crée plusieurs livres dans une seule connection
    mongoose.models = {};
  }

const customerSaver_ = customer => {
    console.log(customer)
    return new Customer(customer).save()
        .then(() => {
            return { message: "New customer created" }
        }).catch((err) => {
            if (err) {
                throw err;
            }
        });
}


const customerLister_ = x => {
    const result = Customer.find();
    
    return result;
};


const customerFinder_ = params => {
    let id = params.id;
    return Customer.findById(id);
};

const customerDeleter_ = params => { //Trouver un moyen d'afficher une réponse dans l'appli
    let id = params.id;
    console.log(id);
    Customer.findByIdAndRemove(id).then(() => {
        console.log("removed");
    }).catch(err => {
        throw err;
    })
     
};


const customerSaver = async event => serverlessHandler(customerSaver_)(event);
const customerLister = async event => serverlessHandler(customerLister_)(event);
const customerFinder = async event => serverlessHandler(customerFinder_)(event);
const customerDeleter = async event => serverlessHandler(customerDeleter_)(event);

module.exports = {
    customerSaver,
    customerLister,
    customerFinder,
    customerDeleter
}
