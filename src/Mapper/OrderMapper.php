<?php

declare(strict_types=1);

namespace App\Mapper;

use App\Dto\Order as OrderDto;
use App\Entity\Order;

class OrderMapper implements MapperInterface
{
    public function map(Order $order): OrderDto
    {
        $orderDto = new OrderDto();
    }
}
