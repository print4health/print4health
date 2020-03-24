<?php

declare(strict_types=1);

namespace App\Domain\Commitment\Dto;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\Order\Dto\OrderOut;

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
