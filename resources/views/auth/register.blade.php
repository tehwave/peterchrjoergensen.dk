@extends('layouts.app')
@section('navigation', false)
@section('footer', false)

@section('app')
    <div class="container h-100">
        <div class="row h-100">
            <div class="my-auto col-lg-8 mx-lg-auto">
                <form method="POST" action="{{ route('register') }}">
                    <article class="card">
                        <header class="card-header bg-pcj text-white">
                            <h1 class="h6 mb-0">Register your account</h1>
                        </header>
                        <section class="card-body">
                                {{ csrf_field() }}

                                @unless ($errors->isEmpty())
                                    <div class="form-row">
                                        <div class="form-group col">
                                            <div class="alert alert-danger" role="alert">
                                                <ul class="list-unstyled mb-0">
                                                    @foreach ($errors->all() as $error)
                                                        <li>{{ $error }}</li>
                                                    @endforeach
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                @endunless

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="name">Name</label>
                                        <input id="name" type="text" class="form-control" name="name"  value="{{ old('name') }}" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col">
                                        <label for="email">Email</label>
                                        <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required>
                                    </div>
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-lg-6">
                                        <label for="password">Password</label>
                                        <input id="password" type="password" class="form-control" name="password" required>
                                    </div>
                                    <div class="form-group mb-0 col-lg-6">
                                        <label for="passwordConfirm">Confirm Password</label>
                                        <input id="passwordConfirm" type="password" class="form-control" name="password_confirmation" required>
                                    </div>
                                </div>
                        </section>
                        <footer class="card-footer">
                            <div class="form-row">
                                <div class="col col-lg-4">
                                    <label for="pin" class="sr-only">PIN</label>
                                    <input id="pin" type="number" placeholder="1234" class="form-control" name="pin" required>
                                </div>
                                <div class="col text-right col-lg-8">
                                    <button type="submit" class="btn btn-pcj">
                                        Register
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
