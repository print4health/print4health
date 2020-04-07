<?php

declare(strict_types=1);

namespace App\Domain\Exception\Maker;

use App\Domain\Exception\NotFoundException;

class MakerByEmailNotFoundException extends NotFoundException
{
    public function __construct(string $email, int $code = 0)
    {
        parent::__construct(
            sprintf('No maker found for email [%s]', $email),
            $code
        );
    }
}
