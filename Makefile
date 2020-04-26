help:                                                                           ## shows this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_\-\.]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

init:                                                                           ## initialize or update project
	composer install
	bin/console do:da:drop --force --if-exists
	bin/console do:da:create
	bin/console do:mi:mi --no-interaction
	bin/console hautelook:fixtures:load -n
	yarn install
	yarn encore dev

cypress:                                                                        ## run frontend tests
	bin/console hautelook:fixtures:load -n
	yarn cypress run
	bin/console hautelook:fixtures:load -n

logs:                                                                           ## display logs
	tail -f var/log/dev.logs

cache:                                                                          ## remove and warmup cache
	bin/console cache:clear && bin/console cache:warmup

phpunit:                                                                        ## run phpunit tests
	vendor/bin/phpunit --testdox -v --colors="always" $(OPTIONS)

coverage:                                                                       ## run phpunit tests with coverage
	xdebug bin/phpunit --testdox -v --colors="always" --coverage-html coverage $(OPTIONS)

php-cs-check:                                                                   ## run cs fixer (dry-run)
	PHP_CS_FIXER_FUTURE_MODE=1 php-cs-fixer fix --allow-risky=yes --diff --dry-run

php-cs-fix:                                                                     ## run cs fixer
	PHP_CS_FIXER_FUTURE_MODE=1 php-cs-fixer fix --allow-risky=yes

phpstan:                                                                        ## run phpstan static code analyser
	phpstan analyse -l max -c phpstan.neon src

psalm:                                                                          ## run psalm static code analyser
	psalm $(OPTIONS) --show-info=false

eslint:
	yarn eslint --fix

static: php-cs-fix phpstan psalm eslint                                          ## run static analyser

dev: static phpunit                                                              ## run dev tools

mysql:                                                                          ## go in mysql
	sudo docker exec -it mysql /usr/bin/mysql print4health

.PHONY: cypress
