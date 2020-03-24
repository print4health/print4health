<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\User\Dto\User as UserDto;
use App\Domain\User\Entity\User;
use Nelmio\ApiDocBundle\Annotation\Model;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
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
     * @SWG\Response(
     *     response=200,
     *     description="Current authenticated user",
     *     @Model(type=UserDto::class)
     * )
     * @SWG\Response(
     *     response=401,
     *     description="User not authenticated"
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
