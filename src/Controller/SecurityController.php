<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class SecurityController extends AbstractController
{
    private Security $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @Route("/login", name="security_login", methods={"POST"})
     */
    public function login()
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }

    /**
     * @Route("/logout", name="security_logout", methods={"GET"})
     */
    public function logout()
    {
        $this->security->getToken()->setAuthenticated(false);

        return $this->redirect('/');
    }
}
