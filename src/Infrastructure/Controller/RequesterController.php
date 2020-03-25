<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Infrastructure\Dto\Requester\RequesterRequest;
use App\Infrastructure\Dto\Requester\RequesterResponse;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Repository\RequesterRepository;
use Doctrine\ORM\EntityManagerInterface;
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

class RequesterController
{
    private SerializerInterface $serializer;
    private RequesterRepository $requesterRepository;
    private EntityManagerInterface $entityManager;
    private UserPasswordEncoderInterface $userPasswordEncoder;

    public function __construct(
        SerializerInterface $serializer,
        RequesterRepository $requesterRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $userPasswordEncoder
    ) {
        $this->serializer = $serializer;
        $this->requesterRepository = $requesterRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordEncoder = $userPasswordEncoder;
    }

    /**
     * @Route(
     *     "/requester",
     *     name="requester_list",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function listAction(): JsonResponse
    {
        $allRequester = $this->requesterRepository->findAll();

        $response = ['requester' => []];

        foreach ($allRequester as $requester) {
            $response['requester'][] = RequesterResponse::createFromRequester($requester);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/requester",
     *     name="requester_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function createAction(Request $request): JsonResponse
    {
        try {
            /** @var RequesterRequest $RequesterRequest */
            $RequesterRequest = $this->serializer->deserialize($request->getContent(), RequesterRequest::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $requester = new Requester($RequesterRequest->email, $RequesterRequest->name);
        $requester->setPassword($this->userPasswordEncoder->encodePassword($requester, $RequesterRequest->password));
        $requester->setStreetAddress($RequesterRequest->streetAddress);
        $requester->setPostalCode($RequesterRequest->postalCode);
        $requester->setAddressCity($RequesterRequest->addressCity);
        $requester->setAddressState($RequesterRequest->addressState);
        $requester->setLatitude($RequesterRequest->latitude);
        $requester->setLongitude($RequesterRequest->longitude);

        $this->entityManager->persist($requester);
        $this->entityManager->flush();

        $RequesterResponse = RequesterResponse::createFromRequester($requester);

        return new JsonResponse(['requester' => $RequesterResponse], 201);
    }

    /**
     * @Route(
     *     "/requester/{uuid}",
     *     name="requester_show",
     *     methods={"GET"},
     *     format="json"
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        $requester = $this->requesterRepository->find($uuid);

        if (null === $requester) {
            throw new NotFoundHttpException('Requester not found');
        }

        $RequesterResponse = RequesterResponse::createFromRequester($requester);

        return new JsonResponse(['requester' => $RequesterResponse]);
    }
}
