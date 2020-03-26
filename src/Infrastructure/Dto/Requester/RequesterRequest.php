<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Requester;

use Swagger\Annotations as SWG;

class RequesterRequest
{
    /** @SWG\Property(type="string") */
    public string $email;

    /** @SWG\Property(type="string") */
    public string $password;

    /** @SWG\Property(type="string") */
    public string $name;

    /** @SWG\Property(type="string") */
    public ?string $streetAddress = null;

    /** @SWG\Property(type="string") */
    public ?string $postalCode = null;

    /** @SWG\Property(type="string") */
    public ?string $addressCity = null;

    /** @SWG\Property(type="string") */
    public ?string $addressState = null;

    /** @SWG\Property(type="string") */
    public ?string $latitude = null;

    /** @SWG\Property(type="string") */
    public ?string $longitude = null;
}
