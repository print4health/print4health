<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Order;

class OrderOut
{
    public string $id;
    public User $user;
    public ThingOut $thing;
    public int $quantity;
    public int $remaining;

    public static function createFromOrder(Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->user = User::createFromUser($order->getUser());
        $self->thing = ThingOut::createFromThing($order->getThing());
        $self->quantity = $order->getQuantity();

        $self->remaining = $order->getQuantity();

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->remaining -= $commitment->getQuantity();
        }

        return $self;
    }
}
