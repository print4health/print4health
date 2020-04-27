<?php

declare(strict_types=1);

namespace App\Domain\Contact;

use App\Infrastructure\Dto\Contact\ContactRequest;
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

    public function send(ContactRequest $contactRequest, string $filePath = null, string $fileName = null): void
    {
        $mailBody = $this->twig->render(
            '/email/contact_form.html.twig',
            ['contactRequest' => $contactRequest]
        );

        $email = new Email();
        $email->subject($contactRequest->subject)
            ->html($mailBody)
            ->cc($contactRequest->email)
            ->to($this->contactEmail)
            ->from($this->contactEmail)
        ;

        if ($filePath !== null && $fileName !== null) {
            $fileContent = file_get_contents($filePath);
            if ($fileContent !== false) {
                $email->attach($fileContent, $fileName);
            }
        }

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $transportException) {
            throw new RuntimeException('E-Mail could not be send!', 0, $transportException);
        }
    }
}
