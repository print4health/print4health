<?php

declare(strict_types=1);

namespace App\Domain\Exception\Maker;

use App\Domain\Exception\NotFoundException;

class MakerByPasswordResetTokenNotFoundException extends NotFoundException
{
    public function __construct(string $recoveryToken)
    {
        parent::__construct(sprintf('Maker by recovery token [%s] not found.', $recoveryToken));
    }
}
