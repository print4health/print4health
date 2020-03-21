<?php

declare(strict_types=1);

namespace App\Dto;

class Thing
{
    public string $id;
    public string $name;

    public static function createFromThing(\App\Entity\Thing $thing): self
    {
        $self = new self();

        $self->id = $thing->getId();
        $self->name = $thing->getName();

        return $self;
    }
}
