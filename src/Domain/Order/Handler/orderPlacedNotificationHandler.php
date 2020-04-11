<?php

namespace App\Domain\Order\Handler;

use App\Domain\Order\Entity\Order;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

class orderPlacedNotificationHandler implements MessageHandlerInterface
{
    public function __invoke(Order $order)
    {
        dump("Hallo Welt");
    }
}
