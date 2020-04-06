<?php

declare(strict_types=1);

namespace App\Domain\Exception\Security;

use App\Domain\DomainException;
use Symfony\Component\Security\Core\Exception\AccountStatusException;
use Throwable;

class UserNotEnabledException extends AccountStatusException
{
}
