<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Repository\OrderRepository")
 * @ORM\Table(name="`order`")
 */
class Order
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="guid")
     */
    private string $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     */
    private User $user;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\Thing", inversedBy="orders")
     * @ORM\JoinColumn(nullable=false)
     */
    private Thing $thing;

    /**
     * @ORM\Column(type="integer")
     */
    private int $quantity;

    /**
     * @var Collection<int, Commitment>
     * @ORM\OneToMany(targetEntity="App\Entity\Commitment", mappedBy="order")
     */
    private $commitments;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private \DateTimeImmutable $createdAt;

    public function __construct(User $user, Thing $thing, int $quantity)
    {
        $this->id = Uuid::uuid4()->toString();
        $this->commitments = new ArrayCollection();
        $this->user = $user;
        $this->thing = $thing;
        $this->quantity = $quantity;
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getThing(): Thing
    {
        return $this->thing;
    }

    public function setThing(Thing $thing): self
    {
        $this->thing = $thing;

        return $this;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    /**
     * @return Commitment[]
     */
    public function getCommitments(): array
    {
        return $this->commitments->toArray();
    }

    public function getRemaining(): int
    {
        $commitmentCounts = 0;
        foreach ($this->getCommitments() as $commitment) {
            $commitmentCounts += $commitment->getQuantity();
        }

        return $this->quantity - $commitmentCounts;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }
}
