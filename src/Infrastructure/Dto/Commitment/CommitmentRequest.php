<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Commitment;

use Swagger\Annotations as SWG;

class CommitmentRequest
{
    /** @SWG\Property(type="string") */
    public string $orderId;

    /** @SWG\Property(type="string") */
    public int $quantity;
}
