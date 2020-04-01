<?php

declare(strict_types=1);

namespace App\Domain\Thing\Entity;

use App\Domain\DateHelper;
use App\Domain\Order\Entity\Order;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Domain\Thing\Repository\ThingRepository")
 */
class Thing
{
    /**
     * @ORM\Id()
     * @ORM\Column(type="guid")
     */
    private string $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $name;

    /**
     * @ORM\Column(type="text")
     */
    private string $description;

    /**
     * @ORM\Column(type="text")
     */
    private string $specification;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $url;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $imageUrl;

    /**
     * @var Collection<int, Order>
     * @ORM\OneToMany(targetEntity="App\Domain\Order\Entity\Order", mappedBy="thing")
     */
    private $orders;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private DateTimeImmutable $createdDate;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private DateTimeImmutable $updatedDate;

    public function __construct(
        string $name,
        string $imageUrl,
        string $url,
        string $description,
        string $specification
    ) {
        $this->name = $name;
        $this->id = Uuid::uuid4()->toString();
        $this->orders = new ArrayCollection();
        $this->imageUrl = $imageUrl;
        $this->url = $url;
        $this->description = $description;
        $this->specification = $specification;
        $this->createdDate = DateHelper::create();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Order[]
     */
    public function getOrders(): array
    {
        return $this->orders->toArray();
    }

    public function addOrder(Order $order): self
    {
        if (!$this->orders->contains($order)) {
            $this->orders[] = $order;
            $order->setThing($this);
        }

        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getUrl(): string
    {
        return $this->url;
    }

    public function getImageUrl(): string
    {
        return $this->imageUrl;
    }

    public function getSpecification(): string
    {
        return $this->specification;
    }

    public function updateUpdatedDate(): void
    {
        $this->updatedDate = DateHelper::create();
    }
}
