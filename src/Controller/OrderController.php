<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\OrderIn;
use App\Dto\OrderOut;
use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Repository\ThingRepository;
use Doctrine\ORM\EntityManagerInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;

class OrderController
{
    private DenormalizerInterface $denormalizer;
    private EntityManagerInterface $entityManager;
    private Security $security;
    private OrderRepository $orderRepository;
    private ThingRepository $thingRepository;

    public function __construct(
        DenormalizerInterface $denormalizer,
        EntityManagerInterface $entityManager,
        Security $security,
        OrderRepository $orderRepository,
        ThingRepository $thingRepository
    ) {
        $this->denormalizer = $denormalizer;
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
     *     "/orders",
     *     name="order_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("ROLE_USER")
     */
    public function createAction(Request $request): JsonResponse
    {
        $jsonRequest = json_decode($request->getContent(), true);
        if (null === $jsonRequest) {
            throw new BadRequestHttpException('No valid json');
        }

        /** @var OrderIn $orderIn */
        $orderIn = $this->denormalizer->denormalize($jsonRequest, OrderIn::class);

        if ($orderIn->quantity < 1) {
            throw new BadRequestHttpException('Quantity must be greater than zero');
        }

        $thing = $this->thingRepository->find($orderIn->thingId);
        if (null === $thing) {
            throw new NotFoundHttpException('No thing was found');
        }

        $order = new Order();
        $order->setQuantity($orderIn->quantity);
        $order->setThing($thing);
        $order->setUser($this->security->getUser());

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
