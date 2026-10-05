<?php

namespace App\Enums;

enum PaymentTransactionType: string
{
    case Initiated = 'initiated';
    case Processing = 'processing';
    case Authorized = 'authorized';
    case Captured = 'captured';
    case Failed = 'failed';
    case Cancelled = 'cancelled';
    case Refunded = 'refunded';
}
