print4health.org
====================

DEVELOPMENT
-----------

### Requirements
- Virtualbox https://www.virtualbox.org/
- Vagrant https://www.vagrantup.com/

### Startup

```bash
git clone git@github.com:bartrail/print4health
cd print4health
vagrant up
vagrant ssh
make init
``` 

### Build JavaScript & CSS
- ```yarn encore dev```
- ```yarn encore dev --watch```

### Lokaler Aufruf

http://192.168.222.12  
Bei Verwendung des Vagrant Plugin "vagrant-hostupdater" ist die lokale Installation unter [http://dev.print4health.org](http://dev.print4health.org) erreichbar.

### Login für Bestellung als Einrichtung

http://dev.print4health.org/#/login

    user@print4health.org
    test

### Services

MailDev/MailCatcher: http://localhost:1080

PRODUCTION
----------
... 
