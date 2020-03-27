<?php

declare(strict_types=1);

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

abstract class AbstractControllerTest extends WebTestCase
{
    protected function logInMaker(KernelBrowser $client): void
    {
        $requestContent = [
            'email' => 'maker@print4health.org',
            'password' => 'test',
        ];

        $client->request('POST', '/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestContent));
    }

    protected function logInRequester(KernelBrowser $client): void
    {
        $requestContent = [
            'email' => 'requester@print4health.org',
            'password' => 'test',
        ];

        $client->request('POST', '/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestContent));
    }

    protected function logInUser(KernelBrowser $client): void
    {
        $requestContent = [
            'email' => 'user@print4health.org',
            'password' => 'test',
        ];

        $client->request('POST', '/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestContent));
    }

    protected function logInAdmin(KernelBrowser $client): void
    {
        $requestContent = [
            'email' => 'admin@print4health.org',
            'password' => 'test',
        ];

        $client->request('POST', '/login', [], [], ['CONTENT_TYPE' => 'application/json'], json_encode($requestContent));
    }

    protected function singleOrder(array $order): void
    {
        $this->assertIsString($order['id']);
        $this->assertIsInt($order['quantity']);
        $this->assertIsInt($order['printed']);
        $this->assertIsInt($order['remaining']);

        $this->singleRequester($order['requester']);
        $this->singleThing($order['thing']);
    }

    protected function singleRequester(array $requester): void
    {
        $this->assertIsString($requester['id']);
        $this->assertIsString($requester['email']);
        $this->assertIsString($requester['name']);

        $this->assertArrayHasKey('streetAddress', $requester);
        $this->assertArrayHasKey('postalCode', $requester);
        $this->assertArrayHasKey('addressCity', $requester);
        $this->assertArrayHasKey('addressState', $requester);
    }

    protected function singleThing(array $thing): void
    {
        $this->assertIsString($thing['id']);
        $this->assertIsString($thing['name']);
        $this->assertIsString($thing['imageUrl']);
        $this->assertIsString($thing['url']);
        $this->assertIsString($thing['description']);
        $this->assertIsString($thing['specification']);
        $this->assertIsInt($thing['needed']);
        $this->assertIsInt($thing['printed']);
    }
}
