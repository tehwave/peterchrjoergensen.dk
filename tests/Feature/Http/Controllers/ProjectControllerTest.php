<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;

class ProjectControllerTest extends TestCase
{
    /** @test */
    public function it_returns_an_ok_response()
    {
        $url = route('portfolio');

        $response = $this->get($url);

        $response->assertOk();
    }
}
