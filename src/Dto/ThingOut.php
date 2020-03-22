<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Thing;
use Doctrine\ORM\EntityNotFoundException;

class ThingOut
{
    public string $id;
    public string $name;
    public string $description;
    public string $fileUrl;
    public string $image;
    public int $needed = 0;
    public int $printed = 0;

    public static function createFromThing(?Thing $thing): self
    {
        if (!$thing instanceof Thing) {
            throw new EntityNotFoundException('Thing is empty');
        }

        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();
        $self->fileUrl = $thing->getFileUrl();

        if (null !== $thing->getImage()) {
            $self->image = $thing->getImage()->getFilename();
        }

        $orders = $thing->getOrders();
        foreach ($orders as $order) {
            $self->needed = $order->getQuantity();

            $commitments = $order->getCommitments();
            foreach ($commitments as $commitment) {
                $self->printed = $commitment->getQuantity();
            }
        }

        return $self;
    }
}
