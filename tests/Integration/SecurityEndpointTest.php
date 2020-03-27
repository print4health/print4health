<?php declare(strict_types=1);

namespace App\Tests\Integration;

class SecurityEndpointTest extends IntegrationTest
{
    public function testLogin(): void
    {
        $data = self::post('/login');

        self::assertSuccessful();
        $this->assertMatchesSnapshot($data);
    }
}
