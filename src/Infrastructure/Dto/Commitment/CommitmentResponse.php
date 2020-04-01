<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Commitment;

use App\Domain\Commitment\Entity\Commitment;
use App\Infrastructure\Dto\Order\OrderResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;
use DateTimeImmutable;

class CommitmentResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(ref=@Model(type=OrderResponse::class)) */
    public OrderResponse $order;

    /** @SWG\Property(type="integer") */
    public int $quantity;

    /** @SWG\Property(type="date") */
    public DateTimeImmutable $createdDate;

    public static function createFromCommitment(Commitment $commitment): self
    {
        $self = new self();

        $self->id = $commitment->getId();
        $self->order = OrderResponse::createFromOrder($commitment->getOrder());
        $self->quantity = $commitment->getQuantity();
        $self->createdDate = $commitment->getCreatedDate();

        return $self;
    }
}
