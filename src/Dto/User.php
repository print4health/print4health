<?php

declare(strict_types=1);

namespace App\Dto;

class User
{
    public string $id;
    public string $username;

    public static function createFromUser(\App\Entity\User $user): self
    {
        $self = new self();

        $self->id = $user->getId();
        $self->username = $user->getUsername();

        return $self;
    }
}
