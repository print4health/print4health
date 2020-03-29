<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Requester;

use App\Domain\User\Entity\Requester;
use Doctrine\ORM\EntityNotFoundException;
use Swagger\Annotations as SWG;

class RequesterResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="string") */
    public string $email;

    /** @SWG\Property(type="string") */
    public ?string $name;

    /** @SWG\Property(type="string") */
    public ?string $streetAddress;

    /** @SWG\Property(type="string") */
    public ?string $postalCode;

    /** @SWG\Property(type="string") */
    public ?string $addressCity;

    /** @SWG\Property(type="string") */
    public ?string $addressState;

    /** @SWG\Property(type="string") */
    public ?string $latitude;

    /** @SWG\Property(type="string") */
    public ?string $longitude;

    /** @SWG\Property(type="bool") */
    public ?bool $isHub;

    /** @SWG\Property(type="array") */
    public ?array $area;

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
        $self->isHub = $requester->isHub();
        $self->area = $requester->getArea();

        return $self;
    }
}
