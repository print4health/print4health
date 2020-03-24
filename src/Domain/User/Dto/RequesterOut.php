<?php

declare(strict_types=1);

namespace App\Domain\User\Dto;

use App\Domain\User\Entity\Requester;
use Doctrine\ORM\EntityNotFoundException;

class RequesterOut
{
    public string $id;
    public string $email;
    public ?string $name;
    public ?string $streetAddress;
    public ?string $postalCode;
    public ?string $addressCity;
    public ?string $addressState;
    public ?string $latitude;
    public ?string $longitude;

    public static function createFromRequester(?Requester $requester): self
    {
        if (!$requester instanceof Requester) {
            throw new EntityNotFoundException('User is empty');
        }

        $self = new self();

        $self->id = $requester->getId();
        $self->email = $requester->getEmail();
        $self->name = $requester->getName();
        $self->streetAddress = $requester->getStreetAddress();
        $self->postalCode = $requester->getPostalCode();
        $self->addressCity = $requester->getAddressCity();
        $self->addressState = $requester->getAddressState();
        $self->latitude = $requester->getLatitude();
        $self->longitude = $requester->getLongitude();

        return $self;
    }
}
