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
