<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
class MakerControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testListActionWithAdminLogin(): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('GET', '/maker');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('maker', $data);

        foreach ($data['maker'] as $maker) {
            $this->singleMaker($maker);
        }
    }

    /**
     * @group functional
     */
    public function testGeoDataListActionWithAdminLogin(): void
    {
        $client = static::createClient();

        $client->request('GET', '/maker/geodata');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('maker', $data);

        foreach ($data['maker'] as $maker) {
            $this->assertIsString($maker['id']);
            $this->assertArrayNotHasKey('email', $maker);
            $this->assertArrayNotHasKey('name', $maker);
            $this->assertArrayNotHasKey('postalCode', $maker);
            $this->assertArrayNotHasKey('addressCity', $maker);
            $this->assertArrayNotHasKey('addressState', $maker);
            $this->assertArrayHasKey('latitude', $maker);
            $this->assertArrayHasKey('longitude', $maker);
        }
    }

    private function singleMaker(array $maker): void
    {
        $this->assertIsString($maker['id']);
        $this->assertIsString($maker['email']);
        $this->assertArrayHasKey('name', $maker);
        $this->assertArrayHasKey('postalCode', $maker);
        $this->assertArrayHasKey('addressCity', $maker);
        $this->assertArrayHasKey('addressState', $maker);
        $this->assertArrayHasKey('latitude', $maker);
        $this->assertArrayHasKey('longitude', $maker);
    }

    /**
     * @group functional
     */
    public function testFailListActionWithUserLogin(): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('GET', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailListActionWithMakerLogin(): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('GET', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailListActionWithRequesterLogin(): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('GET', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailListActionWithoutLogin(): void
    {
        $client = static::createClient();

        $client->request('GET', '/maker');

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }

    public function createMakerDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'unittester-maker@print4health.org',
                    'password' => '123465789',
                    'name' => 'Unit Tester Maker',
                    'postalCode' => '48155',
                    'addressCity' => 'Münster',
                    'addressState' => 'NRW',
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider createMakerDataProvider
     */
    public function testCreateActionWithAdminLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/maker', [], [], [], json_encode($requestContent));

        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('maker', $data);

        $this->singleMaker($data['maker']);
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithUserLogIn(): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithRequesterLogIn(): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithMakerLogIn(): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/maker');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithoutLogIn(): void
    {
        $client = static::createClient();

        $client->request('POST', '/maker');

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
