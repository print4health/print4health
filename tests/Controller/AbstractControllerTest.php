<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class AbstractControllerTest extends WebTestCase
{
    protected function logInAdmin(KernelBrowser $client): void
    {
        $requestContent = [
            'email' => 'user@print4health.org',
            'password' => 'test',
        ];

        $client->request('POST', '/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestContent));
    }
}
