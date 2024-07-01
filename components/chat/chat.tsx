"use client";

import React, { useContext, useEffect } from "react";
import { ChatContext, sidebarTransition } from "@/lib/context-provider";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertRemToPixels } from "@/lib/utils";
import { UserChat, BotChat } from "@/components/chat/chat-item";

export default function Chat() {
    const { sidebarOpen, sidebarTransition: sidebarTransitionContext } = useContext(ChatContext);

    function openSidebar() {
        sidebarOpen.fn(true);
        sidebarTransition(sidebarTransitionContext);
    }

    useEffect(() => {
        const promptArea: HTMLTextAreaElement = document.getElementById("_prompt_area") as HTMLTextAreaElement;

        promptArea.style.height = "auto";
        promptArea.style.height = promptArea.scrollHeight + "px";
        promptArea.style.overflowY = "hidden";

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
            }
        }

        promptArea.addEventListener("input", handleInputPrompt, false);
        promptArea.addEventListener("keydown", handleKeyDownPrompt, false);

        return () => {
            promptArea.removeEventListener("input", handleInputPrompt);
            promptArea.removeEventListener("keydown", handleKeyDownPrompt);
        };
    }, []);

    return (
        <section className="w-full h-svh bg-gray-950 z-10 pb-1 flex flex-col">
            <div className="flex items-center justify-center p-4 py-6 relative">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={openSidebar}
                        className="absolute left-4"
                        style={{ display: sidebarOpen.value ? "none" : "inline-flex" }}
                    >
                        <ArrowRightFromLine className="w-4" />
                    </Button>
                    <h1 className="font-bold">Title of this chat</h1>
                </div>
            </div>
            <div role="_chat_box" className="h-full overflow-y-auto relative">
                <div className="max-h-full">
                    <div className="mx-auto max-w-[830px] w-[830px] flex flex-col">
                        <UserChat
                            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Consequat semper viverra nam libero justo laoreet. Id semper risus in hendrerit gravida. In aliquam sem fringilla ut. Sit amet mattis vulputate enim. Magna etiam tempor orci eu lobortis elementum nibh tellus. Fames ac turpis egestas integer eget aliquet. Amet massa vitae tortor condimentum. Arcu cursus vitae congue mauris rhoncus aenean vel elit scelerisque. A arcu cursus vitae congue. Massa placerat duis ultricies lacus sed. Sem nulla pharetra diam sit amet. Neque egestas congue quisque egestas diam in. In hac habitasse platea dictumst vestibulum rhoncus est. Elementum eu facilisis sed odio morbi quis commodo.

Libero id faucibus nisl tincidunt. Diam ut venenatis tellus in metus vulputate eu scelerisque. Ultrices gravida dictum fusce ut placerat orci nulla. Nibh praesent tristique magna sit amet purus gravida quis blandit. Turpis cursus in hac habitasse platea dictumst quisque sagittis. Tincidunt tortor aliquam nulla facilisi cras fermentum. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Amet commodo nulla facilisi nullam vehicula. Et molestie ac feugiat sed lectus vestibulum mattis. Montes nascetur ridiculus mus mauris vitae ultricies leo integer. Dictum varius duis at consectetur lorem donec massa sapien. Eget est lorem ipsum dolor sit amet consectetur. At imperdiet dui accumsan sit. Malesuada fames ac turpis egestas. Consectetur adipiscing elit ut aliquam purus sit. Dignissim enim sit amet venenatis urna. Elit scelerisque mauris pellentesque pulvinar pellentesque. Eu mi bibendum neque egestas congue quisque egestas diam. Facilisis sed odio morbi quis commodo odio."
                        />
                        <BotChat
                            text={`# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins

## Contents

Here is an example of a plugin in action
([\`remark-toc\`](https://github.com/remarkjs/remark-toc)).
**This section is replaced by an actual table of contents**.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[\`rehype-highlight\`](https://github.com/rehypejs/rehype-highlight).

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

const markdown = \`
# Your markdown here
\`

ReactDOM.render(
  <Markdown rehypePlugins={[rehypeHighlight]}>{markdown}</Markdown>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin:
[\`remark-gfm\`](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [\`rehype-raw\`](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[\`rehype-sanitize\`](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'
import ReactDOM from 'react-dom'
import Markdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'

const markdown = \`
# Your markdown here
\`

ReactDOM.render(
  <Markdown
    components={{
      // Use h2s instead of h1s
      h1: 'h2',
      // Use a component instead of hrs
      hr(props) {
        const {node, ...rest} = props
        return <MyFancyRule {...rest} />
      }
    }}
  >
    {markdown}
  </Markdown>,
  document.querySelector('#content')
)
\`\`\`

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)
`}
                        />
                    </div>
                </div>
            </div>
            <div role="_chat_input" className="flex flex-col items-center gap-2 max-w-[830px] mx-auto w-[830px] relative">
                <div className="w-[calc(100%+100px)] h-8 bg-gradient-to-t from-gray-950 absolute -translate-y-full"></div>
                <div className="w-full min-h-[56px] max-h-[200px] bg-gray-900 rounded-3xl flex items-center">
                    <div className="px-4 w-full py-4">
                        <Textarea
                            id="_prompt_area"
                            rows={1}
                            className="w-full min-h-[20px] max-h-[200px] bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none items-center py-0"
                            placeholder="Write a message..."
                        />
                    </div>
                    <div className="flex h-full mr-3 items-end justify-center py-2">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <CornerDownLeft className="w-4" />
                        </Button>
                    </div>
                </div>
                <div>
                    <p className="text-xs">Please be aware that this feature is currently experimental.</p>
                </div>
            </div>
        </section>
    );
}
