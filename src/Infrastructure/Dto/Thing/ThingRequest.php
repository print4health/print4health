<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Thing;

class ThingRequest
{
    public string $name;
    public string $imageUrl;
    public string $url;
    public string $description;
    public string $specification;
}
