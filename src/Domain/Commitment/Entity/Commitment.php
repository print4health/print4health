<?php

declare(strict_types=1);

namespace App\Domain\Commitment\Entity;

use App\Domain\Order\Entity\Order;
use App\Domain\User\Entity\Maker;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Domain\Commitment\Repository\CommitmentRepository")
 */
class Commitment
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="guid")
     */
    private string $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Domain\Order\Entity\Order")
     * @ORM\JoinColumn(nullable=false)
     */
    private Order $order;

    /**
     * @ORM\Column(type="integer")
     */
    private int $quantity;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private \DateTimeImmutable $createdAt;

    /**
     * @ORM\ManyToOne(targetEntity="App\Domain\User\Entity\Maker")
     * @ORM\JoinColumn(nullable=false)
     */
    private Maker $maker;

    public function __construct(Order $order, Maker $maker, int $quantity)
    {
        $this->id = Uuid::uuid4()->toString();
        $this->order = $order;
        $this->maker = $maker;
        $this->quantity = $quantity;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getOrder(): Order
    {
        return $this->order;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getMaker(): Maker
    {
        return $this->maker;
    }

    public function setMaker(Maker $maker): void
    {
        $this->maker = $maker;
    }
}
