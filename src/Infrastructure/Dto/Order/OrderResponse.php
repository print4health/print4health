<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Order;

use App\Domain\Order\Entity\Order;
use App\Infrastructure\Dto\Thing\ThingResponse;
use App\Domain\User\Dto\RequesterOut;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;

class OrderResponse
{
    /** @SWG\Property(type="string") */
    public string $id;
    /** @SWG\Property(type=@SWG\Schema(@Model(type=RequesterOut::class))) */
    public RequesterOut $requester;
    /** @SWG\Property(type=@SWG\Schema(@Model(type=ThingResponse::class))) */
    public ThingResponse $thing;
    /** @SWG\Property(type="integer") */
    public int $quantity;
    /** @SWG\Property(type="integer") */
    public int $remaining;

    public static function createFromOrder(Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterOut::createFromRequester($order->getRequester());
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
