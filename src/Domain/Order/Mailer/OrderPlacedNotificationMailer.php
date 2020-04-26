<?php

declare(strict_types=1);

namespace App\Domain\Order\Mailer;

use App\Domain\Order\Entity\Order;
use App\Domain\Order\Exception\EmailNotSendException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class OrderPlacedNotificationMailer
{
    private MailerInterface $mailer;
    private Environment $twig;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig
    ) {
        $this->mailer = $mailer;
        $this->twig = $twig;
    }

    public function send(Order $order): void
    {
        $mailBody = $this->twig->render(
            '/email/order/order_placed_notification.html.twig',
            ['order' => $order]
        );

        $email = new Email();
        $requester = $order->getRequester();

        $email->subject('Bestellung wurde eingetragen')
            ->html($mailBody)
            ->to($requester->getEmail())
            ->from('hallo@welt123.de')
        ;

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $transportException) {
            throw new EmailNotSendException();
        }
    }
}
