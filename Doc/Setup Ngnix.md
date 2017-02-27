# Setup Ngnix

	$ sudo apt-get install nginx
	
## Changer les proxy

	$ sudo gedit /etc/nginx/sites-available/default &
	
1. Remplacer le contenu par ce qu'il y a dans le fichier Doc/canneberge.io
2. Sauvegarder

	$ sudo service ngnix restart
	
## Changer les routes local

	$ sudo gedit /etc/hosts
	
Exemple :

	127.0.0.1	admin.canneberge.io
	127.0.0.1	api.canneberge.io
	127.0.0.1	carte.canneberge.io
	127.0.0.1	r.canneberge.io



