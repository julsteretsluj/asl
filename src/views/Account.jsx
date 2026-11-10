import { useState } from "react";
import { authMessage, useAccount } from "../account.jsx";
import { ClipboardList, Icon, LogIn, LogOut, Mail, User } from "../components/icons.jsx";
import { ProgressReset } from "../components/ProgressReset.jsx";
import { GraphicSlot } from "../components/ui.jsx";
import { useProgress } from "../progress-state.jsx";

export function Account() {
  const { user, ready, signIn, signUp, signOut } = useAccount();
  const { syncState } = useProgress();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError("Enter the email address for the account.");
      return;
    }
    if (password.length < 6) {
      setError("Use at least 6 characters.");
      return;
    }
    setPending(true);
    try {
      if (mode === "create") await signUp(email, password);
      else await signIn(email, password);
      window.location.hash = "#/record";
    } catch (err) {
      setError(authMessage(err));
    } finally {
      setPending(false);
    }
  }

  if (!ready) {
    return <p className="text-[15px] text-secondary">Checking your sign-in…</p>;
  }

  if (user) {
    return (
      <div className="max-w-md">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
          <Icon as={User} size="xs" />
          Account
        </p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Signed in</h1>
        <p className="mt-4 inline-flex items-center gap-1.5 text-[16px] leading-7">
          <Icon as={Mail} size="sm" className="text-secondary" />
          {user.email}
        </p>
        <p className="mt-2 text-[15px] leading-6 text-secondary">{syncCopy(syncState)}</p>
        <GraphicSlot id="account-signed-in" className="mt-5" />
        <div className="mt-6 flex flex-col gap-2">
          <a
            href="#/record"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-blue text-[16px] font-semibold text-white"
          >
            <Icon as={ClipboardList} size="sm" className="text-white" />
            See your record
          </a>
          <button
            type="button"
            onClick={() => signOut()}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full text-[16px] font-medium text-secondary"
          >
            <Icon as={LogOut} size="sm" />
            Sign out
          </button>
        </div>
        <ProgressReset />
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
        <Icon as={LogIn} size="xs" />
        Account
      </p>
      <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">
        {mode === "create" ? "Create an account" : "Sign in"}
      </h1>
      <p className="mt-4 text-[16px] leading-7 text-secondary">
        Your lessons, signs, and concepts stay with this email. On this device they are also kept if you are signed out.
      </p>
      <GraphicSlot
        id="account-welcome"
        className="mt-5"
      />
      <form onSubmit={submit} className="mt-6 space-y-4">
        <label className="block">
          <span className="inline-flex items-center gap-1.5 text-[14px] font-medium">
            <Icon as={Mail} size="xs" className="text-secondary" />
            Email
          </span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[16px]"
          />
        </label>
        <label className="block">
          <span className="text-[14px] font-medium">Password</span>
          <input
            type="password"
            autoComplete={mode === "create" ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[16px]"
          />
        </label>
        {error ? (
          <p role="alert" className="text-[14px] leading-6 text-danger">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-blue text-[16px] font-semibold text-white disabled:opacity-60"
        >
          <Icon as={LogIn} size="sm" className="text-white" />
          {pending ? "Working…" : mode === "create" ? "Create account" : "Sign in"}
        </button>
      </form>
      <button
        type="button"
        onClick={() => {
          setMode(mode === "create" ? "sign-in" : "create");
          setError("");
        }}
        className="mt-4 text-[15px] font-medium text-blue"
      >
        {mode === "create" ? "I already have an account" : "Create an account"}
      </button>
      <ProgressReset />
    </div>
  );
}

function syncCopy(syncState) {
  if (syncState === "saved") return "This record is saved to your account.";
  if (syncState === "saving") return "Saving to your account…";
  if (syncState === "error") return "The database didn’t answer. This device still has the record.";
  return "Sign in to keep the record when you use another device.";
}
