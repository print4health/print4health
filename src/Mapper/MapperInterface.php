<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Dto\Order as OrderDto;
use App\Entity\Order;

interface MapperInterface
{
    public function map(Order $order): OrderDto;
}
