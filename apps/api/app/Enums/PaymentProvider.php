<?php

namespace App\Enums;

enum PaymentProvider: string
{
    case Mpesa = 'mpesa';
    case Paystack = 'paystack';
    case Pesapal = 'pesapal';
}
