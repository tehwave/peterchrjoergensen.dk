<?php

namespace Tests\Feature\Http\Controllers;

use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ResumeControllerTest extends TestCase
{
    /** @test */
    public function it_returns_an_ok_response()
    {
        $url = route('resume');

        $response = $this->get($url);

        $response->assertOk();
    }
}
