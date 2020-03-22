<?php

declare(strict_types=1);

namespace App\Dto;

use App\Entity\Image;

class ImageOut
{
    public string $filename;

    public static function createFromImage(Image $image): self
    {
        $self = new self();
        $self->filename = $image->getFilename();

        return $self;
    }
}
