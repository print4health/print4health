<?php

declare(strict_types=1);

namespace App\Dto;

class Commitment
{
    private string $id;
    private OrderOut $order;
    private int $quantity;
}
