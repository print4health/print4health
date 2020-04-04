<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Requester;

use App\Domain\User\Entity\Requester;
use DateTimeImmutable;
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

    /** @SWG\Property(type="number") */
    public ?float $latitude;

    /** @SWG\Property(type="number") */
    public ?float $longitude;

    /** @SWG\Property(type="bool") */
    public ?bool $isHub;

    /**
     * @var array[]
     * @SWG\Property(
     *     type="array",
     *     @SWG\Items(type="float")
     * )
     */
    public ?array $area;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public string $createdDate;

    public static function createFromRequester(Requester $requester): self
    {
        $self = new self();

        $self->id = $requester->getId();
        $self->email = $requester->getEmail();
        $self->name = $requester->getName();
        $self->streetAddress = $requester->getAddressStreet();
        $self->postalCode = $requester->getPostalCode();
        $self->addressCity = $requester->getAddressCity();
        $self->addressState = $requester->getAddressState();
        $self->latitude = $requester->getLatitude();
        $self->longitude = $requester->getLongitude();
        $self->isHub = $requester->isHub();
        $self->area = $requester->getArea();
        $self->createdDate = $requester->getCreatedDate()->format(DateTimeImmutable::ATOM);

        return $self;
    }
}
