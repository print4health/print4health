<?php

declare(strict_types=1);

namespace App\Infrastructure\Dto\User;

use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\UserInterface;
use App\Infrastructure\Dto\Maker\MakerResponse;
use App\Infrastructure\Dto\Requester\RequesterResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use Swagger\Annotations as SWG;

class OrderContactUserDetailResponse
{
    /**
     * @SWG\Property(
     *     type="array",
     *     required="false",
     *     @SWG\Items(ref=@Model(type=MakerResponse::class))
     * )
     */
    public ?MakerResponse $maker;

    /**
     * @SWG\Property(
     *     type="array",
     *     required="false",
     *     @SWG\Items(ref=@Model(type=RequesterResponse::class))
     * )
     */
    public ?RequesterResponse $requester;

    public static function createFromUserInterface(UserInterface $user): self
    {
        $self = new self();
        if ($user instanceof Maker) {
            $self->maker = MakerResponse::createFromMaker($user);
        }
        if ($user instanceof Requester) {
            $self->requester = RequesterResponse::createFromRequester($user);
        }

        return $self;
    }
}
