<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;

class HomeControllerTest extends TestCase
{
    /** @test */
    public function it_returns_an_ok_response()
    {
        $url = route('home');

        $response = $this->get($url);

        $response->assertOk();
    }
}
