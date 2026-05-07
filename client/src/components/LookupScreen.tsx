interface Props {
  name: string;
  phone: string;
  error: string;
  loading: boolean;
  setName: (v: string) => void;
  setPhone: (v: string) => void;
  verifyCustomer: () => void;
}

export default function LookupScreen({
  name,
  phone,
  error,
  loading,
  setName,
  setPhone,
  verifyCustomer,
}: Props) {
  return (
    <section className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold leading-tight mb-4">
            Verify your{" "}
            <span className="text-orange-500">
              LPG account
            </span>
          </h2>

          <p className="text-zinc-400">
            Enter your registered phone number.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-4 outline-none"
            />

            <input
              type="text"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-2xl bg-zinc-900 border border-zinc-800 px-4 py-4 outline-none"
            />

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              onClick={verifyCustomer}
              disabled={loading}
              className="w-full bg-orange-500 py-4 rounded-2xl font-semibold"
            >
              {loading
                ? "Verifying..."
                : "Verify & Continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}