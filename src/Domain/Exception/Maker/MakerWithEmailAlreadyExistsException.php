<?php

declare(strict_types=1);

namespace App\Domain\Exception\Maker;

class MakerWithEmailAlreadyExistsException extends MakerAlreadyExistsException
{
    public function __construct(string $email, int $code = 0)
    {
        parent::__construct(
            sprintf('Maker with the email %s already exist', $email),
            $code
        );
    }
}
