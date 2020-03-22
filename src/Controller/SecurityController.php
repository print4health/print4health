<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ResetPassword;
use App\Dto\ResetPasswordTokenRequest;
use App\Dto\User as UserDto;
use App\Entity\User\UserInterface;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\Router;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Validation;
use Twig\Environment;

class SecurityController
{
    private UserRepository $userRepository;
    private EntityManagerInterface $entityManager;
    private UserPasswordEncoderInterface $passwordEncoder;
    private MailerInterface $mailer;
    private Environment $twig;
    private RouterInterface $router;
    private Security $security;

    public function __construct(
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $passwordEncoder,
        MailerInterface $mailer,
        Environment $twig,
        RouterInterface $router,
        Security $security
    ) {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->router = $router;
        $this->security = $security;
    }

    /**
     * @Route(
     *     "/login",
     *     name="security_login",
     *     methods={"POST"},
     *     format="json",
     * )
     * @SWG\Parameter(
     *     name="credentials",
     *     in="body",
     *     type="json",
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Property(property="email", type="string"),
     *         @SWG\Property(property="password", type="string")
     *     )
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Login successfull",
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Items(ref=@Model(type=UserDto::class))
     *     )
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request or wrong content type"
     * )
     * @SWG\Response(
     *     response=401,
     *     description="Invalid credentials"
     * )
     */
    public function login(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        /** @var UserInterface $user */
        $user = $this->security->getUser();

        $userDto = UserDto::createFromUser($user);

        return new JsonResponse($userDto);
    }

    /**
     * @Route(
     *     "/logout",
     *     name="security_logout",
     *     methods={"GET"}
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Logout successfull",
     * )
     */
    public function logout(): RedirectResponse
    {
        $token = $this->security->getToken();
        if (null === $token) {
            return new RedirectResponse($this->router->generate('home'));
        }
        $token->setAuthenticated(false);

        return new RedirectResponse($this->router->generate('home'));
    }

    /**
     * @Route(
     *     "/request-password-reset",
     *     name="security_request_password_reset",
     *     methods={"POST"},
     *     format="json"
     * )
     * @SWG\Parameter(
     *     name="email",
     *     in="body",
     *     type="json",
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Property(property="email", type="string")
     *     )
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Reset token successfully sent via email"
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request, wrong content type or email not found"
     * )
     */
    public function requestPasswordReset(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        $content = (string) $request->getContent();
        $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
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

            return new JsonResponse(['errors' => $errors], 400);
        }

        /** @var UserInterface|null $user */
        $user = $this->userRepository->findOneByEmail($resetPasswordTokenRequest->email);
        if (null === $user) {
            return new JsonResponse(['errors' => ['User not found']], 400);
        }

        $user->createPasswordResetToken();
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        $url = $this->router->generate('home', ['token' => $user->getPasswordResetToken()], Router::ABSOLUTE_URL);
        $body = $this->twig->render('email/password_reset.txt.twig', ['url' => $url]);
        $email = (new Email())
            ->from('noreply@print4health.org')
            ->to($resetPasswordTokenRequest->email)
            ->subject('print4health Passwort zurücksetzen')
            ->html($body)
        ;

        $this->mailer->send($email);

        return new JsonResponse(['status' => 'ok']);
    }

    /**
     * @Route(
     *     "/reset-password",
     *     name="security_reset_password",
     *     methods={"POST"},
     *     format="json"
     * )
     * @SWG\Parameter(
     *     name="password",
     *     in="body",
     *     type="json",
     *     @SWG\Schema(
     *         type="object",
     *         @SWG\Property(property="token", type="string"),
     *         @SWG\Property(property="password", type="string")
     *     )
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Password successfully"
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request, wrong content type or token expired"
     * )
     */
    public function resetPassword(Request $request): JsonResponse
    {
        if ('json' !== $request->getContentType()) {
            throw new BadRequestHttpException();
        }

        $content = (string) $request->getContent();
        $data = json_decode($content, true, 512, JSON_THROW_ON_ERROR);
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

            return new JsonResponse(['errors' => $errors], 400);
        }

        /** @var UserInterface|null $user */
        $user = $this->userRepository->findOneByPasswordResetToken($resetPassword->token);
        if (null === $user) {
            return new JsonResponse(['errors' => ['Invalid Token']], 400);
        }

        $user->setPassword($this->passwordEncoder->encodePassword($user, $resetPassword->password));
        $user->erasePasswordResetToken();
        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return new JsonResponse(['status' => 'ok']);
    }
}
