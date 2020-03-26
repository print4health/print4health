<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Order;

use App\Domain\Order\Entity\Order;
use App\Infrastructure\Dto\Requester\RequesterResponse;
use App\Infrastructure\Dto\Thing\ThingResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;

class OrderResponse
{
    /** @SWG\Property(type="string") */
    public string $id;

    /** @SWG\Property(ref=@Model(type=RequesterResponse::class)) */
    public RequesterResponse $requester;

    /** @SWG\Property(ref=@Model(type=ThingResponse::class)) */
    public ThingResponse $thing;

    /** @SWG\Property(type="integer") */
    public int $quantity;

    /** @SWG\Property(type="integer") */
    public int $remaining;

    public static function createFromOrder(Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterResponse::createFromRequester($order->getRequester());
        $self->thing = ThingResponse::createFromThing($order->getThing());

        $self->quantity = $order->getQuantity();
        $self->remaining = $order->getRemaining();

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->remaining -= $commitment->getQuantity();
        }

        return $self;
    }
}
