<?php


namespace App\Domain\Order\Command;


use App\Domain\Order\Entity\Order;

class orderPlacedNotificationCommand
{
    private Order $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function getContent(): string
    {
        return $this->order;
    }
}
