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
     */
    public string $name;

    /**
     * @Assert\NotBlank
     * @Assert\Type(type="numeric")
     */
    public ?string $postalCode = null;

    public ?string $addressCity = null;

    public ?string $addressState = null;

    public ?string $latitude = null;

    public ?string $longitude = null;

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
