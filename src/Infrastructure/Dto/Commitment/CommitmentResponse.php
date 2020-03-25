<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Commitment;

use App\Domain\Commitment\Entity\Commitment;
use App\Infrastructure\Dto\Order\OrderResponse;

class CommitmentResponse
{
    public string $id;
    public OrderResponse $order;
    public int $quantity;

    public static function createFromCommitment(Commitment $commitment): self
    {
        $self = new self();

        $self->id = $commitment->getId();
        $self->order = OrderResponse::createFromOrder($commitment->getOrder());
        $self->quantity = $commitment->getQuantity();

        return $self;
    }
}
