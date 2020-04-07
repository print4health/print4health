<?php

declare(strict_types=1);

namespace App\Domain\Requester;

use App\Domain\User\Entity\Requester;
use RuntimeException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

class Mailer
{
    private MailerInterface $mailer;

    private Environment $twig;

    private string $contactEmail;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
        string $contactEmail
    ) {
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->contactEmail = $contactEmail;
    }

    public function sendNewRegistrationNotificationToAdmins(Requester $requester): void
    {
        $mailBody = $this->twig->render(
            '/email/requester/requester-registered.html.twig',
            ['requester' => $requester]
        );

        $email = new Email();
        $email->subject('Neue Requester Registrierung')
            ->html($mailBody)
            ->to($this->contactEmail)
            ->from($this->contactEmail);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $transportException) {
            throw new RuntimeException('E-Mail could not be send!', 0, $transportException);
        }
    }

    public function sendEnabledNotificationToRequester(Requester $requester): void
    {
        $mailBody = $this->twig->render(
            '/email/requester/requester-enabled.html.twig',
            ['requester' => $requester]
        );

        $email = new Email();
        $email->subject('print4health - Dein Account wurde freigeschaltet.')
            ->html($mailBody)
            ->to($requester->getEmail())
            ->from($this->contactEmail);

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $transportException) {
            throw new RuntimeException('E-Mail could not be send!', 0, $transportException);
        }
    }
}
