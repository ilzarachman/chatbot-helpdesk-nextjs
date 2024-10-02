"use client";

import React, {
  useContext,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  LegacyRef,
} from "react";
import {
  AuthenticationContext,
  ChatContext,
  sidebarTransition,
} from "@/lib/context-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  convertRemToPixels,
  fetchAPI,
  saveSidebarState,
  splitStringIntoChars,
} from "@/lib/utils";
import { UserChat, BotChat } from "@/components/chat/chat-item";
import { getChatbotResponse } from "@/lib/utils";
import { motion, Variants } from "framer-motion";
import { Link, animateScroll as scroll } from "react-scroll";
import Image from "next/image";
import WhatsappLogo from "@/assets/whatsapp-icon.svg";

const headerText = "Halo, ada yang bisa aku bantu?";
const descriptionHeaderText =
  "Selamat datang! Saya adalah chatbot helpdesk Unesa. Silakan tanyakan kebutuhan Anda. Jika jawaban saya kurang tepat, Anda dapat mengirimkan feedback melalui tombol feedback, jawaban akan diterima melalui email jika sudah terjawab";

const headerAppearVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const headerChars = splitStringIntoChars(headerText);
const descriptionHeaderChars = splitStringIntoChars(descriptionHeaderText);

export default function Chat({
  conversationUUID = "",
}: {
  conversationUUID?: string;
}) {
  const {
    sidebarOpen,
    sidebarTransition: sidebarTransitionContext,
    newConvHistory,
    chatKey,
  } = useContext(ChatContext);
  const { authenticated } = useContext(AuthenticationContext);
  const [history, updateHistory] = useState<Array<Array<string>>>([]);
  const [uuid, updateUUID] = useState(conversationUUID);
  const uuidRef = useRef(uuid);

  const promptArea = useRef<HTMLTextAreaElement>(null);
  const chatBoxScrollRef = useRef<HTMLDivElement>(null);

  const [isUpdatingResponse, setIsUpdatingResponse] = useState(false);
  const [streamResponse, updateStreamResponse] = useState<string>("");
  const streamResponseRef = useRef(streamResponse);
  const [prompt, updatePrompt] = useState<string>("");
  const promptRef = useRef(prompt);

  useEffect(() => {
    uuidRef.current = conversationUUID;
    focusToPrompt();

    if (localStorage.getItem("history")) {
      localStorage.removeItem("history");
    }
  }, []);

  function focusToPrompt() {
    promptArea.current?.focus();
  }

  function openSidebar() {
    sidebarOpen.fn(true);
    sidebarTransition(sidebarTransitionContext);
    saveSidebarState(true);
  }

  useEffect(() => {
    if (!isUpdatingResponse) {
      focusToPrompt();
    }
  }, [isUpdatingResponse]);

  async function getMessages(conversationUUID: string) {
    if (!authenticated.value) {
      return;
    }

    const res = await fetchAPI(`/conversation/messages/${conversationUUID}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json();
    const messages = data.data.messages;
    updateHistory([]);
    messages.forEach((message: { user: string; assistant: string }) => {
      updateHistory((prev) => [...prev, [message.user, message.assistant]]);
    });
  }

  async function createNewConversation(message: string, userPrompt: string) {
    if (!authenticated.value) {
      return;
    }

    const res = await fetchAPI("/conversation/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assistant_message: message }),
      credentials: "include",
    });
    const data = await res.json();
    updateUUID((prev) => data.data.uuid);
    newConvHistory.fn({ title: data.data.name, uuid: data.data.uuid });
    await addMessagesToConversation(data.data.uuid, userPrompt, message);
  }

  async function addMessagesToConversation(
    conversationUUID: string,
    userMessage: string,
    assistantMessage: string
  ) {
    if (!authenticated.value) {
      return;
    }

    const res = await fetchAPI("/chat/store", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_uuid: conversationUUID,
        user_message: userMessage,
        assistant_message: assistantMessage,
      }),
      credentials: "include",
    });
  }

  useEffect(() => {
    uuidRef.current = uuid;
  }, [uuid]);

  useEffect(() => {
    if (conversationUUID) {
      getMessages(conversationUUID);
    }
  }, [conversationUUID]);

  useEffect(() => {
    const _promptArea = promptArea.current as HTMLTextAreaElement;
    _promptArea.style.height = "auto";
    _promptArea.style.height = _promptArea.scrollHeight + "px";
    _promptArea.style.overflowY = "hidden";

    const _75rem = convertRemToPixels(0.75);

    function handleInputPrompt(e: Event) {
      const target = e.target as HTMLTextAreaElement;
      if (target.scrollHeight >= 200 - _75rem) {
        target.style.overflowY = "auto";
        return;
      }

      target.style.height = "auto";
      target.style.height = target.scrollHeight + "px";
    }

    function handleKeyDownPrompt(e: KeyboardEvent) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        _promptArea.value = "";
        const _prompt = promptRef.current;

        if (_prompt === "") {
          return;
        }

        setIsUpdatingResponse(true);
        getChatbotResponse(
          {
            message: _prompt,
            conversation_uuid: uuidRef.current || conversationUUID,
            history: localStorage.getItem("history") || "[]",
          },
          handleStreamedResponse,
          (response: string) => {
            if (!conversationUUID && uuidRef.current === "") {
              console.log("Starting new conversation!");
              createNewConversation(response, _prompt);
            }

            if (uuidRef.current !== "" || conversationUUID) {
              addMessagesToConversation(
                uuidRef.current || conversationUUID,
                _prompt,
                response
              );
            }

            updateHistory((prev) => {
              const _history = [...prev, [_prompt, response]];
              const _historyLocalStorage = _history.map((h) => {
                return { U: h[0], A: h[1] };
              });
              localStorage.setItem(
                "history",
                JSON.stringify(_historyLocalStorage.slice(-2))
              );
              return _history;
            });
            updatePrompt("");
            updateStreamResponse("");
            setIsUpdatingResponse(false);
          }
        );
        return;
      }
    }

    _promptArea.addEventListener("input", handleInputPrompt, false);
    _promptArea.addEventListener("keydown", handleKeyDownPrompt, false);

    return () => {
      _promptArea.removeEventListener("input", handleInputPrompt);
      _promptArea.removeEventListener("keydown", handleKeyDownPrompt);
    };
  }, []);

  function handleChangePrompt(e: ChangeEvent<HTMLTextAreaElement>) {
    const target = e.target as HTMLTextAreaElement;

    updatePrompt(target.value);
  }

  function handleStreamedResponse(chunk: string) {
    updateStreamResponse((prev) => {
      const updatedResponse = prev + chunk;
      streamResponseRef.current = updatedResponse;
      return updatedResponse;
    });
  }

  useEffect(() => {
    promptRef.current = prompt;
  }, [prompt]);

  useEffect(() => {
    streamResponseRef.current = streamResponse;
  }, [streamResponse]);

  useEffect(() => {
    if (!isUpdatingResponse) {
      return;
    }

    const element = chatBoxScrollRef.current as HTMLDivElement;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });
  }, [isUpdatingResponse]);

  useEffect(() => {
    if (isUpdatingResponse) {
      promptArea.current?.setAttribute("disabled", "true");
    } else {
      promptArea.current?.removeAttribute("disabled");
    }
  }, [isUpdatingResponse]);

  useEffect(() => {
    updateHistory([]);
    updateUUID("");
  }, [chatKey.value]);

  return (
    <section className="w-full h-svh bg-background z-10 pb-1 flex flex-col">
      <Button
        variant="link"
        className="absolute bottom-24 right-8 p-5 z-40"
        onClick={() => window.open("https://wa.me/6281333082211", "_blank")}
      >
        <Image src={WhatsappLogo} alt="Informasi Kontak" className="w-16" />
      </Button>
      <div className="flex items-center justify-center p-4 py-6 relative">
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="icon"
            onClick={openSidebar}
            className="absolute left-4 bg-[#3498DB] hover:bg-[#175782]"
            style={{ display: sidebarOpen.value ? "none" : "inline-flex" }}
          >
            <ArrowRightFromLine className="w-4" strokeWidth={2.5} />
          </Button>
          <h1 className="font-bold invisible">Title of this chat</h1>
        </div>
      </div>
      <div
        role="_chat_box"
        className="h-full overflow-y-scroll relative"
        ref={chatBoxScrollRef}
      >
        <div className="max-h-full">
          <div
            className={`mx-auto max-w-[830px] w-[830px] flex flex-col ${
              history.length === 0 && !isUpdatingResponse ? "items-center" : ""
            }`}
          >
            {history.length === 0 &&
            !isUpdatingResponse &&
            !conversationUUID ? (
              <div className="w-full mt-10">
                <motion.h1
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.015 }}
                  className="font-semibold text-8xl leading-[1] pb-2"
                >
                  {headerChars.map((char, index) => (
                    <motion.span
                      key={index}
                      className="tracking-tight"
                      transition={{ duration: 0.5, ease: "easeIn" }}
                      variants={headerAppearVariants}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h1>

                <motion.p
                  initial="hidden"
                  whileInView="visible"
                  transition={{ staggerChildren: 0.0015 }}
                  className="text-muted-foreground w-[70%] mt-4"
                >
                  {descriptionHeaderChars.map((char, index) => (
                    <motion.span
                      key={index}
                      className="tracking-tight"
                      transition={{ duration: 0.5, ease: "easeIn" }}
                      variants={headerAppearVariants}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.p>
              </div>
            ) : (
              ""
            )}

            {history.map((item, index) => (
              <div key={index} data-generation={false}>
                <UserChat text={item[0]} />
                <BotChat text={item[1]} generation={false} prompt={item[0]} />
              </div>
            ))}

            {isUpdatingResponse ? (
              <div data-generation>
                <UserChat text={prompt} />
                <BotChat
                  text={streamResponse}
                  generation={true}
                  prompt={prompt}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <div
        role="_chat_input"
        className="flex flex-col items-center gap-2 max-w-[830px] mx-auto w-[830px] relative mb-5"
      >
        <div className="w-[calc(100%+100px)] h-8 bg-gradient-to-t from-background absolute -translate-y-full"></div>
        <div
          className="w-full min-h-[56px] max-h-[200px] bg-gray-100 border rounded-3xl flex items-center group hover:cursor-text shadow-md"
          onClick={() => {
            promptArea.current?.focus();
          }}
        >
          <div className="px-4 w-full py-4">
            <Textarea
              id="_prompt_area"
              rows={1}
              className="w-full min-h-[20px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none items-center py-0"
              placeholder="Write a message..."
              onChange={handleChangePrompt}
              ref={promptArea}
            />
          </div>
          <div className="flex h-full mr-3 items-end justify-center py-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <CornerDownLeft className="w-4" />
            </Button>
          </div>
        </div>
        <div>
          <p className="text-xs">
            Please be aware that this feature is currently experimental.
          </p>
        </div>
      </div>
    </section>
  );
}
