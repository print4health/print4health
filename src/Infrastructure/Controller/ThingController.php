<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Exception\NotFoundException;
use App\Domain\Thing\Entity\Thing;
use App\Domain\Thing\Repository\ThingRepository;
use App\Infrastructure\Dto\Thing\ThingRequest;
use App\Infrastructure\Dto\Thing\ThingResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ThingController
{
    private SerializerInterface $serializer;

    private ThingRepository $thingRepository;

    public function __construct(
        SerializerInterface $serializer,
        ThingRepository $thingRepository
    ) {
        $this->serializer = $serializer;
        $this->thingRepository = $thingRepository;
    }

    /**
     * Retrieves the collection of Thing resources.
     *
     * @Route(
     *     "/things",
     *     name="thing_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Thing collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=ThingResponse::class))
     *     )
     * )
     */
    public function listAction(): JsonResponse
    {
        $things = $this->thingRepository->findAll();

        $response = ['things' => []];

        foreach ($things as $thing) {
            $response['things'][] = ThingResponse::createFromThing($thing);
        }

        return new JsonResponse($response);
    }

    /**
     * Retrieves the collection of Thing resources.
     *
     * @Route(
     *     "/things/search/{searchstring}",
     *     name="thing_search",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Thing collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=ThingResponse::class))
     *     )
     * )
     */
    public function searchAction(string $searchstring): JsonResponse
    {
        $things = $this->thingRepository->searchByNameAndDescription($searchstring);

        $response = ['things' => []];

        foreach ($things as $thing) {
            $response['things'][] = ThingResponse::createFromThing($thing);
        }

        return new JsonResponse($response);
    }

    /**
     * Creates a Thing Resource.
     *
     * @Route(
     *     "/things",
     *     name="thing_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Parameter(
     *     name="thing",
     *     in="body",
     *     type="json",
     *     @Model(type=ThingRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Thing successfully created",
     *     @Model(type=ThingResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request"
     * )
     * @SWG\Response(
     *     response=401,
     *     description="Unauthorized"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function createAction(Request $request, ValidatorInterface $validator): JsonResponse
    {
        try {
            /** @var ThingRequest $thingRequest */
            $thingRequest = $this->serializer->deserialize(
                $request->getContent(),
                ThingRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $validator->validate($thingRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors);
        }

        $thing = new Thing(
            $thingRequest->name,
            $thingRequest->imageUrl,
            $thingRequest->url,
            $thingRequest->description,
            $thingRequest->specification
        );

        $this->thingRepository->save($thing);

        $ThingResponse = ThingResponse::createFromThing($thing);

        return new JsonResponse(['thing' => $ThingResponse], 201);
    }

    /**
     * Updates a Thing Resource.
     *
     * @Route(
     *     "/things/{id}",
     *     name="thing_update",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Parameter(
     *     name="thing",
     *     in="body",
     *     type="json",
     *     @Model(type=ThingRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Thing successfully created",
     *     @Model(type=ThingResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request"
     * )
     * @SWG\Response(
     *     response=401,
     *     description="Unauthorized"
     * )
     *
     * @IsGranted("ROLE_ADMIN")
     */
    public function updateAction(Request $request, ValidatorInterface $validator): JsonResponse
    {
        try {
            $thingById = $this->thingRepository->find($request->get('id'));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        try {
            /** @var ThingRequest $thingRequest */
            $thingRequest = $this->serializer->deserialize(
                $request->getContent(),
                ThingRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $validator->validate($thingRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors);
        }

        $thingById->update(
            $thingRequest->name,
            $thingRequest->imageUrl,
            $thingRequest->url,
            $thingRequest->description,
            $thingRequest->specification
        );

        $this->thingRepository->save($thingById);

        $thingResponse = ThingResponse::createFromThing($thingById);

        return new JsonResponse(['thing' => $thingResponse], 201);
    }

    /**
     * Retrieves a Thing resource.
     *
     * @Route(
     *     "/things/{uuid}",
     *     name="thing_show",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Response(
     *     response=200,
     *     description="A Thing",
     *     @Model(type=ThingResponse::class)
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        try {
            $thing = $this->thingRepository->find(Uuid::fromString($uuid));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        $thingResponse = ThingResponse::createFromThing($thing);

        return new JsonResponse(['thing' => $thingResponse]);
    }
}
