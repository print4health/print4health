<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Maker;

use App\Domain\User\Entity\Maker;
use Doctrine\ORM\EntityNotFoundException;
use Swagger\Annotations as SWG;

class MakerGeoDataResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="float") */
    public ?float $latitude;

    /** @SWG\Property(type="float") */
    public ?float $longitude;

    /** @SWG\Property(type="string") */
    public ?string $postalCode;

    /** @SWG\Property(type="string") */
    public ?string $addressCity;

    public static function createFromMaker(?Maker $maker): self
    {
        if (!$maker instanceof Maker) {
            throw new EntityNotFoundException('User is empty');
        }

        $self = new self();

        $self->id = $maker->getId();
        $self->latitude = $maker->getLatitude();
        $self->longitude = $maker->getLongitude();
        $self->postalCode = $maker->getPostalCode();
        $self->addressCity = $maker->getAddressCity();

        return $self;
    }
}
