<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
// TODO: Add success test for createAction
class CommitmentControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testListAction(): void
    {
        $client = static::createClient();

        $client->request('GET', '/commitments');

        $this->assertEquals(200, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('commitments', $data);

        foreach ($data['commitments'] as $commitment) {
            $this->singleCommitment($commitment);
        }
    }

    private function singleCommitment(array $commitment): void
    {
        $this->assertIsString($commitment['id']);
        $this->assertIsInt($commitment['quantity']);

        $this->assertArrayHasKey('order', $commitment);
    }

    public function createCommitmentDataProvider(): array
    {
        return [
            [
                [
                    'orderId' => '12345-12345-12345-12345', // TODO: Must be a valid order id
                    'quantity' => 123,
                ],
            ],
        ];
    }

    public function failCommitmentDataProvider(): array
    {
        return [
            [
                [
                    'orderId' => '12345-12345-12345-12345',
                    'quantity' => 123,
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider failCommitmentDataProvider
     */
    public function testFailCreateActionWithFalseOrderId(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInMaker($client);

        $client->request('POST', '/commitments', [], [], [], json_encode($requestContent));

        $this->assertEquals(400, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertEquals('Order not found', $data['detail']);
    }

    /**
     * @group functional
     * @dataProvider createCommitmentDataProvider
     */
    public function testFailCreateActionWithAdminLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/commitments', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createCommitmentDataProvider
     */
    public function testFailCreateActionWithRequesterLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInRequester($client);

        $client->request('POST', '/commitments', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createCommitmentDataProvider
     */
    public function testFailCreateActionWithUserLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInUser($client);

        $client->request('POST', '/commitments', [], [], [], json_encode($requestContent));

        $this->assertEquals(403, $client->getResponse()->getStatusCode());
    }

    /**
     * @group functional
     * @dataProvider createCommitmentDataProvider
     */
    public function testFailCreateActionWithoutLogIn(array $requestContent): void
    {
        $client = static::createClient();

        $client->request('POST', '/commitments', [], [], [], json_encode($requestContent));

        $this->assertEquals(401, $client->getResponse()->getStatusCode());
    }
}
