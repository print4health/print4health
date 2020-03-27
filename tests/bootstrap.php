<?php

declare(strict_types=1);

use App\Domain\UuidGenerator;
use App\Kernel;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Dotenv\Dotenv;

require dirname(__DIR__) . '/vendor/autoload.php';

if (file_exists(dirname(__DIR__) . '/config/bootstrap.php')) {
    require dirname(__DIR__) . '/config/bootstrap.php';
} elseif (method_exists(Dotenv::class, 'bootEnv')) {
    (new Dotenv())->bootEnv(dirname(__DIR__) . '/.env');
}

UuidGenerator::dummy();

$kernel = new Kernel('test', true);
$kernel->boot();

$application = new Application($kernel);
$application->setAutoExit(false);

$application->run(new ArrayInput([
    'command' => 'doctrine:database:drop',
    '--if-exists' => '1',
    '--force' => '1',
]));

$application->run(new ArrayInput([
    'command' => 'doctrine:database:create',
]));

$application->run(new ArrayInput([
    'command' => 'doctrine:schema:create',
]));

$application->run(new ArrayInput([
    'command' => 'hautelook:fixtures:load',
    '-n' => true,
]));

$kernel->shutdown();
