<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Maker;

use App\Domain\User\Entity\Maker;
use DateTimeImmutable;
use Doctrine\ORM\EntityNotFoundException;
use Swagger\Annotations as SWG;

class MakerResponse
{
    /** @SWG\Property(type="string") */
    public string $id;
    /** @SWG\Property(type="string") */
    public string $email;
    /** @SWG\Property(type="string") */
    public ?string $name;
    /** @SWG\Property(type="string") */
    public ?string $postalCode;
    /** @SWG\Property(type="string") */
    public ?string $addressCity;
    /** @SWG\Property(type="string") */
    public ?string $addressState;
    /** @SWG\Property(type="float") */
    public ?float $latitude;
    /** @SWG\Property(type="float") */
    public ?float $longitude;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public string $createdDate;

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
        $self->createdDate = $maker->getCreatedDate()->format(DateTimeImmutable::ATOM);

        return $self;
    }
}
