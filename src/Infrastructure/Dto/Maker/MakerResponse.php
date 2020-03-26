<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Maker;

use App\Domain\User\Entity\Maker;
use Doctrine\ORM\EntityNotFoundException;

class MakerResponse
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

    public static function createFromMaker(?Maker $maker): self
    {
        if (!$maker instanceof Maker) {
            throw new EntityNotFoundException('User is empty');
        }

        $self = new self();

        $self->id = $maker->getId();
        $self->email = $maker->getEmail();
        $self->name = $maker->getName();
        $self->postalCode = $maker->getPostalCode();
        $self->addressCity = $maker->getAddressCity();
        $self->addressState = $maker->getAddressState();
        $self->latitude = $maker->getLatitude();
        $self->longitude = $maker->getLongitude();

        return $self;
    }
}
