<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\User;

use Swagger\Annotations as SWG;
use Symfony\Component\Validator\Constraints as Assert;

class ResetPasswordTokenRequest
{
    /**
     * @SWG\Property(type="string")
     *
     * @Assert\NotBlank(message="Invalid Email Address")
     * @Assert\Email(message="Invalid Email Address")
     */
    public string $email;
}
