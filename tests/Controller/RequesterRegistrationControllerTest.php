<?php

declare(strict_types=1);

namespace App\Tests\Controller;

// TODO: Add test for showAction
class RequesterRegistrationControllerTest extends AbstractControllerTest
{
    public function createRequesterDataProvider(): array
    {
        return [
            [
                [
                    'email' => 'unittester-requester@print4health.org',
                    'password' => '123465789',
                    'name' => 'Unit Tester Requester',
                    'addressStreet' => 'Salzstraße 123',
                    'postalCode' => '48155',
                    'addressCity' => 'Münster',
                    'addressState' => 'NRW',
                    'hub' => false,
                    'institutionType' => 'HOSPITAL',
                    'descrption' => 'Description / Lorem ipsum dolor sid amed',
                    'contactInfo' => 'ContactInfo / Lorem ipsum dolor sid amed',
                    'confirmedPlattformIsContactOnly' => true,
                    'confirmedNoAccountability' => true,
                    'confirmedNoCertification' => true,
                    'confirmedNoAccountabiltyForMediation' => true,
                    'confirmedRuleMaterialAndTransport' => true,
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider createRequesterDataProvider
     */
    public function testRequesterRegisterAction(array $requestContent): void
    {
        $client = static::createClient();

        $client->request('POST', '/requester/registration', [], [], [], json_encode($requestContent));

        dump($client->getResponse()->getContent());
        $this->assertEquals(201, $client->getResponse()->getStatusCode());

        $data = json_decode($client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertArrayHasKey('requester', $data);
        $this->assertArrayHasKey('email', $data['requester']);
        $this->assertArrayHasKey('id', $data['requester']);
    }

    public function createRequesterValidationErrorDataProvider(): array
    {
        return [
            [
                [
                    'email' => '',
                    'password' => '',
                    'name' => '',
                    'addressStreet' => '',
                    'postalCode' => '',
                    'addressCity' => '',
                    'addressState' => '',
                    'hub' => false,
                    'institutionType' => '',
                    'descrption' => '',
                    'contactInfo' => '',
                    'confirmedPlattformIsContactOnly' => false,
                    'confirmedNoAccountability' => false,
                    'confirmedNoCertification' => false,
                    'confirmedNoAccountabiltyForMediation' => false,
                    'confirmedRuleMaterialAndTransport' => false,
                ],
            ],
        ];
    }

    /**
     * @group functional
     * @dataProvider createRequesterValidationErrorDataProvider
     */
    public function testRequesterRegisterActionWithValidationErrors(array $requestContent): void
    {
        $client = static::createClient();

        $this->logInAdmin($client);

        $client->request('POST', '/requester/registration', [], [], [], json_encode($requestContent));

        $this->assertEquals(422, $client->getResponse()->getStatusCode());
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('type', $data);
        $this->assertArrayHasKey('message', $data);
        $this->assertArrayHasKey('errors', $data);
        $this->assertCount(16, $data['errors']);
    }
}
