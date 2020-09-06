<?php

declare(strict_types=1);

namespace App\Infrastructure\Security;

use App\Infrastructure\Dto\User\UserResponse;
use App\Domain\User\UserInterface as DomainUserInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\UsernameNotFoundException;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Guard\AbstractGuardAuthenticator;
use UnexpectedValueException;
use function get_class;
use function gettype;
use function is_object;

class LoginAuthenticator extends AbstractGuardAuthenticator
{
    private UserPasswordEncoderInterface $encoder;
    private LoggerInterface $logger;

    public function __construct(
        UserPasswordEncoderInterface $encoder,
        LoggerInterface $logger
    ) {
        $this->encoder = $encoder;
        $this->logger = $logger;
    }

    public function supports(Request $request): bool
    {
        return
            $request->isMethod('POST') === true &&
            $request->getContentType() === 'json' && // why not?: application/json
            $request->getPathInfo() === '/login';
    }

    public function getCredentials(Request $request): LoginRequest
    {
        return LoginRequest::fromArray($this->getBody($request));
    }

    /**
     * @param mixed $credentials
     */
    public function getUser($credentials, UserProviderInterface $userProvider): UserInterface
    {
        if ($credentials instanceof LoginRequest === false) {
            throw new UnexpectedValueException(sprintf(
                'Unexpected $credentials class [%s] detected. Need [%s]',
                is_object($credentials) ? get_class($credentials) : gettype($credentials),
                LoginRequest::class
            ));
        }

        try {
            $user = $userProvider->loadUserByUsername($credentials->getEmail());
        } catch (UsernameNotFoundException $exception) {
            throw new AuthenticationException('No User found.');
        }

        return $user;
    }

    /**
     * @param mixed $credentials
     * @param UserInterface $user
     */
    public function checkCredentials($credentials, UserInterface $user): bool
    {
        if ($credentials instanceof LoginRequest === false) {
            throw new UnexpectedValueException(sprintf(
                'Unexpected $credentials class [%s] detected. Need [%s]',
                is_object($credentials) ? get_class($credentials) : gettype($credentials),
                LoginRequest::class
            ));
        }
        if ($user instanceof DomainUserInterface === false) {
            $this->logger->critical('Authentication successful but wrong user class!');

            throw new UnexpectedValueException(sprintf(
                'Unexpected user class [%s] detected. Need [%s]',
                get_class($user),
                DomainUserInterface::class
            ));
        }

        if ($this->encoder->isPasswordValid($user, $credentials->getPassword()) === false) {
            $this->logger->error('Wrong password given.');

            return false;
        }

        if ($user->isEnabled() === false) {
            $this->logger->error('User is not enabled.');

            return false;
        }

        return true;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $this->logger->error('Authentication failed');

        return new JsonResponse(
            [
                'code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'Authentication failed.',
                'data' => null,
            ],
            Response::HTTP_UNAUTHORIZED
        );
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $providerKey): ?Response
    {
        $this->logger->debug('Authentication successful');

        $user = $token->getUser();

        if ($user instanceof DomainUserInterface === false) {
            $this->logger->critical('Authentication successful but wrong user class!');

            throw new UnexpectedValueException(sprintf(
                'Unexpected user class [%s] detected. Need [%s]',
                is_object($user) ? get_class($user) : gettype($user),
                \App\Domain\User\UserInterface::class
            ));
        }

        return new JsonResponse(UserResponse::createFromUser($user));

        /* var User $user
        $user = $token->getUser();

        $jwt = $this->jwtEncoder->encode(
            [
                'roles' => $user->getRoles(),
                'username' => $user->getUsername(),
            ]
        );

        return new JsonResponse(
            [
                'code' => Response::HTTP_OK,
                'message' => 'Authentication successful.',
                'data' => [
                    'token' => $jwt,
                ],
            ],
            Response::HTTP_OK
        );
        */
    }

    public function supportsRememberMe(): bool
    {
        return false;
    }

    public function start(Request $request, AuthenticationException $authException = null): Response
    {
        return new JsonResponse(
            [
                'code' => Response::HTTP_UNAUTHORIZED,
                'message' => 'Authentication required.',
                'data' => null,
            ],
            Response::HTTP_UNAUTHORIZED
        );
    }

    /**
     * @return array<mixed, mixed>
     */
    private function getBody(Request $request): array
    {
        /** @var string $content */
        $content = $request->getContent();

        return json_decode($content, true, 512, JSON_THROW_ON_ERROR);
    }
}
