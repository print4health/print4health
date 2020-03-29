<?php

declare(strict_types=1);

namespace App\Domain\User;

class RequesterNotFoundException extends \RuntimeException implements \App\Domain\Exception\NotFoundException
{
    public function __construct(string $id)
    {
        parent::__construct(sprintf('Requester with ID: "%s" not found', $id));
    }
}
