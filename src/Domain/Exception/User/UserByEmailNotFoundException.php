<?php

declare(strict_types=1);

namespace App\Domain\Exception\User;

use App\Domain\Exception\NotFoundException;

class UserByEmailNotFoundException extends NotFoundException
{
    public function __construct(string $email, int $code = 0)
    {
        parent::__construct(
            sprintf('No User found for email [%s]', $email),
            $code
        );
    }
}
