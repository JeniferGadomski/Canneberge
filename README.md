# Platforme Canneberge

## Cloner le projet
    $ git clone https://github.com/Bhacaz/Platforme-Canneberge.git
    
## Initialiser
### Canneberge_api

    $ cd Canneberge_api
    $ npm install
    $ node app.js
    
### Admin_Client

    $ cd Admin_Client
    $ npm install
    
Pour http://localhost:8000

    $ ng serve --port 8000 
    
Pour votre adresse IP local
    
    $ ng serve --port 8000 --host <<ADRESSE IP>>
    
### Carte

    $ cd Carte
    $ npm install
    $ cd public
    $ bower install
    $ cd ..
    $ node server.js
    
## Partir les 3 serveurs 

    $ ./start_platform.sh <<ADDRESSE IP>>

