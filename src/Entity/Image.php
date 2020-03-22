<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ImageRepository")
 */
class Image
{
    /**
     * @ORM\Id
     * @ORM\Column(type="guid")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $filename;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Thing", mappedBy="image")
     */
    private $things;

    public function __construct(string $filename)
    {
        $this->id = Uuid::uuid4();
        $this->filename = $filename;
        $this->things = new ArrayCollection();
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getFilename(): ?string
    {
        return $this->filename;
    }

    public function setFilename(string $filename): self
    {
        $this->filename = $filename;

        return $this;
    }

    /**
     * @return Collection|Thing[]
     */
    public function getThings(): Collection
    {
        return $this->things->toArray();
    }

    public function addThing(Thing $thing): self
    {
        if (!$this->things->contains($thing)) {
            $this->things[] = $thing;
            $thing->setImage($this);
        }

        return $this;
    }

    public function removeThing(Thing $thing): self
    {
        if ($this->things->contains($thing)) {
            $this->things->removeElement($thing);
            // set the owning side to null (unless already changed)
            if ($thing->getImage() === $this) {
                $thing->setImage(null);
            }
        }

        return $this;
    }
}
