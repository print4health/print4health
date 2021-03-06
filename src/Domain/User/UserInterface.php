<?php

declare(strict_types=1);

namespace App\Domain\User;

use Symfony\Component\Security\Core\User\UserInterface as CoreUserInterface;

interface UserInterface extends CoreUserInterface
{
    public function isEnabled(): bool;

    public function enable(): void;

    public function disable(): void;

    public function getId(): string;

    public function getEmail(): string;

    public function setPassword(string $password): self;

    public function getPassword(): string;

    public function createPasswordResetToken(): void;

    public function erasePasswordResetToken(): void;

    public function getPasswordResetToken(): ?string;

    public function getLatitude(): ?float;

    public function getLongitude(): ?float;
}
