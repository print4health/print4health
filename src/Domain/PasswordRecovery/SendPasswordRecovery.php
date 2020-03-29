<?php

declare(strict_types=1);

namespace App\Domain\PasswordRecovery;

class SendPasswordRecovery
{
    private string $email;

    public function __construct(string $email)
    {
        $this->email = $email;
    }

    public function getEmail(): string
    {
        return $this->email;
    }
}
