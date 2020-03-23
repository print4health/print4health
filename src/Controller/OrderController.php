<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\OrderIn;
use App\Dto\OrderOut;
use App\Entity\Order;
use App\Entity\Thing;
use App\Entity\User\Requester;
use App\Repository\OrderRepository;
use App\Repository\ThingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
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

    public function __construct(
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        Security $security,
        OrderRepository $orderRepository,
        ThingRepository $thingRepository
    ) {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->orderRepository = $orderRepository;
        $this->thingRepository = $thingRepository;
    }

    /**
     * @Route(
     *     "/orders",
     *     name="order_list",
     *     methods={"GET"},
     *     format="json"
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Orders",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderOut::class))
     *     )
     * )
     */
    public function listAction(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderOut::createFromOrder($order);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/orders/thing/{thingId}",
     *     name="order_thing_list",
     *     methods={"GET"},
     *     format="json"
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Orders",
     *     @SWG\Schema(
     *         type="array",
     *         @SWG\Items(ref=@Model(type=OrderOut::class))
     *     )
     * )
     */
    public function listByThingAction(string $thingId): JsonResponse
    {
        $thing = $this->thingRepository->find($thingId);
        if (!$thing instanceof Thing) {
            throw new NotFoundHttpException('Thing not found');
        }
        $orders = $this->orderRepository->findBy(['thing' => $thing]);

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = OrderOut::createFromOrder($order);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/orders",
     *     name="order_create",
     *     methods={"POST"},
     *     format="json"
     * )
     * @SWG\Parameter(
     *     name="order",
     *     in="body",
     *     type="json",
     *     @Model(type=OrderIn::class)
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Order successfully created",
     *     @Model(type=OrderOut::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request"
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
            /** @var OrderIn $orderIn */
            $orderIn = $this->serializer->deserialize($request->getContent(), OrderIn::class, JsonEncoder::FORMAT);
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        if ($orderIn->quantity < 1) {
            throw new BadRequestHttpException('Quantity must be greater than zero');
        }

        $thing = $this->thingRepository->find($orderIn->thingId);
        if (null === $thing) {
            throw new NotFoundHttpException('No thing was found');
        }

        $order = new Order($requester, $thing, $orderIn->quantity);

        $this->entityManager->persist($order);
        $this->entityManager->flush();

        $orderOut = OrderOut::createFromOrder($order);

        return new JsonResponse(['order' => $orderOut], 201);
    }

    /**
     * @Route(
     *     "/orders/{uuid}",
     *     name="order_show",
     *     methods={"GET"},
     *     format="json"
     * )
     * @SWG\Response(
     *     response=200,
     *     description="Order",
     *     @Model(type=OrderOut::class)
     * )
     */
    public function showAction(string $uuid): JsonResponse
    {
        $order = $this->orderRepository->find($uuid);

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        $orderDto = OrderOut::createFromOrder($order);

        return new JsonResponse(['order' => $orderDto]);
    }
}
