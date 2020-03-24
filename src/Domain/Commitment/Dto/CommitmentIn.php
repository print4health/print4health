<?php

declare(strict_types=1);

namespace App\Domain\Commitment\Dto;

class CommitmentIn
{
    public string $orderId;
    public int $quantity;
}
