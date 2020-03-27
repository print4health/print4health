<?php

declare(strict_types=1);

namespace App\Tests\Integration;

class SecurityEndpointTest extends IntegrationTest
{
    public function testLogin(): void
    {
        $data = self::post('/login', [
            'email' => 'admin@print4health.org',
            'password' => 'test',
        ]);

        self::assertSuccessful();
        $this->assertMatchesSnapshot($data);
    }

    public function testLoginFailed(): void
    {
        $data = self::post('/login', [
            'email' => 'admin@print4health.org',
            'password' => 'WRONG_PASSWORD',
        ]);

        self::assertClientError(401);
        $this->assertMatchesSnapshot($data);
    }
}
