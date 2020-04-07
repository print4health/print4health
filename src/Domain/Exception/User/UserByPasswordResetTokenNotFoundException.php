<?php

declare(strict_types=1);

namespace App\Domain\Exception\User;

use App\Domain\Exception\NotFoundException;

class UserByPasswordResetTokenNotFoundException extends NotFoundException
{
    public function __construct(string $recoveryToken)
    {
        parent::__construct(sprintf('User by recovery token [%s] not found.', $recoveryToken));
    }
}
