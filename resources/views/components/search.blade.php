<form role="search" method="GET" action="{{ url()->current() }}">
    <div class="input-group">
        <input type="search" class="form-control" name="query" placeholder="..." value="{{ request()->input('query') }}">
        <span class="input-group-append">
            <button type="submit" class="btn btn-pcj">Search</button>
        </span>
    </div>
</form>
