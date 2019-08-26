<?php

namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\BelongsTo;

class Experience extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = 'App\Experience';

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'title',
        'subtitle',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make()
                ->sortable(),

            BelongsTo::make('Company')
                ->nullable(),

            Text::make('Title')
                ->sortable(),

            Textarea::make('Summary')
                ->nullable(),

            DateTime::make('Started At')
                ->format('YYYY-MM-DD HH:mm')
                ->firstDayOfWeek(1),

            DateTime::make('Stopped At')
                ->format('YYYY-MM-DD HH:mm')
                ->firstDayOfWeek(1)
                ->nullable(),
        ];
    }
}
