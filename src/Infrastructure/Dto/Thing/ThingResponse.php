<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Thing;

use App\Domain\Thing\Entity\Thing;
use DateTimeImmutable;
use Swagger\Annotations as SWG;

class ThingResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(type="string") */
    public string $name;

    /** @SWG\Property(type="string") */
    public string $description;

    /** @SWG\Property(type="string") */
    public string $url;

    /** @SWG\Property(type="string") */
    public string $imageUrl;

    /** @SWG\Property(type="string") */
    public string $specification;

    /** @SWG\Property(type="integer") */
    public int $needed = 0;

    /** @SWG\Property(type="integer") */
    public int $printed = 0;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public string $createdDate;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public ?string $updatedDate;

    public static function createFromThing(Thing $thing): self
    {
        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();
        $self->imageUrl = $thing->getImageUrl();
        $self->url = $thing->getUrl();
        $self->description = $thing->getDescription();
        $self->specification = $thing->getSpecification();
        $self->createdDate = $thing->getCreatedDate()->format(DateTimeImmutable::ATOM);
        $updatedDate = $thing->getUpdatedDate();
        if ($updatedDate instanceof DateTimeImmutable) {
            $self->updatedDate = $updatedDate->format(DateTimeImmutable::ATOM);
        }

        $orders = $thing->getOrders();
        foreach ($orders as $order) {
            $self->needed += $order->getQuantity();

            $commitments = $order->getCommitments();
            foreach ($commitments as $commitment) {
                $self->printed += $commitment->getQuantity();
            }
        }

        return $self;
    }
}
