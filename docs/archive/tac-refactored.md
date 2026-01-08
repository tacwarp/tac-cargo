This is a comprehensive architectural roadmap to refactor TAC CARGO from a fragmented, hard-coded prototype into a world-class, production-ready logistics powerhouse using Tailwind CSS v4, React 19, and Shadcn UI.

1. THE AUDIT: DEE-POLLUTION & TREE-SHAKING
Before building, we must remove the "architectural debt."

Tooling for Cleanup
Knip (Essential): This is the best tool for finding unused dependencies, unused exports, and "dead" files.

Execution: npx knip

Goal: Identify which of those 50+ dependencies in your package.json are actually being imported.

Tailwind Linting: Use eslint-plugin-tailwindcss to find conflicting classes and hard-coded hex values that aren't using your new OKLCH variables.

Depcheck: Specifically for cleaning up the dependencies object in package.json.

2. INFRASTRUCTURE RESET: THE "SHADCN-FIRST" ENGINE
Your current package.json and components.json are slightly misaligned. Next.js 16 and React 19 require strict ESM and modern hook usage.

The CSS Overhaul (Tailwind v4)
Tailwind v4 is CSS-first. You must move the logic out of a JavaScript config and into your globals.css.

Delete the old @layer utilities and clay-card logic.

Inject your new OKLCH theme variables into the @theme block.

Standardize Icons: You have both lucide-react and a massive remixicon CSS file. Kill the Remix Icon CSS. It adds massive bloat. Use the @remixicon/react package (already in your dependencies) or stick strictly to Lucide for consistency.

MCP Server Integration (Automation)
To speed up the refactor, use an MCP (Model Context Protocol) server if you are using an AI-integrated editor (like Claude Desktop or Cursor).

Tool: Use a Filesystem MCP to run a recursive audit.

Command for AI: "Analyze the tree, identify components in /components/ui that do not exist in the Shadcn registry, and suggest which Shadcn Block can replace them."

3. COMPONENT ARCHITECTURE: FROM HARD-CODED TO COMPOSABLE
The screenshots show "cards" that are likely one giant JSX block. We will break these into Shadcn Blocks.

The "Logistics Dashboard" Blueprint
Replace your current custom layouts with these specific Shadcn/Radix primitives:

Current Section,Shadcn/Radix Replacement,Benefit
Inventory Grid,shadcn/ui/table + TanStack Table,"Sorting, filtering, and windowing for large datasets."
Route Tracker,shadcn/ui/resizable,Allows dispatchers to adjust map vs. manifest views.
Status Pills,"shadcn/ui/badge (Variants: outline, destructive, success)",Removes hard-coded hex colors.
Scanning session,shadcn/ui/scroll-area,Keeps the session log performant during high-frequency scans.
Invoices/Finance,shadcn/ui/data-table,Built-in pagination and column visibility.

Visual Hierarchy Rules
To achieve the "Senior Architect" polish:

The 4px Spacing Rule: Use your --spacing: 0.25rem variable religiously. All margins and paddings must be multiples of 4 (e.g., p-4, m-8).

OKLCH Power: Stop using opacity: 0.5. Use the OKLCH variables: bg-primary/50. This ensures the "warmth" of the design remains consistent.

Card Shadows: Use the shadow-md and shadow-lg variables defined in your new CSS. Remove all box-shadow: ... lines from your components.

4. DATA VISUALIZATION: POLISHING THE ANALYTICS
Your project uses nivo, recharts, and custom SVGs. This is too much.

Decision: Move 100% to Shadcn Charts (built on Recharts).

Refactor: Use the ChartContainer component from Shadcn. It automatically plugs into your CSS variables (--chart-1, etc.), meaning your charts will automatically switch colors when you toggle Dark/Light mode without extra logic.

5. STEP-BY-STEP EXECUTION PLAN
Step 1: Clean the Root
Bash

# Find dead code
npx knip --fix
# Remove unused packages
npm prune
Step 2: Implement the New Variable System
Replace your globals.css with the OKLCH block you provided. Ensure the @theme inline block is at the top. This acts as your Single Source of Truth for color.

Step 3: The Component "Purge"
Navigate to components/.

Identify any file that has hard-coded hex codes (e.g., #222222).

Command to AI: "Refactor this component to use Shadcn UI primitives and your new CSS variables. Replace custom icons with Lucide equivalents."

Step 4: The "Final Polish" Pass
Check for Micro-interactions:

Add framer-motion (already in your deps) to the Sidebar transition.

Add sonner (already in your deps) for all cargo scanning "Success/Error" notifications.

Ensure every button has a ring-offset and focus-visible state for WCAG AAA compliance.

To refactor TAC CARGO into a world-class logistics platform, we will transition from your current hard-coded, inconsistent architecture to a Modular Atomic Design system. This approach uses your new OKLCH color engine and strictly follows the Shadcn UI ecosystem.

1. The "Main Deck" Sidebar Architecture
Your sidebar is the "Control Tower" of the application. Using Shadcn Sidebar (the latest primitive), we will implement a collapsible, multi-level navigation system that utilizes the new theme variables.

Category,Primary Component,Key Navigation Nodes
Main Deck,SidebarGroup,"Dashboard, Analytics"
Operations,SidebarMenu,"Shipments, Route Tracker, Tracking, Manifests"
Ops Control,SidebarGroup,"Scanning, Inventory, Exceptions"
Finance,SidebarMenu,"Invoices, Payments"
System,SidebarFooter,"Settings, Support, Feedback"

2. Implementation Instruction: The Clean-Up Phase
To achieve 100% design fidelity and remove technical debt, follow these steps in order:

Step A: Deep-Clean Dependencies
Run Knip: Execute npx knip to identify unused files and dependencies. Delete any file listed that isn't a core utility.

Consolidate Icons: Remove the 1,500+ line Remix Icon CSS file. Replace all instances in the code with @remixicon/react or lucide-react components to enable tree-shaking.

Standardize Charts: Your package.json shows both nivo and recharts. Migrate everything to Shadcn Charts (which uses Recharts under the hood). This allows your charts to inherit OKLCH variables (like --chart-1) automatically.

Step B: Global Style Reset
Replace your current globals.css with a Tailwind v4 CSS-first configuration. This removes the need for a complex tailwind.config.js and centralizes your theme logic.

CSS

@import "tailwindcss";

@theme {
  /* Injecting your high-performance OKLCH palette */
  --color-background: var(--background);
  --color-primary: var(--primary);
  --color-card: var(--card);
  
  /* Standardizing your 4px spacing system */
  --spacing-4: 1rem; 
  --radius-lg: 0.5rem;
}

/* Base resets for modern typography */
@layer base {
  body {
    @apply bg-background text-foreground font-sans antialiased tracking-tight;
  }
}
3. Page-Specific Refactoring Strategies
Inventory & Shipments (The Data-Dense Views)
Current Issue: Hard-coded tables with manual coloring.

Production Fix: Use Shadcn Data Table. Implement "Status Badge" variants in your components/ui/badge.tsx using the OKLCH variables:

Success: bg-primary/10 text-primary

Warning: bg-accent/10 text-accent-foreground

Critical: bg-destructive/10 text-destructive

Route Tracker (The Command Center)
Current Issue: Massive components causing potential layout shifts.

Production Fix: Use Shadcn Resizable Panels. This allows users to drag and adjust the map view versus the manifest list. Replace the hard-coded map styling with a minimalist monochrome overlay to match the "soft-clay" aesthetic.

Scanning & Uplink (The High-Frequency View)
Current Issue: Static logs.

Production Fix: Implement AnimatePresence from framer-motion for scan logs. Use the Shadcn Scroll Area to prevent the entire page from scrolling when the log grows, ensuring the "Session Metrics" remain pinned and visible.

4. Advanced Tooling & Automation
To maintain this level of polish in production, integrate these tools into your workflow:

Cursor / AI MCP Server: Use a Filesystem MCP to perform a "Refactor Audit."

Prompt for AI: "Scan the /components folder. Identify any component using hex codes instead of Tailwind variables and refactor them to use the Shadcn cva() pattern."

Size Limit: Add the size-limit package to your package.json to ensure that adding new Shadcn blocks doesn't bloat your bundle size unexpectedly.

Vercel V0 / Shadcn Blocks: Before building a new page (like Payments or Exceptions), check the Shadcn Block Registry. Most of your requested layouts (Cards, Stats, Sidebar) already exist as optimized blocks that can be copied directly.

Next Action Step
Would you like me to provide the complete React 19 / Shadcn code for the "Route Tracker" using the Resizable Panels and your new OKLCH variables?

Task,tool / Method,Outcome
Code Review,Prisma MCP / Filesystem MCP,Automatically scan for hard-coded hex values and refactor to theme variables.
Icon Cleanup,lucide-react,Unified icon weight and size (20px/1.5 stroke) across the entire platform.
Animation,framer-motion,Use AnimatePresence for smooth transitions between dashboard pages.
Chart Refactor,Shadcn Charts,Move from Nivo to Shadcn Charts to inherit your OKLCH colors via CSS variables automatically.

and here is some of the youtube tutorial transcript, where we can study the concept or learn the concept that can help our project refactor or redesign it: In this video, we are going to create this whole notes application from scratch, including this fancy looking
landing page, which works awesome both in light and dark mode. We are going to
implement authentication using better o including the email verification, forgot
your password, reset password, and also with the Google adapter. Inside of our
app, we have the ability to create notebooks and notes inside of those notebooks. We have everything in the
shed CN sidebar right here. So, we can just click on our notes and we are
opening the rich text editor which looks really awesome both in light and dark
mode and you can here put whatever you like. So you can put everything to be bold, itallic or whatever you need to
make this note look nice. We are going to build this project using this text
stack and we are going to do it from scratch from the creation of a GitHub
repository to the deployment of the whole project. We are even going to buy this nodeforge.dev domain. This whole
project is open source. You have this public GitHub repository available for you in the description below. And I
really hope you're going to learn something from this video. This is something new for me as well. I've never
done these long format videos before, so I'd really appreciate your feedback if
this is something you'd like to see in future. And now without further ado, let's start building this thing. First
Creating the GitHub Repository
thing we are going to do is to create a new GitHub repository for our project.
So we are going to name it Node Forge. And we are going to put as a description
just a simple notes app for devs. We are going to set it as public. This is open
source public open code and we are going to create our repository. Awesome. So
now next thing we need to do is to actually create our Nex.js application.
Initializing the Next.js 15 App
I'm inside of my projects directory in my terminal and I'm running mpx create
next app latest. This one is going to install the latest version of Nex.js on
our machine. So we are going to name our app Node Forge. We are going to use TypeScript ESLint Tin CSS. We are not
going to use sources directory. Yes, for the app router Turboac and we are not
going to customize the import alias. So now our Nex.js application is being
installed. There it is. So now we can go back to our GitHub repository and we are
going to add our origin from my GitHub account and my repository node forge. So
we are going to the node forge directory and we are going to run the g remote add
origin and then now we can run our project and we can now open it inside of
our browser and we have here the default Nex.js landing page. So now we are ready
to install shed cnen. So we are going to shed cen documentation docs nex.js and
Setting Up Shadcn UI
we are going to run the pmppm dlx shedsen latest in it. We are going to use pmppm on this project. So we are
opening a new tab inside of our terminal and running the shetsen initialize
command. We are going to choose stone for our color. And now we have everything ready and we can start
installing some sheden components. I'm just going to add button. We are going to add bunch of components while we are
creating different features. And now we are ready to create our landing page. So
Building the Landing Page
for our landing page we are going to use one amazing library created by one amazing developer and it is called tail
arc. So this is basically a collection of modern looking marketing components
and we are going to use it to create our hero section, feature section, the call
toaction section and our footer. So first one that we are going to implement
is the hero section. It's not going to be this first one but this second one. I really like this one. I think it's good
for something like this. And I already prepared some text with CH GPT for that
landing page. So adding it is really easy. Tailorarch is using shed CN
registry. We just copy this command from here and we put it inside of our
terminal. So this one is going to add all the components that we need for our application. So we can see here hero
section, logo, header, text effect, animated group and button. So now we can
actually open our code for the first time. I'm using cursor. So, let me just make
it a little bit bigger so you can see everything like this. And we are going to close this chat sidebar. We are not
going to vibe code anything. And now we can open our hero section. So, it is
there. Awesome. And we can go to our main default page. We are going to delete all these default stuff from
Nex.js. And we are going to put our hero section. So, we also have our header.
I'm going to add that one as well. So, here I'm adding the it's called, I
think, hero header. Yes, there it is. Awesome. And now we are opening our
project. Here it's not working because we need to restart our dev environment.
We installed shredsen and bunch of dependencies. So now we can go back to
our browser refreshing and we should have our hero section just like that. So
this one is looking really awesome. We also have this header. Everything is
already working on mobile view. So it is responsive and that is everything that
we need. So next section that we are going to implement is the feature
section. So let's go on that one features and we are just going to use this first one that we have here. I
think it is enough. We're just going to put something like notebooks notes and dev friendly notes app. So let's copy
this command again and we are pasting it inside of our terminal. So we have now
features one and card and here actually the tailor has one let's say bug. So
first thing we are going to our features one we are going to name it features. We don't want it to have that one inside
the file name. And here we are going to put card from our shed CN components.
But card is not copied from to the
component/ UI directory. It is actually in our root directory. So we need to
move it to our UI here. I'm going to paste it. And also here we have this lib
utils which needs to be updated. So it should work now.
Everything should be good. And here we are just going to add that feature section inside of our page. And if we go
back, we have here now our feature section. And we need to remove this meet
our customers. We don't need this one. So that one is our hero section. Meet our customers. This whole section needs
to be deleted. We don't need it. Like this. Awesome. So now we have hero
section, our screenshot here. We are going to screenshot this later when we
create actually our application and here we have now feature section. We can now
create our next section and that one is call to action. So here we just need
this this text and get started and book a demo like action buttons. So let's add
this one as well. I'm running the command and we are adding call toaction
component and again button component. So call to action. This one needs to
use UI button from shed CN. And this one again added button to our
root directory. I'm just going to delete that one. And let's close this open editors. Okay. Nice. So now we can go to
our page and here add the call toaction section. Nice. So we can go here and we
have that section as well. Awesome. And the last one that we need is the footer.
So I'm going to the footer. And from all these footers, I think the first one is
definitely the best for this kind of application. Others are really big. We're not going to have 1 million links.
So I'm going to copy this footer from here and add it to our application. So
that one added footer and logo component. Let's go to the footer to see if
everything is all right. Everything looks good. So we can go to our page and here just add the footer.
Awesome. We could maybe call it footer instead of footer section. It doesn't need to have that section part. So here
adding the footer. Nice. And we're opening our app. So now we also have our
nice looking footer. And basically we finished already our landing page. Let's
Implementing Dark Mode
just quickly implement light and dark mode. So we're going back to shed CN.
Here we have dark mode in our sidebar. Next.js. So we are going to add the next
themes dependency. Adding that one. And then next thing we need a theme provider. So we are adding that one to
our components directory. Theme oops something happened. So this one should
be the theme provider.tsx. And there we are pasting in the theme
provider. And then we need to put it inside of our layout. So we are putting
it here. Layout we are wrapping up the children.
putting theme provider around it, importing it from the components directory. And one last thing we need is
to add our mod toggle. So I'm just going to copy this mod toggle from shred CN
and add it to our components mod toggle.tsx. And there I'm going to paste it. We need
for that one drop-down menu. So let's add also the drop-down menu. So here we
added the button. We are going to add dropdown menu.
Adding it right now. Awesome. So now we have that component as well. I'm not sure why is this Lucid React
complaining. We probably need to restart our cursor. Everything is now good. So
we can go to our header and let's see where we're going to add that mod
toggle. We can just add it for now here next to the login button. So, let's
search for the buttons login. Here it is. Let's just add it
here. Mod toggle. AI already knows what I want to do. There it is. And now if
refresh, we need to restart again our dev environment because we added bunch
of dependencies. Restarting it. And if refresh,
refresh, refresh, refresh. There it is. We have now our dark mode. It is
working. We have an issue here which is coming from our theme provider. And to
solve that one, we need to go to our layout and just put here this suppress
hydration warning. And there it goes. We don't have that error anymore, that
warning. And now we have everything working in dark mode
except this one. This is not really looking good. We should probably fix it. Let's see in the hero section. What's
wrong? So that's probably first to remove this one. That's probably some card that makes is it? No, it's not hero
section. It's actually feature section. So here we're looking for cards. It's probably this one. Let's remove it to
see what's happening. Nope. So but if we put there background background.
Yeah, now it's good. Okay. So we need to just replace all the shadow sync 950
with background background and it is good. Let's see in light mode.
Yes, it's looking nice in light mode also. Awesome. So we have all of our
components working successfully now in light and dark mode both. And now we
just need to change this text. Okay. So I copied all the text from chat GPT. I didn't want to bother you to show you me
copy pasting all the things. So now we have this text here and of course this
is just the beginning. I'm going to work on this app after this. This is probably not the final version but we are going
to deploy this one definitely in this video as it is like this. So now last
things that we have are header and footer but we are going to leave that uh
for end of our development because we can add their different links if we
create different pages. So now what we need to do is to implement better o
Authentication Setup
authentication. We are opening the better o documentation. We are going
here to docs and then to installation. So first thing we need to do is to add
our better o dependency. So we are going to our terminal and adding better o with
pmppm. Then we need to set our environment variable and that one is
going to be our better o secret. So I'm going to generate a secret here and we
are going to open actually create our env file. And here I'm going to copy my
better off secret. This one of course needs to be a secret. So keep this one safe. I'm going to delete mine after I
create this video. And now here we also put our better o URL. So this one is
localhost 3000. But when we move it to production, we are going to change it to
our actual domain. And now we need to create our better o instance. So this
one can be inside of our root lib utils, it doesn't matter. So we are going to
create it inside of our lib directory in our case. So I'm creating actually we
have already lib because shetsen created it for us. So here I'm going to create
o.ts and here we are going to paste the
better o configuration. So now here we actually need to add all of our
providers. We are going to do that later. But first thing we need is to configure our database for better o. And
to do that we are going to use Drizzle and Neon. So we need to implement
Drizzle first. We are opening the Drizzle documentation and this one to do
app with neon posgress. This one is really good if you are starting with a Drizzle application if you're using
posgress. So what we need to do is to install Drizzle OM and Drizzle kit. So
we are running this PMP adriel RM and dependency for dev the drizzle kit and
now we need our neon database serverless. So we are adding that one as well and we don't need this pmppm.env
because we are in nexjs and then we have
to set up our neon and rizo. So, first thing we need is to create our actual
Neon string variable for the connection to our Neon database. So, I'm going to Neon and I'm going to log into my
account. I'm going to create a new project and I'm going to call it Node Forge. So, I'm going to create that one
and I'm going to click connect. So here we have my string that I need and we are
going back to our documentation in Drizzle. So that one needs to be database URL and then equals to our
connection string. So I'm going to our env here database
URL and that equals to that string from my neon database. Now, this one needs to
be really safe because somebody can access your database in case somebody sees this string. And then we need our
drizzle.ts inside the db/drizzle. So, I'm going to copy this one. And here
I'm going to create a new directory called DB. And there I'm opening
drizzle.ts. And we're copy pasting it. We're not going to use env because we don't need
it. And here we have our database URL. That one is going to be there because we're using Nex.js and server components
and everything. Now, next thing we need to declare our to-do schema. We don't need to do that. Better off is going to
generate the schema for us. So, we are going to skip this part. And now we need our Drizzle config file inside of our
root directory. So I'm going to root directory. I'm creating drizzle.config.ts.
And there I'm pasting the entire thing. Removing again the env part for
that. ENV dependency and our schema is in db/s schema. It is not in the
sources. So now everything should work. Let's go back to the tutorial here. So
now we can just generate. But we need to get back to our better o documentation.
So here now next thing is to create our database tables and in order to do that
we have this generate command created by better o and this one is really awesome.
Let me show you. So here we paste it inside of our terminal mpx better off
cli generate and this one generates the whole schema for us. So let's see what's
happening. No configuration file found. Add o.dts. Okay, so it needs to have first the o
file. Let's return back to see what's happening. So we didn't put this drizzle
adapter. My bad. So we are going to our o.ts and I'm pasting in this drizzle
adapter right here. So now it should actually work. Okay, awesome. Let's go
now from scratch. Generate and this should generate o schema.ts. Yes, it's
going to create it inside of our root directory. So here, o schema and we have our whole
schema file that we can just copy and paste to our db/s schema. So inside of
our DB directory, creating a new file, schema.ts. And there I'm just going to
paste in this entire thing from better off. So now here we have actually our
whole schema file and we can run the npx drizzle kit push. So this one is going
to create all the tables for us in our neon database. And there it is changes applied. So we can now get back to neon.
And here when we go to our tables we can see that we have account session
user verification and all the tables that we need for our better o authentication. We can continue now in
the better o documentation. So we created our database tables. We have that part finished. Now we need
authentication methods. So first one that we're going to use is the email and
password. So we are going to our o.ts ts and we are going to put in email and
password enabled true. Then we need our mount handler. So here we have for the
NexJS this one. So I'm going to copy it. It needs to be inside the API O. Then
here this all slug and then route.ts. So I'm going here inside the app
directory. It needs to be API then O
then like this all and here just route.ts.
So here I'm pasting in the code from better o documentation and now we need
to create our client instance. So that one is going to be inside of our lib directory oclient.ts.
We are just going there inside the lib oclient.ts
and we are going to paste it in. And for this localhost 3000 we are going
inside of our env file and we are going to put in the next public
base URL. That one is going to be for now localhost 3000
like this. And we are just going to use that one inside of our O client not
schema O client here. So here we are putting in process env next public base
URL this one and that one should work. So now let's go back here. Now we can
actually use our sign in sign up and everything from our o client. So we basically finished our configuration
with better o. We just need to make it work with our application. Let's first
create our server directory inside of our root. So that one is going to be
used for our server actions. And here first one that we're going to create is
users.ts. So here we are going to create sign in and sign up that we need now for our
users. And we can find that one here in the basic usage in the better oath
documentation. So here we can see we are adding the email and password as enabled
and we can do it also through the client but that one is not good for our case
because we're using Nex.js and we want to control everything from the server side. So we want the O.API
way of doing it. Here it is. So we can do it from the server side and we are going to copy this part from here and
put it here. So export const sign in
user and that one is going to receive email and password and we are going to put it
like this here. So we are going to import O from the lib / and we need to
mark this one as a server action like this. So we are putting the use server
flag and now we can here actually sign in our users. So we are going to add the
try and catch and here we are going to remove this response and we are going to
return some kind of like this success true and message signing successfully
successfully. So this one we are going to display it inside the toast and for our error we are going to put yes just
like this we are going to send success false and we are going to send a message
here. If you can see that this E do message, this one is coming actually from better o and those messages are
really they they sound real. They're not like fatal 500 error. They sound like
you cannot sign in you your password is not good or something like that. And now
we are going to create the signup user. AI should now know exactly what we need.
So here we are just going to add name because we need name for our new user.
There it is. And now we can just send the same success true signed up successfully. And now we can actually
use this one on our front end. We can also remove this as response. We are not waiting for anything. We don't need any
response. We are making it ourselves. And now we have our back end basically
for sign in and sign up. So what we are missing is the front end and for that we
are going back to shed CN and we are going to blocks then authentication and
from here we are going to take this simple login form we are taking the not
the npx we need the how do I take from
here I don't know let's just use this npx I think I can just put here P on the
beginning of this command and yes it is working. We're going to add card again
and we added our login form input label card button. So we can now create our
login page. So we're going to our app new folder and here we are going to
create login and we already have it. Okay. Why do we have this one? Oh this
one is already created by I guess by shed CN. So let's see how is
this working. I actually never I'm really surprised by this login and we
already have our login page. Okay, awesome. So now we are going to create
here our sign up page and we can just
copy this page from here and put it inside of our sign up. So here we are
now going to create a new form signup form instead of the login form. And
let's go to the login form. We are going to create inside of our components
directory new directory called forms. And I'm going to move the login form
there because we are going to create bunch of forms. It's really good to have
some separated directory for this. And now we are there going to create signup
form.tsx. So I'm going to copy and paste everything from the login form. And
first we need to add react hook forms to our login form and to make our login
work. So for that going back to shed CN here we have some bugs. We're going to
solve them later. And we are opening the command K is not working normally. Let's
see like this. We are opening our forms. So react hook forms and for that we need
to run the pmppmdlx shred latest add form adding it to our project. So this
one is adding also zod and everything that we need from react hook forms and also form button and label components.
And now to use it is really simple. So we are adding here inside of our login
form. Let's close all other components and we are adding here the use client
importing zod and creating our form schema. So for that one we are going to
put email and password. Then next thing we need our zod resolver and use form
from react hook forms. So we are adding that one on top of our file. Then inside
of our component, we're adding the form and on submit. So adding it
here and default values for email and password are by default empty. And now
we need to put in our shaden components. So button form and input going in. I'm
putting them here below our other components and imports. And one last
thing, we need these inputs. So I'm first going to add this form and we have
here we are repeating some components. Let's delete those duplicates. Okay,
nice. So now we are going to put here
form and we are going to close it in the end of our file
like this. And let's see if it's looking still the
same. We maybe changed some uh components. Login form. This one is on
the login page. So let's check the login page. Login form. It needs to come from
our forms new directory. There it is. Okay. So design looks the same. That one
is good. But we need now to put in everything that we need for our form. So
going back to shed cien we need to create it like this and our button needs
to be submit. So removing this form from here
like this. We can actually move our form inside the card content. I
thought that button is actually inside the card footer but it's not. Okay. And
now we can copy this part. And instead of our label and input, we can put this
whole snippet. So this one is going to be for our email. Here we are putting the
example. This is your email. Maybe we don't even need this description. And
now below instead of this other password and let's see where is it the input here
it is this one we are putting the password
example this is your password let's see how does it look okay it's nice except we have two labels
so we need to remove this password label here.
Nice. And we are going to remove also these descriptions.
It's really obvious that these are that this is for the email and that this is for the password. Okay. Nice. And forgot
your password should be in line with our label. So I'm going to move it. Where is
that? Here it is. This one.
So this whole snippet, I'm putting it next to our label and I'm moving the
label inside of that snippet right here. So let's see it now.
Awesome. So that is what we need. We're going to create also the forgot password functionality. And it looks really nice.
So now if we click login we are instantly calling our onsubmit which is showing
that we don't have these inputs and that one is good. So now let's see what's the
error here. So uncontrolled input to be controlled something is happening. Okay
we're going to fix that. Let's first on submit call actually our signin user. So
we are importing sign in user method and we are going to put here try and catch
and we are also going to create here is loading
state. We are going to call it in the beginning
of our onsubmit and we are going to
on finally here we are going to set it as false. So here we need sonner, we
need toast. So we are going back to sheden quickly. And here I'm looking for
soner. There it is. We are just going to add it quickly to our application
running pmpmdian latest add soner. And we are going to add that toaster inside
of our layout. So here I'm adding the toaster
from our components UI soner. And now inside of our login form we can actually
import this toast from soner and that one is going to work. Now in our button
I'm putting disabled when is loading. And here
we are going to put the loader two icon with size four and animate spin
like this. Nice. Let's see if everything is working smoothly. We don't have any
errors. Awesome. So now if we log in everything we don't have that error anymore also. So if we try something
like some input like this and some password
this one needs to be type password and login. We have the model user was not found in schema object. Okay. So this
one is coming actually from our drizzle adapter. We need to fix this and I know exactly what it is. So in our schema we
need actually to export all these as a schema. So like this. Export
const schema. Yeah, just like this. And now this one we just go to drizzle.ts
and here we put in the schema and we import it from our schema as well and
also to our o. So here also we put schema so we know exactly where is this
schema coming from. And we also here import our schema. Awesome. And now
let's try it again. So here we go with some email.com and here 1 2 3 4 5 6 7 8 login and we
should get some more normal yeah invalid email or password. So this one is now actually coming from our better off and
our configuration is now working as it should. Let's go to our login form
password to put this type password inside of our input where it is. Here it
is. type should be password. Nice. And also all these afs should be
link component from Nex.js. So we are putting links
everywhere here also. Let's see if there is any more a ref. Nope. And this one is now
complaining about something. Can find them div is everything looks good. Let's just
again reload the window. It's probably some silly thing. And we don't have any
more AFS. And this one now looks good. Removing all the imports that are not
used. And we can actually what is here happening? This one is deprecated. It is
now actually not the email. It is Z.
Like this. Yes. Awesome. And password is minimum
eight. That is good. So this part should be now okay. And we now need to copy
this entire form. Put it inside of our sign up form. And here we are going to
add now name. N name. Okay. And also we are going to
add it here when we are signing up. And we are going to put the confirm password as well.
And we need to add those fields. So here we first have our email field. We're
going to leave that one to be the first. Then we have the
password. Let's actually copy the password field because we want to be
type password and everything. So that one is going to be confirm password. And
here also confirm your password. That should be good. And now we need our
name. We're going to put that one below of the email name
here. John Doe. That one should be good. And let's go to our signup page. So
login. Sign up. We should maybe call it sign in instead of login. So here we are
not putting in the signup form in the right way. It should be again from the
forms and is it called oh it is not called signup form. It is actually called login form because we copy pasted
it. Where is it? Login form. Here it is. So this one should be signup form. Okay.
Nice. So here it is. It's looking okay. We just need to remove this confirm your
password and forgot your password from the signup form. So forgot your password. We can remove this link from
here and also this other one for confirming
like this. Awesome. So we now have just a regular sign up form except it
shouldn't be log into your account. It should be sign up and here as well. And
let's see where we have. So sign up
or just maybe we can say here create your account and enter your email below.
To create an account we can say enter your details below to create an account.
Okay. And here we are going to put the link to login. If we already have an account,
there it is. So, if you click login, we are going to login. If you click sign up, we're going to sign up. So, this one
is working nicely. Let's now inside of our signup form on submit. On submit
here, so we want to actually create our user. So, we created signup user from
our server actions. Here we are importing it. Let's just remove this signin user. So now this one should
create the user for us. Let's try it out. I'm going to put in my email the
ordevgmail.com. My name ordev and password. Let's put
just anything. And I'm going to sign up. Let's see what's going to happen. So now we signed
up successfully. That's nice. Let's see neon if I actually created my user. So here I'm clicking refresh and there it
is. It is working from the first try. Awesome. Email verified false. So we are
going to create email verification later. But now if I put this one to true
and save. I should be able to log in to my account. So let's try it out. We are
going to log in. And here I'm typing in the ordev@gmail.com
and my password login and sign in successfully. It is working.
Awesome. So now we need to do the redirections and everything. We are
going to create some kind of dashboard where we're going to redirect our user. So let's do that. So in our app creating
a new directory called dashboard. That one is going to be for all the users
that are logged in. And inside I'm creating page.tsx.
We are just going to show this dashboard text nothing else for now. So we just
need to see if our user is really logged in. And we are getting back to our better o documentation. So here we are
now going to integrations and then next. So what we need from here is the
middleware and also we need to add one more thing to our OTS and those are the actual next cookies.
Here it is. So inside of our plugins we need to add next cookies
and we are going back to our o.ts. So here in the end of our o we are
adding next cookies and that one is imported from better oorththnext.js. JS.
So this one is needed if you're in XJS. We have to have this and it needs to be the last one here inside of this O.TS.
And now we are going to add also the middleware. Here it is. Copying it. And
we are going to our middleware. Oh, we don't have it. Sorry. So we are creating inside of our root directory
middleware.ts. And here we are just pasting this one in. And here we can see the comment this
is not secure. This is the recommended approach to optimistically redirect users and we are doing that. So we are
going to add later inside each ser action the check if our users are indeed
logged in. So I'm going to delete all these comments and from here also and we can
see that here our dashboard is actually protected. So if we go now inside of our
application here, if we go to our dashboard,
we can see actually our dashboard. So we just need now a logout button. Let's
create one quickly. So we are going again to our components directory and there we are creating logout.tsx.
So that one is going to be just a simple logout button.
but from Shetsen of course and we are going to create handle log out and that
one is going to call our O client
and that can call the sign out function from O client and we are going to put
this one to be outlined button like this and also we need here to redirect direct
our users to the landing page. So we are going to
add the router from next navigation. And now this one should work. So let's see
if we add it to our page dashboard. Here I'm going to add the logout button. We
can just say here dashboard. Okay. So we need to put use client on
our log out button. That one needs to be a client component because we are using the router for redirecting. And there it
is. Log out. If we click it, we should be logged out now. There it is. Awesome.
And if we go again to the dashboard, we should be Yeah, we are now redirected
basically to our back to our landing page. So that one is working. Now we can
put inside of our header for this login button that needs to go to slash login
this one to SLS signup. So we can go here to login now login with our user
and we should be redirected to our dashboard. Oh, we are not actually redirecting. Okay, so we need to do that
inside of our login form. So here if success we need to redirect to the
dashboard. So here we are going to add the router from next navigation like
this. Awesome. And now when we log in so we should probably now be able to access
the dashboard because we are logged in. Yes. But we want in case when we are
logging in to automatically just go to our dashboard. So now when I log in, we
are being redirected. We have the toast message and we redirected here. So we basically finished our batter
authentication. Now we need the forgot password functionality and the email verification for our new users. Let's do
Email Verification Flow
first the email verification. So we are going back to better documentation. Then
here we are going to authentication then email and password. And here we have the
email verification. So for that one we are just putting this
whole thing inside of our o.ts. So we are going to our o I'm going to
close again all other files and we are putting in the email
verification. So we are basically here sending the verification email. We are going to use resend for this. So we need
to install resend. Here we are in the documentation going to Nex.js quick
start. And here we are going to install our resend dependency. So adding that
one to our project. There it is. And now we need an email template. We're going to create this one on a different way.
Then we need to send email using resend.
So we need to create an instance of resend. We're going to do it here inside of our auto. TS. So here I'm going to
import resend from resend. Come on AI, help me out on this one.
There it is. And we need to add our resend API key. I already added that
one. So you take that from your recent dashboard. And now for sending the
actual emails, we just need to copy this part from here. So I'm going to copy and paste it
instead of this send email. And here we are going to send it to user email. And
we are going to create verification email with a new tool that is called new
email. This one that one is also created by recent and it is basically like a v0ero
for creating emails. And we're going to ask create me an email for user
verification like this. So now that one is generating
an email for us that is looking good that is following all the best practices is going to have probably one big verify
button on the middle of our email. Yes, there it is. Awesome. So now we can just
copy and paste this one. I'm going to take this code codes this whole code
snippet and I'm going to create inside of our components a new directory called emails and there I'm going to create
verification email.com. There I'm pasting in the entire thing
and I'm going to remove these preview mockup data that they're using. What? Damn, I named it com. It should be tsx.
Sorry. And now we need to add this react email/components dependency
as well. So pmppm add re at react email components. Nice. That one is good. And
we are going to create an interface user verification email props. But we are going to call this one. This is a good
name verification email. I think that one is good. Verification email. So it
can be without the user for our props
like this. Awesome. And we are sending the user name and verification URL. So
we can delete this props from here. And here just import username verification
URL. And let's see where is that one used. Here we need to remove these single
quotes like this. And here we just need to remove also this user. Nice. So this
one should work. Let's try it out. We also here we need to put in the email
that we actually are going to use to send from. So for this you need to verify your own domain or you can use
this testing onboarding at resend but you cannot use it of course forever. And let's now just import our verification
email. So here we are sending the username and verification URL. So that
URL when it is clicked it is automatically going to verify our user for us. So we can now put here nodeforge
and for the email we can just put noteforge ordev.com because I have this email associated
with my resend account. And now here for the email verification
we can just say send on sign up and that one to be true. So whenever we sign up a
new user we are going to receive this email. Let's try it out. So going back
to our application we are going here and let's log out and we are going to sign
up a new user. So now I'm going to use the orcde dev plus test@gmail.com.
If you ever want to test multiple emails and you already have email inside the application, you can just use plus
something and that one is going to work. You're going to receive the emails. We're going to put orgdev 2 and here a
new password. Oh, we actually forgot to put in to match these two passwords. I'm
going to make it later. So now sign up and let's see if this one is actually going to work. Sign up successfully.
Nice. And now I should receive an email. We first need to change this signed up
successfully to put in in the toast there. Please let's say like this.
Please check your email for verification. Nice. Okay. And now let's see if email was successfully received.
So I'm going to my ordev. There it is.
Note forge. So I'm opening the email right here. I received it on my email
and I can now copy this link. But first before that, let's go to neon here. I'm
going to refresh. So we have orgdev 2 and email verified is false. So now if I
go here and paste in that link, something happened. I saw some error.
Let's see if it's actually verified. Yes, email verified. True. So, this one
is working. Awesome. And now I can go back to login screen.orgddev@gmail.com
actually plus test@gmail.com. And when I type in my password, that one
is working. We are successfully going to the dashboard. So, our email verification is successfully
implemented. Awesome. Next thing we need to do is the forgot password and reset
Forgot & Reset Password Feature
password functionality. So we are going back to the documentation here. Now in
the same section for email and password we have this request password reset. So we are
going to put this one inside of our email and password provider. So we are
putting in send reset password and that one is going again inside the o.ts.
So that one is going here. Send reset password. So we need now to generate a
new email reset password. So we are going back to new email and we are going
to tell create me now an email password reset
like this. And while that one is being created, we can go here and remove some of the
these things that are not used like this one. So this email, we can go to our
emails here. Create reset email.tsx not.com this time. And
here we are going to copy paste from here. So here it is. Reset your password with just a simple button. So we are
going to copy and paste that one inside again removing the mock data and this as
well and we are going to put a new interface where we are sending username reset URL and request time and maybe we
don't need it request time but let's just let it be there. So now also single quotes
replacing those so we don't have these warnings. Nice. No warnings in this file. And we can now go back to O and
send the password reset email. So let's just
import it from here. We can remove also this request and token. That one is not
needed. We have everything inside the URL. And this one like this. Nice. So we are now sending
here our username request time and new date transferring it to local string. So
this one looks good. We are sending it from the same email. Subject is reset
your password. So this one should be good. Let's now go to our signup form
and we are going to copy paste maybe actually better login form because that one is smaller. And we are going to
create two new forms. One is reset password form.tsx.
I'm copy and pasting this here. And instead of login form, we're going to call it reset password form. And the
other one is the forgot password form.tsx.
And also copying it here. And now changing the name. And now for each of
these forms, we need to create separated pages. So here we're creating forgot
passwords and inside page.tsx. So we are going to steal again from the
login page this one and putting it here but instead of the login form we're
putting forgot password form that is going to come from the same forms
directory and same for the reset password new directory reset password
I'm going to copy paste this one creating page tsx and pasting it in
reset password form also importing it from our forms directory and now we can
open here if we go let's say first if we log
out inside of our login form we have that forgot your password we need to
lead that to forgot password here and in the sign up I don't know if we have the same thing no okay so only in the login
form so now if we go here and forgot got your password. We are going to our new form. So this is forgot password screen
and there we are just going to type in our email. So we are going to forgot password form and we are going to this
password. We don't need that one. We are removing the password and also here the
password input like this. Nice. So if you go here we have only the email. We
are also going to remove the login with Google. call this part from here
and I forgot about one div and this sign up we can leave this one and also here
instead of login we're saying forgot your password and enter your email below to reset your password and we can also
remove this router push dashboard because we are not going to redirect our
users anywhere they're going to stay here and receive an email which is later going to redirect them so now We are
going to put in instead of this await sign in user here we are going to put
like this error equals to o client and then forget password like this and we
are going to send our email. So now here instead of these responses we are going
to put error like this but AI keeps destroying
me and we are just going to put toast
and he already changed the text. Nice. We just going to put error here for the
message and this one should work. Let's just see why our is loading is not used.
Submit. We lost our button from some reason.
Yes. Okay. So, we need our button back. I probably deleted it somehow
when I removed bunch of unnecessary stuff. Okay, we have reset password button.
Don't have an account. It's going to sign up. Good. So, now I'm putting in my
theorggmail.com original email that I used. Please check
your email for a password reset link. Nice. So, I'm going to my email. I can list this verification email. That's the
old one. And I should now receive the here it is. Reset your password. So, hi
there. We received a request to reset your password at that time. And I need to click this link. Okay. So, I'm
copying this link. And this one should lead us to the reset password page. But
I think I forgot to add that one here. So on submit, we should put here. Yes,
redirect to reset password. I'm not sure what is going to happen now. Let's try it out. So now if I put in Yeah, we
don't. It's not good. So let's do it again. Going again. Login. Forgot my
password. The ordgmail.com. Reset password. And now I should receive
again that same email. Deleting this one. Here it is.
I'm copying again the link and pasting it inside. So let's see. Nice. So now we
are on our reset password page. And as you can see we have this token equals to
this hash code. So we can actually use this to reset our password. But of
course we need to change first our form. So let's go there to our reset password
form. And here we are going to put instead of the email we want password
and confirm password like this. Yes. And then here we are going to remove this
whole email. This one. And we are going to remove also this link for forgot your
password because if somebody's here I guess he knows he forgot his password.
And now adding totally new field and that one is for confirm password. And
here on our unsub onsubmit we are going to call the
again the o client and that one is going to use reset password. We are putting in
the new password and we have to send our token and we have our token as you
remember here as our search params. So we are going to search it from here. So
search params use search params from next navigation and we have the token as
our search params here. So now we can just send that one inside of our O
client reset password. And we are here also going to do the same thing. We're going to call this error. And we are
just going to check here if we don't have error. We are going to put password
reset successfully and router push to login if we successfully reset our
password. So here we just need to change our text. Reset your password. Enter your password below to reset your
password. Awesome. And for this confirm password, we need to check if values are
equal. And we are just going to put in the toast and return and do nothing. And let's do that also for the signup form.
So here, nice. There it is. So let's test it out. Going now here. Reset your
password. Oh, we need to remove this login with Google also. We don't need this button. Nice. Okay, putting now 1 2
3 4 5 6 7 8. And here also 1 2 3 4 5 6 7
8 9. Let's try it out. Good. So this part is working. Deleting one login. Oh,
this one needs to be reset password. Password reset successfully. Nice. Let's just change this login to reset
password. And now we can try it out. So the orgdev@gmail.com
and 1 2 3 4 5 6 7 8 login. Let's see if this is my new password and signing
successfully. Nice. So we have completely implemented better o. We have
just one small thing and that's the Google login. So let's go back to better
Adding Google Authentication
off documentation once more and we are going here in the authentication to Google. There it is. So first thing we
need to do is to get our Google
credentials. So in order to do that we are going to the Google cloud console and here we need to create I already
created a project. So you create here the project for you and you go to
credentials. Then here you're going to see this that you need to configure your consent screen. So you need need to do
this. We are going to get started. We are typing in the app name node forge
support email then next. Here you're putting external. Next then for the
contact information I am just going to put my org dev gmail and then go next.
And here you just agree and continue create. So here now we created the
consent for our oath. And now we can just create our oath client. So here
what you need to do you need to put in the web application. We are going to name it again node forge and we need to
authorize redirect URL and you have that inside the better o here. So you see
they place here what you need to put there and we are just going to copy it
and put it inside of our Google console. So here we are adding that redirect URL
and we are just going to create it. So now from this you're getting your client
ID and your client secret and you put this inside of your ENV file in order
for Google authentication to work. I place those credentials inside of my ENV
file. And next thing we need to do is to put these social providers. So Google
inside of our o.ts. So we are going back there and I'm going to put here social
providers then Google and I have these env variables. So this one should now
work. We just need to put in sign in with Google from our o client. So we are
going to put this sign in inside of our login form. for example. So here we need
our sign in function like this and we are
going to import o client and we can now actually log in through Google. So here
login with Google we are just going to put on click sign in and this one is
going to be type button because this is going to activate our form in case we click it. So now if we go back to our
application and if I log out we go to login and here login with Google that
one is leading us to the Google authentication page. So now if I click
to login with my email we are getting in sign in to node forge and we are
automatically signed in. So now if we go to the dashboard it should work. Yes. So
we are logged in and our Google authentication is working correctly. We just need to redirect and that's the
only thing left and that is easy inside of this function. We just need to put in
the call back URL and that one is going to lead to / dashboard. So whoever logs
in is going to the dashboard and we are also going to copy this function inside
of the signup form. So here, not here, but here we're going to put it like
this. We're going to call it signup and we're going to import o client and use
it on our Google button. So here we are putting on click signup and type button.
So we don't even need to test this one out. This is definitely going to work. And we have successfully implemented our
better o implementation. So we can now move on to our dashboard. First thing we're going to do here is to create the
Creating the Sidebar Layout
sidebar. So we are going back to shed cen blocks and here sidebar. The one
that we need is this one with collapsible sections because we want multiple notebooks to have them here.
And when we click collapse then we are going to have bunch of notes from that
notebook. So I'm going to take this one npx and add sidebar number two and I'm
going to put it to our project. So now we are adding bunch of components. Let's
see what are we going to get. So we are adding we have the file page.tsx
and would we like to overwrite it? No. So we are adding here app sidebar search
form version switcher sidebar separator bunch of components. So we see that we
have now sheet tool tip skeleton breadcrumb. We really added a lot of
components and the reason why I didn't overwrite my page. I don't know which page it was. We already have our landing
page created. So it would be bad for us now to overwrite it. So we are now going
to our dashboard page dashboard. This one I'm going to close all other files
and here as well. And we are going to create inside of our app dashboard the
layout.tsx file and there we are going to add our
sidebar. So let's check our sidebar. We are going to app sidebar and collapsible is missing. That's interesting. Let's go
here to collapsible and just add it quickly to our UI directory. There it
is. And now we can check here. This one
should disappear. There it is. So we can just import this app sidebar inside of
our layout to see how it looks like this. Importing it. And now if we go back to
our application, we need to use sidebar. Use sidebar must be used within a
sidebar provider. So to explain you this, we need to go to sidebar. So here
we can see how sidebar is implemented. So we have here the structure and inside
of our layout we need to have this sidebar provider and there we need to
put our app sidebar. So we can then put sidebar trigger and all the things wherever we want. So we are just going
to use this part from here and put it inside of our layout file. So here we
are adding the sidebar trigger and sidebar provider like this. And if we check here sidebar
app sidebar is actually built by us but this one we are fortunate enough to have
that block inside of shed CN. So let's check how is it looking now. Now we have
actually our sidebar which is working normally and we have also this part
here. We're going to change it a little bit but this one for now looks fine.
Building the Page Wrapper
What we need to do now is to make this look much better. So we are going to
create a component that we are going to call page wrapper.tsx.
So here we are going to put in the children. So we are going to pass in
everything that is going to be inside of our other pages inside the dashboard and
we are going to put breadcrumbs. So we need our interface for that this one and
we are going to receive not the title but we are going to say breadcrumbs and
that one is going to receive label and href. So this one is good and we are
going to pass it here. So we are going to the breadcrumbs in shed cnen to see
the usage of breadcrumbs. So we need to add this one.
So we are importing our breadcrumbs component here and we
are going to just put it inside of our component. Here is the usage. We are
going to put it here like this. Nice. But we are going to do it dynamically.
So here we are going to map through our breadcrumbs and put in all the labels
and crafts here like this. We can remove the breadcrumb page and breadcrumb
separator. We don't need those. And let's just put it like that. Here we are
going to call this one header because this is basically the header. It's going to be on top. And let's just put it
inside of our dashboard page. I don't know if it's this one. Yes, it is. So, instead of this div, we are going to put
page wrapper. Import it. And let's see how does it look. So, if we go back, we
can see that we have now here our dashboard here, which is a breadcrumb.
Then we are going to put the wrapper div around this header. And I'm going to
move the children outside of the header because we want the header to be on top and children below. So this flex call is
actually going to work inside of this div and inside of our header we're going to put flex items center gap of four
little bit of padding here and there. So let's see how is it looking now. I think it's much better. It's just this trigger
needs to be inside here. So here we are going to put the sidebar trigger.
We can call it now because we are inside that sidebar provider and in our layout we are going to remove that trigger. So
now trigger is actually going here. So this one now looks much better. So let's
handle also this content a little bit. We are going to put here max width of
let's say 7 XL and MX auto and also little bit of padding. Let's say 6
pixels. There it is. I think this one looks much nicer. But we're going to put this
actually here to wrap up the children again like
this. And now we are not moving our top header from here. So we can use the
sidebar trigger. And we have our content now moved a little bit from our sidebar.
And it is looking much better. So now we want also to put here this logout button
and to do that we are going to put here the logout component that we created and
we'll need to change a little bit everything because currently our whole
layout is really small. So here I'm going to put instead of this one
flex then flex one and something like this. So let's see how does it look. It
should now be bigger. So if we use our famous border here we can test it out.
So we can see that it is really small. So we need to put inside of our layout
here we need to put also flex one like this. And now our
whole layout is really big. So we can move this log out in the right corner.
So going here and we're going to put justify between and with full. Maybe we
don't even need with full. Let's try it out. And here we're going to wrap up the sidebar trigger and breadcrumbs inside
of one div. That one is just going to be flex item center gap 4. And we can
remove the gap here. And let's check it out. Nice. So now our logout button is
in the top right corner. And this one is here. But our padding is not working
well. So we are going to put here inside of our header. something like this.
Let's try it out. So now it's a little bit better except this logout is looking
really ugly. So we are going to put also let's just put padding of four. And I
think this is now much better. So let's now remove our border and we can add
border bottom to our header. And that one is probably going to look nice. Yes.
So this one is great. We have our sidebar trigger. We have our breadcrumbs logout button. Let's just add next to
the logout button here the mod toggle for
light and dark mode. So here adding the
mod toggle this one. So now we can also change to light and
dark mode and test out everything properly. And it is time now to start
Planning the Database Architecture
with our actual features and that is the ability to create notebooks and inside
of those notebooks our notes. So to do that we are going to create inside of
our server directory the new file and we are going to call it notebooks.ts.
And here we are going to create all the server actions. But before that let's close all the files. We are going to our
schema file and here we are going to create new tables. So first one is going
to be called notebooks and that one is going to have so we need name of that
notebook. We need to assign user ID to that notebook because we need to know uh
who is this notebook coming from and also we need that notes table. So we are
going to create new notes. AI already knows what we want. So we have here
title for our note. We have content which is in this case text. But we want don't want that one. We want it to be
JSON because we are going to use tip tap rich text editor and we are going to
save actually here JSON from it. So we we are going to see it later. And we are
assigning notebook ID. So we know to which notebook is this note associated.
And we also need to create our relations. So notebook relations like
this. So one notebook can have many notes and also here one note can have
only one notebook and we also need here user to put in the relation for our
notebooks. So now if we want to make a query to get the notebook with our user
and with all the notes we can do it easily and also the same thing for our
notes when we are getting a note we can get our notebook together with that note
inside of one query. So this one looks good for now. If we need we are going to
add additional columns or something and only thing left is to create types for
each of these tables. So we are going to do it both both for notes and notebooks. So we are
going to use this inside of our front end to know what can we expect inside of
our notebook data. So we are later also going to add additional types but let's
just leave it as it is now. And now we can go back to our notebooks TS file
Notebooks – Server Actions
which is going to be basically CRUD for our notebooks. So we are putting in the
flag use server and we are going to create create notebook. So that's the
first one. It's C out of CRUD and we are going to import there DB also notebooks
out of our schema and we are going to put in try catch like this. Awesome. And
also we want here our o that is coming basically from better o and we are
getting our user ID out of there and we are assigning it to our notebook. Now we
have this warning here where we are basically missing the ID and the way to fix that is really easy. So we are going
to our schema again and here for our notebooks where we are exporting type
notebook. We are going to export type insert notebook like this. So we
are doing the infer insert and we are going to pass the data basically here.
So we are going to call it values and we are going to call the insert notebook
type and just use it for our notebook right here. So we don't even need to do
this. We can just do something like this. So we are basically passing both the user ID and the name of our
notebook. And now we don't have the warning. We can just do it easily like
this. And we don't even need this user ID. We can also delete this part because
we are definitely when we create our notebook we can pass actually our user ID because we have it there with our o
client and let's just leave it like this. So create notebook and we can
return this notebook created successfully success true and this success false. So we can use that later
in our toast messages. Now we need our get notebooks. So we are going to just
get all notebooks by our user. So here we actually need our user and our
session to get it by our user ID. So here let's check if we actually have
that user. Import everything if not
user ID like this. And we're getting the user
from the notebooks where user ID equals this one. So let's see what is it
complaining about. It's declared two times. So here it should be notebooks by
user and we are sending that one back to our front end. So this is getting the
notebooks. Now we need our update. So
export cons get notebook by id. We can also create this one. So we are
definitely going to use it. And now update. So here we are also sending the insert
notebook. And we are updating the notebook with whatever values we are sending in. And here delete. That one is
simple. So we are just sending the notebook ID. And we are deleting that notebook by ID. So this should be it.
This is enough for now. If we need something we are going to fix it. This error here is it is defined but never
used. So we can even remove this part. We are going to remove it from each catch. We are not using it. We are
returning manually our error messages. And now we can actually go to our front
end parts. We are going to our dashboard back again. And here we are going to
create yeah something like this. So notebooks we can create that one on our
dashboard and inside of our components. So here we are creating notebooks.tsx
and here we are going to display all the notebooks. But before
that inside of our page we are going to get all the notebooks. So here we're
going to make this function a sync. So this is our server component and we are
going to get the notebooks from our server action by our user. So here in
get notebooks we are already calling our session and we should get all the notebooks from our user. So we can now
pass that one to our notebooks here. And even we don't need to do it yet. Let's
just go through them. So notebooks if success then we are just going to map
through our notebooks like this.
Nice. So here we can just put these question
marks to check if we have our notebooks actually actually here. Nice. So we can
delete this one for now. And I totally forgot that we need to call drizzle kit
push. So we push all these tables inside of our neon. So let's go to our neon
back here. And when this one finishes, there it is. We can refresh actually
refresh here. And we have so notes and notebooks. Nice. So we have our tables
and we can now actually insert something into these tables. So let's do that one.
We can do it just manually. So we can take my user ID from this or dev one. So
it's this one. And we can go to notebooks. And here add a record. I'm
going to put name test user ID this one. And create that. We can just put today
and update that as well. Nice. So now we save one change or it needs to have some
ID. Let's just put the user ID or something. Change it a little bit. Nice.
So now we should actually get that notebook on my landing page. So I'm
refreshing the screen. Something is happening. There it is. Okay. And we're not getting anything. Let's Oh, actually
we are. It's this test right here. So we are already getting everything from our
database. Server actions are working. Let's just remove this logout. We don't need it anymore. So here we have our
notebooks. Let's change this age one here. So we can now create cards out of
these notebooks and make the feature to create notes inside of our notebooks.
Creating a New Notebook
But first let's create a button here so we can create our notebooks and not to hardcode it through neon. So to do that
we are going to use the dialogue. So here I'm searching for dialogue inside
of the sheden documentation. So we are going to use this one. We're just going to put in the dialogue where we can
create our own notebook. So we are adding this to our application. Adding
the dependency for the dialogue. There it is. Awesome. So now we can actually
use it. So here I'm going to create one component inside of components here. So it's going
to be called let's just call it create notebook.tsx.
We can also call it create notebook button because it's going to be just one button and export it here like this.
It's going to be button from shed CN. And we're also going to put the dialogue
here. This is going to be a client component because we are going to use bunch of things like state for loading
and things like that. And now we are going to use from here the usage for our
dialogue. We are just going to put it here like this. And instead of this
trigger we are going to put a button create notebook and put as child on this trigger like this. Nice. And here now we
need again our forms. So we are going here back into our forms. So this is one
more reason why it needs to be a client component. So we are adding all the things the same like for our login sign
up etc and forgot password and all the things. So we are putting in a form
schema which is going to be in our case just name. So like this. Awesome. Now,
next thing is again this odd resolver and use form and people ask me if I'm
always doing this thing from scratch like this. And I really do. I don't know. I love to use documentation. Let's
say I'm old school and AI still is not really good in do doing these things.
So, I don't trust him enough to do it instead of me. And now we're adding
here. So, all the components we have already the button. We are going to add the input and also all these form
thingies. And now we are adding our actual form. So we are going to put it
inside of our content right here. The entire form instead of username we're
putting the name and here my notebook for our placeholder. And
here we can just say create on this submit. So, let's see how does it look.
We're going to put it on our page. Let's put it here. So, I'm going to put it
Yeah, we can just put it right here. We're probably not going to leave notebooks on our dashboard page, but
let's see. So, we have create notebook and it is opening our dialogue. We just
need to change this text of our title. So, it's create notebook. create a new
notebook to store your notes. That one sounds good enough. And here it is. So
now on submit here, we want to create our notebooks out of
these values. And as we can see here, AI is now doing the right things. So for
toast, for all the things. Awesome. And we want here to get our user ID. So we
need our o client for that one. Uh so let's get it here. User id equals. So
it's o client and then from here we are getting our
session and out of that we can get actually our user ID data. I think it is
like this and then data user data
user ID. Whoops. What happened? Yeah, this one now looks good. So we are
putting in the user ID. Let's see what is it complaining. It can be undefined. So if not user, we are just going to
return it here. Awesome. And now here we have this error because property ID is
missing. So that's the problem that we kind of solved with that insert notebook, but we need to solve it for
real inside. So something like this crypto random UU ID, but we need to do it on schema level. So here inside of
our notebooks, I'm going to put default like
this to be the generate random UYU ID. And we are going to do the same thing
for our primary key inside of our notes table. So now we need to actually run
again migrations. So let's go back to our neon and we are going to drop these
notebooks and notes as well. So we can still do this now because we don't have
any data. It would be different if we had. And now we can run again. Drizzle
kids push. So now that's going to push our new changes to database. There it
is. Awesome. Now we should here have Yeah, we have all the tables. And back
in our create notebook button, we don't have any more problems. And we can actually send the values to our create
notebook function. And now here we can just put we already have toast success
form reset and we are going to add quickly the loading. So is loading with
use state like this and we are going to add is open. So we close the dialogue when we successfully add our notebook.
So here in dialogue we are putting is open and an open change set is open. So
after our success, we're going to set is open to false and also set is loading to
false after everything is done. And let's just put try catch also here just
in case. So like this. And also here some catch. And after finally we're
going to put set is loading to false. Nice. So now we can here disable our
button while it is loading. And here we can put some nice loader too with size
four and animate spin. Nice. And let's test it out. So we are
going back to our application here. I'm going to refresh and something is
happening. Some errors. I don't know what's happening. No, it's actually good. No notebooks found. Okay. Create
notebook. Notebook. Let's just call it orcs. Create. Looks nice for now. and
notebook created successfully. We didn't refresh. So I need to refresh myself. And we can see our notebook here. So
let's just add also after success. So here after set is open false we are
going to put router refresh. And let's just here call that router from the next
navigation. This one. Awesome. And now when we create a second notebook, let's
call it elves. Create. We have the loading screen. We have the toast. And
we displayed here our two notebooks. So this is a great start. Let's now quickly
Notes – Server Actions
create for our notes. So we are going to notebook server. We're going to copy
paste everything and creating new notes. TS file. I'm just pasting in entire
CRUD. We can just use exactly the same things but we are going to change all
notebook names to actually note. So here instead of get notebooks we are putting
get notes and I hate when AI is not doing the right thing. So here then
notebooks by user here instead of notebooks by user we are going to say
notes like this and here notes user ID
we don't need that one for getting the notes we are going to get them basically
from notebooks so I'm going to remove get notes for now and here get note by
ID then update the note and delete note
note. So we removed all the notebooks and we need to create inside of our
schema insert note. So we are going to do that here like this and we are going to import it
inside of our note from our DB schema. And that's it. So now we can create our
note. Get note by ID, update node, and delete note. Nice. So now let's get back
Setting Up Notebook–Note Relationships
to notebooks. And here inside of our get notebooks, we want this query to return
also the notes together with those notebooks. So we are going to change
this query right here. We are going to use um ORM in a better way. So here we are
putting find many where notebooks user ID and with notes. So we are going to do the same thing with get notebook by ID.
So we are always going to return all nodes together with our notebook. And
now when we have this, we can actually go to our app sidebar. And here we can
call our notebooks together with our notes and put it inside of our sidebar
in those accordians on the left side. So I'm going to copy this whole thing this
data and put it inside of the component because we want to call here our
notebooks. So here we can turn this function into an async function and call
our notebooks from this server notebook server action. So now here we can leave
this main thing maybe or maybe we don't even need it. If we need it, we can we
can just put in whatever we want. But let's delete all these objects that are
hardcoded here. And we can put our notebooks from our database right here.
So I'm putting it in. We are putting in the notebooks. And we are going to put
title to be a notebook name. URL. Let's just leave it like this. We're probably not going to have the like some
specialized URL for our notebooks. But for items, we are putting in notes and
each title is basically a note title and URL is going to be our note ID. So this
one looks good. Let's just see the error what's happening. So it's just undefined. Okay. So we can put here
probably if nothing just to put in the Yeah, like
this empty array. Okay, no more error. Let's see. Nice. Here it is. So we have
now orcs and elves inside of our sidebar, but we don't have any notes
yet. And we don't want it to be an accordion when there are no notes. So
these items are going to be just empty like this or let's see how can we do
that. Let's just find that chevron and we can remove it. Here it is. So we can
put if yes if items length is bigger than zero only in that case then show
this chevron icon. Okay let's see if we have it. Yeah that's it. Okay, so it is
working nicely and we now need to create some notes in order to see it. So let's
hardcode one note for let's say orcs here. So orcs I'm going to take this ID.
Then we are going to notes add record and for ID I'm just going to put in
something title test content it doesn't matter now we're not going to put it
notebook ID created that we can put today and update that as well and I
think here we need something let's just put empty like this okay save one change nice and if we go back to our project
and refresh yes we can see Now here that we have our
test note inside of our sidebar. Awesome. So now we can continue with our
notes creation. So we definitely need that note page. In the moment when we
click this test, it is leading us to the dashboard and notebook ID and then note
ID. So we are just going to put a new page and here in the app dashboard we
are going to call it note. And then inside a new directory that one is going
to be note ID and there inside page.tsx.
So here we are going to export that note page and we are going to search for that
slug. So that one is type params and we
need to get our async param to weight it like this. Nice. And we are going to
await those params. So this one is our note ID. We are
passing it to our page. And now here we can get actually that that note by our
Building the Note Page
note ID from our server action. So this one is not assignable to the parameter
of type string. It is actually in our note ID. So we can just use a spread
operator like this and we are waiting for our note ID. So now here we can just
display our title to see if it is working. And here also we can call note
like this. So we can get our title. Nice. So let's see if this one is
actually working. We are going to our sidebar. Not that one to our app sidebar
here. and our URL, our graph here should
be actually note and then our note ID. So let's try
it out here. I'm refreshing the screen and we are going to our note here. So
that one should open our new page dashboard note and we can see here that we are actually opening our note. So
this is great. We just need to put in on our new page our wrapper. So here we are
putting our page wrapper and that one should let's just import it like this.
We are putting the breadcrumbs so we can return to our dashboard and this one is
going to be our note like this.
Let's see if it is working. It is. So dashboard test but our breadcrumbs are not working as they should. So here we
need after each breadcrumb we need a breadcrumb separator and we are going to
put the fragments in order to make this work like this.
Nice. So we have now the separator but we are not going to put it in case that
our index is the last one.
So this one now looks good. Awesome. Let's see why is this issue here. We
have a unique key prop. Okay. So we need to put here actually our key on our
fragment like this and we can remove it from our breadcrumb item.
Okay, so now this one looks good and we have our note here. So next thing that
we need to do is to insert here one goodlooking rich text editor and we are
Integrating Rich Text Editor
going to use the rich text editor called tip tap. This one is open source and
it's really looking nice. You can see it here. So it's really awesome looking rich text editor and to implement it
it's also really easy. So we are going here instead of the documentation to install then Nex.js and we already have
our nextJS project. We just need to install our dependencies. So we are adding these. I'm going here pmppm add
and then these three ticktap react tap pm and starter kit. And everything we
need to do is just to put in the starter kit and everything is going to work for
us automatically. And I found really great template here under examples basics default text editor which is
really looking good. So we are just going to copy this whole thing. And then we are going to create a new component.
We're going to call it rich text editor.tsx and we are going to paste in the whole
thing. Uh we are going to change it from tip tab to rich text editor. And let's
so here also rich text editor nice so here we need
some extensions I guess we need to install them let's try it out so we are
going back to our terminal pmppm add that extension document then this
paragraph from here pmppm add paragraph and also this text
so we adding all three extensions like this.
And we can see also that we have an update. So we are definitely going to use this and we are getting the JSON. So
we are going to save this JSON object inside of our table. But first let's go to our page here and instead of the note
title, we're just going to put in the rich text editor to see how does it look. So going back to our application,
there it is. So it's just the basic example of the text editor. We have all
the things like this bold, italic, strike code. We can use it to write
whatever we want. So here we can put bold for example for this. And we need
to remove this outline definitely. I found that one because I was using before this tip tab. I found it. I'm
going to copy it just from one of my project. So we just need to put this inside of our globals.css.
So in the end of the file because this is available globally the CSS we just
put this pros mirror focus outline none and we are with that removing this
outline that is really annoying. So now it is looking much better and I think it's also looking good in light mode.
Yes. So we can now here on each update
actually update our note when we are typing something. Let's go to this rich
text editor. So here we need to actually pass our content if it exists and also
we need the note ID so we know which note we need to update. So we are
passing that one to our rich text editor and here on update we are going to place
if note ID just update that note and that one is coming from our server
action notes. So here editor JSON that one actually needs to be our content. So
here we're going to put that one to be content. Let's see what is it complaining about. So it can be
undefined again. Let's go to the update note. And yes, this one needs to be
partial. So we don't need to send everything all the time. And now it is working. Okay. So let's go here inside
the content. We need to send actually content
not to be this just hardcoded. So I'm going to delete this entire JSON here
and put actually our content. So let's see if this is working. Now we shouldn't
have anything here when we refresh. Okay, it is empty. Nice. And now if I say this is my content. I don't know if
this one is saved. Let's see if something is happening back here. Looks good. Okay, let's refresh.
So now okay we are not saving anything. Let's see what's happening on our
update. We are going to put here our content to be like this and console
log our content to see if anything is happening. So we are going to inspect
console and when we type in something this nothing is actually happening. Okay. So
this on update looks like it's not work. Oh, we are not we are not passing the note ID. Okay, so we need to go here and
to our rich text editor actually pass our note ID and this content. But this
is actually already a JSON. So with this one needs to be also here JSON object
like this. And here we don't need to parse it. We can just send it like this.
content it can be. Let's see what is it complaining about. So JSON is missing
the following properties. JSON content. Okay, so this one needs to be actually
JSON content from tip tap react and it needs to be an array of those JSON
contents. Yes, that one is good. Okay, so let's try it. Now we are sending our
actual note ID inside of our note and
here this needs to be as JSON content again from deep tap react. We can handle
this also in our schema. So we force it to be always the same.
But let's try it now if it is actually working. So I'm going to delete everything for a console log and type in
this. So we have it. Okay. And now let's see if it is successfully updated. It is
not yet because we have invalid content past value. So our content is not good.
Let's go to neon to see what's actually happening. I'm going to refresh. And we have the content here. So it does look
good, but we are probably not sending it in the right way. So we are going to send it like this. I think it needs to
be inside an array. We can do it also in rich text editor here. So here we're
going to put an array. I think it's going to work like this. Let's just see
if it does. When I refresh it's failing now because JSON parse is
not working in the right way. Okay. Let's check again the neon here. So, oh,
I see it. So, here it's already type doc and content. So, inside of our rich text
editor, yeah, so we just need to pass the content like this. And let's try it
out now. So, going back and refreshing, we should get now this. There it is.
Awesome. It is working. So, this is saving. And each time we type something,
we are actually saving. I'll now refresh. This is saving. Okay. So we need to wait actually it's not really
instant. So we definitely need some kind of debounce. We are going to implement
that. So saving is working. We are updating our note and we can put here
like some kind of strike and that one is automatically working and saving back
there in our back end. So now we need an ability to create a new note. So let's
close this console and we could also make this like from on the entire screen
like the width. So let's see where do we have okay we have max 2 XL let's put it
to max 7 XL like this. Nice. I think this is better. And also this
should have a little bit more height this editor content. So let's say minimum height of 96 maybe. Yeah, this
one is good and it can always be larger than that. So this one now looks better.
We also need to make this heading like on their part there on their example.
Creating the Notebook Page
Let's first create that notebook page. So here in our dashboard I'm going to
create notebook directory and inside a
new directory called notebook ID
and there I'm going to put a new page.tsx. So that one can be the same like here
our note page but this one is going to be notebook ID here
and it's going to be notebook page we are putting in the notebook ID and we
are getting our notebook notebook here by our ID that one is also going to get
all the notes for us and for our breadcrumbs we are going to put that notebook the link to that one its name,
not title for our notebook. And here we are putting the notebook name. Awesome.
So now we're going to move this note inside of this directory like this. So
our URL is going to be a little bit different. So let's delete all these
imports that are not used. So now in our app sidebar
for our ref we are going to notebook notebook ID and that then this note ID.
So we are going back to our dashboard and here if we click on our test we are
going to our new URL which is notebook then ID then note ID and we can put here
actually on our note page here inside of our breadcrumbs we can
also put the link to our dashboard. So here we can just say note notebook name
and we can put that notebook ID. So now our breadcrumbs are going to be
different. Here it is. So we have we can go to our notebook and we also have the
name of our note. So now we can go back to our notebook here from our breadcrumbs and here we can put like
some small cards for each note that we have inside of our notebook. Let's create a notebook card. So I'm going to
components again and here I'm going to create a new file and that one is going
to be notebook card.tsx. So that one we are just going to use the
shettzian card. So here I'm going to documentation card. I'm going to take here the imports and also the usage.
This is definitely the easiest way for me to use shed CN. So I'm copying here
the usage. I'm going to paste it right into notebook card. We don't need this card action. I'm going to remove that uh
because we are going to make whole card clickable. And now here we are going to
create an interface. So we are here going to receive a notebook
like this. And we can display just notebook name. We don't have the description. And here for our content,
we could just say how many notes we have for now. And in the card footer, we are going to create a link here for
our notebook to actually go and see it. And we are also going to create one
button for delete. That one is going to be destructive. We can also put there
trash to icon like this. That one is going to be class
name size four. Nice. Let's see what's wrong. I didn't
import the trash or Oh, I'm not closing it. Okay.
And nice. So now let's just put it in on
our main page. So not that one but my main page of our dashboard. So here we have
all of our notebooks and instead of doing this we are going to put the notebook card
and let's see if this one is working. So we are going back going to our dashboard
and here we should get yes. So here we have our cards but we need there to
create some kind of grid. So here I'm going to create
something like this. Grid calls three. Maybe it could even go to grid calls 4
like this. Yes, this one is better. We also need a little bit of gap inside
with these buttons inside of our footer. So justify between or maybe better
justify end and gap of two like this. So we put it on the right side. Yes. And
let's just leave it as it is like this. Now also this create notebook where is
that actually. So dashboard page create notebook button we are going to put on
our button here class name of width max. So this button is not across the whole
screen. So it stays here. And this notebooks H1 let's just leave it again
like that. Now we are not going to work a lot on design for this thing. So we
just need to make it to work like everything needs to work to view to
delete to edit etc. So now we need to implement this delete functionality. We
already have that one. So we are going back to our notebook card and here I'm
going to create const handle delete function and that
one is going to call delete notebook from our server actions file like this
and we are just going to say toast success notebook deleted we're also
going to refresh so now AI knows exactly what am I doing always for these kind of
components. Now that one needs to be a client component because we added bunch
of things like state and we are going to add state but for this uh router we need
it to make it to a client component and now we can put one try catch.
So everything here should go into this try and for our catch we are going to put toast error fail to delete notebook.
We can remove this error because we are not using it. And we can also put is
deleting state. That one we're going to put set is deleting to true on the beginning and
finally to set it as false. And now this delete button needs to be disabled
when is deleting. And we are putting here on click handle delete. And here we
are just going to put that loader to icon if we are deleting the notebook. So
let's try it out if everything is working. All right. So these elves we are going to delete them.
And notebook deleted successfully. And that one is working. Awesome. One thing
that we need to add is the alert dialogue. So we are going back to shed
CN and here we are going to search for alert dialogue. Here it is. So that one
has actions like are you absolutely sure and then we have these buttons. This is perfect for things like this. So I'm
going to add that one to our project. Adding it here. And now we're going to
use it. So here I'm going to import inside of our notebook card
this alert dialogue and I'm going to take the usage here and
where our button is. So here I'm going to paste it and this whole button I'm
going to paste it inside the alert dialogue trigger like this. Nice. So now
we can ask users are you absolutely sure and this action cannot be undone. This
will permanently delete the notebook and all its notes. So they need to say yes
continue. And here we are going to put handle delete. So we can remove it from this button
like this. Nice. And we also want a new state is open and set is open which we
are going to put on our alert dialogue. And when they actually delete the file,
we are going to put set is open to false like this. Awesome. So let's try it out
now again. I'm going back here. I'm going to create a new elves notebook.
There it is. Created it. So now when I click delete, are absolutely sure this action can be undone. Continue. And now
we actually deleted our notebook. And this is working now perfectly. Awesome.
And we can now do something similar when we go to actually to this notebook right
here. So we want to show all of our notes. So this notebook card we can
actually create the note cards. So notecard.tsx.
And we are going to paste in this whole thing. So this one is going to be called note card here and we are going to
here receive actually our note not the notebook like this and we are going to
delete here delete note notebook note ID
so everything is basically the same we just put in everywhere note instead of
notebook so we have note title we have this content but we are not going to
show content we are actually just going to show bunch of notes and uh then we
can just create a link to go to that note. So here we actually go to notebook
and then notebook ID and then here to note ID. So this one is good and here
let's see deleting. So this is going to delete the note and now we can put this
to our oh let's just remove this content. We'll see what are we going to put there. So here removing delete
notebook and notebook type. So we can go to our notebook page. So that one is
here notebook ID. So we are here getting the notebook. We already have notes here
and we are just going to map through our notes in the same way. And here we are
going to display all nodes from our notebook right here. So there it is our
test nodes. If we go view we are going to that note where we have this rich
text editor. We still have to solve this header right here. This one needs to look better. So we can go back inside of
our breadcrumbs to our notebook page. And here we can just make it a little
bit better. Let's first finish this sidebar to change this one this documentation and to add a little bit of
Displaying Notes & Notebooks in Sidebar
icons. So we are going to the app sidebar and here instead of this
documentation let's see where is that one actually I don't see it here the documentation.
So here we have the collapsible and versions feature. Here it is. So we can
probably delete this version switcher totally and we are here going to put
just some kind of logo and I already prepared that one. Let me just quickly
put it here inside of our public. So I have here where is it? Node forge logo.
Here it is. Putting it here. It's going to look like this. And we can put it. So
here an image of note
forge logo like this and we are going to import image from next image and here we
are going to put the title also. So here we can put something like I don't know
what is AI creating but I want to put an image here and to put some H2 and we're
going to write here node forge like this. Let's see how does it look. Looks
nice. If we close it, it's closing everything. So, that one is okay. And we
replaced that switcher. And now we need to make this search the docs work. So,
it's not search form. Okay. So, it is outside of this
component. Let's see how does it look. So, it's search your nodes like this.
And here in the app sidebar, we can put
next to our is it here? Yes. So, next to title of
our note, we're going to put that what's it called? The icon is something like
icon file. Yes, this one. So, let's see how does that one look. Yes, this is
nice. So it's marking that this is actually a note. And now we need to make
Implementing Search Functionality
this search to work. To do that we are going to use KNX the best possible tool
for search params and state management inside the URL. So this one is so easy
to use. We are literally just typing in like in the use state and changing our param in the URL. So we are going to the
documentation. We are going to add KN to our project. And here if we check the
usage adapters where it is. Here it is. We search for the Nex.js app router
adapter. And we need to wrap basically inside the layout our children again. So
we are going to put the next adapter here. Knox adapter sorry. And we are
going to import it from KN. Nice. And
now if we check on the landing page, we are just going to use this use query
state like in the example here. So we are going to that search thingy search
form and here we are going to create that use query state and this is going
to be a client component. So it already is and here on sidebar input we are
going to say value not hello we want here to call it actually search and set
search. So here we are going to put search and on change we are going to set search as our search param from here.
Now we can test this one out. So we can go to our app and here if we start
typing ordev we can see it here inside of our URL that we have search equals to
ordev. So it is working. Now we need to use it inside of our app
sidebar. So here we have our search form and we are here putting our whole
filtering. So now we need to turn this whole thing to a client component. So we
are going to create a new component. We are going to call it sidebar data.tsx.
And we are going to export it here. So we are creating side sidebar data and we
are going to return this from here and we are going to put
the fragments to wrap this one up like this. And now we can remove this thingy
and this thingy as well. And we need this whole collapsible. So this one
we are putting it inside of our new component. We are going to put that one to be a use client like this. And we
need all these sidebar groups, sidebar labels,
chevron, right? Then this content,
sidebar menu. So all of the components we need to import them
like this. And this file also from Lucid React. Nice. And now this data is
actually going to come in form of a prop. So we are sending it.
We don't have any more problems. And we can go back to our app sidebar and we
are just going to send this data. Delete everything from here. So this
whole thing is going to be a sidebar data component. We are going to import
it and send send our data. And now here because this is a client component, we
can actually call our search. So we are calling search from KNX
with use query state. What is happening here? Cannot be called in an async function. We are going to
remove this one because this is a client component. It doesn't need to be async. It can't be async. So now we have our
search and we are going to create new filter data. This is it. So here we are
checking basically the title of our of each notebook. But we want to check also
the title of our note. So something like this. Let's see if AI came up with a
good thing. Notebook matches. So it's checking the title of a notebook and note matches. It's checking the title of
note and we are receiving both. Nice. So now we just replace it with a filter
data and this one should work. So let's try it out. We are going back to our app
and we already see here that we don't have any notes. I'm going to delete everything. Now we have it. And if we
type orcs and then again s it's not working. If we type test it's working
also with notes. So we have here our search working. So that one is great. If
we type anything that is not related to this one, it's working. Of course, this can be a little bit smarter. We could
use better search, but this is I think really a good start and especially for
this kind of video because this video could take forever. So, we have our search working. That's the important
thing. We have on our dashboard, we have all the notebooks. So, there we can go
to each notebook. From there, we can go to each note. And let's first just create here a new note dialogue. And
when we are able to create a new note, then we are just going to fix this
header here inside of our rich text editor. So here we need a button same
like inside of our notebook page or was it dashboard? I think it is dashboard.
Yes, here create notebook button. So we are going to copy this thing and
we are going to create a new component create note button.tsx
and we are going to paste the entire thingy. So this one is going to be create note
button. Then we need to send actually our notebook ID because we need it to
know to which notebook we are going to create our note. We don't need user ID.
So we can remove this part from here. And let's see what else do we need. We
need content. So content is just going to be an empty string or we can put
empty object like this because our content column is actually JSON. Here
we're going to create note created successfully. Message fail to create note. Here just a little bit of text to
change everything. and my note create. So everything looks fine. Let's go now
to our notebook page. So that one is here. And we are going to put there
create note button. There it is. So we have our notebook ID.
And now we here have the create note button. If we click it, we have my note.
So I can say new test two note create
and that one created us a new note. So we can now go to that one and here we
have entirely new note to right here. We should probably put the back button but
we have breadcrumbs maybe not. So let's now fix this heading. This is the only
thing that we are going to kind of vibe code. So I'm going to use V0 for this
one. And I want here so for this rich
Editor – Heading Support
text editor I'm going to copy this entire thing that we have. So this entire component and I'm going to
screenshot where is it the one? Yes, this one that they have. So we want it to look same
like this. And we have there all the functions and everything from tip tap. So it's going to create something
similar. So we are going to put here the image. Let's put it now from my
screenshots. Here it is. And we are going to say create this rich text
editor to look like on the screenshot.
Here is the component and I'm just going to copy paste. So now
v 0ero is going to create for us something similar. So we have that
beautiful component. Okay, here it is. I just sped it up a little bit and I had
three versions. So now we have this heading that is looking much better and
we can just copy and paste this entire rich text editor component. So I'm going
to paste it in here. We don't have any errors. So let's see how does it look
going here. I think this one looks much better than before. And if we go to
light mode, it also looks like good in light mode. So we can test here and put
like this is my heading and we can put bold on this heading here. Nice. And we
can put here let's say test and to put
there italic. Nice. So this one is working really nicely. That's a good
thing. If we refresh, let's see if this one is still saving. It's not saving. Okay. So V 0 removed for us the on
update. Let's just here do size eight instead of this one. So let's see on
update this content. Okay. So he just commented
this update note because he doesn't have that one. It's a good thing that we
tested it. So now if I say again this is the test and I put this to bold and I
refresh. This is the test. We again have that problem with debouncing.
Uh that's probably when I write like too fast but we are not going to solve it in
this video. I'm going to create a debounce video for that one. So this one is now looking much better and it is
working. It's really looking awesome. Let's now make it more beautiful. So we
Creating a Global Theme
need to apply some nice theme and I'm going to use for that tweak CN. This is
definitely the best way to create theme for your shed CM project. So here we
have bunch of themes that we can use that are predefined and we can also create our own themes with AI but I'm
just going to take this Versel theme. I think this is going to be the best for this kind of app because we want our
eyes to feel good and not to have some bright colors and something like that.
So we are just going here to code here. We put this inside of our globals CSS.
So I'm going here globals.css. CSS and instead of this whole root and this dark
I'm just going to paste it in overwrite all these things. And now if we return to our app here we have totally
different feeling. So it's a little bit more black and white and I think it's especially looking better in light mode
and it is probably changing a little bit also our landing page. It's a little bit
darker here in dark mode and in light mode. Let's see. Yeah, it looks I think
really nice. And we can now here also change all these things. This tail arc
Final UI Polish
we need to put inside. So that's the header instead of tail arc. Where is
that tail arc thingy? It is. Let's see. Let's see. Is it that logo probably?
Yeah, this one. So here instead of I cannot find tail arc. Let's
search it. Uh oh that's actually the image. Okay, that's good to know. So I'm
going to inside the header instead of this logo I'm just going to put my
image. So here like this putting in the note
forge logo dopng. And here I think this 100 is a little
bit too much. Let's see how does it look. Oh, okay. Maybe it's it's not. So
let's put that 100 like AI said. Ah, that's okay. So let's put 60. That's
probably the best. Yeah, this one is nice. And we are going to write here
also note forge like this.
Nice. So this one is looking okay. We can remove all these links. We are not
using any of it. So here also this button. What is this button actually? I
don't know. It's some kind of set menu state. Okay, this one is for the mobile
view. And here we have all of our links. I'm going to remove that div from here.
So we don't need that one. So all these menu items can be deleted
or we can just actually here remove all these menu items and
leave it empty. So that way we can maybe put something in future. So
we removed it also in the mobile view. That one should be removed. Yes. So we
have here only login and signup. So let's now make this mod toggle a little
bit better here. So why is this complaining? Let's see. Okay, because of
the type. So now let's search for the mod toggle. And here we're going to put
the class name. Oh, we don't have the class name. Interesting. So this button
actually needs to be size. No, that one. Oh, it is already size
icon. Okay, but it is too big. Let's put here on our landing page the one that
I'm using in 8 bit CN. So this small one here. So I'm going to open 8 bit CN. And
there we have that mod something mod switcher. This one. I'm just going to
copy paste it and put it inside of the components. So this is the component
that I also took from shed CN from the GitHub repository of shed CN.
So I'm going to call it mod switcher.tsx and paste it here. And now here in our
header, we can just put that mode switcher instead of the mod toggle.
Let's see how does it look. Yeah, this one is definitely much better for our landing page to change our theme. And
now here we need some screenshot. So let's Where are we going on start
forging? We don't have that one yet. So that one is our hero section. Start
forging needs to go to our dashboard.
and what to see it in action. We can remove that one for now because we don't have something like that. Okay, just
start forging. That one goes to the dashboard. Nice. So, we can go back
here. We need a screenshot. We're going to make that one later. Then here, get started. These are the
call to action. So, we are going again to the dashboard and see it's an action. We are going to
remove it. get started. Nice. And now here in our
footer, we are going to remove probably everything from here. Yes, we are just
going to leave the so this part goes away. Logo is going to
be the image and it's also going to be here the note forge text. Then all these
links go away. So these are the social icons and we can
just leave this note forge all rights reserved. Okay, nice. Except this needs
to look better. So it needs to be flex and item center. So we have here block.
I'm going to remove that note forge. It's it's okay. I guess we could maybe
just leave this in the end, but let's just leave it like this. It's not perfect, but it's better than to have
some false things. So, now we need to actually
go to our dashboard and make some kind of screenshot. So, it's best probably to
create a screenshot of some nice looking note. So, I prepared this text that I'm
just going to screenshot. So, I'm going to take a screenshot of this in light
mode. And I'm also going to take a screenshot in dark mode for the dark
mode there. Like this. Nice. So, now we can go back to our Look, this one is not
working. We need to put this into a link. Okay. So, let's just go to the local host 3000. So here we need to put
in case it's dark mode, we need to put this image here. So let me just take it
from my screenshot. So this one is light
and this one is dark. I'm putting it inside of the public
here. And now inside of our hero section, we
are searching for the image. There it is. So we need here is this
one. This is for the dark. So that one is dark and this one is light. Let's see
how does it look. Oh my god, this is looking even better than I imagined.
Okay, so this one is nice. Let's search for a light. Amazing. I cannot believe
it that I did it from the first time like this. Awesome. So now I think we
are ready to to deploy. Let's check first if we have any lint errors. I saw them a moment ago in there in the code
editor. So we have in app sidebar bunch of unused things. Let's go there. App
sidebar. That's because we moved everything to a new component. So we are deleting all the things that we are not
using. Okay, nice. Then we have the create note button.
Create node button. That one. So create notebook or client
and also footer. We removed that logo and these links. I
can also just delete them. I can always stay from tail arc if I need it. And that should be it. PMPM lint.
Fixing All TypeScript Errors
Awesome. Let's go. G status we have bunch of files that we added so get add
everything get commit m and I'm really curious what is cursor going to give us
here for our commit message. So let's see it generate and he's going to say
let's just say this add initial project structure with authentication database schema and UI components good enough
push and what's happening g push origin does
not appear to be a g repository g remote version so I didn't add actually our git
okay so I'm Going back to g here. I'm searching for node forge and we need to
put in this remote origin. Okay. Now g status and g push origin head. We are
going to push everything to our repository. There it is. It is here.
Awesome. And let's try to run one pmppm build to see if it's going to work. This
is important because when we now deploy it to versel, it can be broken although
we have our lint going through it. So let's see if we have any problems
listing and checking linting and checking. So yes, we have the problem with the animated group in the hero
section that I saw. Let's fix that thing. So here we have this problem with
variance and here also with this same thing. So let's just fix it in chat with
cursor and I think that's just to put somewhere as string or something like that. So that should probably be a quick
one. And yeah, it's the issue the type. Oh no, spring, not string. Okay, so
accept. And we have it now. No, we don't have any more errors. Okay, so let's try
to run one more time. PMPM build. And while the build is is building here,
you shouldn't touch anything and save inside the code editor because it's
going to ruin the build. And reset password. Use search params should be wrapped in a suspend suspense boundary.
Okay, so that's what's the component again? Reset password.
Let's see which one is that. Oh, that's the page actually. the reset password
this one. So we need to put their
usage params inside the boundary. Where is usage params here? So we are going to
put here suspense from react. We can put it inside the
server component as well. So now if we build again. Okay, let's see if it's
going to work this time. Now we shouldn't have any errors anymore. So, compiled successfully. Linting and
checking validity of types. Collecting page data. Awesome. It works. So, we can
Project Deployment
now deploy this project. Let's go to versel. So, this has internal server
error because we need to restart the dev environment. So here I'm going to add a
new project and that one is going to be node forge from my GitHub and we need to
add all of our environment variables. So I'm going to add it now. You're not
going to see it. So I have bunch of resend and all the things from database
etc. So I added all the environment variables and I can press deploy. And
now our deployment is coming. I'm also going to buy the nodeforge.dev domain
and we are going to assign that domain to our versel account here. So now we
can see here the build logs and what is actually happening with our build and everything should go smoothly because we
ran pmppm build and if we have any errors it's going to be because of the environment variables because I placed
the next public URL to be actually notforge.dev and we don't have that
domain assigned yet. So let's see if this build is going to run through
smoothly. Everything is compiled successfully in 34 seconds. And now it
is linting and checking validity of types, collecting page data. Let's see if it's going to work.
So there it is. Looks like it's working. And we should have our project live in
couple of seconds. Collecting build traces. Build completed. There it is.
It's deploying outputs. And we should now get our public domain for our
project. And then we can assign domain for us. There it is. Congratulations.
You just deployed the new project to orgdev. And we can now go here. So we have node forge7 versel.app.
Buying a Custom Domain
So now we can go back to my versel account. Here we can go on domains, buy
a domain, and we can buy node forge. So here, nodeforge.dev is available. I'm
going to buy that one. I would show you how am I buying it, but I have to uh put
in my SMS in my phone and I'm recording this video with my phone. So, I'm going
to buy it now and then I'm going to continue recording the video. There it is. I bought it. We can now go to my
domains. So, we can see here if I refresh nodeforge.dev. So, that one is
bought. And we can go now to my projects here to node forge settings here domains
and we are going to add a domain that one is going to be
where is it nodeforge.dev like this and we are going to save. So
now domain is added to our project and they are generating SSL certificates and
everything that is needed for us in order to put the project on our domain.
And there it is the configuration and everything is validated. So we can now go to nodeforge.dev
and we have here our new application up and running. So we finished everything.
Of course, we can add here bunch of new stuff and also now what is left is to
Connecting Domain to Google Cloud
put in inside of our Google console the new noteforge.dev. So, let's do that one
actually to finish up everything. So, we have that in the better documentation.
We have so many tabs opened. I don't even know where to. So, here it is Google Cloud Console. So we are going
back here and we have note forge and let's see credentials
then our node forge here and we just need to add exactly the same one but
with the https
node forge.dev and add this one to our Google
cloud console. Nice. So now if we get back to our noteforge.dev,
we can here sign up and we can use Google. So this one should now work.
Yes. And we can now open our new account and it is working live in our
nodeforge.dev domain. I really hope you enjoyed in this video. This is something new to me. I never created these long
Outro
videos like Antonio. And this project is not perfect. Of course, we could work a
lot on the UX, on new features, on all the things that we have here in our
dashboard. I'm going to work on it definitely on my YouTube channel in future. I'm going to add new features.
We need something here. Here I was thinking about something for passwords to have like if you save some password
to stay safe even in the database that I cannot read it from neon and there are a
bunch of features that we could add. I would love to hear your opinion and if you could put in the comments what would
you like to see in this kind of project and for more content like this. Join the
mighty horde. Subscribe.

1. Architectural Cleanup (Standardization)
Before writing UI code, we must unify the project's infrastructure:

Dependency Audit: Run npx knip to identify and remove unused dependencies (e.g., the massive Remix Icon CSS file, which adds unnecessary bloat). Replace them with tree-shakable components from @remixicon/react or lucide-react.

Theme Integration: Inject your OKLCH variables directly into the @theme block in globals.css. This allows you to use high-performance utility classes like bg-primary and text-card-foreground while maintaining a "warm minimalist" aesthetic.

Spacing & Grid Rules: Enforce a strict 4px spacing system using your --spacing: 0.25rem variable. All layouts should use multiples of 4 (e.g., gap-4, p-8) to achieve professional alignment and hierarchy.

2. Refactored "Route Tracker" (Resizable Dashboard)
To replace the hard-coded, static route tracker from your screenshots, we will use Shadcn Resizable Panels. This allows dispatchers to dynamically adjust the view between the live map and the manifest data.

TypeScript

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function RouteTracker() {
  return (
    <div className="h-[calc(100vh-4rem)] p-6 bg-background">
      <ResizablePanelGroup direction="horizontal" className="rounded-xl border border-border shadow-lg">
        {/* Left Panel: Live Map View */}
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="relative flex h-full flex-col bg-muted/20">
             {/* Map Placeholder - Integrate with Mapbox/Leaflet here */}
             <div className="absolute top-4 left-4 z-10">
               <Badge className="bg-primary/10 text-primary border-none px-3 py-1">
                 ● Live Monitoring
               </Badge>
             </div>
             <div className="flex-1 flex items-center justify-center text-muted-foreground italic">
               Live Map Engine Render Area
             </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="bg-border" />

        {/* Right Panel: Active Manifest & Unit Details */}
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col p-4 space-y-4 bg-card overflow-y-auto">
            <h3 className="font-semibold text-lg">Active Route</h3>
            <Card className="p-4 border-muted">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Distance Remaining</div>
              <div className="text-2xl font-bold font-mono">412 km</div>
            </Card>
            <div className="space-y-2">
              <span className="text-sm font-medium">Next Milestone</span>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/50 text-accent-foreground">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">Lucknow Bypass</div>
                  <div className="text-xs opacity-70">ETA 18:45</div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
3. Production Readiness Checklist
Category	Tool / Strategy	Benefit
Code Review	Prisma/Filesystem MCP	Automatically identifies and flags hard-coded hex colors or non-Shadcn components.
Charts	Shadcn Charts	Moves from Nivo/Recharts bloat to native Shadcn components that automatically use your OKLCH --chart-x variables.
State Management	Zustand	Highly performant, minimalist state management perfect for cargo tracking and scanning logs.
Feedback	Sonner	Clean, minimalist toast notifications for scanning successes and route exceptions.

Export to Sheets

4. Implementation Steps
Run Tree Command: Execute tree -I 'node_modules|.next' to map out redundant components.

Delete Duplicate UI: Remove any folder in components/ that isn't using the Shadcn cva() (Class Variance Authority) pattern.

Sync Sidebar: Use the sidebar-01 Shadcn Block to group your "Main Deck," "Operations," and "Finance" pages into a unified, collapsible navigation.

Notes App Full Course 2025 This video is highly relevant as it demonstrates how to build a modern dashboard architecture using Next.js 15, Shadcn UI, and responsive sidebars, which are critical for the "Main Deck" navigation overhaul you require.

Discussion: Design Analysis & Mapping
To achieve 100% structural fidelity while pivoting to a Cargo/Logistics domain, we must map the specific UI components from the HR context to Logistics data points.

Component Location	Original (HR)	Cargo Adaptation
Top Right Metrics	Employees, Hirings, Projects	Active Fleet, In-Transit, Delivered
Top Left Filters	Interviews/Hired Pills	Freight Type/Status Pills
Hero Card (Left)	User Profile (Photo)	Driver Profile or Vehicle Focus (Photo)
Center Chart	Work Time (Bar Chart)	Fuel Efficiency / Daily Mileage
Center Circle	Time Tracker	ETA Countdown / Drive Time Remaining
Right Side Top	Onboarding %	Container Load Capacity %
Right Side Bottom	Task List (Dark Card)	Route Waypoints / Manifest (Dark Card)
Bottom Span	Calendar/Schedule	Dispatch Timeline

Export to Sheets

The Design Prompt
Copy and paste the following prompt into Midjourney, DALL-E 3, or use it as a brief for a UI designer.

Markdown

High-fidelity UI/UX dashboard design for a modern Cargo & Logistics management platform ("LogiStream"). The design must strictly adhere to a "Soft Claymorphism" and "Warm Minimalist" aesthetic.

**Visual Style & Palette:**
* **Background:** Smooth, creamy beige/bone white (#F5F5DC) with soft ambient lighting.
* **Accents:** Deep Charcoal Black (#222222) for high contrast elements, Marigold Yellow (#FFD700) for active states and highlights.
* **Texture:** Soft rounded corners (24px radius), subtle drop shadows, fluid layout, no harsh borders.

**Layout Structure (Strict Grid):**

1.  **Header:** Clean sans-serif typography "Welcome, Dispatcher". Top navigation uses pill-shaped buttons with soft shadows.
2.  **Top Metrics (Right):** Three large, minimalist number stats: "78 Trucks", "56 In-Transit", "203 Delivered".
3.  **Hero Section (Left):** A large, soft card featuring a high-quality portrait of a truck driver (or a sleek semi-truck) with a price tag/earnings badge overlay.
4.  **Center Visualization:**
    * A vertical bar chart displaying "Weekly Mileage" with yellow active bars.
    * A large circular gauge widget showing "Drive Time Remaining" (e.g., 02:35) with a yellow progress arc.
5.  **Right Sidebar:**
    * Top: A "Load Capacity" widget with horizontal progress bars.
    * Bottom: A prominent, deep charcoal black card titled "Active Manifest". It contains a vertical list of checkpoints (Pick-up, Weigh Station, Drop-off) with checkmark icons and timestamps.
6.  **Bottom Section:** A horizontal dispatch calendar timeline showing "September 2026" with driver avatars on the timeline.
7.  **Left Sidebar (Navigation):** Collapsible accordion menu for "Fleet Maintenance", "Fuel Logs", and "Compliance".

**Atmosphere:**
Clean, avant-garde, expensive feel, heavy use of whitespace, Dribbble-tier presentation.
