<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Commitment\Entity\Commitment;
use App\Domain\Commitment\Repository\CommitmentRepository;
use App\Domain\Order\Entity\Order;
use App\Domain\Order\Repository\OrderRepository;
use App\Domain\Thing\Entity\Thing;
use App\Domain\Thing\Repository\ThingRepository;
use App\Domain\User\CommitmentNotFoundException;
use App\Domain\User\Entity\Maker;
use App\Domain\User\Entity\Requester;
use App\Domain\User\MakerNotFoundException;
use App\Domain\User\Repository\MakerRepository;
use App\Domain\User\Repository\RequesterRepository;
use App\Domain\User\RequesterNotFoundException;
use App\Infrastructure\Dto\Order\OrderRequest;
use App\Infrastructure\Dto\Order\OrderResponse;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
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

class OrderController
{
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;
    private Security $security;
    private OrderRepository $orderRepository;
    private ThingRepository $thingRepository;
    private RequesterRepository $requesterRepository;

    public function __construct(
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        Security $security,
        OrderRepository $orderRepository,
        ThingRepository $thingRepository,
        RequesterRepository $requesterRepository,
        MakerRepository $makerRepository,
        CommitmentRepository $commitmentRepository
    ) {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
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
     */
    public function listByRequesterAction(string $requesterId): JsonResponse
    {
        $requester = $this->requesterRepository->find($requesterId);

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
     */
    public function listByMakerAction(string $makerId): JsonResponse
    {
        $maker = $this->makerRepository->find(Uuid::fromString($makerId));

        if (!$maker instanceof Maker) {
            throw new MakerNotFoundException($makerId);
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
        $thing = $this->thingRepository->find($thingId);
        if (!$thing instanceof Thing) {
            throw new NotFoundHttpException('Thing not found');
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
    public function createAction(Request $request): JsonResponse
    {
        /** @var Requester $requester */
        $requester = $this->security->getUser();

        try {
            /** @var OrderRequest $orderRequest */
            $orderRequest = $this->serializer->deserialize($request->getContent(), OrderRequest::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        if ($orderRequest->quantity < 1) {
            throw new BadRequestHttpException('Quantity must be greater than zero');
        }

        $thing = $this->thingRepository->find($orderRequest->thingId);
        if (null === $thing) {
            throw new BadRequestHttpException('No thing was found');
        }

        $order = $this->orderRepository->findOneBy(['requester' => $requester, 'thing' => $thing]);
        if ($order instanceof Order) {
            $order->addQuantity($orderRequest->quantity);
        } else {
            $order = new Order($requester, $thing, $orderRequest->quantity);
            $this->entityManager->persist($order);
        }

        $this->entityManager->flush();

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
        $order = $this->orderRepository->find($id);

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        $orderDto = OrderResponse::createFromOrder($order);

        return new JsonResponse(['order' => $orderDto]);
    }
}
