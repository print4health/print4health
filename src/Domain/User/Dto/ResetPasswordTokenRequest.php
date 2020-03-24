<?php

declare(strict_types=1);

namespace App\Domain\User\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordTokenRequest
{
    /**
     * @Assert\NotBlank(message="Invalid Email Address")
     * @Assert\Email(message="Invalid Email Address")
     */
    public string $email;
}
