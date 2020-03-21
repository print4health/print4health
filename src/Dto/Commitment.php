<?php

declare(strict_types=1);

namespace App\Dto;

class Commitment
{
    public string $id;
    public OrderOut $order;
    public int $quantity;
}
