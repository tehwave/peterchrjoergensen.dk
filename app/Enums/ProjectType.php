<?php

namespace App\Enums;

use BenSampo\Enum\Enum;

final class ProjectType extends Enum
{
    const WEBSITE = 'website';
    const OTHER = 'other';
    const VIDEO = 'video';
    const GAME = 'game';
    const APP = 'application';
}
