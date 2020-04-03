<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Contact;

use Symfony\Component\Validator\Constraints as Assert;

class ContactRequest
{
    /**
     * @Assert\NotBlank
     * @Assert\Email
     */
    public string $email;

    /**
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $name;

    /**
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $phone;

    /**
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $subject;

    /**
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $message;
}
