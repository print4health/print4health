<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Thing;

use Swagger\Annotations as SWG;
use Symfony\Component\Validator\Constraints as Assert;

class ThingRequest
{
    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     */
    public string $name;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Url
     */
    public string $imageUrl;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     * @Assert\Url
     */
    public string $url;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     */
    public string $description;

    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank
     */
    public string $specification;
}
