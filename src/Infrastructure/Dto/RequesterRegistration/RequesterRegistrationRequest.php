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
     * @Assert\Length(min=5, max=255)
     */
    public string $name;
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
     * @Assert\Choice(callback="getInstitutionTypes")
     */
    public string $institutionType;

    /**
     * @SWG\Property(type="string")
     * @Assert\Length(min=5, max=3000)
     */
    public ?string $description = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\Length(min=0, max=3000)
     */
    public ?string $contactInfo = null;

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
     * @Assert\NotBlank
     * @Assert\Length(max=255)
     */
    public ?string $addressCity = null;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
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
        return $this->postalCode !== null &&
            $this->postalCode !== '' &&
            $this->addressState !== null &&
            $this->addressState !== '';
    }

    public function hasLatLng(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    public function isHub(): bool
    {
        return $this->institutionType === 'MAKER_HUB';
    }

    /**
     * @return string[]
     */
    public static function getInstitutionTypes(): array
    {
        return [
            'HOSPITAL',
            'DOCTOR_LOCAL',
            'NURSING_SERVICE',
            'HEALTHCARE_INSTITUTION',
            'SOCIAL_INSTITUION',
            'MAKER_HUB',
            'OTHER',
        ];
    }
}
