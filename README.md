# LibraryMicroservicesServerlessApp
Library app composed of books, customers, and orders microservices - made with Serverless and Docker

## Description

Library is an app wich allows run 3 different microservices:
* books which allows to save a book in a mongo dataBase, and access it thanks to serverless
* customers which allows to save a customer in a mongo dataBase, and access it thanks to serverless
* orders which allows to save an order in a mongo dataBase, and access it thanks to serverless.

Here we talked about 3 different mongo models that we can save and display thanks to microservices:
* book which contains title, author, numberPages and publisher.
* customer which contains name, age and address.
* order which contains CustomerID, BookID, initialDate, and deliveryDate. For this one, when orderFinder function 
of orders microservice is called, it requests bookFinder and customerFinder of the two other microservices, to replace CustomerID
and BookID by the Customer name and the Book title. Currently, this is only printed in the console, but in a real app, this would
be printed in browser page or in the frontend app.

## Docker

Each microservice runs in a different docker. That's why in each microservice directory, there is a Dockerfile to set up the 
docker image of the microservice.
We can run all the microservices at once thanks to the docker-compose.yml file which is in the library directory.

## Serverless

Each microservice directory contains a serverless.yml file, which allows to specify all the informations usefull to run the serverless
framework for this microservice, for example on which port it is listening, which functions can be used, where can we find them, and what
is the route to call them.

## Serverless-provider-handler

Each microservice require a node module called serverless-provider-handler. This allows to deal with the async event when there is a request. This allows to take all the important data from the request and pass it to the microservice function that was called, but also to give a response to the request.
I modified this file so that it does a difference between a POST method, a GET method, and a DELETE method. If the method is POST, it won't pass the parameters in argument to the microservice function, but it will do it in the case of a GET method or a DELETE method. These arguments will then be read in some of the microservices functions for example in bookFinder, to find a specific book in function of the id we passed in the request.

## Start

To start this app, you just need to run 'sudo docker-compose up' in the library directory.

## Modifications

If you change anything in books, customers, or orders microservice, don't forget to run 'sudo docker build . -t *microserviceName*'
after modifications, and then refer to Start part of this README to start the app again.

## Ports

Each microservice runs on a different port:
* books: runs on 3000 (the basic serverless-offline port)
* customers: runs on 5555
* orders: runs on 7777

These ports are configured in each microservice directory in Dockerfile (Expose *portnumber*) and in serverless.yml (custom: serverless-offline: ports: *portNumber*),
and in docker-compose *microserviceName*: ports: - *portNumber*:*portNumber*

## Connection between microservices

At the end of the description part of this README, I talked about the fact that the orders microservice is making requests to
the two other microservices. This is possible because in docker-compose.yml file in the library directory, I gave the path
of each microservice and its appropriate function in the environment.
Then I used the request-promise module to make a GET request to these microservices.

## Future improvements

* For now all of this runs on your local machine with serverless-offline, but of course we can use aws to make a real serverless app that runs on cloud.
* For test purpose, all microservices connect to the same mongo dataBase, but now all of this work, we can easily connect them to 
three different mongo databases, so that each microservice is truly independant from one another, thus, if we want to delete a microservice or add one, or use
one of them in a different app, we can easily do it.
* Each microservice contains basic functions, because the purpose here was for me to learn how to use the serverless framework, docker
and how to make microservices, but now that I know how to do it, it's of course possible to make more complex functions, and to make a frontend app
to use all of this correctly.
* The architecture is pretty clear, but maybe we can still make it cleaner by making a very clear separation between the microservice itself, and the serverless framework
