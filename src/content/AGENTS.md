# Internal links in blog posts and cases

- Choose related content manually in each EN/DA MDX file. Do not add automatic matching, a database, or a central relationship registry.
- Use [RelatedPost](../components/RelatedPost.astro) for contextual links within the article and [RelatedContent](../components/RelatedContent.astro) for a list at the end.
- Give `RelatedContent` one to three relevant `links` with `href` and `title`. Use `heading="Read next"` in English and `heading="Læs videre"` in Danish, with localized link text.
- Use public URLs with trailing slashes. Keep destinations consistent across translations, avoid self-links and duplicate list entries, and omit the list when no relevant destination exists.
- A contextual link may also appear in the final list. When adding content, consider useful links to it from existing posts or cases.
