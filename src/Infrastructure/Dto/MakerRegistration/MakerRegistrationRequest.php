<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\MakerRegistration;

use App\Infrastructure\Validator\MakerUniqueEmail;
use Symfony\Component\Validator\Constraints as Assert;

class MakerRegistrationRequest
{
    /**
     * @Assert\NotBlank
     * @Assert\Email
     * @MakerUniqueEmail
     */
    public string $email;

    /**
     * @Assert\NotBlank
     */
    public string $password;

    /**
     * @Assert\NotBlank
     * @Assert\Length(min=5, max=255)
     */
    public string $name;

    /**
     * @Assert\NotBlank
     * @Assert\Type(type="numeric")
     * @Assert\Length(max=255)
     */
    public ?string $postalCode = null;

    /**
     * @Assert\Length(max=255)
     */
    public ?string $addressCity = null;

    /**
     * @Assert\Length(max=255)
     */
    public ?string $addressState = null;

    /**
      * @Assert\Type(type="numeric")
      */
    public ?float $latitude = null;

    /**
     * @Assert\Type(type="numeric")
     */
    public ?float $longitude = null;

    /**
     * @Assert\IsTrue()
     */
    public bool $confirmedRuleForFree = false;

    /**
     * @Assert\IsTrue()
     */
    public bool $confirmedRuleMaterialAndTransport = false;

    /**
     * @Assert\IsTrue()
     */
    public bool $confirmedPlattformIsContactOnly = false;

    /**
     * @Assert\IsTrue()
     */
    public bool $confirmedNoAccountability = false;

    /**
     * @Assert\IsTrue()
     */
    public bool $confirmedPersonalDataTransferToRequester = false;
}
