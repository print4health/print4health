<?php declare(strict_types=1);

namespace App\Domain\Order;

class NotFoundException extends \RuntimeException implements \App\Domain\Exception\NotFoundException
{
    public function __construct(string $orderId)
    {
        parent::__construct(sprintf('order with ID: "%s" not found', $orderId));
    }
}
