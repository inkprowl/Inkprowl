# Current Live Verification — 21 August 2026

The public GitHub Pages homepage at `https://inkprowl.github.io/inkprowl/` was checked after release `67e78d4b633fcf56b3b5a7f85a2bb478400fc91f`. It displayed the restored campaign label **PRESENTED IN PARTNERSHIP**, client **Inkprowl Sample Sponsor Placement**, the approved `https://client-site.example` destination, the active Cloudinary sponsor video, and the restored **Inkprowl Sample Soundtrack**.

The owner route at `https://inkprowl.github.io/inkprowl/#/admin` was checked after the currently active owner-session state. It displayed the upload-first dashboard with file-only Artwork, Song, Sponsor Video, Logo, and Hero Banner upload controls; the thumbnail inventory; category controls; permanent-delete action; and specialist management cards. The permanent-save guidance states that authorization is requested only when a permanent action is selected.

The branded **Music & Video** manager was then opened with the owner’s current session authorization. It loaded the permanent sample soundtrack, sponsor label, client name, HTTPS destination, enabled campaign switch, and the **Save media setting** control, ready for the approved reversible save audit.

Before writing the controlled test, the loaded values were confirmed as: soundtrack **Inkprowl Sample Soundtrack**; label **PRESENTED IN PARTNERSHIP**; client **Inkprowl Sample Sponsor Placement**; destination `https://client-site.example`; and enabled campaign switch **on**.

With the owner’s approval, the sponsor label was changed only to **PRESENTED IN PARTNERSHIP — AUDIT** and submitted through the visible **Save media setting** control. The original label will be restored after the GitHub catalogue write is confirmed.

The manager confirmed that the audit save completed successfully with the message **“Media settings saved. GitHub Pages will rebuild automatically from this commit.”** The original label, **PRESENTED IN PARTNERSHIP**, was then restored and submitted through the same control.

The restore initially exposed a browser-side stale-revision failure. The production repair now requires cache-bypassing GitHub API reads for every owner write retry. The repair was validated by type checking, all 43 automated tests, and a production build; release `5f9acd033ce5c458c0d050d60068b18e303d0b78` deployed successfully through GitHub Pages. After reloading the live admin, the restored permanent values were visible and the controlled label **PRESENTED IN PARTNERSHIP — RETRY VERIFIED** was submitted through the repaired manager for final confirmation before restoration.

The repaired manager reported **“Media settings saved. GitHub Pages will rebuild automatically from this commit.”** for the retry-verification label. The permanent label **PRESENTED IN PARTNERSHIP** was immediately restored and submitted for final confirmation.

After the follow-up hardening release, the live owner manager was reloaded with permanent values present. The controlled label **PRESENTED IN PARTNERSHIP — FINAL AUDIT** was submitted through the freshly deployed cache-safe build; its completion is pending confirmation before the final restoration.

The final audit save completed successfully in the repaired live manager with **“Media settings saved. GitHub Pages will rebuild automatically from this commit.”** The permanent label **PRESENTED IN PARTNERSHIP** was then restored and submitted through that same successful build.

Following the immediate-follow-up repair release, the branded owner manager successfully saved the controlled label **PRESENTED IN PARTNERSHIP — IMMEDIATE SAVE**. Its immediate restoration exposed that the browser could still reuse a response-derived stale blob revision. The permanent values are preserved in the source catalogue and will be restored atomically with the deterministic Git-blob revision repair before a final live verification.

After the deterministic-repair deployment, the browser retained the owner publishing-session key across the page reload; the admin’s owner-identity resume check runs asynchronously before showing its ready state.

The resumed deployed owner session then showed **Publishing ready · inkprowl** and loaded the permanent sponsor label **PRESENTED IN PARTNERSHIP**, the sample sponsor client, the approved HTTPS destination, and the enabled campaign switch in the branded Music & Video manager.

Release `4af75c169792adbbc7278b84a2251cce4dbcc88f` was loaded from the live GitHub Pages admin URL. The branded sign-in page visibly presents the simplified **log in → choose a file → Upload & Publish** guidance and explicitly confirms that a refresh requires a new login and authorisation, while no token or media is written to local or session storage. The configured visual owner ID and password were accepted in the live form, ready to open the upload-first dashboard.

For the approved no-storage audit, the live branded Music & Video manager was opened after a fresh visual login. The permanent campaign values were loaded, the temporary label **PRESENTED IN PARTNERSHIP — VERIFIED** was entered, and the separate owner credential prompt was completed for this open page only. The browser explicitly confirms that this temporary authorization is cleared on refresh, tab close, or logout and is never stored in local or session storage.

Release `e90ab15b8aed8666def588c07020e738d13ff391` was loaded after the memory-only action-handoff repair. A new visual owner login exposed the upload-first dashboard and the Music & Video control room with the permanent sponsor settings. A temporary sponsor-label marker was prepared for the approved handoff verification.

The temporary label **PRESENTED IN PARTNERSHIP — HANDOFF AUDIT** was saved by selecting **Save media setting**, completing the one-time owner authorization prompt, and allowing the pending action to resume from memory. The manager displayed **“Media settings saved. GitHub Pages will rebuild automatically from this commit.”** with no browser storage used. The permanent label will now be restored through the same open-page authorization.

The permanent label **PRESENTED IN PARTNERSHIP** was then restored immediately through the same open-page authorization. The manager again confirmed **“Media settings saved. GitHub Pages will rebuild automatically from this commit.”** This verifies that consecutive sponsor saves resume reliably in memory only, without localStorage, sessionStorage, or cookies.

The approved artwork-category audit then selected **Panther in Pinstripe Suit**, temporarily changed its category from **Mafia Bosses** to **Business Animals**, and submitted **Save artwork details** through the same authorized memory-only owner page. The dashboard confirmed: **“Artwork title, description, category, tags, and public metadata are saved. GitHub Pages will rebuild automatically from this permanent catalogue commit.”** The original category will now be restored immediately.

The category selector was returned to **Mafia Bosses** and **Save artwork details** was submitted through the same authorized open-page session. The dashboard again confirmed the permanent catalogue-save success message, and the edit form visibly returned to **Mafia Bosses**. This completes the reversible artwork-category persistence audit without storing an authorization token in the browser.
