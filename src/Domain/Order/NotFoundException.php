<?php

declare(strict_types=1);

namespace App\Domain\Order;

use App\Domain\Exception\NotFoundException as DomainNotFoundException;

class NotFoundException extends DomainNotFoundException
{
    public function __construct(string $orderId)
    {
        parent::__construct(sprintf('order with ID: "%s" not found', $orderId));
    }
}
