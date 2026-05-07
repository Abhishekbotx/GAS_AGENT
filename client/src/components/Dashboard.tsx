"use client";

import Transcript from "../components/Transcript";
import ToolCalls from "../components/ToolCalls";

interface Customer {
  name: string;
  phone: string;
  consumer_id: string;
}

interface Message {
  type: "bot" | "user";
  text: string;
}

interface Tool {
  name: string;
  status: string;
}

interface Props {
  customer: Customer;
  callStatus: string;
  callTitle: string;
  callSubtitle: string;
  timer: string;
  transcripts: Message[];
  toolCalls: Tool[];
  workflow: {
    lookup: string;
    call: string;
    intent: string;
    action: string;
  };
  startCall: () => void;
  calling: boolean;
}

export default function Dashboard({
  customer,
  callStatus,
  callTitle,
  callSubtitle,
  // timer,
  transcripts,
  toolCalls,
  workflow,
  startCall,
  calling,
}: Props) {
  return (
    <section className="h-screen grid lg:grid-cols-[1fr_360px] overflow-hidden bg-[#0b0f14] text-white">
      
      {/* LEFT */}
      <div className="flex flex-col border-r border-zinc-800">

        {/* HEADER */}
        <div className="h-20 border-b border-zinc-800 flex items-center justify-between px-6">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-xl">
            </div>

            <div>
              <h2 className="font-bold text-lg">
                LPG Support AI
              </h2>

              <p className="text-zinc-400 text-sm">
                Voice Workflow Engine
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">

            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>

            <span className="text-sm text-zinc-300">
              Online
            </span>

          </div>

        </div>

        {/* VOICE CARD */}
        <div className="p-6">

          <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 p-8 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 justify-between">

              <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center">

                  <div className="flex items-end gap-1 h-8">

                    <span className="w-1 h-3 rounded-full bg-white animate-pulse"></span>
                    <span className="w-1 h-6 rounded-full bg-white animate-pulse"></span>
                    <span className="w-1 h-4 rounded-full bg-white animate-pulse"></span>
                    <span className="w-1 h-7 rounded-full bg-white animate-pulse"></span>

                  </div>

                </div>

                <div>

                  <h2 className="text-3xl font-bold mb-2">
                    {callTitle}
                  </h2>

                  <p className="text-orange-100">
                    {callSubtitle}
                  </p>

                </div>

              </div>

              <div className="space-y-3">

                <button
                  onClick={startCall}
                  disabled={calling}
                  className="bg-white text-orange-700 px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all"
                >
                  {calling
                    ? "Call Active"
                    : "Start Voice Call"}
                </button>

                {/* <div className="text-center text-orange-100 text-sm">
                  {timer}
                </div> */}

              </div>

            </div>

          </div>

        </div>

        {/* TRANSCRIPT */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">

          <div className="flex items-center justify-between mb-4">

            <h3 className="font-bold text-lg">
              Live Transcript
            </h3>

            <div className="text-sm px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
              {callStatus}
            </div>

          </div>

          <Transcript messages={transcripts} />

        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="bg-[#0f141b] overflow-y-auto scrollbar-0">

        <div className="p-6 space-y-6">

          {/* CUSTOMER */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <div className="flex items-center justify-between mb-6">

              <h3 className="font-bold text-lg">
                Customer
              </h3>

              <div className="text-green-400 text-sm">
                Verified
              </div>

            </div>

            <div className="space-y-5">

              <div>

                <p className="text-zinc-500 text-sm mb-1">
                  Name
                </p>

                <h4 className="text-xl font-bold">
                  {customer.name}
                </h4>

              </div>

              <div>

                <p className="text-zinc-500 text-sm mb-1">
                  Phone
                </p>

                <div className="font-medium">
                  {customer.phone}
                </div>

              </div>

              <div>

                <p className="text-zinc-500 text-sm mb-1">
                  Consumer ID
                </p>

                <div className="inline-flex px-3 py-2 rounded-xl bg-orange-500/10 text-orange-400">
                  {customer.consumer_id}
                </div>

              </div>

            </div>

          </div>

          {/* WORKFLOW */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h3 className="font-bold text-lg mb-5">
              Workflow
            </h3>

            <div className="space-y-4">

              <div className="flex items-center justify-between">
                <span>Lookup</span>
                <span className="text-green-400">
                  {workflow.lookup}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Voice Call</span>
                <span className="text-yellow-400">
                  {workflow.call}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Intent Detection</span>
                <span className="text-zinc-400">
                  {workflow.intent}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Action Execution</span>
                <span className="text-zinc-400">
                  {workflow.action}
                </span>
              </div>

            </div>

          </div>

          {/* TOOL CALLS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">

            <h3 className="font-bold text-lg mb-5">
              Tool Calls
            </h3>

            <ToolCalls tools={toolCalls} />

          </div>

        </div>

      </div>

    </section>
  );
}