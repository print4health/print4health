<?php

declare(strict_types=1);

namespace App\Domain\User;

class NotFoundException extends \RuntimeException implements \App\Domain\Exception\NotFoundException
{
    public function __construct(string $id)
    {
        parent::__construct(sprintf('User with ID: "%s" not found', $id));
    }
}
