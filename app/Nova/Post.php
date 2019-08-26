<?php

namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\DateTime;
use Laravel\Nova\Fields\Markdown;
use Laravel\Nova\Fields\Textarea;
use Benjaminhirsch\NovaSlugField\Slug;
use Benjaminhirsch\NovaSlugField\TextWithSlug;

class Post extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = 'App\Post';

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
        'id', 'title', 'slug',
    ];

    /**
     * Determine if the given resource is authorizable.
     *
     * @return bool
     */
    public static function authorizable()
    {
        return false;
    }

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

            TextWithSlug::make('Title')
                ->slug('slug')
                ->onlyOnForms(),

            Slug::make('Slug')
                ->onlyOnForms(),

            Text::make('Title', function () { return $this->link; })
                ->asHtml()
                ->readonly()
                ->exceptOnForms(),

            Textarea::make('Excerpt')
                ->nullable(),

            Markdown::make('Body')
                ->nullable(),

            DateTime::make('Created At')
                ->format('YYYY-MM-DD HH:mm')
                ->firstDayOfWeek(1)
                ->readonly()
                ->hideFromIndex(),

            DateTime::make('Updated At')
                ->format('YYYY-MM-DD HH:mm')
                ->firstDayOfWeek(1)
                ->readonly()
                ->hideFromIndex(),

            DateTime::make('Published At')
                ->format('YYYY-MM-DD HH:mm')
                ->firstDayOfWeek(1)
                ->nullable(),
        ];
    }
}
