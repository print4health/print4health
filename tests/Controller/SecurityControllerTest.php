<?php

declare(strict_types=1);

namespace App\Tests\Controller;

class SecurityControllerTest extends AbstractControllerTest
{
    public function credentialsDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'maker-not-enabled@print4health.org',
                    'password' => 'test',
                ],
                401,
            ],
            [
                [
                    'email' => 'requester-not-enabled@print4health.org',
                    'password' => 'test',
                ],
                401,
            ],
            [
                [
                    'email' => 'user-not-enabled@print4health.org',
                    'password' => 'test',
                ],
                401,
            ],
            [
                [
                    'email' => 'maker@print4health.org',
                    'password' => 'test',
                ],
                200,
            ],
            [
                [
                    'email' => 'requester@print4health.org',
                    'password' => 'test',
                ],
                200,
            ],
            [
                [
                    'email' => 'user@print4health.org',
                    'password' => 'test',
                ],
                200,
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider credentialsDataProvider
     */
    public function testLogin($credentials, $expectedStatusCode): void
    {
        $client = static::createClient();
        $requestContent = $credentials;
        $client->request(
            'POST',
            '/login', [], [], ['CONTENT_TYPE' => 'application/json'],
            json_encode($requestContent)
        );
        $this->assertEquals($expectedStatusCode, $client->getResponse()->getStatusCode());
    }
}
