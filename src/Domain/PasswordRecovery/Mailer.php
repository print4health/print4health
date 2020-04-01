<?php

declare(strict_types=1);

namespace App\Domain\PasswordRecovery;

use App\Domain\User\UserInterface;
use App\Domain\User\UserRepositoryWrapper;
use RuntimeException;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Router;
use Symfony\Component\Routing\RouterInterface;
use Twig\Environment;

class Mailer
{
    private MailerInterface $mailer;

    private Environment $twig;

    private RouterInterface $router;

    private UserRepositoryWrapper $userRepositoryWrapper;

    private string $from;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
        RouterInterface $router,
        UserRepositoryWrapper $userRepositoryWrapper,
        string $from
    ) {
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->from = $from;
        $this->router = $router;
        $this->userRepositoryWrapper = $userRepositoryWrapper;
    }

    public function send(UserInterface $user): void
    {
        $user->createPasswordResetToken();
        $this->userRepositoryWrapper->save($user);

        $url = $this->router->generate('home', [], Router::ABSOLUTE_URL);
        $url .= '#/reset-password/' . $user->getPasswordResetToken();
        $body = $this->twig->render('email/password_reset.txt.twig', ['url' => $url]);
        $email = new Email();
        $email->from($this->from)
            ->to($user->getEmail())
            ->subject('print4health - Passwort zurücksetzen')
            ->html($body)
        ;

        try {
            $this->mailer->send($email);
        } catch (TransportExceptionInterface $transportException) {
            throw new RuntimeException('E-Mail could not be send!', 0, $transportException);
        }
    }
}
