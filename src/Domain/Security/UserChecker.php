<?php

declare(strict_types=1);

namespace App\Domain\Security;

use App\Domain\Exception\Security\UserNotEnabledException;
use App\Domain\User\UserInterface;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface as BaseUserInterface;

/**
 * https://symfony.com/doc/current/security/user_checkers.html
 * Class UserChecker.
 */
class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(BaseUserInterface $user): void
    {
        if (!$user instanceof UserInterface) {
            return;
        }

        // user is deleted, show a generic Account Not Found message.
        if (false === $user->isEnabled()) {
            throw new UserNotEnabledException('User is not enabled');
        }
    }

    public function checkPostAuth(BaseUserInterface $user): void
    {
    }
}
