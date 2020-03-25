<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\Commitment;

class CommitmentRequest
{
    public string $orderId;
    public int $quantity;
}
