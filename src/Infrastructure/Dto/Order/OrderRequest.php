<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Order;

use Swagger\Annotations as SWG;

class OrderRequest
{
    /** @SWG\Property(type="string") */
    public string $thingId;

    /** @SWG\Property(type="string") */
    public int $quantity;
}
