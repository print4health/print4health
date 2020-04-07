<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Requester;

use App\Infrastructure\Validator\UserUniqueEmail;
use Swagger\Annotations as SWG;
use Symfony\Component\Validator\Constraints as Assert;

class RequesterRequest
{
    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Email
     * @UserUniqueEmail
     */
    public string $email;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     */
    public string $password;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $name;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     */
    public ?string $addressStreet = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     */
    public ?string $postalCode = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\Length(max=255)
     */
    public ?string $addressCity = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\Length(max=255)
     */
    public ?string $addressState = null;

    /**
     * @SWG\Property(type="float")
     * @Assert\Type(type="numeric")
     */
    public ?float $latitude = null;

    /**
     * @SWG\Property(type="float")
     * @Assert\Type(type="numeric")
     */
    public ?float $longitude = null;
}
