<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\OrderIn;
use App\Dto\OrderOut;
use App\Entity\Order;
use App\Repository\OrderRepository;
use App\Repository\ThingRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class OrderController
{
    private NormalizerInterface $normalizer;
    private DenormalizerInterface $denormalizer;
    private EntityManagerInterface $entityManager;
    private Security $security;
    private OrderRepository $orderRepository;
    private ThingRepository $thingRepository;
    private UserRepository $userRepository;

    public function __construct(
        NormalizerInterface $normalizer,
        DenormalizerInterface $denormalizer,
        EntityManagerInterface $entityManager,
        Security $security,
        OrderRepository $orderRepository,
        ThingRepository $thingRepository
    ) {
        $this->normalizer = $normalizer;
        $this->denormalizer = $denormalizer;
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->orderRepository = $orderRepository;
        $this->thingRepository = $thingRepository;
    }

    /**
     * @Route(
     *     "/orders",
     *     methods={"GET"}
     * )
     */
    public function all(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = $this->normalizer->normalize(OrderOut::createFromOrder($order));
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/orders",
     *     methods={"POST"},
     *     format="json"
     * )
     */
    public function create(Request $request): JsonResponse
    {
        $jsonRequest = json_decode($request->getContent(), true);

        if (null === $jsonRequest) {
            throw new BadRequestHttpException();
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

        return new JsonResponse(['order' => $orderOut]);
    }

    /**
     * @Route(
     *     "/orders/{uuid}",
     *     methods={"GET"}
     * )
     */
    public function get(string $uuid): JsonResponse
    {
        $order = $this->orderRepository->find($uuid);

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        $orderDto = OrderOut::createFromOrder($order);

        return new JsonResponse(['order' => $orderDto]);
    }
}
