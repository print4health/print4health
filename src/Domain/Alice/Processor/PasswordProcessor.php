<?php

declare(strict_types=1);

namespace App\Domain\Alice\Processor;

use App\Domain\User\UserInterface;
use Fidry\AliceDataFixtures\ProcessorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordProcessor implements ProcessorInterface
{
    private UserPasswordEncoderInterface $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * Processes an object before it is persisted to DB.
     *
     * @param string $id     Fixture ID
     * @param object $object
     */
    public function preProcess(string $id, $object): void
    {
        if (!$object instanceof UserInterface) {
            return;
        }

        $password = $this->passwordEncoder->encodePassword($object, $object->getPassword());
        $object->setPassword($password);
    }

    /**
     * Processes an object after it is persisted to DB.
     *
     * @param string $id     Fixture ID
     * @param object $object
     */
    public function postProcess(string $id, $object): void
    {
    }
}
