print4Health
====================

DEVELOPMENT
-----------

### Install
- Virtualbox
- Vagrant

### Startup

```bash
git clone git@github.com:bartrail/print4health.git
cd print4health
vagrant up
vagrant ssh
make init
``` 

Bei Verwendung des Vagrant Plugin "vagrant-hostupdater" ist die Test - Installation unter [http://dev.print4health.org](http://dev.print4health.org) erreichbar.



### Build JavaScript & CSS
- ```yarn run dev```
- ```yarn run prod```
- ```yarn run watch```

### Services

MailDev/MailCatcher: http://localhost:1080

PRODUCTION
----------

... 
