<?php

declare(strict_types=1);

namespace App\Tests\Controller;

class ApiControllerTest extends AbstractControllerTest
{
    /**
     * @group functional
     */
    public function testBasicSwaggerDefinitions(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/doc');
        $this->assertEquals(200, $client->getResponse()->getStatusCode());
    }
}
