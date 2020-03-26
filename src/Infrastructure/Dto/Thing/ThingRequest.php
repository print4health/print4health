<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Thing;

use Swagger\Annotations as SWG;

class ThingRequest
{
    /** @SWG\Property(type="string") */
    public string $name;

    /** @SWG\Property(type="string") */
    public string $imageUrl;

    /** @SWG\Property(type="string") */
    public string $url;

    /** @SWG\Property(type="string") */
    public string $description;

    /** @SWG\Property(type="string") */
    public string $specification;
}
