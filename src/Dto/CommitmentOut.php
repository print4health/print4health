<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Commitment;

class CommitmentOut
{
    public string $id;
    public OrderOut $order;
    public int $quantity;

    public static function createFromCommitment(Commitment $commitment): self
    {
        $self = new self();

        $self->id = $commitment->getId();
        $self->order = OrderOut::createFromOrder($commitment->getOrder());
        $self->quantity = $commitment->getQuantity();

        return $self;
    }
}
