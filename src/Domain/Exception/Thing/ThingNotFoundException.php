<?php

declare(strict_types=1);

namespace App\Domain\Exception\Thing;

use App\Domain\Exception\NotFoundException;

class ThingNotFoundException extends NotFoundException
{
    public function __construct(string $id, int $code = 0)
    {
        parent::__construct(
            sprintf('No Thing found for id [%s]', $id),
            $code
        );
    }
}
