<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Maker;

use Symfony\Component\Validator\Constraints as Assert;

class MakerRequest
{
    /**
     * @Assert\NotBlank
     * @Assert\Email
     */
    public string $email;

    /**
     * @Assert\NotBlank
     */
    public string $password;

    /**
     * @Assert\NotBlank
     */
    public string $name;

    /**
     * @Assert\NotBlank
     * @Assert\Type(type="numeric")
     */
    public ?string $postalCode = null;

    public ?string $addressCity = null;
    public ?string $addressState = null;
    public ?float $latitude = null;
    public ?float $longitude = null;
}
