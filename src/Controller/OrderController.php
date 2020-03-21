<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\Order;
use App\Repository\OrderRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class OrderController
{
    private NormalizerInterface $normalizer;
    private OrderRepository $orderRepository;

    public function __construct(NormalizerInterface $normalizer, OrderRepository $orderRepository)
    {
        $this->normalizer = $normalizer;
        $this->orderRepository = $orderRepository;
    }

    /**
     * @Route(
     *     "/order",
     *     methods={"GET"}
     * )
     */
    public function list(): JsonResponse
    {
        $orders = $this->orderRepository->findAll();

        $response = ['orders' => []];

        foreach ($orders as $order) {
            $response['orders'][] = $this->normalizer->normalize(Order::createFromOrder($order));
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/order/{uuid}",
     *     methods={"GET"}
     * )
     */
    public function get(string $uuid): JsonResponse
    {
        $order = $this->orderRepository->find($uuid);

        if (null === $order) {
            throw new NotFoundHttpException('Order not found');
        }

        $orderDto = Order::createFromOrder($order);

        return new JsonResponse(['order' => $orderDto]);
    }
}
