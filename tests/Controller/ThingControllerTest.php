<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
class ThingControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testListAction(): void
    {
        $client = static::createClient();

        $client->request('GET', '/things');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('things', $data);

        foreach ($data['things'] as $thing) {
            $this->singleThing($thing);
        }
    }

    public function createThingDataProvider(): array
    {
        return [
            [
                [
                    'name' => 'Unit Test Thing',
                    'imageUrl' => 'https://example.org/image.png',
                    'url' => 'https://example.org/thing',
                    'description' => 'This is the description of a thing',
                    'specification' => 'Specifications of a thing',
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider createThingDataProvider
     */
    public function testCreateActionWithAdminLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/things', [], [], [], json_encode($requestContent));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('thing', $data);

        $this->singleThing($data['thing']);
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithMakerLogIn(): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/things');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithRequesterLogIn(): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/things');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithUserLogIn(): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/things');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithoutLogIn(): void
    {
        $client = static::createClient();

        $client->request('POST', '/things');

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
