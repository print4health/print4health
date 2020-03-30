<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\PasswordRecovery\Mailer as PasswordRecoveryMailer;
use App\Domain\User\NotFoundException;
use App\Domain\User\Repository\UserRepository;
use App\Domain\User\UserInterface;
use App\Domain\User\UserRepositoryWrapper;
use App\Infrastructure\Dto\User\ResetPassword;
use App\Infrastructure\Dto\User\ResetPasswordTokenRequest;
use App\Infrastructure\Dto\User\User as UserDto;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
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

    private Environment $twig;

    private RouterInterface $router;

    private Security $security;

    public function __construct(
        UserRepository $userRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $passwordEncoder,
        Environment $twig,
        RouterInterface $router,
        Security $security
    ) {
        $this->userRepository = $userRepository;
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
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
     *     @Model(type=UserDto::class)
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
            throw new BadRequestHttpException('Content-Type is\'nt "application/json".');
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
    public function requestPasswordReset(
        Request $request,
        PasswordRecoveryMailer $mailer,
        UserRepositoryWrapper $userRepositoryWrapper
    ): JsonResponse {
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

        try {
            $user = $userRepositoryWrapper->findByEmail($resetPasswordTokenRequest->email);
        } catch (NotFoundException $exception) {
            return new JsonResponse(['errors' => ['User not found']], 400);
        }

        $mailer->send($user);

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
    public function resetPassword(Request $request, UserRepositoryWrapper $userRepositoryWrapper): JsonResponse
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
        $user = $userRepositoryWrapper->findByPasswordResetToken($resetPassword->token);
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
