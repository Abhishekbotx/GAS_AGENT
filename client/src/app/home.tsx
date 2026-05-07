"use client";

import { useEffect, useState } from "react";

import LookupScreen from "@/components/LookupScreen";
import Dashboard from "@/components/Dashboard";

import {
  lookupCustomer,
  startCall as startVoiceCall,
  getCallResult,
} from "@/lib/api";

import { formatTime } from "@/lib/helpers";

export default function HomePage() {

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [calling, setCalling] = useState(false);

  const [seconds, setSeconds] = useState(0);

  const [error, setError] = useState("");

  const [customer, setCustomer] = useState<any>(null);

  const [callId, setCallId] = useState<string | null>(null);

  const [workflow, setWorkflow] = useState({
    lookup: "Done",
    call: "Pending",
    intent: "Waiting",
    action: "Waiting",
  });

  const [callStatus, setCallStatus] = useState("Waiting");

  const [callTitle, setCallTitle] =
    useState("Ready to Call");

  const [callSubtitle, setCallSubtitle] =
    useState("AI agent will call your number");

  const [transcripts, setTranscripts] = useState([
    {
      type: "bot",
      text:
        "Welcome 👋 Verify your account and start your AI powered LPG support call.",
    },
  ]);

  const [toolCalls, setToolCalls] = useState<any[]>([]);

  function appendMessage(
    type: "bot" | "user",
    text: string
  ) {
    setTranscripts((prev: any) => [
      ...prev,
      {
        type,
        text,
      },
    ]);
  }

  function addToolCall(
    name: string,
    status: string
  ) {
    setToolCalls((prev) => [
      {
        name,
        status,
      },
      ...prev,
    ]);
  }

  useEffect(() => {

    let interval: any;

    if (calling) {

      interval = setInterval(() => {

        setSeconds((prev) => prev + 1);

      }, 1000);

    }

    return () => clearInterval(interval);

  }, [calling]);

  async function verifyCustomer() {
    console.log(name, phone);
    if (!/^[6-9]\d{9}$/.test(phone)) {

      setError("Invalid mobile number");

      return;

    }

    try {

      setLoading(true);

      setError("");

      const data = await lookupCustomer({
        name,
        phone,
      });

      if (!data.success) {

        throw new Error(
          data.message || "Customer not found"
        );

      }

      setCustomer(data.customer);

      appendMessage(
        "bot",
        `Welcome ${data.customer.name}. Your account has been verified successfully.`
      );

      addToolCall(
        "lookup_customer()",
        "success"
      );

    } catch (err: any) {

      setError(err.message);

      addToolCall(
        "lookup_customer()",
        "failed"
      );

    } finally {

      setLoading(false);

    }

  }

  async function startCall() {

    if (!customer) return;

    try {

      setCalling(true);

      setCallStatus("Connecting");

      setCallTitle("Calling User");

      setCallSubtitle(
        `Calling +91 ${customer.phone}`
      );

      addToolCall(
        "start_call()",
        "pending"
      );

      appendMessage(
        "bot",
        "Initiating voice AI call..."
      );

      const data = await startVoiceCall(
        customer.phone
      );

      if (data.call_id) {

        setCallId(data.call_id);

      }

      setWorkflow((prev) => ({
        ...prev,
        call: "Connected",
        intent: "Listening",
      }));

      setCallStatus("In Progress");

      setCallTitle("Voice Call Active");

      setCallSubtitle(
        "AI is calling please pick up the call on your phone"
      );

      addToolCall(
        "bolna_voice_agent()",
        "success"
      );

      appendMessage(
        "bot",
        "Voice call connected successfully."
      );

    } catch (err: any) {

      setCalling(false);

      appendMessage(
        "bot",
        err.message || "Call failed"
      );

      addToolCall(
        "start_call()",
        "failed"
      );

    }

  }

  useEffect(() => {

    if (!callId) return;

    const interval = setInterval(async () => {

      try {

        const data = await getCallResult(
          callId
        );

        if (
          data.status === "completed"
        ) {

          clearInterval(interval);

          setCalling(false);

          setCallStatus("Completed");

          setCallTitle("Call Completed");

          setCallSubtitle(
            "Workflow finished"
          );

          setWorkflow((prev) => ({
            ...prev,
            intent: "Detected",
            action: "Executed",
          }));

          addToolCall(
            "intent_detection()",
            "success"
          );

          addToolCall(
            "execute_action()",
            "success"
          );

          appendMessage(
            "bot",
            `
            Intent: ${
              data.intent || "booking"
            }
            `
          );

          appendMessage(
            "bot",
            data.summary ||
              "Cylinder booking completed"
          );

        }

      } catch (err) {

        console.log(err);

      }

    }, 3000);

    return () => clearInterval(interval);

  }, [callId]);

  if (!customer) {

    return (
      <LookupScreen
        name={name}
        phone={phone}
        error={error}
        loading={loading}
        setName={setName}
        setPhone={setPhone}
        verifyCustomer={verifyCustomer}
      />
    );

  }

  return (
    <Dashboard
      customer={customer}
      callStatus={callStatus}
      callTitle={callTitle}
      callSubtitle={callSubtitle}
    //   timer={formatTime(seconds)}
      transcripts={transcripts}
      toolCalls={toolCalls}
      workflow={workflow}
      startCall={startCall}
      calling={calling}
    />
  );

}