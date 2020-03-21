<?php

declare(strict_types=1);

namespace App\Dto;

use Doctrine\ORM\EntityNotFoundException;

class Thing
{
    public string $id;
    public string $name;

    public static function createFromThing(?\App\Entity\Thing $thing): self
    {
        if (!$thing instanceof \App\Entity\Thing) {
            throw new EntityNotFoundException('Thing is empty');
        }

        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();

        return $self;
    }
}
