<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Order;

class OrderOut
{
    public string $id;
    public RequesterOut $requester;
    public ThingOut $thing;
    public int $quantity;
    public int $remaining;

    public static function createFromOrder(Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterOut::createFromRequester($order->getRequester());
        $self->thing = ThingOut::createFromThing($order->getThing());

        $self->quantity = $order->getQuantity();
        $self->remaining = $order->getRemaining();

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->remaining -= $commitment->getQuantity();
        }

        return $self;
    }
}
