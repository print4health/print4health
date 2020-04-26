<?php

declare(strict_types=1);

namespace App\Domain\Order\Command;

use App\Domain\Order\Entity\Order;

class OrderPlacedNotificationCommand
{
    private Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getContent(): Order
    {
        return $this->order;
    }
}
