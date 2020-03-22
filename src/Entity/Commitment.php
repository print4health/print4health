<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CommitmentRepository")
 */
class Commitment
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="guid")
     */
    private string $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Order")
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

    public function __construct(Order $order, int $quantity)
    {
        $this->id = Uuid::uuid4()->toString();
        $this->order = $order;
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
}
