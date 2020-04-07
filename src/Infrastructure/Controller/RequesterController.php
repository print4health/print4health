<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\User\Entity\Requester;
use App\Domain\User\Repository\RequesterRepository;
use App\Infrastructure\Dto\Requester\RequesterRequest;
use App\Infrastructure\Dto\Requester\RequesterResponse;
use App\Infrastructure\Dto\ValidationError\ValidationErrorResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
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

class RequesterController
{
    private SerializerInterface $serializer;

    private RequesterRepository $requesterRepository;

    private UserPasswordEncoderInterface $userPasswordEncoder;

    private ValidatorInterface $validator;

    public function __construct(
        SerializerInterface $serializer,
        RequesterRepository $requesterRepository,
        UserPasswordEncoderInterface $userPasswordEncoder,
        ValidatorInterface $validator
    ) {
        $this->serializer = $serializer;
        $this->requesterRepository = $requesterRepository;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->validator = $validator;
    }

    /**
     * Retrieves the collection of Requester resources.
     *
     * @Route(
     *     "/requester",
     *     name="requester_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Requester")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Requester collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=RequesterResponse::class))
     *     )
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
     * Creates a Requester Resource.
     *
     * @Route(
     *     "/requester",
     *     name="requester_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Requester")
     *
     * @SWG\Parameter(
     *     name="requester",
     *     in="body",
     *     type="json",
     *     @Model(type=RequesterRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Requester successfully created",
     *     @Model(type=RequesterResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request"
     * )
     * @SWG\Response(
     *     response=401,
     *     description="Unauthorized"
     * )
     * @SWG\Response(
     *     response=422,
     *     description="Validation failed due to missing mandatory fields or invalid field data",
     *     @Model(type=ValidationErrorResponse::class)
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function createAction(Request $request): JsonResponse
    {
        try {
            /** @var RequesterRequest $requesterRequest */
            $requesterRequest = $this->serializer->deserialize(
                $request->getContent(),
                RequesterRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $this->validator->validate($requesterRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors, 'RequesterValidationError');
        }

        $requester = new Requester($requesterRequest->email, $requesterRequest->name, false);
        $requester->setPassword($this->userPasswordEncoder->encodePassword($requester, $requesterRequest->password));
        $requester->setAddressStreet($requesterRequest->addressStreet);
        $requester->setPostalCode($requesterRequest->postalCode);
        $requester->setAddressCity($requesterRequest->addressCity);
        $requester->setAddressState($requesterRequest->addressState);
        $requester->setLatitude($requesterRequest->latitude);
        $requester->setLongitude($requesterRequest->longitude);

        $this->requesterRepository->save($requester);

        $RequesterResponse = RequesterResponse::createFromRequester($requester);

        return new JsonResponse(['requester' => $RequesterResponse], 201);
    }

    /**
     * Retrieves a Requester resource.
     *
     * @Route(
     *     "/requester/{uuid}",
     *     name="requester_show",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Requester")
     *
     * @SWG\Response(
     *     response=200,
     *     description="A Requester",
     *     @Model(type=RequesterResponse::class)
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        $requester = $this->requesterRepository->find($uuid);

        if (null === $requester) {
            throw new NotFoundHttpException('Requester not found');
        }

        $RequesterResponse = RequesterResponse::createFromRequester($requester);

        return new JsonResponse($RequesterResponse);
    }
}
