<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Order;

use App\Infrastructure\Validator\ThingExists;
use Swagger\Annotations as SWG;
use Symfony\Component\Validator\Constraints as Assert;

class OrderRequest
{
    /**
     * @SWG\Property(type="string")
     * @Assert\NotBlank()
     * @Assert\Uuid()
     * @ThingExists()
     */
    public string $thingId;

    /**
     * @SWG\Property(type="string")
     * @Assert\GreaterThan(value="0")
     */
    public int $quantity;
}
