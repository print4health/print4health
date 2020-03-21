<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ResetPassword;
use App\Dto\ResetPasswordTokenRequest;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Router;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Validator\Validation;
use Twig\Environment;

class SecurityController extends AbstractController
{
    private UserRepository $userRepository;
    private EntityManagerInterface $entityManager;
    private UserPasswordEncoderInterface $passwordEncoder;
    private MailerInterface $mailer;
    private Environment $twig;
    private RouterInterface $router;

    public function __construct(
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $passwordEncoder,
        MailerInterface $mailer,
        Environment $twig,
        RouterInterface $router
    ) {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->router = $router;
    }

    /**
     * @Route("/login", name="security_login", methods={"POST"})
     */
    public function login(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }

    /**
     * @Route("/request-password-reset", name="security_request_password_reset", methods={"POST"})
     */
    public function requestPasswordReset(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        $data = json_decode($request->getContent(), true);
        if (null === $data) {
            throw new BadRequestHttpException();
        }

        $resetPasswordTokenRequest = new ResetPasswordTokenRequest();
        $resetPasswordTokenRequest->email = $data['email'] ?? '';

        $validator = Validation::createValidatorBuilder()
            ->enableAnnotationMapping()
            ->getValidator()
        ;
        $violations = $validator->validate($resetPasswordTokenRequest);

        if ($violations->count() > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                /** @var ConstraintViolation $violation */
                if (\is_string($violation->getMessage())) {
                    $errors[] = sprintf('%s', $violation->getMessage());
                }
            }

            return $this->json(['errors' => $errors], 400);
        }

        /** @var User $user */
        $user = $this->userRepository->findOneByEmail($resetPasswordTokenRequest->email);
        if (null === $user) {
            return $this->json(['errors' => ['User not found']], 400);
        }

        $user->createPasswordResetToken();
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $url = $this->router->generate('home', ['token' => $user->getPasswordResetToken()], Router::ABSOLUTE_URL);
        $body = $this->twig->render('email/password_reset.txt.twig', ['url' => $url]);
        $email = (new Email())
            ->from('noreply@print4health.org')
            ->to($resetPasswordTokenRequest->email)
            ->subject('Print4Health Passwort zurücksetzen')
            ->html($body)
        ;

        $this->mailer->send($email);

        return $this->json(['OK']);
    }

    /**
     * @Route("/reset-password", name="security_reset_password", methods={"POST"})
     */
    public function resetPassword(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        $data = json_decode($request->getContent(), true);
        if (null === $data) {
            throw new BadRequestHttpException();
        }

        $resetPassword = new ResetPassword();
        $resetPassword->token = $data['token'] ?? '';
        $resetPassword->password = $data['password'] ?? '';

        $validator = Validation::createValidatorBuilder()
            ->enableAnnotationMapping()
            ->getValidator()
        ;
        $violations = $validator->validate($resetPassword);

        if ($violations->count() > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                /** @var ConstraintViolation $violation */
                if (\is_string($violation->getMessage())) {
                    $errors[] = sprintf('%s', $violation->getMessage());
                }
            }

            return $this->json(['errors' => $errors], 400);
        }

        /** @var User $user */
        $user = $this->userRepository->findOneByPasswordResetToken($resetPassword->token);
        if (null === $user) {
            return $this->json(['errors' => ['Invalid Token']], 400);
        }

        $user->setPassword($this->passwordEncoder->encodePassword($user, $resetPassword->password));
        $user->erasePasswordResetToken();
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json(['OK']);
    }
}
