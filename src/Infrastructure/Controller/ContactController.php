<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use App\Domain\Contact\Mailer as ContactMailer;
use App\Infrastructure\Dto\Contact\ContactRequest;
use App\Infrastructure\Exception\ValidationErrorException;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Exception\NotEncodableValueException;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Twig\Environment;

class ContactController
{
    private MailerInterface $mailer;
    private Environment $twig;
    private SerializerInterface $serializer;
    private ValidatorInterface $validator;

    public function __construct(
        MailerInterface $mailer,
        Environment $twig,
        SerializerInterface $serializer,
        ValidatorInterface $validator
    ) {
        $this->mailer = $mailer;
        $this->twig = $twig;
        $this->serializer = $serializer;
        $this->validator = $validator;
    }

    /**
     * @Route(
     *     "/contact-form",
     *     name="contact_form",
     *     methods={"POST"},
     *     format="json"
     * )
     *
     * @SWG\Response(
     *     response=200,
     *     description="received contact form data",
     * )
     *
     * @throws \Exception
     */
    public function formDataAction(
        Request $request,
        ContactMailer $contactMailer
    ): JsonResponse {
        try {
            try {
                /** @var ContactRequest $contactRequest */
                $contactRequest = $this->serializer->deserialize(
                    $request->getContent(),
                    ContactRequest::class,
                    JsonEncoder::FORMAT
                );
            } catch (NotEncodableValueException $notEncodableValueException) {
                throw new BadRequestHttpException('No valid json', $notEncodableValueException);
            }

            $errors = $this->validator->validate($contactRequest);
            if ($errors->count() > 0) {
                throw new ValidationErrorException($errors, 'MakerRegistrationValidationError');
            }

//            $file = $request->files->get('file');
//            $params['filePath'] = null;
//            $params['file'] = null;
//
//            if ($file) {
//                if ($_FILES['file']['size'] <= 3000000) {
//                    $params['filePath'] = $_FILES['file']['tmp_name'];
//                    $params['file'] = $file;
//                } else {
//                    throw new \Exception('File larger than 3MB', 1);
//                }
//            }

            $contactMailer->send($contactRequest);
        } catch (\Exception $err) {
            throw new \Exception($err->getMessage());
        }

        return new JsonResponse(['status' => 'ok']);
    }
}
