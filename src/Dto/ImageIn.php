<?php

declare(strict_types=1);

namespace App\Dto;

class ImageIn
{
    public string $filename;
    private $data;
    private $decodedData;

    public function setData(string $data): void
    {
        $this->data = $data;
        $this->decodedData = base64_decode($data);
    }

    public function getDecodedData(): string
    {
        return $this->decodedData;
    }
}
