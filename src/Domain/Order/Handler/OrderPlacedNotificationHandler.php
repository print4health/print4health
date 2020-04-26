<?php

declare(strict_types=1);

namespace App\Domain\Order\Handler;

use App\Domain\Order\Command\OrderPlacedNotificationCommand;
use App\Domain\Order\Mailer\OrderPlacedNotificationMailer;
use Symfony\Component\Messenger\Handler\MessageHandlerInterface;

class OrderPlacedNotificationHandler implements MessageHandlerInterface
{
    private OrderPlacedNotificationMailer $mailer;

    public function __construct(OrderPlacedNotificationMailer $mailer)
    {
        $this->mailer = $mailer;
    }

    public function __invoke(OrderPlacedNotificationCommand $command): void
    {
        $this->mailer->send($command->getContent());
    }
}
