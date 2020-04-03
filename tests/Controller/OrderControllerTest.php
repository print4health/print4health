<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
// TODO: Add test for listByThingAction
// TODO: Add success test for createAction
class OrderControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testListAction(): void
    {
        $client = static::createClient();

        $client->request('GET', '/orders');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('orders', $data);

        foreach ($data['orders'] as $order) {
            $this->singleOrder($order);
        }
    }

    public function failCommitmentDataProvider(): array
    {
        return [
            [
                [
                    'quantity' => -1,
                ],
                'Quantity must be greater than zero',
            ],
            [
                [
                    'quantity' => 0,
                ],
                'Quantity must be greater than zero',
            ],
            [
                [
                    'thingId' => 'e2856d83-f2d0-4400-a73f-f24defafcb72',
                    'quantity' => 123,
                ],
                'No thing was found',
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider failCommitmentDataProvider
     */
    public function testFailCreateActionWithRequesterLogIn(array $requestContent, string $errorMessage): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/orders', [], [], [], json_encode($requestContent));
        $this->assertEquals(422, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('errors', $data);
        $this->assertGreaterThan(0, $data['errors']);
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithAdminLogIn(): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/orders');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithUserLogIn(): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/orders');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithMakerLogIn(): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/orders');

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     */
    public function testFailCreateActionWithoutLogIn(): void
    {
        $client = static::createClient();

        $client->request('POST', '/orders');

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
