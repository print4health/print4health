<?php

declare(strict_types=1);

namespace App\Domain\Exception\Maker;

use App\Domain\Exception\NotFoundException;
use Ramsey\Uuid\UuidInterface;

class MakerByIdNotFoundException extends NotFoundException
{
    public function __construct(UuidInterface $uuid, int $code = 0)
    {
        parent::__construct(
            sprintf('No Maker found for id [%s]', $uuid->toString()),
            $code
        );
    }
}
