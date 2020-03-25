<?php

declare(strict_types=1);

namespace App\Domain\Order\Dto;

use Swagger\Annotations as SWG;

class OrderIn
{
    /** @SWG\Property(type="string") */
    public string $thingId;
    /** @SWG\Property(type="string") */
    public int $quantity;
}
