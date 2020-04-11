<?php
declare(strict_types=1);

namespace App\Domain\Order\Exception;

use App\Domain\DomainException;

class EmailNotSendException extends DomainException
{
    public function __construct()
    {
        parent::__construct(sprintf('E-Mail could not be send!', $orderId));
    }

}
