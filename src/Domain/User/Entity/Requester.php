<?php

declare(strict_types=1);

namespace App\Domain\User\Entity;

use App\Domain\DateHelper;
use App\Domain\Order\Entity\Order;
use App\Domain\User\UserInterface;
use DateTimeImmutable;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Domain\User\Repository\RequesterRepository")
 */
class Requester implements UserInterface
{
    public const ROLE_REQUESTER = 'ROLE_REQUESTER';

    /**
     * @ORM\Column(type="guid")
     * @ORM\Id
     */
    private string $id;

    /**
     * @ORM\Column(unique=true)
     */
    private string $email;

    /**
     * @var string[]
     * @ORM\Column(type="json")
     */
    private array $roles = [];

    /**
     * @ORM\Column
     */
    private string $password;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private ?string $passwordResetToken = null;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private ?DateTimeImmutable $passwordResetTokenCreatedAt;

    /**
     * @var Collection<int, Order>
     * @ORM\OneToMany(targetEntity="App\Domain\Order\Entity\Order", mappedBy="requester", orphanRemoval=true)
     */
    private $orders;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private string $name;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $addressStreet = null;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $postalCode = null;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $addressCity = null;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private ?string $addressState = null;

    /**
     * @ORM\Column(name="latitude", type="decimal", precision=20, scale=16, nullable=true)
     */
    private ?float $latitude = null;

    /**
     * @ORM\Column(name="longitude", type="decimal", precision=20, scale=16, nullable=true)
     */
    private ?float $longitude = null;

    /**
     * @ORM\Column(name="hub", type="boolean", nullable=true)
     */
    private ?bool $hub = false;

    /**
     * @var float[]
     * @ORM\Column(name="area", type="json_array", nullable=true)
     */
    private ?array $area = null;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private DateTimeImmutable $createdDate;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private ?DateTimeImmutable $updatedDate;

    public function __construct(string $email, string $name)
    {
        $this->email = $email;
        $this->name = $name;
        $this->id = Uuid::uuid4()->toString();
        $this->orders = new ArrayCollection();
        $this->createdDate = DateHelper::create();
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getEmail(): string
    {
        return (string) $this->email;
    }

    public function getUsername(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = User::ROLE_USER;
        $roles[] = self::ROLE_REQUESTER;

        return array_unique($roles);
    }

    /**
     * @param string[] $roles
     *
     * @return $this
     */
    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return (string) $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getSalt(): string
    {
        return '';
    }

    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function createPasswordResetToken(): void
    {
        $this->passwordResetToken = Uuid::uuid4()->toString();
        $this->passwordResetTokenCreatedAt = new DateTimeImmutable();
    }

    public function erasePasswordResetToken(): void
    {
        $this->passwordResetToken = null;
        $this->passwordResetTokenCreatedAt = null;
    }

    public function getPasswordResetToken(): ?string
    {
        return $this->passwordResetToken;
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
            $order->setRequester($this);
        }

        return $this;
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

    public function getAddressStreet(): ?string
    {
        return $this->addressStreet;
    }

    public function setAddressStreet(?string $addressStreet): self
    {
        $this->addressStreet = $addressStreet;

        return $this;
    }

    public function getPostalCode(): ?string
    {
        return $this->postalCode;
    }

    public function setPostalCode(?string $postalCode): self
    {
        $this->postalCode = $postalCode;

        return $this;
    }

    public function getAddressCity(): ?string
    {
        return $this->addressCity;
    }

    public function setAddressCity(?string $addressCity): self
    {
        $this->addressCity = $addressCity;

        return $this;
    }

    public function getAddressState(): ?string
    {
        return $this->addressState;
    }

    public function setAddressState(?string $addressState): void
    {
        $this->addressState = $addressState;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): void
    {
        $this->latitude = $latitude;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): void
    {
        $this->longitude = $longitude;
    }

    public function isHub(): ?bool
    {
        return $this->hub;
    }

    public function setHub(?bool $hub): void
    {
        $this->hub = $hub;
    }

    /**
     * @return array[]
     */
    public function getArea(): ?array
    {
        return $this->area;
    }

    /**
     * @param float[] $area
     */
    public function setArea(?array $area): void
    {
        $this->area = $area;
    }

    public function updateUpdatedDate(): void
    {
        $this->updatedDate = DateHelper::create();
    }

    public function getCreatedDate(): DateTimeImmutable
    {
        return $this->createdDate;
    }

    public function getUpdatedDate(): ?DateTimeImmutable
    {
        return $this->updatedDate;
    }
}
