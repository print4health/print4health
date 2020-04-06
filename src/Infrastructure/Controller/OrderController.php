<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Commitment\Repository\CommitmentRepository;
use App\Domain\Exception\NotFoundException;
use App\Domain\Order\Entity\Order;
use App\Domain\Order\Repository\OrderRepository;
use App\Domain\Thing\Entity\Thing;
use App\Domain\Thing\Repository\ThingRepository;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Entity\User;
use App\Domain\User\MakerNotFoundException;
use App\Domain\User\Repository\MakerRepository;
use App\Domain\User\Repository\RequesterRepository;
use App\Domain\User\RequesterNotFoundException;
use App\Infrastructure\Dto\Order\OrderRequest;
use App\Infrastructure\Dto\Order\OrderResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Nelmio\ApiDocBundle\Annotation\Model;
use Ramsey\Uuid\Exception\InvalidUuidStringException;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class OrderController
{
    private SerializerInterface $serializer;

    private Security $security;

    private OrderRepository $orderRepository;

    private ThingRepository $thingRepository;

    private RequesterRepository $requesterRepository;

    private MakerRepository $makerRepository;

    private CommitmentRepository $commitmentRepository;

    public function __construct(
        SerializerInterface $serializer,
        Security $security,
        OrderRepository $orderRepository,
        ThingRepository $thingRepository,
        RequesterRepository $requesterRepository,
        MakerRepository $makerRepository,
        CommitmentRepository $commitmentRepository
    ) {
        $this->serializer = $serializer;
        $this->security = $security;
        $this->orderRepository = $orderRepository;
        $this->thingRepository = $thingRepository;
        $this->requesterRepository = $requesterRepository;
        $this->makerRepository = $makerRepository;
        $this->commitmentRepository = $commitmentRepository;
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/orders",
     *     name="order_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Orders")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Order collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderResponse::class))
     *     )
     * )
     */
    public function listAction(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderResponse::createFromOrder($order);
        }

        return new JsonResponse($response);
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/orders/requester/{requesterId}",
     *     name="order_requester_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Requester")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Order collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderResponse::class))
     *     )
     * )
     * @IsGranted("ROLE_ADMIN")
     */
    public function listByRequesterAction(string $requesterId): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($requesterId);
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Invalid Uuid [%s]', $requesterId));
        }

        $requester = $this->requesterRepository->find($uuid->toString());

        if (!$requester instanceof Requester) {
            throw new RequesterNotFoundException($requesterId);
        }

        $orders = $this->orderRepository->findBy(['requester' => $requester]);

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderResponse::createFromOrder($order);
        }

        return new JsonResponse($response);
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/orders/maker/{makerId}",
     *     name="order_maker_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Maker")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Order collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderResponse::class))
     *     )
     * )
     * @IsGranted("ROLE_ADMIN")
     */
    public function listByMakerAction(string $makerId): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($makerId);
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Invalid Uuid [%s]', $makerId));
        }

        try {
            $maker = $this->makerRepository->find($uuid);
        } catch (MakerNotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        $commitments = $this->commitmentRepository->findBy(['maker' => $maker]);

        $response = ['orders' => []];

        foreach ($commitments as $commitment) {
            $response['orders'][] = OrderResponse::createFromOrder($commitment->getOrder());
        }

        return new JsonResponse($response);
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/orders/user",
     *     name="order_user_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Maker")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Order collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderResponse::class))
     *     )
     * )
     * @IsGranted("ROLE_USER")
     */
    public function listUserAction(): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \App\Domain\User\NotFoundException('');
        }

        $userRoles = $user->getRoles();

        if (\in_array(Maker::ROLE_MAKER, $userRoles)) {
            return $this->listByMakerAction($user->getId());
        }

        if (\in_array(Requester::ROLE_REQUESTER, $userRoles)) {
            return $this->listByRequesterAction($user->getId());
        }

        throw new BadRequestHttpException('The user is neither a maker nor a requester');
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/things/{thingId}/orders",
     *     name="order_thing_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Things")
     *
     * @SWG\Response(
     *     response=200,
     *     description="Order collection response",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderResponse::class))
     *     )
     * )
     */
    public function listByThingAction(string $thingId): JsonResponse
    {
        try {
            $thing = $this->thingRepository->find(Uuid::fromString($thingId));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }
        $orders = $thing->getOrders();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderResponse::createFromOrder($order);
        }

        return new JsonResponse($response);
    }

    /**
     * Creates a Order Resource.
     *
     * @Route(
     *     "/orders",
     *     name="order_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Orders")
     *
     * @SWG\Parameter(
     *     name="order",
     *     in="body",
     *     type="json",
     *     @Model(type=OrderRequest::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Order successfully created",
     *     @Model(type=OrderResponse::class)
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
     *     response=404,
     *     description="Requested thing could not be found"
     * )
     *
     * @IsGranted("ROLE_REQUESTER")
     */
    public function createAction(Request $request, ValidatorInterface $validator): JsonResponse
    {
        /** @var Requester $requester */
        $requester = $this->security->getUser();

        try {
            /** @var OrderRequest $orderRequest */
            $orderRequest = $this->serializer->deserialize(
                $request->getContent(),
                OrderRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $validator->validate($orderRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors);
        }

        try {
            $thing = $this->thingRepository->find(Uuid::fromString($orderRequest->thingId));
        } catch (NotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        $order = $this->orderRepository->findOneBy(['requester' => $requester, 'thing' => $thing]);
        if ($order instanceof Order) {
            $order->addQuantity($orderRequest->quantity);
        } else {
            $order = new Order($requester, $thing, $orderRequest->quantity);
        }

        $this->orderRepository->save($order);

        $OrderResponse = OrderResponse::createFromOrder($order);

        return new JsonResponse(['order' => $OrderResponse], 201);
    }

    /**
     * Retrieves a Order resource.
     *
     * @Route(
     *     "/orders/{id}",
     *     name="order_show",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @SWG\Tag(name="Orders")
     *
     * @SWG\Response(
     *     response=200,
     *     description="A Order",
     *     @Model(type=OrderResponse::class)
     * )
     */
    public function showAction(string $id): JsonResponse
    {
        try {
            $uuid = Uuid::fromString($id);
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Invalid Uuid [%s]', $id));
        }

        $order = $this->orderRepository->find($uuid->toString());

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        $orderDto = OrderResponse::createFromOrder($order);

        return new JsonResponse($orderDto);
    }
}
