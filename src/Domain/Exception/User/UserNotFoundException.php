<?php

declare(strict_types=1);

namespace App\Domain\Exception\User;

use App\Domain\Exception\NotFoundException;
use Ramsey\Uuid\UuidInterface;

class UserNotFoundException extends NotFoundException
{
    public function __construct(UuidInterface $uuid, int $code = 0)
    {
        parent::__construct(
            sprintf('No User found for id [%s]', $uuid->toString()),
            $code
        );
    }
}
