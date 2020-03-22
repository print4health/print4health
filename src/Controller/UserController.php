<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\User as UserDto;
use App\Entity\User\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class UserController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @Route(
     *     "/user/profile",
     *     name="user_profile",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function profileAction(): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        $userDto = UserDto::createFromUser($user);

        return new JsonResponse($userDto);
    }
}
