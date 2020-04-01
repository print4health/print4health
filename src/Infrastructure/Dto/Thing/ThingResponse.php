<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Thing;

use App\Domain\Thing\Entity\Thing;
use Doctrine\ORM\EntityNotFoundException;
use Swagger\Annotations as SWG;
use DateTimeImmutable;

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

    /** @SWG\Property(type="int") */
    public int $needed = 0;

    /** @SWG\Property(type="int") */
    public int $printed = 0;

    /** @SWG\Property(type="date") */
    public DateTimeImmutable $createdDate;

    /** @SWG\Property(type="date") */
    public ?DateTimeImmutatble $updatedDate;

    public static function createFromThing(?Thing $thing): self
    {
        if (!$thing instanceof Thing) {
            throw new EntityNotFoundException('Thing is empty');
        }

        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();
        $self->imageUrl = $thing->getImageUrl();
        $self->url = $thing->getUrl();
        $self->description = $thing->getDescription();
        $self->specification = $thing->getSpecification();
        $self->createdDate = $thing->getCreatedDate();
        $self->updatedDate = $thing->getUpdatedDate();

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
