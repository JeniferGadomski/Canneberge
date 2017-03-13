# Serveur pour R

##Installation de l'interpréteur R

	$ sudo apt-get install r-base
	$ sudo R

## Installer Rserve

	> install.packages("Rserve")

## FastRWeb

	$ sudo apt-get install libcairo2-dev libxt-dev libxml2-dev libcurl4-openssl-dev libssl-dev

	> install.packages('Cairo')
	> install.packages('FastRWeb')
	> install.packages('XML')
	> install.packages('httr')
	$ sudo ~/R/.../FastRWeb/install.sh

### Changement de congif
Ouvrir le fichier :
_/var/FastRWeb/code/rserve.conf_

Et remplacer la totalité du contenu par :

	http.port 8888
	remote enable
	source /var/FastRWeb/code/rserve.R
	control enable

Ouvrir le fichier  :
_/var/FastRWeb/code/rserve.R_

Et ajouter les lignes suivante :

	...

	## as well as define any global variables you want all
	## scripts to see

	## Today, pretty much everyone speaks UTF-8, it makes the life easier
	library(FastRWeb)
	.http.request <- FastRWeb:::.http.request

	Sys.setlocale(,"en_US.UTF-8")

	...

Ajouter un lien symbolique entre le fichier script de l'API et de FastRWeb : 

	$ ln -s ~/Documents/Platforme-Canneberge/API/uploads/filetext.R

## Partir FastRWeb

Option 1 : Seul

	$  /var/FastRWeb/code/start
	
Option 2 : En même temps que les autres service

	$ pm2 start ecosystem.json
