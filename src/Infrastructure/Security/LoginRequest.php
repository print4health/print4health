<?php

declare(strict_types=1);

namespace App\Infrastructure\Security;

use Webmozart\Assert\Assert;

final class LoginRequest
{
    private string $email;
    private string $password;

    public function __construct(string $email, string $password)
    {
        Assert::notEmpty($email);
        Assert::notEmpty($password);

        Assert::email($email);

        $this->email = $email;
        $this->password = $password;
    }

    /**
     * @param array<string, string> $data
     */
    public static function fromArray(array $data): self
    {
        Assert::keyExists($data, 'email');
        Assert::keyExists($data, 'password');

        $email = $data['email'];
        $password = $data['password'];

        Assert::notNull($email);
        Assert::notNull($password);

        return new self($email, $password);
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
