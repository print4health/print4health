<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
class RequesterControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testListAction(): void
    {
        $client = static::createClient();

        $client->request('GET', '/requester');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('requester', $data);

        foreach ($data['requester'] as $requester) {
            $this->singleRequester($requester);
        }
    }

    public function createRequesterDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'unittester-requester@print4health.org',
                    'password' => '123465789',
                    'name' => 'Unit Tester Requester',
                    'streetAddress' => 'Salzstraße 123',
                    'postalCode' => '48155',
                    'addressCity' => 'Münster',
                    'addressState' => 'NRW',
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider createRequesterDataProvider
     */
    public function testCreateActionWithAdminLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/requester', [], [], [], json_encode($requestContent));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('requester', $data);

        $this->singleRequester($data['requester']);
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithMakerLogIn(): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/requester');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithRequesterLogIn(): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/requester');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithUserLogIn(): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/requester');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithoutLogIn(): void
    {
        $client = static::createClient();

        $client->request('POST', '/requester');

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
