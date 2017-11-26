@extends('layouts.app')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                <form method="POST" action="{{ route('login') }}">
                    <article class="card">
                        <header class="card-header bg-pcj text-white">
                            <h1 class="h6 mb-0">Login</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="email">Email</label>
                                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="password">Password</label>
                                        <input id="password" type="password" class="form-control" name="password" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <div class="form-check">
                                            <label class="form-check-label">
                                                <input class="form-check-input" type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> Remember me
                                            </label>
                                        </div>
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col my-auto">
                                    <a href="{{ route('password.request') }}" class="card-link">I forgot my password</a>
                                </div>
                                <div class="col text-right">
                                    <button type="submit" class="btn btn-pcj">
                                        Log in
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </article>
                </form>
            </div>
        </div>
    </div>
@endsection
