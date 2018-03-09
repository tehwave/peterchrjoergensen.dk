<footer class="pcj-footer">
    {{ $slot }}

    <section
        class="pcj-parallax pcj-footer-contact"
        data-image-src="{{ asset('img/footer.jpg') }}"
        data-natural-width="1920"
        data-natural-height="725"
        data-parallax="scroll"
        data-speed="0.6"
        data-z-index="0"
    >
        <div class="container">
            <div class="row text-center">
                <section class="col-12 mb-4 col-lg mb-lg-0">
                    <h2 class="h1">Get in touch</h2>
                </section>
                <section class="col-12 col-lg">
                    <a href="https://www.linkedin.com/in/peterchrjoergensen" target="_blank" class="pr-3" rel="noopener" title="Find Peter on LinkedIn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zM17.4 36h-5V20h5v16zm-2.5-18.2c-1.6 0-2.9-1.3-2.9-2.9 0-1.6 1.3-2.9 2.9-2.9 1.6 0 2.9 1.3 2.9 2.9 0 1.6-1.3 2.9-2.9 2.9zM36 36h-5v-7.8c0-1.9 0-4.2-2.6-4.2s-3 2-3 4.1V36h-5V20h4.8v2.2h.1c.7-1.3 2.3-2.6 4.7-2.6 5 0 6 3.3 6 7.6V36z"/></svg>
                    </a>
                    <a href="mailto:hello@peterchrjoergensen.dk?subject=Hello" target="_top" class="pr-3" title="Send Peter an email">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><g fill="#fff"><path data-color="color-2" d="M45 5H3c-1.1 0-2 .9-2 2v6c0 .37.2.7.52.88l22 12c.15.08.32.12.48.12s.33-.04.48-.12l22-12c.32-.18.52-.5.52-.88V7c0-1.1-.9-2-2-2z"/><path d="M25.44 27.63c-.45.24-.94.37-1.44.37s-1-.13-1.43-.36L1.02 15.88 1 15.9V41c0 1.1.9 2 2 2h42c1.1 0 2-.9 2-2V15.9l-.02-.02-21.54 11.75z"/></g></svg>
                    </a>
                    <a href="https://www.twitter.com/tehwave" target="_blank" rel="noopener" title="Find Peter on Twitter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="#fff" d="M42 0H6C2.7 0 0 2.7 0 6v36c0 3.3 2.7 6 6 6h36c3.3 0 6-2.7 6-6V6c0-3.3-2.7-6-6-6zm-8.5 19.1v.6c0 6.5-5 14-14 14-2.8 0-5.4-.8-7.5-2.2.4 0 .8.1 1.2.1 2.3 0 4.4-.8 6.1-2.1-2.2 0-4-1.5-4.6-3.4.3.1.6.1.9.1.4 0 .9-.1 1.3-.2-2.3-.5-3.9-2.4-3.9-4.8v-.1c.7.4 1.4.6 2.2.6-1.3-.9-2.2-2.4-2.2-4.1 0-.9.2-1.7.7-2.5 2.4 3 6.1 4.9 10.1 5.1-.1-.4-.1-.7-.1-1.1 0-2.7 2.2-4.9 4.9-4.9 1.4 0 2.7.6 3.6 1.6 1.1-.2 2.2-.6 3.1-1.2-.4 1.1-1.1 2.1-2.2 2.7 1-.1 1.9-.4 2.8-.8-.6 1-1.4 1.9-2.4 2.6z"/></svg>
                    </a>
                </section>
            </div>
        </div>
    </section>

    <div class="container text-center">
        <div class="row py-4">
            <section class="col">
                Designed and developed by Peter <span title="tehwave">🌊</span> Jørgensen
            </section>
        </div>
    </div>
</footer>
