import { Eye, EyeOff, ExternalLink, KeyRound, LockKeyhole, RotateCcw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { Mark } from "@/components/InkprowlChrome";

export default function Admin() {
  const [showPassword, setShowPassword] = useState(false); const [message, setMessage] = useState("");
  useEffect(() => {
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    robots.dataset.inkprowlAdmin = "true";
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);
  const submit = (event: FormEvent) => { event.preventDefault(); setMessage("For security, INKPROWL owner actions happen through your authenticated GitHub repository and Cloudinary account—not a public browser password."); };
  return <div className="admin-shell"><div className="admin-login"><Mark /><span className="eyebrow">PRIVATE OWNER WORKSPACE</span><h1>Good work<br /><em>needs a key.</em></h1><p>Use your authenticated GitHub and Cloudinary accounts to manage public INKPROWL content and media.</p><form onSubmit={submit}><label>LOGIN ID<input defaultValue="INKPROWL" aria-label="Login ID" /></label><label>PASSWORD<div className="password-row"><input type={showPassword ? "text" : "password"} placeholder="Owner password" aria-label="Password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label><button className="button-light wide" type="submit"><LockKeyhole size={16} /> Continue securely</button></form><button className="reset-link" onClick={() => setMessage("Password recovery is handled by GitHub or Cloudinary through their account recovery flows.")}><RotateCcw size={14} /> Reset password</button>{message && <p className="admin-message">{message}</p>}</div><div className="admin-guide"><div><span className="eyebrow">OWNER CONTROL MAP</span><h2>One public site.<br /><em>Two secure desks.</em></h2></div><div className="management-cards"><a href="https://github.com/inkprowl/inkprowl" target="_blank" rel="noreferrer"><KeyRound size={20} /><strong>GitHub workspace</strong><p>Edit titles, descriptions, categories, metadata, related artwork, download states, and ad settings.</p><ExternalLink size={16} /></a><a href="https://cloudinary.com/console" target="_blank" rel="noreferrer"><LockKeyhole size={20} /><strong>Cloudinary library</strong><p>Upload, replace, organize, and remove permanent image, music, and video assets.</p><ExternalLink size={16} /></a></div></div></div>;
}
