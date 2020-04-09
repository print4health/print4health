<?php

declare(strict_types=1);

namespace App\Domain\Exception\Requester;

use App\Domain\Exception\NotFoundException;
use Ramsey\Uuid\UuidInterface;

class RequesterByIdNotFoundException extends NotFoundException
{
    public function __construct(UuidInterface $uuid, int $code = 0)
    {
        parent::__construct(
            sprintf('No Requester found for id [%s]', $uuid->toString()),
            $code
        );
    }
}
