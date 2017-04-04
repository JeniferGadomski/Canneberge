
#!/usr/bin/python

# Script python pour updater le fichier hosts (/etc/hosts)
# Run en sudo, argument 1 est le nouveau ip
# Exemple : 
# $ sudo ./update_hosts.py 127.0.0.1

import sys

hosts = '/etc/hosts'
domains = ['admin.canneberge.io', 'api.canneberge.io', 'carte.canneberge.io', 'r.canneberge.io', 'portail.canneberge.io', 'doc.canneberge.io']

#Read file
f = open(hosts, 'r')
lines = f.readlines()
f.close()

# Rewrite file
f = open(hosts, 'w')

for line in lines:
	for domain in domains:
		if line.find(domain) != -1:
			line = sys.argv[1] + '\t' + domain + '\n'
			print(line)
			break
	f.write(line)
	
f.close
