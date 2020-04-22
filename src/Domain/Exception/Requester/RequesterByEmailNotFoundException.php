<?php

declare(strict_types=1);

namespace App\Domain\Exception\Requester;

use App\Domain\Exception\NotFoundException;

class RequesterByEmailNotFoundException extends NotFoundException
{
    public function __construct(string $email, int $code = 0)
    {
        parent::__construct(
            sprintf('No Requester found for email [%s]', $email),
            $code
        );
    }
}
