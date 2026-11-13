# latechwrestling.github.io

TODO - 11/12/26
Add 2026 schedule
Update roster
Update team picture

## Updating the site without editing HTML

Click the site logo five times quickly to reveal the private editor, then use the
password `BulldogWC2022!`. On the first visit, the website owner must paste a
GitHub fine-grained publishing key into the editor. After that, the editor can
publish schedule, roster, article, and picture changes directly from the browser.
The editor publishes to the GitHub repository; it cannot change files in an already
running local preview. A local preview will show those changes only after the
published files are pulled into this checkout. GitHub Pages may also take a short
time to rebuild after publishing.

The editor accepts Word `.docx`, legacy text/RTF, PDF, OpenDocument `.odt`, Markdown,
HTML, and plain-text article files, plus picture uploads. It creates the article
page, updates the Media page, uploads pictures, and updates the home page without
requiring the administrator to open folders or edit files. The GitHub key is kept
only in that browser's local storage. The password is a convenience lock; GitHub
repository permissions and the limited-scope publishing key provide the actual
protection.

The Home picture and team-gear settings panel can change the store URL, change the
button text, or hide the **Buy Team Gear** link while the store is inactive.

The Roster panel includes a biography box for every roster member and coach. When
roster changes are published, each biography is written to its linked bio page.

### Creating the publishing key

This one-time step should be done by the GitHub account owner or someone who has
write access to `LATechWrestling/latechwrestling.github.io`:

1. Sign in to GitHub and open [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new).
2. Give the token a name such as `LaTech Website Editor` and choose an expiration date.
3. Set **Resource owner** to `LATechWrestling`.
4. Choose **Only select repositories**, then select `latechwrestling.github.io`.
5. Under **Repository permissions**, set **Contents** to **Read and write**. Leave all other permissions alone.
6. Select **Generate token** and copy the token immediately. GitHub only shows the complete token once.
7. Open the private editor, enter the site password, paste the token into **Publishing key**, and choose **Connect and load current website**.

The token should never be emailed, placed in the website files, or posted in a
message. If it is exposed, revoke it in GitHub and create a replacement. GitHub's
documentation confirms that updating repository files requires the fine-grained
token's **Contents: write** permission: [Managing personal access tokens](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens) and [Create or update file contents](https://docs.github.com/en/rest/repos/contents?apiversion=2022-11-28).
