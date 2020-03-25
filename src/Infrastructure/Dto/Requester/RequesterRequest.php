<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Requester;

class RequesterRequest
{
    public string $email;
    public string $password;
    public string $name;
    public ?string $streetAddress = null;
    public ?string $postalCode = null;
    public ?string $addressCity = null;
    public ?string $addressState = null;
    public ?string $latitude = null;
    public ?string $longitude = null;
}
