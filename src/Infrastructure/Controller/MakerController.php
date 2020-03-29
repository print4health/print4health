<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Exception\Maker\MakerNotFoundException;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Repository\MakerRepository;
use App\Infrastructure\Dto\Maker\MakerRequest;
use App\Infrastructure\Dto\Maker\MakerResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Doctrine\ORM\EntityManagerInterface;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class MakerController
{
    private SerializerInterface $serializer;
    private MakerRepository $makerRepository;
    private EntityManagerInterface $entityManager;
    private UserPasswordEncoderInterface $userPasswordEncoder;

    public function __construct(
        SerializerInterface $serializer,
        MakerRepository $makerRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $userPasswordEncoder
    ) {
        $this->serializer = $serializer;
        $this->makerRepository = $makerRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordEncoder = $userPasswordEncoder;
    }

    /**
     * @Route(
     *     "/maker",
     *     name="maker_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function listAction(): JsonResponse
    {
        $allMaker = $this->makerRepository->findAll();

        $response = ['maker' => []];

        foreach ($allMaker as $maker) {
            $response['maker'][] = MakerResponse::createFromMaker($maker);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/maker",
     *     name="maker_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function createAction(Request $request, ValidatorInterface $validator): JsonResponse
    {
        try {
            /** @var MakerRequest $makerRequest */
            $makerRequest = $this->serializer->deserialize($request->getContent(), MakerRequest::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $validator->validate($makerRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors, 'MakerCreateValidationError');
        }

        $maker = new Maker($makerRequest->email, $makerRequest->name);
        $maker->setPassword($this->userPasswordEncoder->encodePassword($maker, $makerRequest->password));
        $maker->setPostalCode($makerRequest->postalCode);
        $maker->setAddressCity($makerRequest->addressCity);
        $maker->setAddressState($makerRequest->addressState);
        $maker->setLatitude($makerRequest->latitude);
        $maker->setLongitude($makerRequest->longitude);

        $this->entityManager->persist($maker);
        $this->entityManager->flush();

        $makerResponse = MakerResponse::createFromMaker($maker);

        return new JsonResponse(['maker' => $makerResponse], 201);
    }

    /**
     * @Route(
     *     "/maker/{uuid}",
     *     name="maker_show",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function showAction(string $uuid): JsonResponse
    {
        try {
            $maker = $this->makerRepository->find(Uuid::fromString($uuid));
        } catch (MakerNotFoundException $exception) {
            throw new NotFoundHttpException('Maker not found');
        }

        $makerResponse = MakerResponse::createFromMaker($maker);

        return new JsonResponse(['maker' => $makerResponse]);
    }
}
