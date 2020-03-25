<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\User;

use Symfony\Component\Validator\Constraints as Assert;

class ResetPassword
{
    /**
     * @Assert\NotBlank(message="Invalid Token")
     */
    public string $token;

    /**
     * @Assert\NotBlank(message="Invalid Password")
     * @Assert\Length(
     *     min=8,
     *     max=50,
     *     minMessage="The password must be at least {{ limit }} characters long",
     *     maxMessage="The password must not be longer than {{ limit }} characters"
     * )
     */
    public string $password;
}
