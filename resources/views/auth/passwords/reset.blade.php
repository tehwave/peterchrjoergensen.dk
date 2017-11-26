@extends('layouts.app')
@section('html', 'class=h-100')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                <form method="POST" action="{{ route('password.request') }}">
                    <article class="card">
                        <header class="card-header bg-pcj text-white">
                            <h1 class="h6 mb-0">Reset my password</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}
                                <input type="hidden" name="token" value="{{ $token }}">

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="email">Email</label>
                                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email', $email) }}" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-lg-6">
                                        <label for="password">New Password</label>
                                        <input id="password" type="password" class="form-control" name="password" required>
                                    </div>
                                    <div class="form-group mb-0 col-lg-6">
                                        <label for="passwordConfirm">Confirm Password</label>
                                        <input id="passwordConfirm" type="password" class="form-control" name="password_confirmation" required>
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer text-right">
                            <button type="submit" class="btn btn-pcj">
                                Reset
                            </button>
                        </footer>
                    </article>
                </form>
            </div>
        </div>
    </div>
@endsection
