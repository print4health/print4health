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

    private function singleThing(array $thing): void
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
     * @dataProvider createThingDataProvider
     */
    public function testFailCreateActionWithMakerLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/things', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createThingDataProvider
     */
    public function testFailCreateActionWithRequesterLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/things', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createThingDataProvider
     */
    public function testFailCreateActionWithUserLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/things', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createThingDataProvider
     */
    public function testFailCreateActionWithoutLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $client->request('POST', '/things', [], [], [], json_encode($requestContent));

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
