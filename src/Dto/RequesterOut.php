<?php

declare(strict_types=1);

namespace App\Dto;

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

    public static function createFromRequester(?\App\Entity\User\Requester $requester): self
    {
        if (!$requester instanceof \App\Entity\User\Requester) {
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

        return $self;
    }
}
