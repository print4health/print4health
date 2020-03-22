<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Thing;
use Doctrine\ORM\EntityNotFoundException;

class ThingOut
{
    public string $id;
    public string $name;
    public string $description;
    public string $url;
    public string $imageUrl;

    public static function createFromThing(?Thing $thing): self
    {
        if (!$thing instanceof Thing) {
            throw new EntityNotFoundException('Thing is empty');
        }

        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();
        $self->imageUrl = $thing->getImageUrl();
        $self->url = $thing->getUrl();
        $self->description = $thing->getDescription();

        return $self;
    }
}
