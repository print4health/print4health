<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Exception\NotFoundException;
use App\Domain\PasswordRecovery\Mailer as PasswordRecoveryMailer;
use App\Domain\Requester\Mailer;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Repository\UserRepository;
use App\Domain\User\UserInterface;
use App\Domain\User\UserInterfaceRepository;
use App\Infrastructure\Dto\User\ResetPassword;
use App\Infrastructure\Dto\User\ResetPasswordTokenRequest;
use App\Infrastructure\Dto\User\UserResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Ramsey\Uuid\Exception\InvalidUuidStringException;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Validator\Validation;
use Twig\Environment;

class SecurityController
{
    private UserRepository $userRepository;

    private UserPasswordEncoderInterface $passwordEncoder;

    private Environment $twig;

    private RouterInterface $router;

    private Security $security;

    public function __construct(
        UserRepository $userRepository,
        UserPasswordEncoderInterface $passwordEncoder,
        Environment $twig,
        RouterInterface $router,
        Security $security
    ) {
        $this->userRepository = $userRepository;
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
     *     @Model(type=UserResponse::class)
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

        /** @var UserInterface|null $user */
        $user = $this->security->getUser();
        if (null === $user) {
            throw new NotFoundHttpException('User is empty');
        }

        $userDto = UserResponse::createFromUser($user);

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
        UserInterfaceRepository $userRepositoryWrapper
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
            throw new ValidationErrorException($violations, 'RequestPasswordResetValidationError');
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
    public function resetPassword(Request $request, UserInterfaceRepository $userRepositoryWrapper): JsonResponse
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
            throw new ValidationErrorException($violations, 'ResetPasswordResetValidationError');
        }

        try {
            $user = $userRepositoryWrapper->findByPasswordResetToken($resetPassword->token);
        } catch (NotFoundException $exception) {
            return new JsonResponse(['errors' => [$exception->getMessage()]], 404);
        }

        $user->setPassword($this->passwordEncoder->encodePassword($user, $resetPassword->password));
        $user->erasePasswordResetToken();

        $userRepositoryWrapper->save($user);

        return new JsonResponse(['status' => 'ok']);
    }

    /**
     * @Route(
     *     "/user/{uuid}/enable",
     *     name="security_user_enable",
     *     methods={"PATCH"},
     *     format="json"
     * )
     * @SWG\Tag(name="User")
     * @SWG\Response(
     *     response=200,
     *     description="User enabled successfully"
     * )
     * @SWG\Response(
     *     response=304,
     *     description="User was already enabled"
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed Uuid"
     * )
     * @SWG\Response(
     *     response=404,
     *     description="User not found"
     * )
     * @IsGranted("ROLE_ADMIN")
     */
    public function enableUser(
        Request $request,
        UserInterfaceRepository $userRepositoryWrapper,
        Mailer $mailer
    ): JsonResponse {
        $uuid = $request->get('uuid');
        try {
            $user = $userRepositoryWrapper->find(Uuid::fromString($uuid));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException(sprintf('User with id [%s] not found', $uuid));
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Parameter [%s] is not a valid uuid', $uuid));
        }

        if ($user->isEnabled()) {
            return new JsonResponse([
                'user' => [
                    'id' => $uuid,
                    'enabled' => $user->isEnabled(),
                ],
            ], Response::HTTP_NOT_MODIFIED);
        }

        $user->enable();
        $userRepositoryWrapper->save($user);

        if ($user instanceof Requester) {
            $mailer->sendEnabledNotificationToRequester($user);
        }

        return new JsonResponse([
            'user' => [
                'id' => $uuid,
                'enabled' => $user->isEnabled(),
            ],
        ]);
    }

    /**
     * @Route(
     *     "/user/{uuid}/disable",
     *     name="security_user_disable",
     *     methods={"PATCH"},
     *     format="json"
     * )
     * @SWG\Tag(name="User")
     * @SWG\Response(
     *     response=200,
     *     description="User disabled successfully"
     * )
     * @SWG\Response(
     *     response=304,
     *     description="User was already disabled"
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed Uuid"
     * )
     * @SWG\Response(
     *     response=404,
     *     description="User not found"
     * )
     * @IsGranted("ROLE_ADMIN")
     */
    public function disableUser(string $uuid, UserInterfaceRepository $userRepositoryWrapper): JsonResponse
    {
        try {
            $user = $userRepositoryWrapper->find(Uuid::fromString($uuid));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException(sprintf('User with id [%s] not found', $uuid));
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Parameter [%s] is not a valid uuid', $uuid));
        }

        if (false === $user->isEnabled()) {
            return new JsonResponse([
                'user' => [
                    'id' => $uuid,
                    'enabled' => $user->isEnabled(),
                ],
            ], Response::HTTP_NOT_MODIFIED);
        }

        $user->disable();
        $userRepositoryWrapper->save($user);

        return new JsonResponse([
            'user' => [
                'id' => $uuid,
                'enabled' => $user->isEnabled(),
            ],
        ]);
    }
}
