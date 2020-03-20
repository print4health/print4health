#!/bin/bash

if [ $# -eq 0 ] || [ "--help" == "$1" ] || [ "-h" == "$1" ]
then
    default=$(echo -e "\\e[0m")
    title=$(echo -e "\\e[33m")
    info=$(echo -e "\\e[32m")

    cat <<USAGE
${title}Usage:${default}
  xdebug [-h|--help] [<command>]

${title}Help:${default}
 The ${info}xdebug${default} command allows to run a PHP command with Xdebug remote debug enabled.

 Run a local executable PHP script:

    ${info}xdebug bin/console symfony:command${default}

 Run the PHP command:

   ${info}xdebug php script.php${default}
USAGE

    if [ $# -eq 0 ]
    then
        exit 3
    fi

    exit 0
fi

run_with_xdebug() {
    DEVICE=`ip addr | grep "^3:" | awk '{ print $2 }' | sed -r 's/://g'`
    IP=`ip addr | grep "global $DEVICE" | awk '{ print $2 }' | sed -r 's/\/24//g'`

    XDEBUG_CONFIG="idekey=PHPSTORM" \
    PHP_IDE_CONFIG="serverName=$IP" \
    php \
        -d zend_extension=xdebug.so \
        -d xdebug.remote_enable=on \
        -d xdebug.remote_host=`ip route | grep default | awk '{ print $3 }'` \
        "$@"
}

if [ -f "$1" ]
then
    run_with_xdebug "$@"

elif [ "php" != "$1" ]
then
    if ! which "$1" > /dev/null 2>&1
    then
        echo "Not a PHP file or a command: $1"
        exit 4
    fi

    run_with_xdebug "$(which "$1")" "${@:2}"

else
    run_with_xdebug "${@:2}"
fi
