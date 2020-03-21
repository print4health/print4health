<?php

declare(strict_types=1);

namespace App\Dto;

class Order
{
    public string $id;
    public User $user;
    public Thing $thing;
    public int $quantity;
//    public array $commitments;

    public static function createFromOrder(\App\Entity\Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->user = User::createFromUser($order->getUser());
        $self->thing = Thing::createFromThing($order->getThing());
        $self->quantity = $order->getQuantity();

        return $self;
    }
}
