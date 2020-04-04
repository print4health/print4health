<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\RequesterRegistration;

use App\Infrastructure\Validator\UserUniqueEmail;
use Swagger\Annotations as SWG;
use Symfony\Component\Validator\Constraints as Assert;

class RequesterRegistrationRequest
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
     * @Assert\Length(min=8)
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
     * @Assert\Type(type="numeric")
     * @Assert\Length(max=255)
     */
    public ?string $addressStreet = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Type(type="numeric")
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
     * @SWG\Property(type="boolean")
     * @Assert\Type(type="boolean")
     */
    public ?bool $hub = null;

    /**
     * @SWG\Property(type="number")
     * @Assert\Type(type="numeric")
     */
    public ?float $latitude = null;

    /**
     * @SWG\Property(type="number")
     * @Assert\Type(type="numeric")
     */
    public ?float $longitude = null;

    /**
     * @SWG\Property(type="boolean")
     * @Assert\IsTrue()
     */
    public bool $confirmedPlattformIsContactOnly = false;

    /**
     * @SWG\Property(type="boolean")
     * @Assert\IsTrue()
     */
    public bool $confirmedNoAccountability = false;

    /**
     * @SWG\Property(type="boolean")
     * @Assert\IsTrue()
     */
    public bool $confirmedNoCertification = false;

    /**
     * @SWG\Property(type="boolean")
     * @Assert\IsTrue()
     */
    public bool $confirmedNoAccountabiltyForMediation = false;

    /**
     * @SWG\Property(type="boolean")
     * @Assert\IsTrue()
     */
    public bool $confirmedRuleMaterialAndTransport = false;

    public function hasPostalCodeAndCountry(): bool
    {
        return null !== $this->postalCode &&
            '' !== $this->postalCode &&
            null !== $this->addressState &&
            '' !== $this->addressState;
    }

    public function hasLatLng(): bool
    {
        return null !== $this->latitude && null !== $this->longitude;
    }
}
