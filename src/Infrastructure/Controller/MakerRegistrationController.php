<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\User\Entity\Maker;
use App\Domain\User\Repository\MakerRepository;
use App\Infrastructure\Dto\MakerRegistration\MakerRegistrationRequest;
use App\Infrastructure\Dto\MakerRegistration\MakerRegistrationResponse;
use App\Infrastructure\Exception\ValidationErrorException;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Annotation\Model;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

/**
 * Class MakerRegistrationController.
 *
 * @Route(
 *     "/maker/registration",
 *     name="maker_registration",
 *     methods={"POST"},
 *     format="json"
 * )
 * @IsGranted("IS_AUTHENTICATED_ANONYMOUSLY")
 */
class MakerRegistrationController
{
    private SerializerInterface $serializer;

    private MakerRepository $makerRepository;

    private EntityManagerInterface $entityManager;

    private UserPasswordEncoderInterface $userPasswordEncoder;

    /**
     * @var ValidatorInterface
     */
    private ValidatorInterface $validator;

    public function __construct(
        SerializerInterface $serializer,
        MakerRepository $makerRepository,
        EntityManagerInterface $entityManager,
        UserPasswordEncoderInterface $userPasswordEncoder,
        ValidatorInterface $validator
    ) {
        $this->serializer = $serializer;
        $this->makerRepository = $makerRepository;
        $this->entityManager = $entityManager;
        $this->userPasswordEncoder = $userPasswordEncoder;
        $this->validator = $validator;
    }

    /**
     * @throws \Doctrine\ORM\EntityNotFoundException
     *
     * @return JsonResponse
     *
     * @SWG\Tag(name="Maker")
     * @SWG\Parameter(
     *     name="maker-registration",
     *     in="body",
     *     type="json",
     *     @SWG\Schema(
     *         type="object",
     *         required={
     *             "email",
     *             "password",
     *             "name",
     *             "postalCode",
     *             "confirmedRuleForFree",
     *             "confirmedRuleMaterialAndTransport",
     *             "confirmedPlattformIsContactOnly",
     *             "confirmedNoAccountability",
     *             "confirmedPersonalDataTransferToRequester"
     *         },
     *         @SWG\Property(property="email", type="string"),
     *         @SWG\Property(property="password", type="string"),
     *         @SWG\Property(property="name", type="string"),
     *         @SWG\Property(property="postalCode", type="integer"),
     *         @SWG\Property(property="addressCity", type="string"),
     *         @SWG\Property(property="addressState", type="string"),
     *         @SWG\Property(property="latitude", type="float"),
     *         @SWG\Property(property="longitude", type="float"),
     *         @SWG\Property(property="confirmedRuleForFree", type="boolean"),
     *         @SWG\Property(property="confirmedRuleMaterialAndTransport", type="boolean", default=false),
     *         @SWG\Property(property="confirmedPlattformIsContactOnly", type="boolean", default=false),
     *         @SWG\Property(property="confirmedNoAccountability", type="boolean", default=false),
     *         @SWG\Property(property="confirmedPersonalDataTransferToRequester", type="boolean", default=false)
     *     )
     * )
     * @SWG\Response(
     *     response=201,
     *     description="Maker created successfully",
     *     @Model(type=MakerRegistrationResponse::class)
     * )
     * @SWG\Response(
     *     response=400,
     *     description="Malformed request or wrong content type"
     * )
     * @SWG\Response(
     *     response=422,
     *     description="Validation failed due to missing mandatory fields or invalid field data"
     * )
     */
    public function __invoke(Request $request)
    {
        try {
            /** @var MakerRegistrationRequest $makerRegistrationRequest */
            $makerRegistrationRequest = $this->serializer->deserialize(
                $request->getContent(),
                MakerRegistrationRequest::class,
                JsonEncoder::FORMAT
            );
        } catch (NotEncodableValueException $notEncodableValueException) {
            throw new BadRequestHttpException('No valid json', $notEncodableValueException);
        }

        $errors = $this->validator->validate($makerRegistrationRequest);
        if ($errors->count() > 0) {
            throw new ValidationErrorException($errors, 'MakerRegistrationValidationError');
        }

        $maker = new Maker($makerRegistrationRequest->email, $makerRegistrationRequest->name);
        $maker->setPassword($this->userPasswordEncoder->encodePassword($maker, $makerRegistrationRequest->password));
        $maker->setPostalCode($makerRegistrationRequest->postalCode);
        $maker->setAddressCity($makerRegistrationRequest->addressCity);
        $maker->setAddressState($makerRegistrationRequest->addressState);
        $maker->setLatitude($makerRegistrationRequest->latitude);
        $maker->setLongitude($makerRegistrationRequest->longitude);

        $this->entityManager->persist($maker);
        $this->entityManager->flush();

        // todo send email for activation ?

        $makerResponse = MakerRegistrationResponse::createFromMaker($maker);

        return new JsonResponse(['maker' => $makerResponse], Response::HTTP_CREATED);
    }
}
