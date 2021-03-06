<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Order;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\Order\Entity\Order;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Infrastructure\Dto\Commitment\CommitmentResponse;
use App\Infrastructure\Dto\Requester\RequesterResponse;
use App\Infrastructure\Dto\Thing\ThingResponse;
use DateTimeImmutable;
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
    public int $printed;

    /** @SWG\Property(type="integer") */
    public int $remaining;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public string $createdDate;

    /** @SWG\Property(type="string", example="Y-m-d\TH:i:sP") */
    public ?string $updatedDate;

    /**
     * @SWG\Property(
     *   type="array",
     *   @SWG\Items(ref=@Model(type=CommitmentResponse::class))
     * )
     *
     * @var CommitmentResponse[]
     */
    public array $commitments = [];

    public static function createFromOrder(Order $order): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterResponse::createFromRequester($order->getRequester());
        $self->thing = ThingResponse::createFromThing($order->getThing());

        $self->quantity = $order->getQuantity();
        $self->remaining = $order->getRemaining();
        $self->printed = 0;

        $self->createdDate = $order->getCreatedDate()->format(DateTimeImmutable::ATOM);
        $updatedDate = $order->getUpdatedDate();
        if ($updatedDate instanceof DateTimeImmutable) {
            $self->updatedDate = $updatedDate->format(DateTimeImmutable::ATOM);
        }

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->printed += $commitment->getQuantity();
            $self->remaining -= $commitment->getQuantity();
        }

        return $self;
    }

    public static function createFromOrderAndMaker(Order $order, Maker $maker): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterResponse::createFromRequester($order->getRequester());
        $self->thing = ThingResponse::createFromThing($order->getThing());

        $self->quantity = $order->getQuantity();
        $self->remaining = $order->getRemaining();
        $self->printed = 0;

        $self->createdDate = $order->getCreatedDate()->format(DateTimeImmutable::ATOM);
        $updatedDate = $order->getUpdatedDate();
        if ($updatedDate instanceof DateTimeImmutable) {
            $self->updatedDate = $updatedDate->format(DateTimeImmutable::ATOM);
        }

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->printed += $commitment->getQuantity();
            $self->remaining -= $commitment->getQuantity();

            // add "my" commitment only
            if ($commitment->getMaker()->getId() === $maker->getId()) {
                $self->commitments[] = CommitmentResponse::createFromCommitmentWithoutOrder($commitment);
            }
        }

        return $self;
    }

    public static function createFromOrderAndRequester(Order $order, Requester $requester): self
    {
        $self = new self();

        $self->id = $order->getId();
        $self->requester = RequesterResponse::createFromRequester($order->getRequester());
        $self->thing = ThingResponse::createFromThing($order->getThing());

        $self->quantity = $order->getQuantity();
        $self->remaining = $order->getRemaining();
        $self->printed = 0;

        $self->createdDate = $order->getCreatedDate()->format(DateTimeImmutable::ATOM);
        $updatedDate = $order->getUpdatedDate();
        if ($updatedDate instanceof DateTimeImmutable) {
            $self->updatedDate = $updatedDate->format(DateTimeImmutable::ATOM);
        }

        $commitments = $order->getCommitments();
        foreach ($commitments as $commitment) {
            $self->printed += $commitment->getQuantity();
            $self->remaining -= $commitment->getQuantity();
            $self->commitments[] = CommitmentResponse::createFromCommitmentWithMaker($commitment);
        }

        return $self;
    }
}
