<?php

declare(strict_types=1);

namespace App\Domain\User;

use App\Domain\Exception\NotFoundException as DomainNotFoundException;

class MakerNotFoundException extends DomainNotFoundException
{
    public function __construct(string $id)
    {
        parent::__construct(sprintf('Maker with ID: "%s" not found', $id));
    }
}
