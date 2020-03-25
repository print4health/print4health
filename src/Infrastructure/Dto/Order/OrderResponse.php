<?php

declare(strict_types=1);

namespace App\Domain\Order\Dto;

use App\Domain\Order\Entity\Order;
use App\Domain\Thing\Dto\ThingOut;
use App\Domain\User\Dto\RequesterOut;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;

class OrderOut
{
    /** @SWG\Property(type="string") */
    public string $id;
    /** @SWG\Property(type=@SWG\Schema(@Model(type=RequesterOut::class))) */
    public RequesterOut $requester;
    /** @SWG\Property(type=@SWG\Schema(@Model(type=ThingOut::class))) */
    public ThingOut $thing;
    /** @SWG\Property(type="integer") */
    public int $quantity;
    /** @SWG\Property(type="integer") */
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
