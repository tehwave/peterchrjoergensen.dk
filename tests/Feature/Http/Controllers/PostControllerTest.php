<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;

class PostControllerTest extends TestCase
{
    /** @test */
    public function it_returns_an_ok_response()
    {
        $url = route('blog');

        $response = $this->get($url);

        $response->assertOk();
    }
}
