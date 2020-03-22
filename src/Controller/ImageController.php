<?php

declare(strict_types=1);

namespace App\Controller;

use App\Dto\ImageIn;
use App\Dto\ImageOut;
use App\Entity\Image;
use App\Repository\ImageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Ramsey\Uuid\Uuid;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\String\Slugger\AsciiSlugger;

class ImageController
{
    private ImageRepository $imageRepository;
    private SerializerInterface $serializer;
    private EntityManagerInterface $entityManager;
    private string $imageUploadPath;

    public function __construct(
        ImageRepository $imageRepository,
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        string $imageUploadPath
    ) {
        $this->imageRepository = $imageRepository;
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->imageUploadPath = $imageUploadPath;
    }

    /**
     * @Route(
     *     "/images",
     *     name="image_list",
     *     methods={"GET"},
     *     format="json"
     * )
     *
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function listAction(): JsonResponse
    {
        $images = $this->imageRepository->findAll();

        $response = ['images' => []];

        foreach ($images as $image) {
            $response['images'][] = ImageOut::createFromImage($image);
        }

        return new JsonResponse($response);
    }

    /**
     * @Route(
     *     "/images",
     *     name="image_create",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     */
    public function createAction(Request $request): JsonResponse
    {
        /** @var ImageIn $imageIn */
        $imageIn = $this->serializer->deserialize(
            $request->getContent(),
            ImageIn::class,
            JsonEncoder::FORMAT
        );

        $slugger = new AsciiSlugger();
        $fileInfo = new \SplFileInfo($imageIn->filename);
        $basename = substr($slugger->slug(pathinfo($fileInfo->getBasename(), PATHINFO_FILENAME)), 0, 180);
        $filename = sprintf(
            '%s-%s.%s',
            $basename,
            Uuid::uuid4(),
            $slugger->slug($fileInfo->getExtension())
        );
        $image = new Image($filename);

        $filesystem = new Filesystem();
        $filesystem->dumpFile(sprintf('%s/%s', $this->imageUploadPath, $image->getFilename()), $imageIn->getDecodedData());

        $this->entityManager->persist($image);
        $this->entityManager->flush();

        $imageOut = ImageOut::createFromImage($image);

        return new JsonResponse(['image' => $imageOut], 201);
    }
}
