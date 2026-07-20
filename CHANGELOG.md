# Changelog

## v2.1.0 (2026-07-20)

Lazy loading for the file and folder pickers.

- File and folder pickers are now Resource Locators that load contents **one folder level at a time** instead of fetching the entire library tree / full file list up front. This drastically speeds up the pickers on large libraries.
- Browse by typing a path (e.g. `/invoices/2024/`) to drill deeper, or switch to **By Path** to enter a path/expression directly.
- Applies to all file and folder selectors across the File, Folder, Search, Share and Tag actions.

**Migration note:** the affected parameters changed from simple dropdowns to Resource Locators, which changes how the value is stored. Existing workflows may need the file/folder to be re-selected in the picker; the **By Path** mode still accepts any previously used path or expression.

## v2.0.1 (2024-08-28)

- Improved return values structure of the File Search
- Add loadOptionsMethod for search_path in File Search (advanced)

## v2.0.0 (2024-08-28)

Complete rewrite of the Seafile node for n8n with now 33 actions:

- File Actions (10)
- Folder Actions (3)
- Info Actions (3)
- Library Actions (4)
- Search Actions (2)
- Share Actions (7)
- Tag Actions (4)

This new version introduces breaking changes, including modifications to the authentication process, which prevent the creation of a compatible update for n8n. As a result, existing workflows will need to be rebuilt. The change in authentication was made because the node now exclusively supports the Account-Token, no longer accommodating the Repo-Token.

## v1.1.0 (2024-01-01)

Initial version developed by https://www.npmjs.com/~vquie supporting these operations:

- Upload File
- Get Download Link
- List Directory
- Delete File
