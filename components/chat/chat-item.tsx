import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BotMessageSquare } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquareDiff } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import FeedbackForm from "@/components/feedback/feedback-form";

export function UserChat({ text }: { text: string }) {
  return (
    <>
      <div className="p-7 max-w-3xl flex gap-5 w-full min-w-full bg-muted rounded-3xl pr-14 ">
        <Avatar>
          <AvatarImage
            src="https://t4.ftcdn.net/jpg/01/23/09/33/360_F_123093367_c7WoJ0uHCkepbgLasnGFBKK8sSNiJw6l.jpg"
            alt="@shadcn"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p className="text-foreground pt-2 w-full">{text}</p>
      </div>
    </>
  );
}

function LinkRenderer(props: any) {
  console.log({ props });
  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      {props.children}
    </a>
  );
}

export function BotChat({
  prompt,
  text,
  generation,
}: {
  prompt: string;
  text: string;
  generation: boolean;
}) {
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState<boolean>(false);

  function closeFeedback() {
    setIsFeedbackOpen(false);
  }

  return (
    <>
      <div className="p-4 my-4 mt-2 max-w-3xl flex gap-5 w-full min-w-full">
        <Avatar>
          <AvatarFallback className="bg-transparent">
            <BotMessageSquare className="w-6 h-6" />
          </AvatarFallback>
        </Avatar>

        {text != "" ? (
          <div className="flex flex-col gap-2">
            <div
              className="pt-2 g-markdown-container"
              data-generation={generation}
            >
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{ a: LinkRenderer }}
              >
                {text}
              </Markdown>
            </div>
            {!generation ? (
              <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-[150px]">
                    <MessageSquareDiff className="w-5 h-5 mr-2" /> Feedback
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Give this dialog a feedback!</DialogTitle>
                    <DialogDescription>
                      Feedback will help us improve.
                    </DialogDescription>
                  </DialogHeader>

                  <FeedbackForm
                    bot_answer={text}
                    prompt={prompt}
                    onClose={closeFeedback}
                  />
                </DialogContent>
              </Dialog>
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="flex flex-col w-full ">
            <div className="animate-pulse bg-muted h-3 w-full rounded-full mt-1"></div>
            <div className="animate-pulse bg-muted h-3 w-[80%] rounded-full mt-2"></div>
          </div>
        )}
      </div>
    </>
  );
}
