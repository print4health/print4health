<?php

declare(strict_types=1);

namespace App\Infrastructure\Controller;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Swagger\Annotations as SWG;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Mailer\MailerInterface;
use App\Domain\Contact\Mailer as ContactMailer;
use Twig\Environment;

class ContactController
{
    private MailerInterface $mailer;
    private Environment $twig;


    public function __construct(MailerInterface $mailer, Environment $twig)
    {
        $this->mailer = $mailer;
        $this->twig = $twig;
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
     * @param Request $request
     * @param ContactMailer $contactMailer
     * @return JsonResponse
     * @throws \Exception
     */

    public function formDataAction(
        Request $request,
        ContactMailer $contactMailer
    ): JsonResponse {

        try {
            $params = $request->request->all();
            $file = $request->files->get('file');
            $params['filePath'] = null;
            $params['file'] = null;

            if($file){
                if($_FILES['file']['size'] <= 3000000) {
                    $params['filePath'] = $_FILES['file']['tmp_name'];
                    $params['file'] = $file;
                } else {
                    throw new \Exception("File larger than 3MB", 1);
                }
            }

            $contactMailer->send($params, $file);

        } catch (\Exception $err) {
            throw new \Exception($err);
        }

        return new JsonResponse(['status' => 'ok']);
    }
}
