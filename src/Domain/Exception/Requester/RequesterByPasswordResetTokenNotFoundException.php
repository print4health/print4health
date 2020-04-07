<?php

declare(strict_types=1);

namespace App\Domain\Exception\Requester;

use App\Domain\Exception\NotFoundException;

class RequesterByPasswordResetTokenNotFoundException extends NotFoundException
{
    public function __construct(string $recoveryToken)
    {
        parent::__construct(sprintf('Requester by recovery token [%s] not found.', $recoveryToken));
    }
}
