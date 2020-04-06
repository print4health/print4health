<?php

declare(strict_types=1);

namespace App\Domain\Security;

use App\Domain\Exception\Security\UserNotEnabledException;
use App\Domain\User\UserInterface;
use Symfony\Component\Security\Core\User\UserCheckerInterface;
use Symfony\Component\Security\Core\User\UserInterface as BaseUserInterface;

/**
 * https://symfony.com/doc/current/security/user_checkers.html
 * Class UserChecker
 * @package App\Domain\Security
 */
class UserChecker implements UserCheckerInterface
{
    public function checkPreAuth(BaseUserInterface $user)
    {
        if (!$user instanceof UserInterface) {
            return;
        }

        // user is deleted, show a generic Account Not Found message.
        if ($user->isEnabled() === false) {
            throw new UserNotEnabledException('User is not enabled');
        }
    }

    public function checkPostAuth(BaseUserInterface $user)
    {
    }
}
