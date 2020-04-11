<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Commitment\Repository\CommitmentRepository;
use App\Domain\Exception\Maker\MakerByIdNotFoundException;
use App\Domain\Exception\NotFoundException;
use App\Domain\Exception\Requester\RequesterByIdNotFoundException;

use App\Domain\Exception\User\UserByIdNotFoundException;
use App\Domain\Order\Command\orderPlacedNotificationCommand;
use App\Domain\Order\Entity\Order;
use App\Domain\Order\Repository\OrderRepository;
use App\Domain\Thing\Repository\ThingRepository;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\Entity\User;
use App\Domain\User\Repository\MakerRepository;
use App\Domain\User\Repository\RequesterRepository;
use App\Domain\User\UserInterface;
use App\Domain\User\UserInterfaceRepository;
use App\Infrastructure\Dto\Order\OrderRequest;
use App\Infrastructure\Dto\Order\OrderResponse;
use App\Infrastructure\Dto\User\OrderContactUserDetailResponse;
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
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
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

        try {
            $requester = $this->requesterRepository->find($uuid);
        } catch (RequesterByIdNotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        $orders = $this->orderRepository->findBy(['requester' => $requester]);

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderResponse::createFromOrderAndRequester($order, $requester);
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
        } catch (MakerByIdNotFoundException $exception) {
            throw new NotFoundHttpException($exception->getMessage());
        }

        $commitments = $this->commitmentRepository->findBy(['maker' => $maker]);

        $response = ['orders' => []];

        foreach ($commitments as $commitment) {
            $response['orders'][] = OrderResponse::createFromOrderAndMaker($commitment->getOrder(), $maker);
        }

        return new JsonResponse($response);
    }

    /**
     * Retrieves the collection of Order resources.
     *
     * @Route(
     *     "/orders/user",
     *     name="order_list_for_current_user",
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
    public function listForCurrentUserAction(): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();
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
    public function createAction(Request $request, ValidatorInterface $validator, MessageBusInterface $messageBus): JsonResponse
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

        $messageBus->dispatch(new orderPlacedNotificationCommand($order));

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
     *
     * @IsGranted("ROLE_USER")
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

        /** @var UserInterface $user */
        $user = $this->security->getUser();

        if (
            false === $order->hasCommitmentByUser($user) &&
            false === $order->isOrderByUser($user)
        ) {
            throw new AccessDeniedException(sprintf('You are not allowed to see this order'));
        }

        $orderDto = OrderResponse::createFromOrder($order);

        return new JsonResponse($orderDto);
    }

    /**
     * Retrieves a Order resource.
     *
     * @Route(
     *     "/orders/{orderId}/user-details/{userId}",
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
     *     @Model(type=OrderContactUserDetailResponse::class)
     * )
     *
     * @IsGranted("ROLE_USER")
     */
    public function showUserDetailFromOrderAction(
        string $orderId,
        string $userId,
        UserInterfaceRepository $userInterfaceRepository
    ): JsonResponse {
        try {
            $userDetail = $userInterfaceRepository->find(Uuid::fromString($userId));
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Invalid Uuid [%s]', $orderId));
        } catch (UserByIdNotFoundException $exception) {
            throw new NotFoundHttpException(sprintf('User with id [%s] not found', $orderId));
        }

        try {
            $order = $this->orderRepository->find(Uuid::fromString($orderId)->toString());
        } catch (InvalidUuidStringException $exception) {
            throw new BadRequestHttpException(sprintf('Invalid Uuid [%s]', $orderId));
        }

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        /** @var UserInterface $currentUser */
        $currentUser = $this->security->getUser();

        if (
            false === $order->hasCommitmentByUser($currentUser) &&
            false === $order->isOrderByUser($currentUser)
        ) {
            throw new AccessDeniedException(sprintf('You are not allowed to see this user'));
        }

        if (
            false === $order->hasCommitmentByUser($userDetail) &&
            false === $order->isOrderByUser($userDetail)
        ) {
            throw new AccessDeniedException(sprintf('You are not allowed to see this user'));
        }
        $orderDto = OrderContactUserDetailResponse::createFromUserInterface($userDetail);

        return new JsonResponse($orderDto);
    }
}
