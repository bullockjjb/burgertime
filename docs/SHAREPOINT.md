# Office playtest: one HTML file

Use **Accelevation-Time.html** from the release download or the `dist/` build folder. This is the entire game: code, artwork, logos, typography, sound generation, and licenses are inside it. It needs no accompanying folder, installation, server, or internet connection.

## Distribute through SharePoint

1. Upload `Accelevation-Time.html` to the SharePoint document library used by your team.
2. Share that file with your testers using your normal office sharing permissions.
3. Tell testers: **Download the HTML file, then open the downloaded file in Edge or Chrome.** If SharePoint displays source code or a preview, select Download first.
4. Ask testers which builder and mode they used, whether controls felt clear, which components they recognized, and what they would change. Send feedback through your existing office channel; the game does not submit or collect it automatically.

Suggested message:

> Try Accelevation Time: download the attached HTML file and open it in Edge or Chrome. Choose a builder, start in Guided mode, and build the four product families. Please send me anything confusing, any bugs, and your favorite improvement idea. A screenshot and your browser/device are helpful.

## Play directly from a SharePoint page

SharePoint Online document libraries normally download HTML files or show a preview rather than execute their embedded game code. Uploading this file does not guarantee an in-page game. The single-file build solves distribution; it does not change your tenant’s file-handling policies.

For immediate browser play, add a **Quick Links** tile to your SharePoint page pointing to:

https://bullockjjb.github.io/burgertime/

That version is publicly accessible. If your office requires a private host, use an IT-approved internal web host instead. Your site owner can also use SharePoint’s **Embed** web part for an approved HTTPS game host, if tenant/domain policies permit it. No SharePoint settings were changed for this release.

Microsoft references checked for this release:

- [HTML file handling in SharePoint Online](https://learn.microsoft.com/en-us/sharepoint/dev/solution-guidance/security-permissivesetting)
- [Add content using the Embed web part](https://support.microsoft.com/en-us/sharepoint/sites-pages/add-content-to-your-page-using-the-embed-web-part)

## What stays local

The game remembers character choice, sound/motion preferences, and personal bests in that browser when browser storage is available. Scores are not shared between employees. Browser or company policy may restrict opening downloaded HTML; that must be handled through normal IT policy rather than by changing file extensions or bypassing controls.
