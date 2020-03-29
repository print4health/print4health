<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\Exception\NotFoundException as DomainNotFoundException;

class NotFoundException extends DomainNotFoundException
{
    public function __construct(string $id)
    {
        parent::__construct(sprintf('User with ID: "%s" not found', $id));
    }
}
